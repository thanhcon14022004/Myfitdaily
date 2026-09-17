using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.DTOs.Auth;

namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto request);
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto request);
    }
}
