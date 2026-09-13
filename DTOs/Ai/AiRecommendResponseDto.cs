namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class AccompanyingOutfitDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Style { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HarmonyScore { get; set; } = "96%";
        public List<RecommendedClothingDto> Items { get; set; } = new List<RecommendedClothingDto>();
    }

    public class AiRecommendResponseDto
    {
        public int Id { get; set; }
        public string OutfitName { get; set; } = string.Empty;
        public string Occasion { get; set; } = string.Empty;
        public string Season { get; set; } = string.Empty;
        public List<int> ItemIds { get; set; } = new List<int>();
        public List<RecommendedClothingDto> RecommendedItems { get; set; } = new List<RecommendedClothingDto>();
        public string StylistNotes { get; set; } = string.Empty;
        public string HarmonyScore { get; set; } = "98%";
        public string ContrastLevel { get; set; } = "Hài hòa (Optimal)";
        public bool CreatedByAi { get; set; } = true;

        // Trạng thái tủ đồ của người dùng và các bộ kèm theo
        public bool IsWardrobeEmpty { get; set; } = false;
        public string? EmptyWardrobeMessage { get; set; }
        public List<AccompanyingOutfitDto> AccompanyingOutfits { get; set; } = new List<AccompanyingOutfitDto>();

        // Bắt buộc có thông số tỉ trọng & vóc dáng trước khi AI gợi ý
        public bool RequiresBodyMetrics { get; set; } = false;
        public string? BodyMetricsWarning { get; set; }
    }
}
