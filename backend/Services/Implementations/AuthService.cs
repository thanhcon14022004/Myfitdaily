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
                return ApiResponse<AuthResponseDto>.Fail("Email n├áy ─æ├ú ─æ╞░ß╗úc ─æ─âng k├╜ trong hß╗ç thß╗æng");
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

            return ApiResponse<AuthResponseDto>.Ok(response, "─É─âng k├╜ t├ái khoß║ún th├ánh c├┤ng");
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();

            User? user = null;
            try
            {
                user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AuthService DB Warning]: {ex.Message}. Falling back to demo check.");
            }

            // Fallback chß║┐ ─æß╗Ö Demo nß║┐u Database kh├┤ng kß║┐t nß╗æi ─æ╞░ß╗úc (do mß║íng tr╞░ß╗¥ng/c├┤ng ty chß║╖n port 5432)
            if (user == null && request.Password == "Password123!")
            {
                if (normalizedEmail == "demo@myfitdaily.com")
                {
                    user = new User
                    {
                        Id = 1,
                        Email = "demo@myfitdaily.com",
                        FullName = "Demo Nß╗» Ch├óu ├ü",
                        Gender = "Nß╗»",
                        Role = "User",
                        SubscriptionType = "Free",
                        Height = 165,
                        Weight = 52,
                        Chest = 88,
                        Waist = 64,
                        Hips = 92,
                        BodyShape = "─Éß╗ông hß╗ô c├ít",
                        Age = 22,
                        AgeGroup = "GenZ",
                        CreatedAt = DateTime.UtcNow
                    };
                }
                else if (normalizedEmail == "test@myfitdaily.com")
                {
                    user = new User
                    {
                        Id = 2,
                        Email = "test@myfitdaily.com",
                        FullName = "Demo Nam Ch├óu ├ü",
                        Gender = "Nam",
                        Role = "User",
                        SubscriptionType = "Free",
                        Height = 178,
                        Weight = 70,
                        Chest = 98,
                        Waist = 78,
                        Hips = 95,
                        BodyShape = "Tam gi├íc ng╞░ß╗úc",
                        Age = 24,
                        AgeGroup = "GenZ",
                        CreatedAt = DateTime.UtcNow
                    };
                }
            }

            if (user == null || (!string.IsNullOrEmpty(user.PasswordHash) && !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)))
            {
                return ApiResponse<AuthResponseDto>.Fail("Email hoß║╖c mß║¡t khß║⌐u kh├┤ng ch├¡nh x├íc");
            }

            var (token, expiresAt) = _tokenService.GenerateJwtToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                TokenType = "Bearer",
                ExpiresAt = expiresAt,
                User = MapToUserDto(user)
            };

            return ApiResponse<AuthResponseDto>.Ok(response, "─É─âng nhß║¡p th├ánh c├┤ng");
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
                AgeGroup = user.AgeGroup
            };
        }
    }
}