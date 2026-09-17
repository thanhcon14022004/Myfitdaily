using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Clothing
{
    public class BatchCreateClothingItemDto
    {
        [Required]
        public List<CreateClothingItemDto> Items { get; set; } = new();
    }
}