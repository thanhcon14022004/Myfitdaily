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
        public string SourceType { get; set; } = "Wardrobe"; // "Wardrobe" (Tủ đồ) hoặc "TrendingOnline" (Xu hướng mạng TMĐT)
        public string SourceBadge { get; set; } = "👗 Từ Tủ Đồ Cá Nhân";
        public string BodyFlatteringNote { get; set; } = string.Empty; // Phân tích tối ưu theo vóc dáng, số đo, tuổi, giới tính
    }

    public class AffiliateItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Price { get; set; } = "350.000đ";
        public string? OriginalPrice { get; set; } = "490.000đ";
        public string Platform { get; set; } = "Shopee Mall"; // Shopee, Uniqlo, Coolmate, Lazada, Routine
        public string AffiliateUrl { get; set; } = "https://shopee.vn";
        public string? DiscountBadge { get; set; } = "-28%";
    }

    public class AffiliateOutfitDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Style { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HarmonyScore { get; set; } = "99%";
        public string TotalEstimatedPrice { get; set; } = "1.250.000đ";
        public string AffiliatePartner { get; set; } = "Shopee Mall x MyFitDaily Partner";
        public string BodyFlatteringNote { get; set; } = string.Empty;
        public string StylistReason { get; set; } = string.Empty;
        public List<AffiliateItemDto> Items { get; set; } = new List<AffiliateItemDto>();
    }

    public class FutureEventOutfitPairDto
    {
        // Gợi ý 1: Outfit từ trong tủ đồ cá nhân
        public AccompanyingOutfitDto WardrobeOutfit { get; set; } = new AccompanyingOutfitDto();

        // Gợi ý 2: Gợi ý từ 1 bộ đồ app làm affiliate
        public AffiliateOutfitDto AffiliateOutfit { get; set; } = new AffiliateOutfitDto();

        // Bối cảnh phân tích
        public string EventNature { get; set; } = string.Empty;
        public string JobContext { get; set; } = string.Empty;
        public string EventWeather { get; set; } = string.Empty;
        public string StylistAnalysis { get; set; } = string.Empty;
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

        // Chế độ phối: "Now" hoặc "FutureEvent"
        public string Timeframe { get; set; } = "Now";
        public string? EventNature { get; set; }
        public string? JobContext { get; set; }
        public string? EventWeather { get; set; }

        // Kết quả 2 gợi ý cho sự kiện tương lai
        public FutureEventOutfitPairDto? FutureEventOutfits { get; set; }

        // Trạng thái tủ đồ của người dùng và các bộ kèm theo
        public bool IsWardrobeEmpty { get; set; } = false;
        public string? EmptyWardrobeMessage { get; set; }
        public List<AccompanyingOutfitDto> AccompanyingOutfits { get; set; } = new List<AccompanyingOutfitDto>();

        // Bắt buộc có thông số tỉ trọng & vóc dáng trước khi AI gợi ý
        public bool RequiresBodyMetrics { get; set; } = false;
        public string? BodyMetricsWarning { get; set; }
    }
}
