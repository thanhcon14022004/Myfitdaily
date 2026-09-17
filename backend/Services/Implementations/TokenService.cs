using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MYFITDAILY_EXE201_Group6.Entities;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Services.Implementations
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public (string Token, DateTime ExpiresAt) GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "MyFitDailySuperSecretKey2026_EXE201Group6_DefaultJwtKeyMustBeLongEnough!";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "MyFitDaily";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "MyFitDailyClient";
            var expiresInDays = int.TryParse(_configuration["Jwt:ExpiresInDays"], out var days) ? days : 7;

            var expiresAt = DateTime.UtcNow.AddDays(expiresInDays);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("SubscriptionType", user.SubscriptionType),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.WriteToken(tokenDescriptor);

            return (tokenString, expiresAt);
        }
    }
}
