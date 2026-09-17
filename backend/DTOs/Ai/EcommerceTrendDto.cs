namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class EcommerceTrendDto
    {
        public string AgeGroupKey { get; set; } = string.Empty;
        public string AgeGroupLabel { get; set; } = string.Empty;
        public string AgeRange { get; set; } = string.Empty;
        public List<string> PrimaryChannels { get; set; } = new();
        public List<string> SignatureStyles { get; set; } = new();
        public List<string> HotTrendingItems { get; set; } = new();
        public List<string> ColorPalette { get; set; } = new();
        public List<string> TopEcomHashtags { get; set; } = new();
        public string StylistAdviceSummary { get; set; } = string.Empty;
        public string BestSellingInsight { get; set; } = string.Empty;
    }
}
