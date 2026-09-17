using MYFITDAILY_EXE201_Group6.DTOs.User;

namespace MYFITDAILY_EXE201_Group6.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string TokenType { get; set; } = "Bearer";
        public DateTime ExpiresAt { get; set; }
        public UserDto User { get; set; } = null!;
    }
}
