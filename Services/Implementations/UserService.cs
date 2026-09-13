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
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return ApiResponse<UserDto>.Fail("Không tìm thấy người dùng");
            }

            return ApiResponse<UserDto>.Ok(MapToUserDto(user), "Lấy thông tin tài khoản thành công");
        }

        public async Task<ApiResponse<UserDto>> UpdateProfileAsync(int userId, UpdateProfileDto request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return ApiResponse<UserDto>.Fail("Không tìm thấy người dùng");
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

            return ApiResponse<UserDto>.Ok(MapToUserDto(user), "Cập nhật thông tin tài khoản và thông số vóc dáng thành công");
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
                AgeGroup = user.AgeGroup ?? DetermineAgeGroup(user.Age)
            };
        }
    }
}
