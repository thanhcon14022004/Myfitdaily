using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Auth
{
    public class VerifyOtpDto
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã xác thực là bắt buộc")]
        [StringLength(10, MinimumLength = 4, ErrorMessage = "Mã xác thực không hợp lệ")]
        public string OtpCode { get; set; } = string.Empty;

        public bool IsVerifiedByProvider { get; set; } = false;
    }
}
