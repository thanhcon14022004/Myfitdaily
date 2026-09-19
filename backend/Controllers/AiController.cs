using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.DTOs.Ai;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly IAiStylistService _stylist;
    private readonly IFashionEcommerceTrendService _trends;
    private readonly IHttpClientFactory _httpClients;
    private readonly IConfiguration _config;

    public AiController(IAiStylistService stylist, IFashionEcommerceTrendService trends, IHttpClientFactory httpClients, IConfiguration config)
        => (_stylist, _trends, _httpClients, _config) = (stylist, trends, httpClients, config);

    private int? CurrentUserId() => int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : null;

    [HttpPost("recommend")]
    public async Task<IActionResult> GetRecommendation([FromBody] AiRecommendRequestDto request)
        => !ModelState.IsValid ? BadRequest(ModelState) : Ok(await _stylist.GenerateOutfitRecommendationAsync(CurrentUserId(), request));

    [HttpPost("chat")]
    public async Task<IActionResult> ChatWithStylist([FromBody] AiChatRequestDto request)
        => !ModelState.IsValid ? BadRequest(ModelState) : Ok(await _stylist.ChatWithStylistAsync(CurrentUserId(), request));

    [HttpGet("ecommerce-trends")]
    public IActionResult GetEcommerceTrends([FromQuery] string? ageGroupKey, [FromQuery] int? age)
    {
        if (age.HasValue) return Ok(ApiResponse<EcommerceTrendDto>.Ok(_trends.GetTrendByAge(age.Value), "Lấy xu hướng TMĐT thành công"));
        if (!string.IsNullOrWhiteSpace(ageGroupKey)) return Ok(ApiResponse<EcommerceTrendDto>.Ok(_trends.GetTrendByGroupKey(ageGroupKey), "Lấy xu hướng TMĐT thành công"));
        return Ok(ApiResponse<List<EcommerceTrendDto>>.Ok(_trends.GetAllTrends(), "Danh sách toàn bộ xu hướng TMĐT theo các độ tuổi"));
    }

    [HttpPost("scan-clothing")]
    public async Task<IActionResult> ScanClothing([FromBody] ScanClothingRequestDto request)
        => !ModelState.IsValid ? BadRequest(ModelState) : Ok(await _stylist.ScanClothingItemAsync(request));

    [HttpPost("scan-ootd")]
    public async Task<IActionResult> ScanOotd([FromBody] ScanOotdRequestDto request)
        => !ModelState.IsValid ? BadRequest(ModelState) : Ok(await _stylist.ScanOotdAsync(request));

    // The browser sends only images. The paid FASHN secret is retained exclusively on the server.
    [HttpPost("virtual-try-on")]
    public async Task<IActionResult> StartVirtualTryOn([FromBody] VirtualTryOnRequestDto request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var key = _config["Fashn:ApiKey"];
        if (string.IsNullOrWhiteSpace(key)) return StatusCode(503, ApiResponse<object>.Fail("Chưa cấu hình FASHN_API_KEY trên server."));
        var payload = new { model_name = request.Category == "shoes" ? "tryon-max" : "tryon-v1.6", inputs = new { model_image = request.ModelImage, garment_image = request.GarmentImage, category = request.Category == "shoes" ? "auto" : request.Category, garment_photo_type = "model", mode = request.Mode is "performance" or "balanced" or "quality" ? request.Mode : "balanced", output_format = "jpeg", moderation_level = "conservative" } };
        var client = _httpClients.CreateClient("Fashn");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);
        var response = await client.PostAsync("/v1/run", new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));
        var body = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode, body);
        using var json = JsonDocument.Parse(body);
        return Ok(new { id = json.RootElement.GetProperty("id").GetString() });
    }

    [HttpGet("virtual-try-on/{id}")]
    public async Task<IActionResult> GetVirtualTryOnStatus(string id)
    {
        var key = _config["Fashn:ApiKey"];
        if (string.IsNullOrWhiteSpace(key)) return StatusCode(503, ApiResponse<object>.Fail("Chưa cấu hình FASHN_API_KEY trên server."));
        var client = _httpClients.CreateClient("Fashn");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);
        var response = await client.GetAsync($"/v1/status/{Uri.EscapeDataString(id)}");
        var body = await response.Content.ReadAsStringAsync();
        return response.IsSuccessStatusCode ? Content(body, "application/json") : StatusCode((int)response.StatusCode, body);
    }
}
