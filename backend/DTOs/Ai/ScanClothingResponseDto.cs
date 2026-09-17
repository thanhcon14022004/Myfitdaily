namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class ScanClothingResponseDto
    {
        public string Brand { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int CategoryId { get; set; } = 1;
        public string CategoryName { get; set; } = "Tops";
        public string Color { get; set; } = "Trắng";
        public string Style { get; set; } = "Casual";
        public string Season { get; set; } = "AllSeason";
        public double Confidence { get; set; } = 0.95;
        public List<string> SuggestedSizes { get; set; } = new();
        public string AiNotes { get; set; } = string.Empty;
        public bool IsBrandIdentified { get; set; } = true;
    }
}
