namespace MYFITDAILY_EXE201_Group6.DTOs.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string? Gender { get; set; }
        public string Role { get; set; } = string.Empty;
        public string SubscriptionType { get; set; } = string.Empty;
        public DateTime? SubscriptionExpiresAt { get; set; }
        public string? SubscriptionPeriod { get; set; }
        public DateTime CreatedAt { get; set; }

        // Thông số thể trạng & tỉ lệ cơ thể
        public double? Height { get; set; }
        public double? Weight { get; set; }
        public double? Chest { get; set; }
        public double? Waist { get; set; }
        public double? Hips { get; set; }
        public string? BodyShape { get; set; }
        public int? Age { get; set; }
        public string? AgeGroup { get; set; }

        // Tính toán chỉ số BMI tự động
        public double? Bmi => (Height.HasValue && Height > 0 && Weight.HasValue && Weight > 0)
            ? Math.Round(Weight.Value / Math.Pow(Height.Value / 100.0, 2), 1)
            : null;

        // Kiểm tra xem người dùng đã điền đầy đủ thông số cơ thể bắt buộc hay chưa
        public bool HasBodyMetrics => Height.HasValue && Height > 0 && Weight.HasValue && Weight > 0;
    }
}
