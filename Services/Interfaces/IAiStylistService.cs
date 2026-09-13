using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.DTOs.Ai;

namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public interface IAiStylistService
    {
        Task<ApiResponse<AiRecommendResponseDto>> GenerateOutfitRecommendationAsync(int? userId, AiRecommendRequestDto request);
        Task<ApiResponse<AiChatResponseDto>> ChatWithStylistAsync(int? userId, AiChatRequestDto request);
        Task<ApiResponse<ScanClothingResponseDto>> ScanClothingItemAsync(ScanClothingRequestDto request);
    }
}
