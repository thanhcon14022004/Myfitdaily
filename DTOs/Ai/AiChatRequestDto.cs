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
    }
}
