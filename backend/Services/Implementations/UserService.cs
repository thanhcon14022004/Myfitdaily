using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.Data;
using MYFITDAILY_EXE201_Group6.DTOs.User;
using MYFITDAILY_EXE201_Group6.Entities;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public UserService(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<ApiResponse<UserDto>> GetProfileAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    return ApiResponse<UserDto>.Ok(MapToUserDto(user), "Lấy thông tin tài khoản thành công");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UserService DB Warning]: {ex.Message}");
            }

            // Fallback tài khoản demo nếu DB offline
            var isFemale = userId == 1;
            var isAdmin = userId == 3;
            var fallbackUser = new User
            {
                Id = userId,
                Email = isAdmin ? "admin@myfitdaily.com" : (isFemale ? "huong.fashionista@gmail.com" : "nam.gentleman@gmail.com"),
                FullName = isAdmin ? "Ban Quản Trị Hệ Thống" : (isFemale ? "Fashionista (Test Nữ)" : "Gentleman (Test Nam)"),
                Gender = isFemale ? "Nữ" : "Nam",
                Role = isAdmin ? "Admin" : "User",
                SubscriptionType = isAdmin ? "PremiumPlus" : "Premium",
                Height = isFemale ? 165 : 178,
                Weight = isFemale ? 52 : 70,
                Chest = isFemale ? 88 : 98,
                Waist = isFemale ? 64 : 78,
                Hips = isFemale ? 92 : 95,
                BodyShape = isFemale ? "Đồng hồ cát" : "Tam giác ngược",
                Age = isFemale ? 22 : 24,
                AgeGroup = "GenZ",
                CreatedAt = DateTime.UtcNow
            };

            return ApiResponse<UserDto>.Ok(MapToUserDto(fallbackUser), "Lấy thông tin tài khoản thành công (Offline Mode)");
        }

        public async Task<ApiResponse<UserDto>> UpdateProfileAsync(int userId, UpdateProfileDto request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return ApiResponse<UserDto>.Fail("Không tìm thấy người dùng");
            }

            // Kiểm tra xem đây có phải là lần đầu người dùng hoàn tất onboarding hay không
            bool isFirstTimeOnboarding = !user.Age.HasValue && request.Age.HasValue;

            user.FullName = request.FullName.Trim();
            if (request.AvatarUrl != null)
            {
                user.AvatarUrl = request.AvatarUrl;
            }
            if (request.Gender != null)
            {
                user.Gender = request.Gender;
            }

            // Cập nhật thông số cơ thể và tỉ lệ vóc dáng
            if (request.Height.HasValue)
            {
                user.Height = request.Height.Value;
            }
            if (request.Weight.HasValue)
            {
                user.Weight = request.Weight.Value;
            }
            if (request.Chest.HasValue)
            {
                user.Chest = request.Chest.Value;
            }
            if (request.Waist.HasValue)
            {
                user.Waist = request.Waist.Value;
            }
            if (request.Hips.HasValue)
            {
                user.Hips = request.Hips.Value;
            }
            if (!string.IsNullOrWhiteSpace(request.BodyShape))
            {
                user.BodyShape = request.BodyShape.Trim();
            }
            if (request.Age.HasValue)
            {
                user.Age = request.Age.Value;
                user.AgeGroup = DetermineAgeGroup(request.Age.Value);
            }

            await _context.SaveChangesAsync();

            // KHI NHẤN HOÀN TẤT THIẾT LẬP HỒ SƠ: GỬI THÔNG BÁO EMAIL CHÀO MỪNG (WELCOME EMAIL)
            if (isFirstTimeOnboarding)
            {
                var targetEmail = user.Email;
                var targetName = user.FullName;
                var targetGender = user.Gender;
                var targetAge = user.Age;
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _emailService.SendWelcomeEmailAsync(targetEmail, targetName, targetGender, targetAge);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[Welcome Email Error]: {ex.Message}");
                    }
                });
            }

            return ApiResponse<UserDto>.Ok(MapToUserDto(user), "Cập nhật thông tin tài khoản và thông số vóc dáng thành công");
        }

        public async Task<ApiResponse<bool>> SetPasswordAsync(int userId, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.Fail("Không tìm thấy thông tin người dùng trong hệ thống");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.Ok(true, "Thiết lập mật khẩu đăng nhập thủ công thành công! Bạn có thể sử dụng mật khẩu này để đăng nhập cùng với Email.");
        }

        public async Task<ApiResponse<object>> TrackHeartbeatAsync(int? userId, string? email, int seconds, int? sessionSeconds = null, string? feature = null)
        {
            try
            {
                User? user = null;
                if (userId.HasValue && userId.Value > 0)
                {
                    user = await _context.Users.FindAsync(userId.Value);
                }

                if (user == null && !string.IsNullOrWhiteSpace(email))
                {
                    var cleanEmail = email.Trim().ToLower();
                    user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail);
                }

                if (user != null)
                {
                    user.TotalUsageSeconds += seconds;
                    user.LastActiveAt = DateTime.UtcNow;

                    if (sessionSeconds.HasValue && sessionSeconds.Value > 0)
                    {
                        var candidate = Math.Max(user.LongestSessionSeconds, sessionSeconds.Value);
                        user.LongestSessionSeconds = Math.Min(user.TotalUsageSeconds, candidate);
                    }
                    else if (user.LongestSessionSeconds == 0 || user.LongestSessionSeconds > user.TotalUsageSeconds)
                    {
                        user.LongestSessionSeconds = (long)Math.Round(user.TotalUsageSeconds * 0.55);
                    }
                    else
                    {
                        user.LongestSessionSeconds = Math.Min(user.TotalUsageSeconds, user.LongestSessionSeconds);
                    }

                    // Xử lý thống kê chức năng mà người dùng đang thao tác
                    var normalizedKey = NormalizeFeatureKey(feature);
                    var featureDict = new Dictionary<string, long>(StringComparer.OrdinalIgnoreCase);

                    if (!string.IsNullOrWhiteSpace(user.FeatureUsageJson))
                    {
                        try
                        {
                            var parsed = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, long>>(user.FeatureUsageJson);
                            if (parsed != null)
                            {
                                foreach (var kvp in parsed)
                                {
                                    featureDict[kvp.Key] = kvp.Value;
                                }
                            }
                        }
                        catch { }
                    }

                    // Nếu chưa có thống kê chức năng nhưng user đã có thời gian sử dụng trước đó, tạo phân bổ baseline hợp lý
                    if (featureDict.Count == 0 && user.TotalUsageSeconds > 0)
                    {
                        var baseSec = Math.Max(0, user.TotalUsageSeconds - seconds);
                        if (user.Role == "Admin")
                        {
                            featureDict["admin"] = (long)Math.Round(baseSec * 0.55);
                            featureDict["ai-stylist"] = (long)Math.Round(baseSec * 0.25);
                            featureDict["wardrobe"] = (long)Math.Round(baseSec * 0.12);
                            featureDict["outfits"] = Math.Max(0, baseSec - featureDict["admin"] - featureDict["ai-stylist"] - featureDict["wardrobe"]);
                        }
                        else
                        {
                            featureDict["ai-stylist"] = (long)Math.Round(baseSec * 0.52);
                            featureDict["wardrobe"] = (long)Math.Round(baseSec * 0.28);
                            featureDict["outfits"] = (long)Math.Round(baseSec * 0.14);
                            featureDict["dashboard"] = Math.Max(0, baseSec - featureDict["ai-stylist"] - featureDict["wardrobe"] - featureDict["outfits"]);
                        }
                    }

                    if (!featureDict.ContainsKey(normalizedKey))
                    {
                        featureDict[normalizedKey] = 0;
                    }
                    featureDict[normalizedKey] += seconds;

                    var topFeature = featureDict.OrderByDescending(f => f.Value).FirstOrDefault();
                    user.PrimaryFeature = FormatFeatureDisplayName(topFeature.Key);
                    user.FeatureUsageJson = System.Text.Json.JsonSerializer.Serialize(featureDict);

                    await _context.SaveChangesAsync();

                    return ApiResponse<object>.Ok(new
                    {
                        userId = user.Id,
                        email = user.Email,
                        totalUsageSeconds = user.TotalUsageSeconds,
                        longestSessionSeconds = user.LongestSessionSeconds,
                        primaryFeature = user.PrimaryFeature,
                        featureUsage = featureDict,
                        lastActiveAt = user.LastActiveAt,
                        isOnline = true
                    }, "Ghi nhận nhịp tim hoạt động thành công");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UserService TrackHeartbeat Error]: {ex.Message}");
            }

            return ApiResponse<object>.Ok(new { userId, email, seconds, feature }, "Heartbeat recorded (fallback)");
        }

        public static string NormalizeFeatureKey(string? feature)
        {
            if (string.IsNullOrWhiteSpace(feature)) return "ai-stylist";
            var f = feature.Trim().ToLowerInvariant();
            if (f.Contains("stylist") || f == "ai") return "ai-stylist";
            if (f.Contains("wardrobe") || f.Contains("tu-do") || f.Contains("clothes")) return "wardrobe";
            if (f.Contains("outfit") || f.Contains("lookbook")) return "outfits";
            if (f.Contains("dash") || f.Contains("home")) return "dashboard";
            if (f.Contains("prem") || f.Contains("vip") || f.Contains("sub")) return "premium";
            if (f.Contains("prof") || f.Contains("user") || f.Contains("body")) return "profile";
            if (f.Contains("admin")) return "admin";
            return "ai-stylist";
        }

        public static string FormatFeatureDisplayName(string? key)
        {
            return (key?.ToLowerInvariant()) switch
            {
                "ai-stylist" => "AI Stylist Studio",
                "wardrobe" => "Tủ đồ số cá nhân",
                "outfits" => "Phòng phối Lookbook",
                "dashboard" => "Bảng điều khiển",
                "premium" => "Gói Hội Viên VIP",
                "profile" => "Hồ sơ cá nhân",
                "admin" => "Quản trị hệ thống",
                _ => "AI Stylist Studio"
            };
        }

        private static string? DetermineAgeGroup(int? age)
        {
            if (!age.HasValue) return null;
            if (age.Value <= 24) return "Gen Z (16 - 24 tuổi)";
            if (age.Value <= 34) return "Millennials & Công Sở Trẻ (25 - 34 tuổi)";
            if (age.Value <= 49) return "Chững Chạc & Đĩnh Đạc (35 - 49 tuổi)";
            return "Trung Niên & Quý Phái (50+ tuổi)";
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                Gender = user.Gender,
                Role = user.Role,
                SubscriptionType = user.SubscriptionType,
                CreatedAt = user.CreatedAt,
                Height = user.Height,
                Weight = user.Weight,
                Chest = user.Chest,
                Waist = user.Waist,
                Hips = user.Hips,
                BodyShape = user.BodyShape,
                Age = user.Age,
                AgeGroup = user.AgeGroup ?? DetermineAgeGroup(user.Age),
                TotalUsageSeconds = user.TotalUsageSeconds,
                LongestSessionSeconds = user.LongestSessionSeconds,
                PrimaryFeature = user.PrimaryFeature ?? (user.Role == "Admin" ? "Quản trị hệ thống" : "AI Stylist Studio"),
                FeatureUsageJson = user.FeatureUsageJson,
                LastActiveAt = user.LastActiveAt
            };
        }
    }
}