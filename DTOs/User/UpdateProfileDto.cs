using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.DTOs.User
{
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "Họ tên là bắt buộc")]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? AvatarUrl { get; set; }

        [MaxLength(20)]
        public string? Gender { get; set; }

        // Bắt buộc điền thông số chiều cao và trọng lượng
        [Required(ErrorMessage = "Chiều cao là thông tin bắt buộc")]
        [Range(50, 250, ErrorMessage = "Chiều cao phải trong khoảng từ 50cm đến 250cm")]
        public double? Height { get; set; }

        [Required(ErrorMessage = "Trọng lượng/Cân nặng là thông tin bắt buộc")]
        [Range(20, 300, ErrorMessage = "Cân nặng phải trong khoảng từ 20kg đến 300kg")]
        public double? Weight { get; set; }

        // Số đo tỉ lệ cơ thể 3 vòng
        [Range(30, 200, ErrorMessage = "Số đo Vòng 1 (Ngực) phải trong khoảng từ 30cm đến 200cm")]
        public double? Chest { get; set; }

        [Range(30, 200, ErrorMessage = "Số đo Vòng 2 (Eo) phải trong khoảng từ 30cm đến 200cm")]
        public double? Waist { get; set; }

        [Range(30, 200, ErrorMessage = "Số đo Vòng 3 (Mông) phải trong khoảng từ 30cm đến 200cm")]
        public double? Hips { get; set; }

        [MaxLength(50)]
        public string? BodyShape { get; set; }

        [Range(10, 120, ErrorMessage = "Độ tuổi phải trong khoảng từ 10 đến 120 tuổi")]
        public int? Age { get; set; }
    }
}
