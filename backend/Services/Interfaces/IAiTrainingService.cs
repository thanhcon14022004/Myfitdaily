using MYFITDAILY_EXE201_Group6.DTOs.Ai;

namespace MYFITDAILY_EXE201_Group6.Services.Interfaces;

public interface IAiTrainingService
{
    Task<List<FashionRuleDto>> GetAllRulesAsync();
    Task<FashionRuleDto?> GetRuleByIdAsync(string id);
    Task<FashionRuleDto> CreateRuleAsync(CreateFashionRuleDto dto);
    Task<FashionRuleDto?> UpdateRuleAsync(string id, UpdateFashionRuleDto dto);
    Task<bool> DeleteRuleAsync(string id);

    Task<List<TrainingSampleDto>> GetAllSamplesAsync();
    Task<TrainingSampleDto> CreateSampleAsync(CreateTrainingSampleDto dto);
    Task<bool> DeleteSampleAsync(string id);

    Task<string> GetActiveRulesSystemPromptAsync();
    Task<TestRecommendationResponseDto> TestRecommendationAsync(TestRecommendationRequestDto request);
    Task<string> ExportDatasetJsonlAsync();
}
