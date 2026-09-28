using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Data;
using MYFITDAILY_EXE201_Group6.DTOs.Auth;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Đăng ký tài khoản người dùng mới (Gửi mã OTP xác thực 5 phút)
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(request);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Đăng nhập tài khoản và nhận JWT Access Token
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(request);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Yêu cầu gửi liên kết khôi phục mật khẩu qua Email
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ForgotPasswordAsync(request.Email);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Đăng nhập mạng xã hội: Nếu có tài khoản thì vào luôn, nếu chưa có thì gửi mã OTP xác nhận về email trong 5 phút
        /// </summary>
        [HttpPost("social-login")]
        public async Task<IActionResult> SocialLogin([FromBody] SocialLoginDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.SocialLoginAsync(request);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Xác thực mã OTP 6 số để hoàn tất đăng ký tài khoản (thời lượng 5 phút)
        /// </summary>
        [HttpPost("verify-registration-otp")]
        public async Task<IActionResult> VerifyRegistrationOtp([FromBody] VerifyOtpDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.VerifyOtpAndRegisterAsync(request);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Gửi lại mã OTP xác nhận mới với thời lượng 5 phút
        /// </summary>
        [HttpPost("resend-verification-otp")]
        public async Task<IActionResult> ResendVerificationOtp([FromBody] ResendOtpDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ResendVerificationOtpAsync(request);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Xóa tài khoản thử nghiệm theo Email khỏi CSDL (Dành cho việc test quy trình đăng ký/đăng nhập)
        /// </summary>
        [HttpDelete("delete-test-account")]
        public async Task<IActionResult> DeleteTestAccount([FromQuery] string email, [FromServices] ApplicationDbContext context)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { message = "Email không được để trống" });
            }

            var targetEmail = email.Trim().ToLowerInvariant();
            var users = await context.Users
                .Include(u => u.ClothingItems)
                .Include(u => u.Outfits)
                .Include(u => u.AiStylistHistories)
                .Where(u => u.Email.ToLower() == targetEmail)
                .ToListAsync();

            bool deletedFromAppDb = false;
            if (users.Any())
            {
                foreach (var user in users)
                {
                    var userId = user.Id;
                    var outfitIds = await context.Outfits.Where(o => o.UserId == userId).Select(o => o.Id).ToListAsync();
                    var clothingIds = await context.ClothingItems.Where(c => c.UserId == userId).Select(c => c.Id).ToListAsync();

                    var outfitItems = await context.OutfitItems
                        .Where(oi => outfitIds.Contains(oi.OutfitId) || clothingIds.Contains(oi.ClothingItemId))
                        .ToListAsync();
                    if (outfitItems.Any()) context.OutfitItems.RemoveRange(outfitItems);

                    var outfits = await context.Outfits.Where(o => o.UserId == userId).ToListAsync();
                    if (outfits.Any()) context.Outfits.RemoveRange(outfits);

                    var clothing = await context.ClothingItems.Where(c => c.UserId == userId).ToListAsync();
                    if (clothing.Any()) context.ClothingItems.RemoveRange(clothing);

                    var histories = await context.AiStylistHistories.Where(h => h.UserId == userId).ToListAsync();
                    if (histories.Any()) context.AiStylistHistories.RemoveRange(histories);

                    var transactions = await context.PaymentTransactions.Where(p => p.UserId == userId).ToListAsync();
                    if (transactions.Any()) context.PaymentTransactions.RemoveRange(transactions);

                    context.Users.Remove(user);
                }
                await context.SaveChangesAsync();
                deletedFromAppDb = true;
            }

            // Đồng thời dọn dẹp trong bảng auth.users của Supabase nếu có
            bool deletedFromAuthSchema = false;
            try
            {
                var rows = await context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM auth.users WHERE LOWER(email) = {0}", targetEmail);
                deletedFromAuthSchema = rows > 0;
            }
            catch
            {
                // Bỏ qua nếu không có quyền can thiệp schema auth
            }

            return Ok(new
            {
                success = true,
                message = $"Đã xử lý xóa tài khoản {email}",
                deletedFromAppDb,
                deletedFromAuthSchema
            });
        }

        /// <summary>
        /// Kiểm tra xem email đã tồn tại trong CSDL hay chưa
        /// </summary>
        [HttpGet("check-user-exists")]
        public async Task<IActionResult> CheckUserExists([FromQuery] string email, [FromServices] ApplicationDbContext context)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { message = "Email không được để trống" });
            }

            var targetEmail = email.Trim().ToLowerInvariant();
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == targetEmail);
            return Ok(new
            {
                exists = user != null,
                email = targetEmail,
                fullName = user?.FullName,
                role = user?.Role
            });
        }

        /// <summary>
        /// Thử nghiệm gửi email chào mừng thực tế qua SMTP
        /// </summary>
        [HttpGet("test-welcome-email")]
        public async Task<IActionResult> TestWelcomeEmail([FromQuery] string? email, [FromServices] IEmailService emailService)
        {
            var target = string.IsNullOrWhiteSpace(email) ? "thanhcon14022004@gmail.com" : email.Trim();
            var success = await emailService.SendWelcomeEmailAsync(target, "Hà Trung Thành", "Nam", 22);
            return Ok(new
            {
                success,
                targetEmail = target,
                message = success ? "Email chào mừng đã được gửi thành công đến hòm thư!" : "Gửi email thất bại, vui lòng kiểm tra cấu hình SMTP."
            });
        }
    }
}
