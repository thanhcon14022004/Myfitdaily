using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MYFITDAILY_EXE201_Group6.DTOs.User;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Lấy thông tin hồ sơ của người dùng hiện tại
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _userService.GetProfileAsync(userId.Value);
            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Cập nhật thông tin hồ sơ của người dùng hiện tại
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _userService.UpdateProfileAsync(userId.Value, request);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Thiết lập hoặc đổi mật khẩu đăng nhập thủ công cho tài khoản hiện tại
        /// </summary>
        [HttpPost("set-password")]
        public async Task<IActionResult> SetPassword([FromBody] SetPasswordDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _userService.SetPasswordAsync(userId.Value, request.NewPassword);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Ghi nhận thời gian hoạt động / sử dụng trang web theo chu kỳ nhịp tim (Heartbeat)
        /// </summary>
        [HttpPost("heartbeat")]
        [AllowAnonymous]
        public async Task<IActionResult> Heartbeat([FromBody] HeartbeatDto request)
        {
            var userId = GetCurrentUserId() ?? request.UserId;
            var email = User.FindFirst(ClaimTypes.Email)?.Value ?? request.Email;

            var seconds = request.Seconds > 0 && request.Seconds <= 300 ? request.Seconds : 10;
            var result = await _userService.TrackHeartbeatAsync(userId, email, seconds, request.SessionSeconds, request.Feature);
            return Ok(result);
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            return null;
        }
    }
}
