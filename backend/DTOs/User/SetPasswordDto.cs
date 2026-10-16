using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.User
{
    public class SetPasswordDto
    {
        [Required(ErrorMessage = "Mật khẩu mới là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
