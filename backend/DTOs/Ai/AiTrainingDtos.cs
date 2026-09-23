namespace MYFITDAILY_EXE201_Group6.DTOs.Ai;

public class FashionRuleDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Category { get; set; } = "Color"; // Color, BodyShape, Weather, Occasion, General
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RuleContent { get; set; } = string.Empty;
    public string Priority { get; set; } = "High"; // High (Bắt buộc), Medium (Ưu tiên), Low (Tham khảo)
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateFashionRuleDto
{
    public string Category { get; set; } = "Color";
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RuleContent { get; set; } = string.Empty;
    public string Priority { get; set; } = "High";
    public bool IsActive { get; set; } = true;
}

public class UpdateFashionRuleDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? RuleContent { get; set; }
    public string? Priority { get; set; }
    public bool? IsActive { get; set; }
}

public class TrainingSampleItemDto
{
    public int? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty; // Tops, Bottoms, Shoes, Outerwear, Accessories
    public string? ImageUrl { get; set; }
    public string? Color { get; set; }
}

public class TrainingSampleDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Title { get; set; } = string.Empty;
    public string Style { get; set; } = "Smart Casual"; // Streetwear, Old Money, Minimalist, Clean Fit, Korean
    public string Occasion { get; set; } = "Hẹn hò / Dạo phố";
    public string Gender { get; set; } = "Nam"; // Nam, Nữ, Unisex
    public string StylistRationale { get; set; } = string.Empty; // Tại sao cách phối này đẹp
    public List<TrainingSampleItemDto> Items { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateTrainingSampleDto
{
    public string Title { get; set; } = string.Empty;
    public string Style { get; set; } = "Smart Casual";
    public string Occasion { get; set; } = "Hẹn hò / Dạo phố";
    public string Gender { get; set; } = "Nam";
    public string StylistRationale { get; set; } = string.Empty;
    public List<TrainingSampleItemDto> Items { get; set; } = new();
}

public class TestRecommendationRequestDto
{
    public string UserPrompt { get; set; } = string.Empty;
    public string Gender { get; set; } = "Nam";
    public double? Height { get; set; }
    public double? Weight { get; set; }
    public string? BodyShape { get; set; }
    public string? Occasion { get; set; }
    public string? WeatherInfo { get; set; }
    public string? StylePreference { get; set; }
}

public class TestRecommendationResponseDto
{
    public bool Success { get; set; }
    public string Advice { get; set; } = string.Empty;
    public List<string> RulesApplied { get; set; } = new();
    public List<string> SuggestedItems { get; set; } = new();
    public string ModelUsed { get; set; } = "Gemini 1.5 Flash (In-Context Fashion Rules)";
    public int ActiveRulesCount { get; set; }
    public int ActiveSamplesCount { get; set; }
}
