using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.Data;
using MYFITDAILY_EXE201_Group6.DTOs.Subscription;
using MYFITDAILY_EXE201_Group6.DTOs.User;
using MYFITDAILY_EXE201_Group6.Entities;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionController : ControllerBase
    {
        public static readonly List<SubscriptionPlanDto> AVAILABLE_PLANS = new()
        {
            new SubscriptionPlanDto
            {
                Id = "Free",
                Name = "Free",
                MonthlyPrice = 0,
                YearlyPrice = 0,
                Currency = "VNĐ",
                MaxClothes = 15,
                MaxDailyAiRecommendations = 5,
                TargetSegment = "Người dùng mới",
                HighlightBadge = "Gói Khởi Đầu",
                IsPopular = false,
                Features = new List<string>
                {
                    "Quản lý tối đa 15 món đồ trong tủ",
                    "5 lượt gợi ý outfit AI mỗi ngày",
                    "Gợi ý mua sắm cơ bản",
                    "Phối đồ cơ bản theo phong cách"
                }
            },
            new SubscriptionPlanDto
            {
                Id = "Premium",
                Name = "Premium",
                MonthlyPrice = 49000,
                YearlyPrice = 499000,
                Currency = "VNĐ",
                MaxClothes = 100,
                MaxDailyAiRecommendations = -1, // Unlimited
                TargetSegment = "Gen Z & Giới văn phòng trẻ",
                HighlightBadge = "Phổ Biến Nhất 🔥",
                IsPopular = true,
                Features = new List<string>
                {
                    "Quản lý tối đa 100 món đồ trong tủ",
                    "Gợi ý AI không giới hạn lượt hỏi",
                    "Phối đồ theo thời tiết & sự kiện linh hoạt",
                    "Lưu và tra cứu lịch sử outfit toàn diện",
                    "Mặc thử đồ Haute Couture trên Mannequin ảo 3D",
                    "Gợi ý mua sắm trực tiếp từ sàn TMĐT liên kết"
                }
            },
            new SubscriptionPlanDto
            {
                Id = "PremiumPlus",
                Name = "Premium Plus",
                MonthlyPrice = 99000,
                YearlyPrice = 999000,
                Currency = "VNĐ",
                MaxClothes = -1, // Unlimited
                MaxDailyAiRecommendations = -1, // Unlimited
                TargetSegment = "Tín đồ thời trang",
                HighlightBadge = "Đặc Quyền VIP 💎",
                IsPopular = false,
                Features = new List<string>
                {
                    "Lưu trữ không giới hạn số lượng đồ trong tủ",
                    "Giả lập phom dáng AI (AI body simulation & tỷ lệ vóc dáng)",
                    "Phân tích tủ đồ nâng cao & báo cáo xu hướng cá nhân hóa",
                    "Tất cả đặc quyền của gói Premium",
                    "Ưu tiên xử lý AI siêu tốc độ 0.5s",
                    "Trải nghiệm độc quyền sớm các tính năng Haute Couture mới"
                }
            }
        };

        private readonly ApplicationDbContext _context;
        private readonly ISePayService _sePayService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<SubscriptionController> _logger;

        public SubscriptionController(
            ApplicationDbContext context,
            ISePayService sePayService,
            IConfiguration configuration,
            ILogger<SubscriptionController> logger)
        {
            _context = context;
            _sePayService = sePayService;
            _configuration = configuration;
            _logger = logger;
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(claim, out var id))
            {
                return id;
            }
            return null;
        }

        /// <summary>
        /// Lấy bảng giá và danh sách tính năng của 3 gói thành viên VIP
        /// </summary>
        [HttpGet("plans")]
        public IActionResult GetPlans()
        {
            return Ok(ApiResponse<List<SubscriptionPlanDto>>.Ok(AVAILABLE_PLANS, "Lấy danh sách gói thành viên thành công"));
        }

        /// <summary>
        /// Lấy trạng thái gói thành viên và hạn mức sử dụng của người dùng hiện tại
        /// </summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue)
            {
                // Trả về thông số mặc định của khách trải nghiệm (Gói Free)
                var guestPlan = AVAILABLE_PLANS.First(p => p.Id == "Free");
                return Ok(ApiResponse<SubscriptionStatusDto>.Ok(new SubscriptionStatusDto
                {
                    SubscriptionType = "Free",
                    SubscriptionPeriod = "Lifetime",
                    CurrentClothesCount = 0,
                    MaxClothes = guestPlan.MaxClothes,
                    TodayAiCount = 0,
                    MaxDailyAiRecommendations = guestPlan.MaxDailyAiRecommendations,
                    TargetSegment = guestPlan.TargetSegment,
                    CurrentFeatures = guestPlan.Features,
                    IsExpired = false
                }, "Lấy trạng thái gói thành viên trải nghiệm"));
            }

            User? user = null;
            try
            {
                user = await _context.Users.FindAsync(userId.Value);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Subscription Warning]: Error finding user: {ex.Message}");
            }

            var subType = string.IsNullOrWhiteSpace(user?.SubscriptionType) ? "Free" : user.SubscriptionType;
            if (subType.Equals("premium_plus", StringComparison.OrdinalIgnoreCase)) subType = "PremiumPlus";

            var currentPlan = AVAILABLE_PLANS.FirstOrDefault(p => p.Id.Equals(subType, StringComparison.OrdinalIgnoreCase))
                             ?? AVAILABLE_PLANS.First(p => p.Id == "Free");

            int clothesCount = 0;
            int todayAiCount = 0;
            try
            {
                if (user != null)
                {
                    clothesCount = await _context.ClothingItems.CountAsync(c => c.UserId == user.Id);
                    var todayUtc = DateTime.UtcNow.Date;
                    todayAiCount = await _context.AiStylistHistories.CountAsync(h => h.UserId == user.Id && h.CreatedAt >= todayUtc);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Subscription Warning]: Error counting records: {ex.Message}");
            }

            bool isExpired = user?.SubscriptionExpiresAt.HasValue == true && user.SubscriptionExpiresAt.Value < DateTime.UtcNow;

            return Ok(ApiResponse<SubscriptionStatusDto>.Ok(new SubscriptionStatusDto
            {
                SubscriptionType = isExpired ? "Free" : currentPlan.Name,
                SubscriptionPeriod = user?.SubscriptionPeriod,
                SubscriptionExpiresAt = user?.SubscriptionExpiresAt,
                CurrentClothesCount = clothesCount,
                MaxClothes = currentPlan.MaxClothes,
                TodayAiCount = todayAiCount,
                MaxDailyAiRecommendations = currentPlan.MaxDailyAiRecommendations,
                TargetSegment = currentPlan.TargetSegment,
                CurrentFeatures = currentPlan.Features,
                IsExpired = isExpired
            }, "Lấy trạng thái gói thành viên thành công"));
        }

        /// <summary>
        /// Nâng cấp hoặc thay đổi gói dịch vụ
        /// </summary>
        [HttpPost("upgrade")]
        public async Task<IActionResult> UpgradeSubscription([FromBody] UpgradeSubscriptionRequestDto request)
        {
            var userId = GetCurrentUserId();
            User? user = null;

            try
            {
                if (userId.HasValue)
                {
                    user = await _context.Users.FindAsync(userId.Value);
                }
                else
                {
                    user = await _context.Users.FirstOrDefaultAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Subscription Warning]: DB access transient issue: {ex.Message}");
            }

            // Chuẩn hóa tên gói
            string targetPlan = request.PlanId.Trim();
            if (targetPlan.Equals("premium", StringComparison.OrdinalIgnoreCase))
            {
                targetPlan = "Premium";
            }
            else if (targetPlan.Equals("premiumplus", StringComparison.OrdinalIgnoreCase) ||
                     targetPlan.Equals("premium_plus", StringComparison.OrdinalIgnoreCase) ||
                     targetPlan.Equals("plus", StringComparison.OrdinalIgnoreCase))
            {
                targetPlan = "PremiumPlus";
            }
            else
            {
                targetPlan = "Free";
            }

            bool isYearly = string.Equals(request.BillingCycle, "Yearly", StringComparison.OrdinalIgnoreCase);
            var expiresAt = targetPlan == "Free" ? (DateTime?)null : DateTime.UtcNow.AddDays(isYearly ? 365 : 30);
            var period = targetPlan == "Free" ? null : (isYearly ? "Yearly" : "Monthly");

            if (user != null)
            {
                try
                {
                    user.SubscriptionType = targetPlan;
                    user.SubscriptionPeriod = period;
                    user.SubscriptionExpiresAt = expiresAt;
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Subscription Warning]: Could not save changes to DB: {ex.Message}");
                }
            }

            var userDto = new UserDto
            {
                Id = user?.Id ?? 1,
                Email = user?.Email ?? "demo@myfitdaily.com",
                FullName = user?.FullName ?? "Người Dùng VIP",
                AvatarUrl = user?.AvatarUrl,
                Gender = user?.Gender ?? "Nam",
                Role = user?.Role ?? "User",
                SubscriptionType = targetPlan,
                SubscriptionExpiresAt = expiresAt,
                SubscriptionPeriod = period,
                CreatedAt = user?.CreatedAt ?? DateTime.UtcNow,
                Height = user?.Height,
                Weight = user?.Weight,
                Chest = user?.Chest,
                Waist = user?.Waist,
                Hips = user?.Hips,
                BodyShape = user?.BodyShape,
                Age = user?.Age,
                AgeGroup = user?.AgeGroup
            };

            var planDisplayName = targetPlan == "PremiumPlus" ? "Premium Plus" : targetPlan;
            var cycleText = isYearly ? "theo Năm" : "theo Tháng";
            return Ok(ApiResponse<UserDto>.Ok(userDto, $"Chúc mừng bạn đã kích hoạt thành công gói {planDisplayName} ({cycleText})!"));
        }

        /// <summary>
        /// Tạo đơn thanh toán SePay VietQR động với mã OrderCode duy nhất
        /// </summary>
        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequestDto request)
        {
            var userId = GetCurrentUserId() ?? 1;
            var planId = request.PlanId.Trim();
            bool isYearly = string.Equals(request.BillingCycle, "Yearly", StringComparison.OrdinalIgnoreCase);

            decimal amount = 0;
            string planDisplayName = planId;
            if (planId.Equals("Premium", StringComparison.OrdinalIgnoreCase))
            {
                planId = "Premium";
                planDisplayName = "Premium VIP";
                amount = isYearly ? 499000 : 49000;
            }
            else if (planId.Equals("PremiumPlus", StringComparison.OrdinalIgnoreCase) ||
                     planId.Equals("premium_plus", StringComparison.OrdinalIgnoreCase))
            {
                planId = "PremiumPlus";
                planDisplayName = "Premium Plus VIP";
                amount = isYearly ? 999000 : 99000;
            }
            else
            {
                return BadRequest(ApiResponse<object>.Fail("Gói không hợp lệ để tạo thanh toán."));
            }

            // Sinh mã đơn hàng duy nhất bắt đầu bằng MFD (ví dụ: MFD849201)
            var random = new Random();
            string orderCode;
            int attempts = 0;
            do
            {
                orderCode = $"MFD{random.Next(100000, 999999)}";
                attempts++;
            } while (await _context.PaymentTransactions.AnyAsync(p => p.OrderCode == orderCode) && attempts < 10);

            var paymentTx = new PaymentTransaction
            {
                UserId = userId,
                OrderCode = orderCode,
                PlanId = planId,
                BillingCycle = isYearly ? "Yearly" : "Monthly",
                Amount = amount,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.PaymentTransactions.Add(paymentTx);
            await _context.SaveChangesAsync();

            var bankName = _configuration["SePay:BankName"] ?? "ACB";
            var accountNumber = _configuration["SePay:AccountNumber"] ?? "27655931";
            var accountName = _configuration["SePay:AccountName"] ?? "HA TRUNG THANH";

            // Chuẩn VietQR SePay động
            var qrUrl = $"https://qr.sepay.vn/img?acc={accountNumber}&bank={bankName}&amount={Convert.ToInt64(amount)}&des={orderCode}";

            var response = new CreatePaymentResponseDto
            {
                OrderCode = orderCode,
                PlanId = planId,
                PlanName = planDisplayName,
                BillingCycle = isYearly ? "Yearly" : "Monthly",
                Amount = amount,
                BankName = bankName,
                AccountNumber = accountNumber,
                AccountName = accountName,
                TransferContent = orderCode,
                QrUrl = qrUrl,
                CreatedAt = paymentTx.CreatedAt
            };

            return Ok(ApiResponse<CreatePaymentResponseDto>.Ok(response, "Khởi tạo mã thanh toán SePay VietQR thành công"));
        }

        /// <summary>
        /// Kiểm tra giao dịch từ SePay và tự động kích hoạt gói VIP nếu nhận được tiền
        /// </summary>
        [HttpGet("check-payment/{orderCode}")]
        public async Task<IActionResult> CheckPayment(string orderCode)
        {
            var cleanCode = orderCode.Trim();
            var tx = await _context.PaymentTransactions.FirstOrDefaultAsync(p => p.OrderCode == cleanCode);
            if (tx == null)
            {
                return NotFound(ApiResponse<CheckPaymentResponseDto>.Fail("Không tìm thấy đơn hàng thanh toán."));
            }

            if (tx.Status == "Success")
            {
                var existingUser = await _context.Users.FindAsync(tx.UserId);
                return Ok(ApiResponse<CheckPaymentResponseDto>.Ok(new CheckPaymentResponseDto
                {
                    IsSuccess = true,
                    Status = "Success",
                    Message = "Thanh toán đã được xác nhận thành công!",
                    OrderCode = tx.OrderCode,
                    PlanId = tx.PlanId,
                    PaidAt = tx.PaidAt,
                    User = existingUser != null ? MapToUserDto(existingUser) : null
                }, "Đơn hàng đã thanh toán thành công"));
            }

            // Gọi SePay Service để đối soát trực tiếp với API SePay
            var match = await _sePayService.FindMatchingTransactionAsync(tx.OrderCode, tx.Amount);
            if (match != null)
            {
                // Đảm bảo không nạp lặp cùng 1 giao dịch SePay
                bool isTxUsed = await _context.PaymentTransactions.AnyAsync(p => p.SePayTransactionId == match.TransactionId && p.Id != tx.Id);
                if (!isTxUsed)
                {
                    tx.Status = "Success";
                    tx.SePayTransactionId = match.TransactionId;
                    tx.PaidAt = match.TransactionDate ?? DateTime.UtcNow;
                    tx.BankBrandName = match.BankBrandName;
                    tx.AccountNumber = match.AccountNumber;
                    tx.TransactionContent = match.TransactionContent;
                    tx.UpdatedAt = DateTime.UtcNow;

                    var user = await _context.Users.FindAsync(tx.UserId);
                    if (user != null)
                    {
                        bool isYearly = string.Equals(tx.BillingCycle, "Yearly", StringComparison.OrdinalIgnoreCase);
                        user.SubscriptionType = tx.PlanId;
                        user.SubscriptionPeriod = tx.BillingCycle;
                        user.SubscriptionExpiresAt = DateTime.UtcNow.AddDays(isYearly ? 365 : 30);
                        user.UpdatedAt = DateTime.UtcNow;
                    }

                    await _context.SaveChangesAsync();

                    _logger.LogInformation("[Subscription]: Order {OrderCode} successfully upgraded to {PlanId} for User {UserId}",
                        tx.OrderCode, tx.PlanId, tx.UserId);

                    return Ok(ApiResponse<CheckPaymentResponseDto>.Ok(new CheckPaymentResponseDto
                    {
                        IsSuccess = true,
                        Status = "Success",
                        Message = $"Chúc mừng bạn đã kích hoạt thành công gói {tx.PlanId}!",
                        OrderCode = tx.OrderCode,
                        PlanId = tx.PlanId,
                        PaidAt = tx.PaidAt,
                        User = user != null ? MapToUserDto(user) : null
                    }, "Xác nhận thanh toán SePay thành công"));
                }
            }

            return Ok(ApiResponse<CheckPaymentResponseDto>.Ok(new CheckPaymentResponseDto
            {
                IsSuccess = false,
                Status = "Pending",
                Message = "Đang chờ chuyển khoản từ ngân hàng...",
                OrderCode = tx.OrderCode,
                PlanId = tx.PlanId
            }, "Đang chờ thanh toán"));
        }

        /// <summary>
        /// Webhook tiếp nhận tự động từ SePay (nếu cấu hình webhook trong SePay dashboard)
        /// </summary>
        [HttpPost("sepay-webhook")]
        public async Task<IActionResult> SePayWebhook([FromBody] SePayWebhookDto payload)
        {
            if (payload == null || string.IsNullOrWhiteSpace(payload.Content))
            {
                return BadRequest(new { success = false, message = "Invalid payload" });
            }

            var pendingTxs = await _context.PaymentTransactions
                .Where(p => p.Status == "Pending")
                .ToListAsync();

            PaymentTransaction? matchedTx = null;
            foreach (var tx in pendingTxs)
            {
                if (payload.Content.Contains(tx.OrderCode, StringComparison.OrdinalIgnoreCase) &&
                    payload.TransferAmount >= tx.Amount)
                {
                    matchedTx = tx;
                    break;
                }
            }

            if (matchedTx != null)
            {
                matchedTx.Status = "Success";
                matchedTx.SePayTransactionId = payload.Id.ToString();
                matchedTx.PaidAt = DateTime.UtcNow;
                matchedTx.BankBrandName = payload.Gateway;
                matchedTx.AccountNumber = payload.AccountNumber;
                matchedTx.TransactionContent = payload.Content;
                matchedTx.UpdatedAt = DateTime.UtcNow;

                var user = await _context.Users.FindAsync(matchedTx.UserId);
                if (user != null)
                {
                    bool isYearly = string.Equals(matchedTx.BillingCycle, "Yearly", StringComparison.OrdinalIgnoreCase);
                    user.SubscriptionType = matchedTx.PlanId;
                    user.SubscriptionPeriod = matchedTx.BillingCycle;
                    user.SubscriptionExpiresAt = DateTime.UtcNow.AddDays(isYearly ? 365 : 30);
                    user.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation("[SePayWebhook]: Processed order {OrderCode} successfully via webhook", matchedTx.OrderCode);
            }

            return Ok(new { success = true, message = "Webhook processed" });
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                Gender = user.Gender,
                Role = user.Role,
                SubscriptionType = user.SubscriptionType,
                SubscriptionExpiresAt = user.SubscriptionExpiresAt,
                SubscriptionPeriod = user.SubscriptionPeriod,
                CreatedAt = user.CreatedAt,
                Height = user.Height,
                Weight = user.Weight,
                Chest = user.Chest,
                Waist = user.Waist,
                Hips = user.Hips,
                BodyShape = user.BodyShape,
                Age = user.Age,
                AgeGroup = user.AgeGroup
            };
        }
    }
}
