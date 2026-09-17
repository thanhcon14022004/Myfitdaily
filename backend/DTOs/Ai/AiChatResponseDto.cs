namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class AiChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;

        public bool IsFashionRelated { get; set; } = true;

        public bool IsWardrobeEmpty { get; set; } = false;

        public string? EmptyWardrobeNotice { get; set; }

        public List<RecommendedClothingDto>? SuggestedItems { get; set; } = new();

        public List<AccompanyingOutfitDto>? AccompanyingOutfits { get; set; } = new();

        public List<string>? SuggestedFollowUpQuestions { get; set; } = new();

        // Bắt buộc có thông số tỉ trọng & vóc dáng trước khi AI trả lời
        public bool RequiresBodyMetrics { get; set; } = false;
        public string? BodyMetricsWarning { get; set; }

        public string? Timeframe { get; set; } = "Now";
        public FutureEventOutfitPairDto? FutureEventOutfits { get; set; }
    }
}
