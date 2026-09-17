using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.Data;
using MYFITDAILY_EXE201_Group6.DTOs.Auth;
using MYFITDAILY_EXE201_Group6.DTOs.User;
using MYFITDAILY_EXE201_Group6.Entities;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthService(ApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();

            var existingUser = await _context.Users
                .AnyAsync(u => u.Email.ToLower() == normalizedEmail);

            if (existingUser)
            {
                return ApiResponse<AuthResponseDto>.Fail("Email này đã được đăng ký trong hệ thống");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Email = normalizedEmail,
                PasswordHash = passwordHash,
                FullName = request.FullName.Trim(),
                Gender = request.Gender,
                Role = "User",
                SubscriptionType = "Free",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var (token, expiresAt) = _tokenService.GenerateJwtToken(newUser);

            var response = new AuthResponseDto
            {
                Token = token,
                TokenType = "Bearer",
                ExpiresAt = expiresAt,
                User = MapToUserDto(newUser)
            };

            return ApiResponse<AuthResponseDto>.Ok(response, "Đăng ký tài khoản thành công");
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return ApiResponse<AuthResponseDto>.Fail("Email hoặc mật khẩu không chính xác");
            }

            var (token, expiresAt) = _tokenService.GenerateJwtToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                TokenType = "Bearer",
                ExpiresAt = expiresAt,
                User = MapToUserDto(user)
            };

            return ApiResponse<AuthResponseDto>.Ok(response, "Đăng nhập thành công");
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
                SubscriptionExpiresAt = user.SubscriptionExpiresAt,
                SubscriptionPeriod = user.SubscriptionPeriod,
                CreatedAt = user.CreatedAt,
                Height = user.Height,
                Weight = user.Weight,
                Chest = user.Chest,
                Waist = user.Waist,
                Hips = user.Hips,
                BodyShape = user.BodyShape,
                Age = user.Age,
                AgeGroup = user.AgeGroup
            };
        }
    }
}
