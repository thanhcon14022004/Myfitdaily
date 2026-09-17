using MYFITDAILY_EXE201_Group6.DTOs.Ai;

namespace MYFITDAILY_EXE201_Group6.Services.Interfaces
{
    public interface IFashionEcommerceTrendService
    {
        List<EcommerceTrendDto> GetAllTrends();
        EcommerceTrendDto GetTrendByAge(int? age);
        EcommerceTrendDto GetTrendByGroupKey(string? groupKey);
        string GetTrendSummaryForAiPrompt(int? age, bool isMale = false);
        string DetermineAgeGroup(int? age);
    }
}
