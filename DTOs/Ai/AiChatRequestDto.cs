using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Ai
{
    public class ChatMessageItemDto
    {
        public string Sender { get; set; } = "user"; // "user" hoặc "stylist"
        public string Text { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class AiChatRequestDto
    {
        [Required(ErrorMessage = "Nội dung câu hỏi không được để trống")]
        public string Message { get; set; } = string.Empty;

        public List<ChatMessageItemDto>? History { get; set; } = new();

        public List<int>? WardrobeItemIds { get; set; }

        public string? UserLocation { get; set; }

        public double? Temperature { get; set; }

        public string? WeatherCondition { get; set; }
        
        // Thông số vóc dáng, số đo, tuổi tác, giới tính của người dùng
        public double? Height { get; set; }
        public double? Weight { get; set; }
        public string? Gender { get; set; }
        public int? Age { get; set; }
        public string? BodyShape { get; set; }
        public double? Chest { get; set; }
        public double? Waist { get; set; }
        public double? Hips { get; set; }
    }
}
