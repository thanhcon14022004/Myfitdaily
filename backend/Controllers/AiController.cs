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
        /// Y├¬u cß║ºu AI Stylist ph├ón t├¡ch tß╗º ─æß╗ô v├á gß╗úi ├╜ bß╗Ö phß╗æi trang phß╗Ñc ph├╣ hß╗úp
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
        /// Tr├▓ chuyß╗çn trß╗▒c tiß║┐p vß╗¢i AI Stylist (C├│ hß╗ç thß╗æng Fashion Guardrail chß╗ë trß║ú lß╗¥i vß╗ü thß╗¥i trang & trang phß╗Ñc)
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
        /// Lß║Ñy dß╗» liß╗çu Radar xu h╞░ß╗¢ng thß╗¥i trang tr├¬n c├íc s├án TM─ÉT (Shopee, TikTok Shop, Taobao, Zara, Uniqlo) ph├ón h├│a theo tß╗½ng ─æß╗Ö tuß╗òi
        /// </summary>
        [HttpGet("ecommerce-trends")]
        public IActionResult GetEcommerceTrends([FromQuery] string? ageGroupKey, [FromQuery] int? age)
        {
            if (age.HasValue)
            {
                var trend = _trendService.GetTrendByAge(age.Value);
                return Ok(ApiResponse<EcommerceTrendDto>.Ok(trend, "Lß║Ñy xu h╞░ß╗¢ng TM─ÉT th├ánh c├┤ng"));
            }

            if (!string.IsNullOrWhiteSpace(ageGroupKey))
            {
                var trend = _trendService.GetTrendByGroupKey(ageGroupKey);
                return Ok(ApiResponse<EcommerceTrendDto>.Ok(trend, "Lß║Ñy xu h╞░ß╗¢ng TM─ÉT th├ánh c├┤ng"));
            }

            var all = _trendService.GetAllTrends();
            return Ok(ApiResponse<List<EcommerceTrendDto>>.Ok(all, "Danh s├ích to├án bß╗Ö xu h╞░ß╗¢ng TM─ÉT theo c├íc ─æß╗Ö tuß╗òi"));
        }

        /// <summary>
        /// AI Vision Smart Scan: ─Éß╗ìc h├¼nh ß║únh m├│n ─æß╗ô/nh├ún m├íc, tß╗▒ ─æß╗Öng nhß║¡n diß╗çn th╞░╞íng hiß╗çu, t├¬n, danh mß╗Ñc, m├áu sß║»c, phong c├ích v├á size
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

        /// <summary>
        /// AI OOTD Deconstruction: Ph├ón t├¡ch ß║únh to├án th├ón (OOTD) v├á b├│c t├ích ─æß╗ông loß║ít ├üo / Quß║ºn / Gi├áy / Phß╗Ñ kiß╗çn v├áo tß╗º ─æß╗ô
        /// </summary>
        [HttpPost("scan-ootd")]
        public async Task<IActionResult> ScanOotd([FromBody] ScanOotdRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _aiStylistService.ScanOotdAsync(request);
            return Ok(result);
        }
    }
}