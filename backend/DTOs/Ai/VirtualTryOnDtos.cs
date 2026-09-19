using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Ai;

public class VirtualTryOnRequestDto
{
    [Required] public string ModelImage { get; set; } = string.Empty;
    [Required] public string GarmentImage { get; set; } = string.Empty;
    [Required] [RegularExpression("^(tops|bottoms|shoes)$")] public string Category { get; set; } = "tops";
    public string Mode { get; set; } = "balanced";
}
