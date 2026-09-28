namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public class PendingRegistration
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string Gender { get; set; } = "Nam";
        public string? AvatarUrl { get; set; }
        public string Provider { get; set; } = "Email";
        public string OtpCode { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
    }

    public interface IEmailVerificationService
    {
        /// <summary>
        /// Tạo phiên đăng ký chờ xác thực và phát sinh mã OTP 6 số (hiệu lực 5 phút)
        /// </summary>
        Task<(string otpCode, int expiresInSeconds)> CreatePendingRegistrationAsync(
            string email, 
            string fullName, 
            string gender, 
            string? password = null, 
            string? avatarUrl = null, 
            string provider = "Email"
        );

        /// <summary>
        /// Xác thực mã OTP người dùng nhập
        /// </summary>
        Task<(bool success, string message, PendingRegistration? pending)> VerifyOtpAsync(string email, string otpCode, bool isVerifiedByProvider = false);

        /// <summary>
        /// Gửi lại mã OTP mới với thời lượng 5 phút
        /// </summary>
        Task<(bool success, string message, string? newOtp, int expiresInSeconds)> ResendOtpAsync(string email);

        PendingRegistration? GetPending(string email);
    }
}
