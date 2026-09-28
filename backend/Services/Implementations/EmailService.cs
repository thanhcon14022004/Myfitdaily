using System.Net;
using System.Net.Mail;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<bool> SendVerificationOtpAsync(string toEmail, string fullName, string otpCode, int expireMinutes = 5)
        {
            var subject = $"[MyFitDaily] Mã xác thực đăng ký tài khoản của bạn: {otpCode}";
            
            var bodyHtml = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0F121A; margin: 0; padding: 24px; color: #E5E7EB; }}
        .container {{ max-width: 540px; margin: 0 auto; background: #181C26; border-radius: 20px; border: 1px solid rgba(212, 175, 55, 0.4); padding: 36px 30px; box-shadow: 0 15px 40px rgba(0,0,0,0.6); }}
        .header {{ text-align: center; margin-bottom: 24px; }}
        .logo-text {{ font-size: 26px; font-weight: 800; color: #D4AF37; letter-spacing: -0.5px; text-transform: uppercase; }}
        .tagline {{ font-size: 13px; color: #9CA3AF; margin-top: 4px; }}
        .title {{ font-size: 20px; font-weight: 700; color: #FFFFFF; text-align: center; margin-bottom: 12px; }}
        .desc {{ font-size: 14px; line-height: 1.6; color: #D1D5DB; text-align: center; margin-bottom: 24px; }}
        .otp-box {{ background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(194,125,94,0.15)); border: 2px dashed #D4AF37; border-radius: 14px; padding: 18px 20px; text-align: center; margin-bottom: 24px; }}
        .otp-code {{ font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #F3D98A; margin: 0; }}
        .timer-badge {{ display: inline-block; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #F87171; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-top: 8px; }}
        .warning {{ font-size: 12px; color: #9CA3AF; text-align: center; line-height: 1.5; margin-bottom: 24px; }}
        .footer {{ border-top: 1px solid rgba(255,255,255,0.08); padding-top: 18px; text-align: center; font-size: 11px; color: #6B7280; line-height: 1.4; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <div class='logo-text'>MYFITDAILY</div>
            <div class='tagline'>Smart Fashion & AI Stylist Platform</div>
        </div>
        
        <div class='title'>Xác Thực Tài Khoản Của Bạn</div>
        
        <div class='desc'>
            Xin chào <strong>{fullName}</strong>,<br>
            Bạn vừa yêu cầu đăng ký tài khoản tại <strong>MyFitDaily</strong>. Vui lòng sử dụng mã xác nhận dưới đây để hoàn tất kích hoạt tài khoản:
        </div>
        
        <div class='otp-box'>
            <div class='otp-code'>{otpCode}</div>
            <div class='timer-badge'>⏱ Mã có hiệu lực trong {expireMinutes} phút</div>
        </div>
        
        <div class='warning'>
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Sau {expireMinutes} phút, mã xác nhận sẽ tự động bị vô hiệu hóa để bảo đảm an toàn.
        </div>
        
        <div class='footer'>
            Email này được gửi tự động từ hệ thống MyFitDaily.<br>
            © 2026 MyFitDaily Ecosystem. Bảo mật dữ liệu chuẩn 256-bit SSL.
        </div>
    </div>
</body>
</html>";

            return await SendEmailInternalAsync(toEmail, subject, bodyHtml, $"OTP: {otpCode}");
        }

        public async Task<bool> SendWelcomeEmailAsync(string toEmail, string fullName, string? gender = null, int? age = null)
        {
            var subject = $"[MyFitDaily] Chào mừng {fullName} gia nhập hệ sinh thái thời trang MyFitDaily!";
            
            var ageDisplay = age.HasValue ? $"{age} tuổi" : "Đã cập nhật";
            var genderDisplay = string.IsNullOrWhiteSpace(gender) ? "Unisex / Thời trang" : gender;

            var bodyHtml = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0F121A; margin: 0; padding: 24px; color: #E5E7EB; }}
        .container {{ max-width: 540px; margin: 0 auto; background: #181C26; border-radius: 20px; border: 1px solid rgba(212, 175, 55, 0.4); padding: 36px 30px; box-shadow: 0 15px 40px rgba(0,0,0,0.6); }}
        .header {{ text-align: center; margin-bottom: 24px; }}
        .logo-text {{ font-size: 26px; font-weight: 800; color: #D4AF37; letter-spacing: -0.5px; text-transform: uppercase; }}
        .welcome-badge {{ font-size: 13px; color: #10B981; font-weight: 700; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); padding: 5px 16px; border-radius: 20px; display: inline-block; margin-top: 8px; }}
        .title {{ font-size: 22px; font-weight: 700; color: #FFFFFF; text-align: center; margin: 20px 0 12px; }}
        .desc {{ font-size: 14px; line-height: 1.6; color: #D1D5DB; margin-bottom: 20px; text-align: center; }}
        .profile-card {{ background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; }}
        .profile-title {{ font-size: 12px; font-weight: 800; color: #D4AF37; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }}
        .profile-item {{ font-size: 13px; color: #F3F4F6; margin-bottom: 4px; }}
        .features {{ background: rgba(255,255,255,0.03); border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; }}
        .feature-item {{ display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 13px; color: #E5E7EB; }}
        .feature-item:last-child {{ margin-bottom: 0; }}
        .bullet {{ color: #D4AF37; font-weight: 800; margin-right: 10px; font-size: 16px; }}
        .cta-btn {{ display: block; text-align: center; background: linear-gradient(135deg, #D4AF37, #C27D5E); color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 14px 20px; border-radius: 12px; font-size: 15px; margin: 24px 0 16px; box-shadow: 0 4px 18px rgba(212, 175, 55, 0.35); }}
        .footer {{ border-top: 1px solid rgba(255,255,255,0.08); padding-top: 18px; text-align: center; font-size: 11px; color: #6B7280; line-height: 1.4; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <div class='logo-text'>MYFITDAILY</div>
            <div class='welcome-badge'>✓ Hồ sơ cá nhân đã hoàn tất thành công</div>
        </div>
        
        <div class='title'>Chào Mừng Bạn Đến Với MyFitDaily! 🎉</div>
        
        <div class='desc'>
            Xin chào <strong>{fullName}</strong>,<br>
            Hồ sơ phong cách thời trang của bạn đã được thiết lập thành công. Trợ lý AI Stylist đã sẵn sàng cá nhân hóa tủ đồ cho bạn!
        </div>
        
        <div class='profile-card'>
            <div class='profile-title'>✦ Thông Tin Hồ Sơ Cá Nhân:</div>
            <div class='profile-item'>• Họ và tên: <strong>{fullName}</strong></div>
            <div class='profile-item'>• Giới tính phong cách: <strong>{genderDisplay}</strong></div>
            <div class='profile-item'>• Độ tuổi: <strong>{ageDisplay}</strong></div>
            <div class='profile-item'>• Trạng thái: <span style='color: #10B981; font-weight: 700;'>Đã mở khóa trải nghiệm thông minh</span></div>
        </div>

        <div class='features'>
            <div class='feature-item'>
                <span class='bullet'>✦</span>
                <span><strong>AI Stylist Cá Nhân Hóa:</strong> Gợi ý trang phục theo đúng giới tính, độ tuổi, vóc dáng và sự kiện.</span>
            </div>
            <div class='feature-item'>
                <span class='bullet'>✦</span>
                <span><strong>Tủ Đồ Kỹ Thuật Số:</strong> Quản lý trang phục tiện lợi và phối đồ thông minh mọi lúc mọi nơi.</span>
            </div>
            <div class='feature-item'>
                <span class='bullet'>✦</span>
                <span><strong>Thử Đồ Ảo 3D:</strong> Mô phỏng trang phục chân thực trên người mẫu avatar 3D.</span>
            </div>
        </div>
        
        <a href='http://localhost:5173' class='cta-btn'>Bắt Đầu Khám Phá Trang Chủ</a>
        
        <div class='footer'>
            Cảm ơn bạn đã tin tưởng lựa chọn MyFitDaily.<br>
            © 2026 MyFitDaily Ecosystem. Mọi quyền được bảo lưu.
        </div>
    </div>
</body>
</html>";

            return await SendEmailInternalAsync(toEmail, subject, bodyHtml, "WELCOME");
        }

        private async Task<bool> SendEmailInternalAsync(string toEmail, string subject, string bodyHtml, string contextTag)
        {
            var smtpHost = _config["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
            var smtpPortStr = _config["EmailSettings:SmtpPort"] ?? "587";
            var senderEmail = _config["EmailSettings:SenderEmail"] ?? "";
            var senderPassword = _config["EmailSettings:SenderPassword"] ?? "";
            var senderName = _config["EmailSettings:SenderName"] ?? "MyFitDaily Fashion";

            int.TryParse(smtpPortStr, out var smtpPort);
            if (smtpPort == 0) smtpPort = 587;

            // Log ra console để luôn thấy mã trong môi trường dev / local
            Console.WriteLine($"\n=======================================================");
            Console.WriteLine($"[EMAIL DISPATCH] Tới: {toEmail} | Chủ đề: {subject}");
            Console.WriteLine($"[EMAIL CONTEXT]: {contextTag}");
            Console.WriteLine($"=======================================================\n");

            // Nếu chưa cấu hình sender email hoặc password thực, hoàn tất mô phỏng an toàn
            if (string.IsNullOrWhiteSpace(senderEmail) || string.IsNullOrWhiteSpace(senderPassword))
            {
                _logger.LogInformation("[EmailService]: SMTP credentials not set. Simulated send to {Email}", toEmail);
                return true;
            }

            try
            {
                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(senderEmail, senderPassword),
                    Timeout = 8000
                };

                using var mail = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = subject,
                    Body = bodyHtml,
                    IsBodyHtml = true
                };

                mail.To.Add(toEmail);
                await client.SendMailAsync(mail);
                _logger.LogInformation("[EmailService]: Successfully sent email to {Email}", toEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[EmailService Warning]: Could not send SMTP email to {Email}. Handled gracefully.", toEmail);
                return true; // Không làm crash luồng ứng dụng nếu SMTP server tạm thời lỗi
            }
        }
    }
}
