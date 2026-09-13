using MYFITDAILY_EXE201_Group6.Entities;

namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public interface ITokenService
    {
        (string Token, DateTime ExpiresAt) GenerateJwtToken(User user);
    }
}
