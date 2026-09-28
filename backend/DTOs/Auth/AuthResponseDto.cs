using MYFITDAILY_EXE201_Group6.DTOs.User;

namespace MYFITDAILY_EXE201_Group6.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string TokenType { get; set; } = "Bearer";
        public DateTime ExpiresAt { get; set; }
        public UserDto? User { get; set; }
        
        // Trạng thái yêu cầu xác thực email 5 phút
        public bool RequiresVerification { get; set; } = false;
        public string? VerificationEmail { get; set; }
        public int ExpiresInSeconds { get; set; } = 300; // 5 phút (300 giây)
        public string? DebugOtpCode { get; set; }
        
        // Đánh dấu người dùng mới cần nhập thông tin cơ bản (họ tên, giới tính, độ tuổi) trước khi vào trang chủ
        public bool IsNewUser { get; set; } = false;
        public bool NeedsProfileSetup { get; set; } = false;
    }
}
