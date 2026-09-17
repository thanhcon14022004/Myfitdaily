using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.Clothing
{
    public class CreateClothingItemDto
    {
        [Required(ErrorMessage = "Tên món đồ không được để trống")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng chọn danh mục")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập màu sắc")]
        [MaxLength(50)]
        public string Color { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng chọn phong cách")]
        [MaxLength(50)]
        public string Style { get; set; } = "Casual";

        [Required(ErrorMessage = "Vui lòng chọn mùa phù hợp")]
        [MaxLength(50)]
        public string Season { get; set; } = "AllSeason";

        [Required(ErrorMessage = "Vui lòng cung cấp hình ảnh")]
        public string ImageUrl { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Brand { get; set; }

        [MaxLength(20)]
        public string? Size { get; set; }
    }
}
