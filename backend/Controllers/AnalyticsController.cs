using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MYFITDAILY_EXE201_Group6.DTOs.Analytics;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        /// <summary>
        /// Thu thập sự kiện truy cập trang web (Pageview, Action, Heartbeat)
        /// </summary>
        [HttpPost("track")]
        [AllowAnonymous]
        public async Task<IActionResult> Track([FromBody] AnalyticsTrackDto dto)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers.UserAgent.ToString();
            var result = await _analyticsService.TrackEventAsync(dto, ip, userAgent);
            return Ok(result);
        }

        /// <summary>
        /// Báo cáo thống kê lưu lượng trang web toàn diện (Google Analytics nội bộ)
        /// Hỗ trợ period: today, 7d, 30d, all
        /// </summary>
        [HttpGet("overview")]
        [AllowAnonymous] // Cho phép Admin hoặc Client gọi với fallback an toàn
        public async Task<IActionResult> GetOverview([FromQuery] string period = "7d")
        {
            var result = await _analyticsService.GetOverviewAsync(period);
            return Ok(result);
        }

        /// <summary>
        /// Danh sách khách truy cập trang web theo thời gian thực (Realtime Active)
        /// </summary>
        [HttpGet("realtime")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRealtime()
        {
            var result = await _analyticsService.GetRealtimeVisitorsAsync();
            return Ok(result);
        }
    }
}

