using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Auth
{
    public class ForgotPasswordDto
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        public string Email { get; set; } = string.Empty;
    }
}
