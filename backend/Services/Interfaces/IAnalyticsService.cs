using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.DTOs.Analytics;

namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public interface IAnalyticsService
    {
        Task<ApiResponse<bool>> TrackEventAsync(AnalyticsTrackDto dto, string? ipAddress, string? userAgent);
        Task<ApiResponse<AnalyticsOverviewDto>> GetOverviewAsync(string period = "7d");
        Task<ApiResponse<List<AnalyticsRealtimeVisitorDto>>> GetRealtimeVisitorsAsync();
    }
}

