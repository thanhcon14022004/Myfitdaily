using System.Text;
using System.Text.Json;
using MYFITDAILY_EXE201_Group6.DTOs.Ai;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Services.Implementations;

public class AiTrainingService : IAiTrainingService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _storagePath;
    private readonly object _lock = new();

    public AiTrainingService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        
        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var dataDir = Path.Combine(baseDir, "Data");
        if (!Directory.Exists(dataDir))
        {
            Directory.CreateDirectory(dataDir);
        }
        _storagePath = Path.Combine(dataDir, "ai_training_store.json");
        EnsureInitialized();
    }

    private class TrainingStoreModel
    {
        public List<FashionRuleDto> Rules { get; set; } = new();
        public List<TrainingSampleDto> Samples { get; set; } = new();
    }

    private void EnsureInitialized()
    {
        lock (_lock)
        {
            if (File.Exists(_storagePath))
            {
                try
                {
                    var json = File.ReadAllText(_storagePath);
                    var model = JsonSerializer.Deserialize<TrainingStoreModel>(json);
                    if (model != null && model.Rules.Count > 0)
                    {
                        return; // already has data
                    }
                }
                catch { }
            }

            // Seed default curated fashion rules
            var defaultStore = new TrainingStoreModel
            {
                Rules = new List<FashionRuleDto>
                {
                    new()
                    {
                        Id = "rule-color-1",
                        Category = "Color",
                        Name = "Quy Tắc 3 Màu Tối Giản (Rule of Three)",
                        Description = "Hạn chế tối đa số lượng màu trên 1 set trang phục để đảm bảo sự thanh lịch.",
                        RuleContent = "Trong một set đồ hàng ngày, chỉ sử dụng tối đa 3 màu chủ đạo (ví dụ: Đen - Trắng - Be, hoặc Navy - Trắng - Xám). Tuyệt đối không phối quá 3 khối màu nổi bật cùng lúc.",
                        Priority = "High",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "rule-color-2",
                        Category = "Color",
                        Name = "Tương Phản Sáng - Tối (High Contrast)",
                        Description = "Tạo chiều sâu và phân tầng thị giác rõ nét giữa áo và quần.",
                        RuleContent = "Khi người dùng chọn áo màu sáng (trắng, kem, be, pastel), ưu tiên gợi ý quần tối màu (đen, xám than, xanh navy đậm) và ngược lại để tạo sự cân bằng và phân chia tỷ lệ cơ thể.",
                        Priority = "High",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "rule-color-3",
                        Category = "Color",
                        Name = "Bảng Màu Đất & Tối Giản (Earth Tones & Quiet Luxury)",
                        Description = "Phối hợp các gam màu trung tính đem lại cảm giác sang trọng và bền vững.",
                        RuleContent = "Ưu tiên các bộ phối kết hợp màu Be, Nâu Cacao, Xanh Rêu, Xám Melange và Trắng ngà. Tránh các màu neon chói lóa khi tư vấn phong cách công sở hoặc dạo phố thanh lịch.",
                        Priority = "Medium",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "rule-body-1",
                        Category = "BodyShape",
                        Name = "Tỷ Lệ Hoàng Kim 1/3 - 2/3 (Tôn Dáng & Hack Chiều Cao)",
                        Description = "Phân chia tỷ lệ áo và quần để chân trông dài hơn.",
                        RuleContent = "Gợi ý sơ vin (tuck) hoặc chọn áo form crop/boxy kết hợp quần cạp cao để phần thân trên chiếm 1/3 và đôi chân chiếm 2/3 tổng chiều cao người mặc.",
                        Priority = "High",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "rule-body-2",
                        Category = "BodyShape",
                        Name = "Cân Bằng Phom Dáng (Tight-Loose Balance)",
                        Description = "Không mặc cả cây quá bó hoặc cả cây quá thùng thình.",
                        RuleContent = "Nếu chọn áo form rộng (Oversized / Boxy), hãy cân bằng bằng quần suông đứng vừa vặn hoặc ngược lại. Tránh tạo cảm giác nuốt dáng người mặc.",
                        Priority = "High",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "rule-weather-1",
                        Category = "Weather",
                        Name = "Xếp Lớp Giữ Ấm Dưới 20°C (Layering Cold Weather)",
                        Description = "Bắt buộc tư vấn trang phục nhiều lớp khi nhiệt độ xuống thấp.",
                        RuleContent = "Khi thời tiết dưới 20°C hoặc se lạnh, BẮT BUỘC gợi ý phối Layer: lớp trong là áo thun/sơ mi, lớp ngoài khoác Blazer dạ, Bomber, hoặc Sweatshirt nỉ bông.",
                        Priority = "High",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "rule-weather-2",
                        Category = "Weather",
                        Name = "Chất Liệu Thoáng Khí Mùa Nóng (> 30°C)",
                        Description = "Tư vấn chất liệu mỏng nhẹ, thấm hút mồ hôi cho mùa hè.",
                        RuleContent = "Khi nhiệt độ trên 30°C, ưu tiên áo ba lỗ, polo pique, áo thun cotton 100% hoặc linen. Hạn chế quần áo chất liệu dạ, da hoặc nỉ dày.",
                        Priority = "High",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "rule-occasion-1",
                        Category = "Occasion",
                        Name = "Smart Casual Đi Làm & Hội Thảo",
                        Description = "Lịch thiệp nhưng không quá cứng nhắc.",
                        RuleContent = "Phối áo Sơ mi Oxford hoặc Polo có cổ với Quần tây xếp ly hoặc Chinos và Giày Loafer / Sneaker da tối giản.",
                        Priority = "Medium",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                },
                Samples = new List<TrainingSampleDto>
                {
                    new()
                    {
                        Id = "sample-1",
                        Title = "Set Đồ Mẫu 1: Cream & Black Minimal Streetwear",
                        Style = "Minimalist Streetwear",
                        Occasion = "Dạo phố / Cafe cuối tuần",
                        Gender = "Nam",
                        StylistRationale = "Áp dụng quy tắc tương phản sáng tối: Sweatshirt đen dày dặn form boxy kết hợp cùng quần suông kem nhẹ nhàng và sneaker retro gum, tạo vẻ ngoài trẻ trung thanh lịch chuẩn GenZ.",
                        Items = new List<TrainingSampleItemDto>
                        {
                            new() { Name = "Sweatshirt Frozen.HN Studio", CategoryName = "Tops", Color = "Đen", ImageUrl = "/assets/stylist/frozen-sweatshirt.png" },
                            new() { Name = "Quần suông dây rút Cream", CategoryName = "Bottoms", Color = "Kem", ImageUrl = "/assets/stylist/cream-relaxed-pants.png" },
                            new() { Name = "Sneaker Retro Cream / Black", CategoryName = "Shoes", Color = "Kem / Đen", ImageUrl = "/assets/stylist/retro-sneakers.png" }
                        },
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "sample-2",
                        Title = "Set Đồ Mẫu 2: Smart Casual Navy & Loafer",
                        Style = "Smart Casual",
                        Occasion = "Đi làm / Gặp gỡ đối tác / Hẹn hò tối",
                        Gender = "Nam",
                        StylistRationale = "Áo sơ mi oxford màu xanh navy tôn da phái mạnh, kết hợp cùng quần âu xếp ly đen hoặc chinos kem và giày da mang đến vẻ đĩnh đạc đáng tin cậy.",
                        Items = new List<TrainingSampleItemDto>
                        {
                            new() { Name = "Áo Sơ Mi Oxford Navy Slim-Fit", CategoryName = "Tops", Color = "Xanh Navy", ImageUrl = "/assets/stylist/navy-shirt-essential.png" },
                            new() { Name = "Quần Tây Xếp Ly Đen May Đo", CategoryName = "Bottoms", Color = "Đen", ImageUrl = "/assets/stylist/cream-relaxed-pants.png" },
                            new() { Name = "Giày Sneaker Da Trắng Minimalist", CategoryName = "Shoes", Color = "Trắng", ImageUrl = "/assets/stylist/retro-sneakers.png" }
                        },
                        CreatedAt = DateTime.UtcNow
                    }
                }
            };

            var options = new JsonSerializerOptions { WriteIndented = true };
            File.WriteAllText(_storagePath, JsonSerializer.Serialize(defaultStore, options));
        }
    }

    private TrainingStoreModel LoadStore()
    {
        lock (_lock)
        {
            if (!File.Exists(_storagePath))
            {
                EnsureInitialized();
            }
            try
            {
                var json = File.ReadAllText(_storagePath);
                return JsonSerializer.Deserialize<TrainingStoreModel>(json) ?? new TrainingStoreModel();
            }
            catch
            {
                return new TrainingStoreModel();
            }
        }
    }

    private void SaveStore(TrainingStoreModel store)
    {
        lock (_lock)
        {
            var options = new JsonSerializerOptions { WriteIndented = true };
            File.WriteAllText(_storagePath, JsonSerializer.Serialize(store, options));
        }
    }

    public Task<List<FashionRuleDto>> GetAllRulesAsync()
    {
        var store = LoadStore();
        return Task.FromResult(store.Rules);
    }

    public Task<FashionRuleDto?> GetRuleByIdAsync(string id)
    {
        var store = LoadStore();
        var rule = store.Rules.FirstOrDefault(r => r.Id == id);
        return Task.FromResult(rule);
    }

    public Task<FashionRuleDto> CreateRuleAsync(CreateFashionRuleDto dto)
    {
        var store = LoadStore();
        var newRule = new FashionRuleDto
        {
            Id = "rule-" + Guid.NewGuid().ToString("N")[..8],
            Category = dto.Category ?? "General",
            Name = dto.Name,
            Description = dto.Description,
            RuleContent = dto.RuleContent,
            Priority = dto.Priority ?? "High",
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };
        store.Rules.Insert(0, newRule);
        SaveStore(store);
        return Task.FromResult(newRule);
    }

    public Task<FashionRuleDto?> UpdateRuleAsync(string id, UpdateFashionRuleDto dto)
    {
        var store = LoadStore();
        var existing = store.Rules.FirstOrDefault(r => r.Id == id);
        if (existing == null) return Task.FromResult<FashionRuleDto?>(null);

        if (!string.IsNullOrWhiteSpace(dto.Name)) existing.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.Description)) existing.Description = dto.Description;
        if (!string.IsNullOrWhiteSpace(dto.RuleContent)) existing.RuleContent = dto.RuleContent;
        if (!string.IsNullOrWhiteSpace(dto.Priority)) existing.Priority = dto.Priority;
        if (dto.IsActive.HasValue) existing.IsActive = dto.IsActive.Value;

        SaveStore(store);
        return Task.FromResult<FashionRuleDto?>(existing);
    }

    public Task<bool> DeleteRuleAsync(string id)
    {
        var store = LoadStore();
        var removed = store.Rules.RemoveAll(r => r.Id == id) > 0;
        if (removed) SaveStore(store);
        return Task.FromResult(removed);
    }

    public Task<List<TrainingSampleDto>> GetAllSamplesAsync()
    {
        var store = LoadStore();
        return Task.FromResult(store.Samples);
    }

    public Task<TrainingSampleDto> CreateSampleAsync(CreateTrainingSampleDto dto)
    {
        var store = LoadStore();
        var newSample = new TrainingSampleDto
        {
            Id = "sample-" + Guid.NewGuid().ToString("N")[..8],
            Title = dto.Title,
            Style = dto.Style,
            Occasion = dto.Occasion,
            Gender = dto.Gender,
            StylistRationale = dto.StylistRationale,
            Items = dto.Items ?? new(),
            CreatedAt = DateTime.UtcNow
        };
        store.Samples.Insert(0, newSample);
        SaveStore(store);
        return Task.FromResult(newSample);
    }

    public Task<bool> DeleteSampleAsync(string id)
    {
        var store = LoadStore();
        var removed = store.Samples.RemoveAll(s => s.Id == id) > 0;
        if (removed) SaveStore(store);
        return Task.FromResult(removed);
    }

    public Task<string> GetActiveRulesSystemPromptAsync()
    {
        var store = LoadStore();
        var activeRules = store.Rules.Where(r => r.IsActive).ToList();
        var activeSamples = store.Samples.ToList();

        var sb = new StringBuilder();
        sb.AppendLine("═══════════════════════════════════════════════════════════════════════════════");
        sb.AppendLine("✦ HỆ THỐNG QUY TẮC THỜI TRANG ĐƯỢC HUẤN LUYỆN BỞI BAN QUẢN TRỊ (ADMIN FASHION RULES):");
        sb.AppendLine("BẮT BUỘC tuân thủ các nguyên lý phối đồ đã được kiểm định sau đây khi tư vấn cho người dùng:");

        int idx = 1;
        foreach (var rule in activeRules)
        {
            sb.AppendLine($"{idx}. [{rule.Category.ToUpper()} | {rule.Priority.ToUpper()}] {rule.Name}:");
            sb.AppendLine($"   Quy tắc: {rule.RuleContent}");
            idx++;
        }

        if (activeSamples.Any())
        {
            sb.AppendLine("\n✦ CÁC BỘ PHỐI TRANG PHỤC MẪU CHUẨN MỰC ĐÃ ĐƯỢC ĐÀO TẠO (GROUND-TRUTH OUTFITS):");
            int sIdx = 1;
            foreach (var s in activeSamples.Take(4))
            {
                var itemsStr = string.Join(" + ", s.Items.Select(i => $"{i.CategoryName}: {i.Name} ({i.Color})"));
                sb.AppendLine($"[Mẫu {sIdx}] {s.Title} ({s.Style} - {s.Occasion} - {s.Gender}):");
                sb.AppendLine($"  Gồm: {itemsStr}");
                sb.AppendLine($"  Lý do phối đẹp: {s.StylistRationale}");
                sIdx++;
            }
        }
        sb.AppendLine("═══════════════════════════════════════════════════════════════════════════════");

        return Task.FromResult(sb.ToString());
    }

    public async Task<TestRecommendationResponseDto> TestRecommendationAsync(TestRecommendationRequestDto request)
    {
        var store = LoadStore();
        var activeRules = store.Rules.Where(r => r.IsActive).ToList();
        var activeSamples = store.Samples.ToList();

        var rulesPrompt = await GetActiveRulesSystemPromptAsync();
        var apiKey = _configuration["Ai:GeminiApiKey"] ?? "";

        // Build a detailed test prompt
        var systemInstruction = "Bạn là Chuyên gia Thời trang và Stylist Cá Nhân AI cao cấp của MyFitDaily. " +
                                "Dưới đây là BỘ QUY TẮC THỜI TRANG ĐÃ HUẤN LUYỆN BỞI BAN QUẢN TRỊ:\n" +
                                rulesPrompt + "\n" +
                                "Nhiệm vụ: Phân tích tình huống người dùng, ÁP DỤNG CHÍNH XÁC các quy tắc trên để gợi ý một set đồ hoàn chỉnh (Áo, Quần, Giày, Áo khoác nếu cần) và giải thích rõ ràng tại sao cách phối này tuân thủ các quy tắc thời trang.\n" +
                                "Trả về câu trả lời chuyên nghiệp, súc tích bằng tiếng Việt.";

        var userContext = $"[TÌNH HUỐNG THỬ NGHIỆM]:\n" +
                          $"- Giới tính: {request.Gender}\n" +
                          (!string.IsNullOrWhiteSpace(request.Occasion) ? $"- Dịp / Hoàn cảnh: {request.Occasion}\n" : "") +
                          (request.Height.HasValue ? $"- Chiều cao: {request.Height}cm\n" : "") +
                          (request.Weight.HasValue ? $"- Cân nặng: {request.Weight}kg\n" : "") +
                          (!string.IsNullOrWhiteSpace(request.BodyShape) ? $"- Dáng người: {request.BodyShape}\n" : "") +
                          (!string.IsNullOrWhiteSpace(request.WeatherInfo) ? $"- Thời tiết: {request.WeatherInfo}\n" : "") +
                          (!string.IsNullOrWhiteSpace(request.StylePreference) ? $"- Gu mong muốn: {request.StylePreference}\n" : "") +
                          $"- Yêu cầu của người dùng: \"{request.UserPrompt}\"";

        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(15);
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

                var payload = new
                {
                    contents = new[]
                    {
                        new { role = "user", parts = new[] { new { text = systemInstruction + "\n\n" + userContext } } }
                    }
                };

                var res = await client.PostAsync(url, new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));
                if (res.IsSuccessStatusCode)
                {
                    var resJson = await res.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(resJson);
                    var candidates = doc.RootElement.GetProperty("candidates");
                    if (candidates.GetArrayLength() > 0)
                    {
                        var text = candidates[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
                        return new TestRecommendationResponseDto
                        {
                            Success = true,
                            Advice = text ?? "Không nhận được phản hồi từ AI.",
                            RulesApplied = activeRules.Select(r => r.Name).Take(4).ToList(),
                            ModelUsed = "Google Gemini 1.5 Flash (In-Context Learning)",
                            ActiveRulesCount = activeRules.Count,
                            ActiveSamplesCount = activeSamples.Count
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AiTraining Gemini Call Warning]: {ex.Message}");
            }
        }

        // Smart In-Memory Stylist Engine Fallback if no Gemini Key or network error
        var fallbackAdvice = new StringBuilder();
        fallbackAdvice.AppendLine($"✨ [ĐÁNH GIÁ TỪ BỘ QUY TẮC ĐÃ HUẤN LUYỆN]");
        fallbackAdvice.AppendLine($"Dựa trên {activeRules.Count} quy tắc thời trang đang hoạt động:");
        fallbackAdvice.AppendLine($"• Phối màu: Áp dụng 'Quy tắc 3 màu' và 'Tương phản sáng tối'. Gợi ý áo thun/sơ mi sáng màu phối quần âu hoặc jeans tối màu.");
        if (request.WeatherInfo != null && (request.WeatherInfo.Contains("lạnh") || request.WeatherInfo.Contains("1") || request.WeatherInfo.Contains("20")))
        {
            fallbackAdvice.AppendLine($"• Thời tiết ({request.WeatherInfo}): Kích hoạt quy tắc 'Layering dưới 20°C' - Khoác thêm Blazer dạ nâu hoặc Bomber kaki để vừa ấm vừa thanh lịch.");
        }
        else
        {
            fallbackAdvice.AppendLine($"• Thời tiết: Áo chất liệu cotton thoáng mát, form relaxed tạo sự dễ chịu.");
        }
        fallbackAdvice.AppendLine($"• Vóc dáng: Tuân thủ 'Tỷ lệ hoàng kim 1/3 - 2/3', sơ vin vạt trước để tạo cảm giác đôi chân thon dài hơn.");
        fallbackAdvice.AppendLine($"• Set đồ hoàn chỉnh: 1 Áo form thoải mái + 1 Quần suông cạp cao + Sneaker retro minimal.");

        return new TestRecommendationResponseDto
        {
            Success = true,
            Advice = fallbackAdvice.ToString(),
            RulesApplied = activeRules.Select(r => r.Name).Take(3).ToList(),
            ModelUsed = "Fashion Rules Engine Studio (In-Context Simulation)",
            ActiveRulesCount = activeRules.Count,
            ActiveSamplesCount = activeSamples.Count
        };
    }

    public Task<string> ExportDatasetJsonlAsync()
    {
        var store = LoadStore();
        var sb = new StringBuilder();

        // Convert samples & rules into standard SFT (Supervised Fine-Tuning) JSONL format for OpenAI / Vertex AI
        foreach (var sample in store.Samples)
        {
            var userMsg = $"Tôi là {sample.Gender}, đang cần phối một bộ trang phục phong cách {sample.Style} cho dịp {sample.Occasion}. Hãy gợi ý cho tôi set đồ chuẩn và giải thích nguyên tắc phối.";
            var assistantMsg = $"Dưới đây là bản phối {sample.Title} chuẩn phong cách {sample.Style}:\n" +
                               string.Join("\n", sample.Items.Select(i => $"- {i.CategoryName}: {i.Name} ({i.Color})")) +
                               $"\n\n✦ Nguyên tắc chuyên gia: {sample.StylistRationale}";

            var entry = new
            {
                messages = new object[]
                {
                    new { role = "system", content = "Bạn là Chuyên gia Stylist AI của MyFitDaily." },
                    new { role = "user", content = userMsg },
                    new { role = "assistant", content = assistantMsg }
                }
            };

            sb.AppendLine(JsonSerializer.Serialize(entry));
        }

        return Task.FromResult(sb.ToString());
    }
}
