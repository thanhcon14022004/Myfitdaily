using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class AiRecommendRequestDto
    {
        [Required]
        public string Occasion { get; set; } = "Date"; // Date, Work, Casual, Party, School, Travel

        [Required]
        public string Weather { get; set; } = "Warm"; // Warm, Hot, Cool, Rainy

        [Required]
        public string Style { get; set; } = "Minimalist"; // Minimalist, Casual, Elegant, Streetwear, Vintage

        public string ColorTone { get; set; } = "Neutral"; // Neutral, Pastel, Monochrome, WarmTone

        public List<int>? AvailableItemIds { get; set; }
    }
}
