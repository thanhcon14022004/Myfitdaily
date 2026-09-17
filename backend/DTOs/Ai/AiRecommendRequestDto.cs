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

        // Lựa chọn thời điểm phối đồ: "Now" (Bây giờ) hoặc "FutureEvent" (Sự kiện trong tương lai)
        public string Timeframe { get; set; } = "Now";

        // Các thông tin cho sự kiện tương lai
        public string? EventNature { get; set; } // Tính chất sự kiện (Đám cưới, Phỏng vấn, Tiệc tối, Hẹn hò...)
        public string? JobContext { get; set; } // Bối cảnh công việc / Nghề nghiệp (Văn phòng, Sáng tạo, Quản lý...)
        public string? EventWeather { get; set; } // Thời tiết dự kiến của sự kiện
        public string? EventDate { get; set; } // Ngày diễn ra sự kiện
    }
}
