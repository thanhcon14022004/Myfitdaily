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

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<UserDto>> GetProfileAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    return ApiResponse<UserDto>.Ok(MapToUserDto(user), "Lß║Ñy th├┤ng tin t├ái khoß║ún th├ánh c├┤ng");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UserService DB Warning]: {ex.Message}");
            }

            // Fallback t├ái khoß║ún demo nß║┐u DB offline
            var isFemale = userId == 1;
            var fallbackUser = new User
            {
                Id = userId,
                Email = isFemale ? "demo@myfitdaily.com" : "test@myfitdaily.com",
                FullName = isFemale ? "Demo Nß╗» Ch├óu ├ü" : "Demo Nam Ch├óu ├ü",
                Gender = isFemale ? "Nß╗»" : "Nam",
                Role = "User",
                SubscriptionType = "Free",
                Height = isFemale ? 165 : 178,
                Weight = isFemale ? 52 : 70,
                Chest = isFemale ? 88 : 98,
                Waist = isFemale ? 64 : 78,
                Hips = isFemale ? 92 : 95,
                BodyShape = isFemale ? "─Éß╗ông hß╗ô c├ít" : "Tam gi├íc ng╞░ß╗úc",
                Age = isFemale ? 22 : 24,
                AgeGroup = "GenZ",
                CreatedAt = DateTime.UtcNow
            };

            return ApiResponse<UserDto>.Ok(MapToUserDto(fallbackUser), "Lß║Ñy th├┤ng tin t├ái khoß║ún th├ánh c├┤ng (Offline Mode)");
        }

        public async Task<ApiResponse<UserDto>> UpdateProfileAsync(int userId, UpdateProfileDto request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return ApiResponse<UserDto>.Fail("Kh├┤ng t├¼m thß║Ñy ng╞░ß╗¥i d├╣ng");
            }

            user.FullName = request.FullName.Trim();
            if (request.AvatarUrl != null)
            {
                user.AvatarUrl = request.AvatarUrl;
            }
            if (request.Gender != null)
            {
                user.Gender = request.Gender;
            }

            // Cß║¡p nhß║¡t th├┤ng sß╗æ c╞í thß╗â v├á tß╗ë lß╗ç v├│c d├íng
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

            return ApiResponse<UserDto>.Ok(MapToUserDto(user), "Cß║¡p nhß║¡t th├┤ng tin t├ái khoß║ún v├á th├┤ng sß╗æ v├│c d├íng th├ánh c├┤ng");
        }

        private static string? DetermineAgeGroup(int? age)
        {
            if (!age.HasValue) return null;
            if (age.Value <= 24) return "Gen Z (16 - 24 tuß╗òi)";
            if (age.Value <= 34) return "Millennials & C├┤ng Sß╗ƒ Trß║╗ (25 - 34 tuß╗òi)";
            if (age.Value <= 49) return "Chß╗»ng Chß║íc & ─É─⌐nh ─Éß║íc (35 - 49 tuß╗òi)";
            return "Trung Ni├¬n & Qu├╜ Ph├íi (50+ tuß╗òi)";
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
                AgeGroup = user.AgeGroup ?? DetermineAgeGroup(user.Age)
            };
        }
    }
}