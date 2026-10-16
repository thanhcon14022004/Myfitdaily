using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Auth
{
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu mới là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
