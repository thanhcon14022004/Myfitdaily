using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class ScanClothingRequestDto
    {
        [Required(ErrorMessage = "Vui lòng cung cấp hình ảnh cần quét")]
        public string ImageUrl { get; set; } = string.Empty;

        public string? Hint { get; set; }
        public string? ColorHint { get; set; }
        public string? CategoryHint { get; set; }
        public double? AspectRatio { get; set; }
    }
}
