using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.DTOs.User;

namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<UserDto>> GetProfileAsync(int userId);
        Task<ApiResponse<UserDto>> UpdateProfileAsync(int userId, UpdateProfileDto request);
        Task<ApiResponse<bool>> SetPasswordAsync(int userId, string newPassword);
        Task<ApiResponse<object>> TrackHeartbeatAsync(int? userId, string? email, int seconds, int? sessionSeconds = null, string? feature = null);
    }
}
