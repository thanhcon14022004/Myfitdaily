using System.Collections.Concurrent;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Services.Implementations
{
    public class EmailVerificationService : IEmailVerificationService
    {
        private readonly ConcurrentDictionary<string, PendingRegistration> _pendingStore = new(StringComparer.OrdinalIgnoreCase);
        private readonly IEmailService _emailService;
        private readonly ILogger<EmailVerificationService> _logger;

        public EmailVerificationService(IEmailService emailService, ILogger<EmailVerificationService> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<(string otpCode, int expiresInSeconds)> CreatePendingRegistrationAsync(
            string email, 
            string fullName, 
            string gender, 
            string? password = null, 
            string? avatarUrl = null, 
            string provider = "Email")
        {
            var normalizedEmail = email.Trim().ToLower();
            
            // Phát sinh mã OTP 6 chữ số ngẫu nhiên
            var otpCode = Random.Shared.Next(100000, 999999).ToString();
            var now = DateTime.UtcNow;
            var expiresAt = now.AddMinutes(5); // Đúng 5 phút theo yêu cầu

            var pending = new PendingRegistration
            {
                Email = normalizedEmail,
                FullName = fullName.Trim(),
                Password = password,
                Gender = string.IsNullOrWhiteSpace(gender) ? "Nam" : gender,
                AvatarUrl = avatarUrl,
                Provider = provider,
                OtpCode = otpCode,
                CreatedAt = now,
                ExpiresAt = expiresAt
            };

            _pendingStore[normalizedEmail] = pending;

            // Gửi email xác thực kèm OTP
            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailService.SendVerificationOtpAsync(normalizedEmail, fullName, otpCode, 5);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send verification email to {Email}", normalizedEmail);
                }
            });

            _logger.LogInformation("[EmailVerificationService]: Created 5-min pending verification for {Email}. OTP: {Otp}", normalizedEmail, otpCode);

            return (otpCode, 300);
        }

        public Task<(bool success, string message, PendingRegistration? pending)> VerifyOtpAsync(string email, string otpCode, bool isVerifiedByProvider = false)
        {
            var normalizedEmail = email.Trim().ToLower();
            var cleanCode = (otpCode ?? string.Empty).Trim();

            if (!_pendingStore.TryGetValue(normalizedEmail, out var pending))
            {
                return Task.FromResult<(bool, string, PendingRegistration?)>((false, "Không tìm thấy phiên đăng ký chờ xác thực. Vui lòng thực hiện lại từ đầu.", null));
            }

            // Kiểm tra thời hạn 5 phút
            if (DateTime.UtcNow > pending.ExpiresAt)
            {
                _pendingStore.TryRemove(normalizedEmail, out _);
                return Task.FromResult<(bool, string, PendingRegistration?)>((false, "Mã xác thực đã hết hạn (quá 5 phút). Quá trình đăng ký bị hủy bỏ. Vui lòng bấm 'Gửi lại mã' để thử lại.", null));
            }

            // Kiểm tra mã OTP: chấp nhận nếu khớp mã nội bộ HOẶC đã được nhà cung cấp (Supabase Auth) xác thực hợp lệ
            if (!isVerifiedByProvider && !string.Equals(pending.OtpCode, cleanCode, StringComparison.Ordinal))
            {
                return Task.FromResult<(bool, string, PendingRegistration?)>((false, "Mã xác thực không chính xác. Vui lòng kiểm tra lại hộp thư của bạn.", null));
            }

            // Xác thực thành công: xóa khỏi hàng đợi chờ
            _pendingStore.TryRemove(normalizedEmail, out _);
            return Task.FromResult<(bool, string, PendingRegistration?)>((true, "Xác thực thành công", pending));
        }

        public async Task<(bool success, string message, string? newOtp, int expiresInSeconds)> ResendOtpAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLower();

            if (!_pendingStore.TryGetValue(normalizedEmail, out var existing))
            {
                return (false, "Phiên đăng ký đã hết hạn hoặc không tồn tại. Vui lòng bắt đầu đăng ký lại.", null, 0);
            }

            var newOtp = Random.Shared.Next(100000, 999999).ToString();
            existing.OtpCode = newOtp;
            existing.CreatedAt = DateTime.UtcNow;
            existing.ExpiresAt = DateTime.UtcNow.AddMinutes(5); // Gia hạn thêm 5 phút

            _pendingStore[normalizedEmail] = existing;

            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailService.SendVerificationOtpAsync(normalizedEmail, existing.FullName, newOtp, 5);
                }
                catch { }
            });

            _logger.LogInformation("[EmailVerificationService]: Resent OTP for {Email}. New OTP: {Otp}", normalizedEmail, newOtp);

            return (true, $"Mã xác thực mới đã được gửi tới {normalizedEmail}. Mã có hiệu lực trong 5 phút.", newOtp, 300);
        }

        public PendingRegistration? GetPending(string email)
        {
            var normalizedEmail = email.Trim().ToLower();
            _pendingStore.TryGetValue(normalizedEmail, out var pending);
            return pending;
        }
    }
}
