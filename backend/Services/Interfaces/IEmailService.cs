namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public interface IEmailService
    {
        /// <summary>
        /// Gửi email chứa mã xác thực 6 số (thời lượng 5 phút)
        /// </summary>
        Task<bool> SendVerificationOtpAsync(string toEmail, string fullName, string otpCode, int expireMinutes = 5);

        /// <summary>
        /// Gửi email thông báo chào mừng sau khi người dùng nhấn Hoàn tất hồ sơ cá nhân
        /// </summary>
        Task<bool> SendWelcomeEmailAsync(string toEmail, string fullName, string? gender = null, int? age = null);
    }
}
