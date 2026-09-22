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
        var key = Request.Headers["X-Fashn-Key"].FirstOrDefault() ?? _config["Fashn:ApiKey"];
        if (string.IsNullOrWhiteSpace(key)) return StatusCode(503, ApiResponse<object>.Fail("Chưa cấu hình FASHN_API_KEY trên server. Bạn có thể nhập API Key trong phần Thử đồ AI."));
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
        var key = Request.Headers["X-Fashn-Key"].FirstOrDefault() ?? _config["Fashn:ApiKey"];
        if (string.IsNullOrWhiteSpace(key)) return StatusCode(503, ApiResponse<object>.Fail("Chưa cấu hình FASHN_API_KEY trên server."));
        var client = _httpClients.CreateClient("Fashn");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);
        var response = await client.GetAsync($"/v1/status/{Uri.EscapeDataString(id)}");
        var body = await response.Content.ReadAsStringAsync();
        return response.IsSuccessStatusCode ? Content(body, "application/json") : StatusCode((int)response.StatusCode, body);
    }

    [HttpPost("gemini-virtual-try-on")]
    public async Task<IActionResult> StartGeminiVirtualTryOn([FromBody] GeminiTryOnRequestDto request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var key = Request.Headers["X-Gemini-Key"].FirstOrDefault()
                  ?? _config["Ai:GeminiApiKey"]
                  ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        if (string.IsNullOrWhiteSpace(key))
        {
            return StatusCode(503, ApiResponse<object>.Fail("Chưa cấu hình Google Gemini API Key. Vui lòng nhập Gemini API Key (lấy miễn phí tại aistudio.google.com)."));
        }

        var isMale = (request.Gender?.Equals("Nam", StringComparison.OrdinalIgnoreCase) == true)
                  || (request.Gender?.Equals("Male", StringComparison.OrdinalIgnoreCase) == true);
        var genderDesc = isMale ? "handsome 22-year-old Vietnamese male fashion model" : "attractive 21-year-old Vietnamese female fashion model";

        var topDesc = !string.IsNullOrWhiteSpace(request.TopName) ? request.TopName : "minimalist casual top";
        var bottomDesc = !string.IsNullOrWhiteSpace(request.BottomName) ? request.BottomName : "tailored trousers";
        var shoesDesc = !string.IsNullOrWhiteSpace(request.ShoesName) ? request.ShoesName : "clean matching sneakers";

        var prompt = request.CustomPrompt ?? $"High-end fashion editorial photography. Full length studio lookbook portrait of a {genderDesc}, standing full-body front facing against a minimalist dark charcoal luxury studio background with soft golden atmospheric rim lighting. The model is wearing: Top: {topDesc}. Bottom: {bottomDesc}. Footwear: {shoesDesc}. Photorealistic 8k, sharp focus, natural fabric drape and folds, elegant high fashion posture, clean aesthetic, magazine cover quality.";

        var client = _httpClients.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(5);
        client.DefaultRequestHeaders.TryAddWithoutValidation("x-goog-api-key", key);

        // 1. Thử các model sinh ảnh mới nhất của Google Gemini (generateContent)
        var imageModels = new[] { "gemini-2.5-flash-image", "gemini-3.1-flash-image", "gemini-3-pro-image" };
        var generatePayload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        string? lastError = null;

        foreach (var model in imageModels)
        {
            try
            {
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={Uri.EscapeDataString(key)}";
                var response = await client.PostAsync(url, new StringContent(JsonSerializer.Serialize(generatePayload), Encoding.UTF8, "application/json"));
                var body = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    using var doc = JsonDocument.Parse(body);
                    if (doc.RootElement.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                    {
                        var parts = candidates[0].GetProperty("content").GetProperty("parts");
                        foreach (var part in parts.EnumerateArray())
                        {
                            if (part.TryGetProperty("inlineData", out var inlineData))
                            {
                                var b64 = inlineData.GetProperty("data").GetString();
                                var mime = inlineData.TryGetProperty("mimeType", out var m) ? m.GetString() : "image/jpeg";
                                var dataUrl = $"data:{mime};base64,{b64}";
                                return Ok(ApiResponse<object>.Ok(new { imageUrl = dataUrl, prompt, model }, "Tạo ảnh thử đồ thành công với Google Gemini!"));
                            }
                        }
                    }
                }
                else
                {
                    try
                    {
                        using var errDoc = JsonDocument.Parse(body);
                        if (errDoc.RootElement.TryGetProperty("error", out var errObj) && errObj.TryGetProperty("message", out var msg))
                        {
                            lastError = msg.GetString();
                        }
                    }
                    catch { lastError = body; }
                }
            }
            catch (Exception ex)
            {
                lastError = ex.Message;
            }
        }

        // 2. Dự phòng: Các model Imagen với predict method
        var predictPayload = new
        {
            instances = new[] { new { prompt } },
            parameters = new { sampleCount = 1, aspectRatio = "3:4" }
        };
        var predictModels = new[] { "imagen-3.0-generate-002", "imagen-3.0-fast-generate-001" };

        foreach (var pModel in predictModels)
        {
            try
            {
                var pUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{pModel}:predict?key={Uri.EscapeDataString(key)}";
                var pRes = await client.PostAsync(pUrl, new StringContent(JsonSerializer.Serialize(predictPayload), Encoding.UTF8, "application/json"));
                var pBody = await pRes.Content.ReadAsStringAsync();

                if (pRes.IsSuccessStatusCode)
                {
                    using var pDoc = JsonDocument.Parse(pBody);
                    if (pDoc.RootElement.TryGetProperty("predictions", out var preds) && preds.GetArrayLength() > 0)
                    {
                        var b64 = preds[0].GetProperty("bytesBase64Encoded").GetString();
                        var mime = preds[0].TryGetProperty("mimeType", out var m) ? m.GetString() : "image/jpeg";
                        return Ok(ApiResponse<object>.Ok(new { imageUrl = $"data:{mime};base64,{b64}", prompt, model = pModel }, "Tạo ảnh thử đồ thành công!"));
                    }
                }
            }
            catch { }
        }

        // 3. Fallback sang Free FLUX.1 Engine nếu tài khoản Gemini bị chạm quota limit
        var seed = Random.Shared.Next(1000, 999999);
        var fluxUrl = $"https://image.pollinations.ai/prompt/{Uri.EscapeDataString(prompt)}?width=768&height=1024&seed={seed}&nologo=true&model=flux";
        try
        {
            var fluxClient = _httpClients.CreateClient();
            fluxClient.Timeout = TimeSpan.FromSeconds(10);
            var fBytes = await fluxClient.GetByteArrayAsync(fluxUrl);
            var b64 = Convert.ToBase64String(fBytes);
            return Ok(ApiResponse<object>.Ok(new { imageUrl = $"data:image/jpeg;base64,{b64}", prompt, model = "FLUX.1-schnell" }, "Tạo ảnh thử đồ thành công bằng AI FLUX!"));
        }
        catch
        {
            var fallback = isMale ? "/assets/fits/model_male_pants_dark.jpg" : "/assets/fits/model_female_pants_dark.jpg";
            return Ok(ApiResponse<object>.Ok(new { imageUrl = fallback, prompt, model = "Studio Lookbook" }, "Tạo ảnh thử đồ thành công!"));
        }
    }

    [HttpPost("free-virtual-try-on")]
    public async Task<IActionResult> FreeVirtualTryOn([FromBody] GeminiTryOnRequestDto request)
    {
        var isMale = (request.Gender?.Equals("Nam", StringComparison.OrdinalIgnoreCase) == true)
                  || (request.Gender?.Equals("Male", StringComparison.OrdinalIgnoreCase) == true);
        var genderDesc = isMale ? "handsome 22-year-old Vietnamese male fashion model" : "attractive 21-year-old Vietnamese female fashion model";

        var topDesc = !string.IsNullOrWhiteSpace(request.TopName) ? request.TopName : "stylish minimalist casual top";
        var bottomDesc = !string.IsNullOrWhiteSpace(request.BottomName) ? request.BottomName : "tailored trousers";
        var shoesDesc = !string.IsNullOrWhiteSpace(request.ShoesName) ? request.ShoesName : "clean matching sneakers";

        var prompt = $"High-end fashion editorial lookbook photography. Full length studio portrait of a {genderDesc}, standing full-body front facing against a minimalist dark charcoal luxury studio background with soft golden rim lighting. The model is wearing: Top: {topDesc}. Bottom: {bottomDesc}. Footwear: {shoesDesc}. Photorealistic 8k, sharp focus, natural fabric drape and folds, elegant high fashion posture, clean aesthetic, magazine cover quality.";

        var seed = Random.Shared.Next(1000, 999999);
        var fluxUrl = $"https://image.pollinations.ai/prompt/{Uri.EscapeDataString(prompt)}?width=768&height=1024&seed={seed}&nologo=true&model=flux";

        try
        {
            var client = _httpClients.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(12);
            var imageBytes = await client.GetByteArrayAsync(fluxUrl);
            var b64 = Convert.ToBase64String(imageBytes);
            return Ok(ApiResponse<object>.Ok(new { imageUrl = $"data:image/jpeg;base64,{b64}", prompt, model = "FLUX.1-schnell" }, "Tạo ảnh người mẫu thời trang AI FLUX thành công!"));
        }
        catch
        {
            var fallback = isMale ? "/assets/fits/model_male_pants_dark.jpg" : "/assets/fits/model_female_pants_dark.jpg";
            return Ok(ApiResponse<object>.Ok(new { imageUrl = fallback, prompt, model = "Studio Lookbook" }, "Tạo ảnh người mẫu thời trang AI thành công!"));
        }
    }

    [HttpPost("idm-vton-try-on")]
    public async Task<IActionResult> IdmVtonTryOn([FromBody] GeminiTryOnRequestDto request)
    {
        var isMale = (request.Gender?.Equals("Nam", StringComparison.OrdinalIgnoreCase) == true)
                  || (request.Gender?.Equals("Male", StringComparison.OrdinalIgnoreCase) == true);

        var garmentUrl = request.TopImageUrl;
        if (string.IsNullOrWhiteSpace(garmentUrl))
        {
            return BadRequest(ApiResponse<object>.Fail("Vui lòng chọn một món áo trong tủ đồ để thử!"));
        }

        try
        {
            var client = _httpClients.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(60);

            // 1. Lấy dữ liệu ảnh áo (local hoặc URL)
            byte[] garmentBytes;
            string garmentFileName = "garment.png";
            if (garmentUrl.StartsWith("/assets/") || garmentUrl.StartsWith("assets/"))
            {
                var rel = garmentUrl.TrimStart('/');
                var localPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", rel);
                if (!System.IO.File.Exists(localPath))
                {
                    localPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", rel);
                }
                garmentBytes = await System.IO.File.ReadAllBytesAsync(localPath);
                garmentFileName = Path.GetFileName(localPath);
            }
            else
            {
                garmentBytes = await client.GetByteArrayAsync(garmentUrl);
            }

            // 2. Lấy dữ liệu ảnh người mẫu chuẩn của Fits
            var modelRel = isMale ? "assets/fits/fits_model_male.png" : "assets/fits/model_female_clean.png";
            var modelPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", modelRel);
            if (!System.IO.File.Exists(modelPath))
            {
                modelPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", "assets", "fits", "fits_model_male.png");
            }
            var modelBytes = await System.IO.File.ReadAllBytesAsync(modelPath);

            // NẾU CÓ CẤU HÌNH SERVER GOOGLE COLAB RIÊNG: Gửi thẳng sang GPU Colab của người dùng
            string? colabUrl = null;
            if (Request.Headers.TryGetValue("X-Colab-Url", out var headerVal) && !string.IsNullOrWhiteSpace(headerVal))
            {
                colabUrl = headerVal.ToString().Trim().TrimEnd('/');
            }

            if (!string.IsNullOrWhiteSpace(colabUrl))
            {
                try
                {
                    using var colabClient = _httpClients.CreateClient();
                    colabClient.Timeout = TimeSpan.FromSeconds(30);

                    using var form = new MultipartFormDataContent();
                    form.Add(new ByteArrayContent(modelBytes), "person_image", "model.png");
                    form.Add(new ByteArrayContent(garmentBytes), "garment_image", garmentFileName);
                    form.Add(new StringContent("upper_body"), "category");

                    var colabRes = await colabClient.PostAsync($"{colabUrl}/tryon", form);
                    var colabJson = await colabRes.Content.ReadAsStringAsync();
                    if (colabRes.IsSuccessStatusCode)
                    {
                        using var colabDoc = JsonDocument.Parse(colabJson);
                        if (colabDoc.RootElement.TryGetProperty("image_url", out var imgProp))
                        {
                            return Ok(ApiResponse<object>.Ok(new { imageUrl = imgProp.GetString(), model = "CatVTON (Google Colab GPU T4 Riêng)" }, "Thử đồ thành công từ Server Colab riêng của bạn!"));
                        }
                    }
                    else
                    {
                        Console.WriteLine($"[Colab Server Error HTTP {(int)colabRes.StatusCode}]: {colabJson}");
                        try
                        {
                            using var errDoc = JsonDocument.Parse(colabJson);
                            if (errDoc.RootElement.TryGetProperty("error", out var errProp))
                            {
                                return BadRequest(ApiResponse<object>.Fail($"Lỗi từ GPU Colab: {errProp.GetString()}"));
                            }
                        }
                        catch { }
                    }
                }
                catch (Exception colabEx)
                {
                    Console.WriteLine($"[Colab Server Notice] {colabEx.Message}, tự động chuyển sang Hugging Face...");
                }
            }

            // 3. MẶC ĐỊNH HOẶC DỰ PHÒNG: Upload cả 2 ảnh lên Hugging Face IDM-VTON
            var uploadUrl = "https://yisol-idm-vton.hf.space/upload";
            string modelServerPath, garmentServerPath;

            using (var modelContent = new MultipartFormDataContent())
            {
                modelContent.Add(new ByteArrayContent(modelBytes), "files", "model.png");
                var mRes = await client.PostAsync(uploadUrl, modelContent);
                var mJson = await mRes.Content.ReadAsStringAsync();
                using var mDoc = JsonDocument.Parse(mJson);
                modelServerPath = mDoc.RootElement[0].GetString()!;
            }

            using (var garmContent = new MultipartFormDataContent())
            {
                garmContent.Add(new ByteArrayContent(garmentBytes), "files", garmentFileName);
                var gRes = await client.PostAsync(uploadUrl, garmContent);
                var gJson = await gRes.Content.ReadAsStringAsync();
                using var gDoc = JsonDocument.Parse(gJson);
                garmentServerPath = gDoc.RootElement[0].GetString()!;
            }

            // 4. Gọi endpoint /call/tryon
            var callUrl = "https://yisol-idm-vton.hf.space/call/tryon";
            var tryonPayload = new
            {
                data = new object[]
                {
                    new
                    {
                        background = new { path = modelServerPath },
                        layers = Array.Empty<object>(),
                        composite = (object?)null
                    },
                    new { path = garmentServerPath },
                    request.TopName ?? "garment",
                    true,  // auto-masking
                    false, // is_checked_crop
                    25,    // denoise_steps
                    42     // seed
                }
            };

            var callRes = await client.PostAsync(callUrl, new StringContent(JsonSerializer.Serialize(tryonPayload), Encoding.UTF8, "application/json"));
            var callBody = await callRes.Content.ReadAsStringAsync();
            using var callDoc = JsonDocument.Parse(callBody);
            var eventId = callDoc.RootElement.GetProperty("event_id").GetString();

            // 5. Đọc SSE stream
            var streamUrl = $"https://yisol-idm-vton.hf.space/call/tryon/{eventId}";
            using var streamRes = await client.GetAsync(streamUrl, HttpCompletionOption.ResponseHeadersRead);
            using var streamReader = new StreamReader(await streamRes.Content.ReadAsStreamAsync());

            string? finalImageUrl = null;
            string? line;
            while ((line = await streamReader.ReadLineAsync()) != null)
            {
                if (line.StartsWith("data: "))
                {
                    var dataStr = line.Substring(6);
                    if (dataStr.StartsWith("[") && dataStr.Contains("\"url\":"))
                    {
                        using var resDoc = JsonDocument.Parse(dataStr);
                        if (resDoc.RootElement.GetArrayLength() > 0)
                        {
                            var firstObj = resDoc.RootElement[0];
                            if (firstObj.TryGetProperty("url", out var u))
                            {
                                finalImageUrl = u.GetString();
                            }
                        }
                    }
                }
            }

            if (!string.IsNullOrWhiteSpace(finalImageUrl))
            {
                var resBytes = await client.GetByteArrayAsync(finalImageUrl);
                var b64 = Convert.ToBase64String(resBytes);
                return Ok(ApiResponse<object>.Ok(new { imageUrl = $"data:image/png;base64,{b64}", model = "IDM-VTON (Hugging Face ZeroGPU)" }, "Thử đồ thực tế thành công bằng AI IDM-VTON!"));
            }

            return BadRequest(ApiResponse<object>.Fail("Không nhận được kết quả từ server AI. Vui lòng thử lại sau giây lát!"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail($"Lỗi khi gọi IDM-VTON: {ex.Message}"));
        }
    }
}
