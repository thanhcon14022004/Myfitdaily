using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Ai;

public class VirtualTryOnRequestDto
{
    [Required] public string ModelImage { get; set; } = string.Empty;
    [Required] public string GarmentImage { get; set; } = string.Empty;
    [Required] [RegularExpression("^(tops|bottoms|shoes)$")] public string Category { get; set; } = "tops";
    public string Mode { get; set; } = "balanced";
}

public class GeminiTryOnRequestDto
{
    public string Gender { get; set; } = "Nam";
    public string? TopName { get; set; }
    public string? TopDescription { get; set; }
    public string? TopImageUrl { get; set; }
    public string? BottomName { get; set; }
    public string? BottomDescription { get; set; }
    public string? BottomImageUrl { get; set; }
    public string? ShoesName { get; set; }
    public string? ShoesDescription { get; set; }
    public string? CustomPrompt { get; set; }
}
