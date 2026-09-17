namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class ScanOotdRequestDto
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? Hint { get; set; }
        public string? GenderHint { get; set; }
    }
}