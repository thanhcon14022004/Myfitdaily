using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.DTOs.Ai;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IAiStylistService _aiStylistService;
        private readonly IFashionEcommerceTrendService _trendService;

        public AiController(IAiStylistService aiStylistService, IFashionEcommerceTrendService trendService)
        {
            _aiStylistService = aiStylistService;
            _trendService = trendService;
        }

        /// <summary>
        /// Yêu cầu AI Stylist phân tích tủ đồ và gợi ý bộ phối trang phục phù hợp
        /// </summary>
        [HttpPost("recommend")]
        public async Task<IActionResult> GetRecommendation([FromBody] AiRecommendRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int? userId = null;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }

            var result = await _aiStylistService.GenerateOutfitRecommendationAsync(userId, request);
            return Ok(result);
        }

        /// <summary>
        /// Trò chuyện trực tiếp với AI Stylist (Có hệ thống Fashion Guardrail chỉ trả lời về thời trang & trang phục)
        /// </summary>
        [HttpPost("chat")]
        public async Task<IActionResult> ChatWithStylist([FromBody] AiChatRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int? userId = null;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }

            var result = await _aiStylistService.ChatWithStylistAsync(userId, request);
            return Ok(result);
        }

        /// <summary>
        /// Lấy dữ liệu Radar xu hướng thời trang trên các sàn TMĐT (Shopee, TikTok Shop, Taobao, Zara, Uniqlo) phân hóa theo từng độ tuổi
        /// </summary>
        [HttpGet("ecommerce-trends")]
        public IActionResult GetEcommerceTrends([FromQuery] string? ageGroupKey, [FromQuery] int? age)
        {
            if (age.HasValue)
            {
                var trend = _trendService.GetTrendByAge(age.Value);
                return Ok(ApiResponse<EcommerceTrendDto>.Ok(trend, "Lấy xu hướng TMĐT thành công"));
            }

            if (!string.IsNullOrWhiteSpace(ageGroupKey))
            {
                var trend = _trendService.GetTrendByGroupKey(ageGroupKey);
                return Ok(ApiResponse<EcommerceTrendDto>.Ok(trend, "Lấy xu hướng TMĐT thành công"));
            }

            var all = _trendService.GetAllTrends();
            return Ok(ApiResponse<List<EcommerceTrendDto>>.Ok(all, "Danh sách toàn bộ xu hướng TMĐT theo các độ tuổi"));
        }

        /// <summary>
        /// AI Vision Smart Scan: Đọc hình ảnh món đồ/nhãn mác, tự động nhận diện thương hiệu, tên, danh mục, màu sắc, phong cách và size
        /// </summary>
        [HttpPost("scan-clothing")]
        public async Task<IActionResult> ScanClothing([FromBody] ScanClothingRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _aiStylistService.ScanClothingItemAsync(request);
            return Ok(result);
        }
    }
}
