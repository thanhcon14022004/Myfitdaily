using Microsoft.AspNetCore.Mvc;
using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.DTOs.Ai;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Controllers;

[ApiController]
[Route("api/ai-training")]
public class AiTrainingController : ControllerBase
{
    private readonly IAiTrainingService _trainingService;

    public AiTrainingController(IAiTrainingService trainingService)
    {
        _trainingService = trainingService;
    }

    [HttpGet("rules")]
    public async Task<IActionResult> GetRules()
    {
        var rules = await _trainingService.GetAllRulesAsync();
        return Ok(ApiResponse<List<FashionRuleDto>>.Ok(rules, "Lấy danh sách quy tắc thời trang thành công"));
    }

    [HttpPost("rules")]
    public async Task<IActionResult> CreateRule([FromBody] CreateFashionRuleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.RuleContent))
        {
            return BadRequest(ApiResponse<object>.Fail("Tên quy tắc và nội dung quy tắc không được để trống!"));
        }
        var created = await _trainingService.CreateRuleAsync(dto);
        return Ok(ApiResponse<FashionRuleDto>.Ok(created, "Thêm quy tắc đào tạo AI mới thành công"));
    }

    [HttpPut("rules/{id}")]
    public async Task<IActionResult> UpdateRule(string id, [FromBody] UpdateFashionRuleDto dto)
    {
        var updated = await _trainingService.UpdateRuleAsync(id, dto);
        if (updated == null)
        {
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy quy tắc cần cập nhật"));
        }
        return Ok(ApiResponse<FashionRuleDto>.Ok(updated, "Cập nhật quy tắc đào tạo AI thành công"));
    }

    [HttpDelete("rules/{id}")]
    public async Task<IActionResult> DeleteRule(string id)
    {
        var ok = await _trainingService.DeleteRuleAsync(id);
        if (!ok)
        {
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy quy tắc cần xóa"));
        }
        return Ok(ApiResponse<object>.Ok(new { id }, "Đã xóa quy tắc đào tạo"));
    }

    [HttpGet("samples")]
    public async Task<IActionResult> GetSamples()
    {
        var samples = await _trainingService.GetAllSamplesAsync();
        return Ok(ApiResponse<List<TrainingSampleDto>>.Ok(samples, "Lấy danh sách set đồ mẫu thành công"));
    }

    [HttpPost("samples")]
    public async Task<IActionResult> CreateSample([FromBody] CreateTrainingSampleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest(ApiResponse<object>.Fail("Tiêu đề set đồ mẫu không được để trống!"));
        }
        var created = await _trainingService.CreateSampleAsync(dto);
        return Ok(ApiResponse<TrainingSampleDto>.Ok(created, "Thêm set đồ mẫu đào tạo thành công"));
    }

    [HttpDelete("samples/{id}")]
    public async Task<IActionResult> DeleteSample(string id)
    {
        var ok = await _trainingService.DeleteSampleAsync(id);
        if (!ok)
        {
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy set đồ mẫu cần xóa"));
        }
        return Ok(ApiResponse<object>.Ok(new { id }, "Đã xóa set đồ mẫu đào tạo"));
    }

    [HttpPost("test-recommendation")]
    public async Task<IActionResult> TestRecommendation([FromBody] TestRecommendationRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.UserPrompt))
        {
            return BadRequest(ApiResponse<object>.Fail("Vui lòng nhập tình huống thử nghiệm!"));
        }
        var result = await _trainingService.TestRecommendationAsync(request);
        return Ok(ApiResponse<TestRecommendationResponseDto>.Ok(result, "Chạy thử nghiệm gợi ý AI thành công"));
    }

    [HttpGet("export-dataset")]
    public async Task<IActionResult> ExportDataset()
    {
        var jsonl = await _trainingService.ExportDatasetJsonlAsync();
        var bytes = System.Text.Encoding.UTF8.GetBytes(jsonl);
        return File(bytes, "application/jsonl", "myfitdaily_fashion_training_dataset.jsonl");
    }
}
