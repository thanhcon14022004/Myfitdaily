using System.Collections.Generic;

namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class DetectedOotdItemDto
    {
        public string ItemType { get; set; } = "Top"; // Top, Bottom, Outerwear, Shoes, Dress, Accessory
        public string Brand { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int CategoryId { get; set; } = 1;
        public string CategoryName { get; set; } = "Tops";
        public string Color { get; set; } = "Trß║»ng";
        public string Style { get; set; } = "Casual";
        public string Season { get; set; } = "AllSeason";
        public string Description { get; set; } = string.Empty;
        public string Size { get; set; } = "M";
        public List<string> SuggestedSizes { get; set; } = new();
        public string ImageUrl { get; set; } = string.Empty;
        public double Confidence { get; set; } = 0.95;
    }

    public class ScanOotdResponseDto
    {
        public string OverallStyle { get; set; } = "Smart Casual";
        public string OotdDescription { get; set; } = string.Empty;
        public string AiModelUsed { get; set; } = "OpenAI Vision";
        public List<DetectedOotdItemDto> Items { get; set; } = new();
    }
}