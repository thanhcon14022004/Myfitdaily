using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Auth
{
    public class SocialLoginDto
    {
        [Required(ErrorMessage = "Nhà cung cấp đăng nhập (Provider) là bắt buộc (Google hoặc Facebook)")]
        public string Provider { get; set; } = "Google"; // "Google" or "Facebook"

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Họ và tên là bắt buộc")]
        public string FullName { get; set; } = string.Empty;

        public string? AvatarUrl { get; set; }

        public string? Gender { get; set; } = "Nam";

        public string? ProviderKey { get; set; }

        public string? AccessToken { get; set; }

        public bool IsEmailConfirmed { get; set; } = false;
    }
}
