using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? AvatarUrl { get; set; }

        [MaxLength(20)]
        public string? Gender { get; set; }

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "User"; // "User", "Admin"

        [Required]
        [MaxLength(20)]
        public string SubscriptionType { get; set; } = "Free"; // "Free", "Premium", "PremiumPlus"

        public DateTime? SubscriptionExpiresAt { get; set; }

        [MaxLength(20)]
        public string? SubscriptionPeriod { get; set; } // "Monthly", "Yearly"

        // Thông số cơ thể và tỉ lệ vóc dáng (Bắt buộc cho AI Stylist cá nhân hóa)
        public double? Height { get; set; }     // Chiều cao (cm)
        public double? Weight { get; set; }     // Cân nặng (kg)
        public double? Chest { get; set; }      // Vòng 1 - Ngực (cm)
        public double? Waist { get; set; }      // Vòng 2 - Eo (cm)
        public double? Hips { get; set; }       // Vòng 3 - Mông (cm)

        [MaxLength(50)]
        public string? BodyShape { get; set; }  // Dáng người (Hourglass, Pear, Rectangle, InvertedTriangle, Apple)

        // Độ tuổi & Nhóm tuổi theo xu hướng TMĐT
        public int? Age { get; set; }           // Tuổi của người dùng
        [MaxLength(50)]
        public string? AgeGroup { get; set; }   // Gen Z (16-24), Millennials (25-34), Mid-Career (35-49), Mature (50+)

        // Navigation properties
        public ICollection<ClothingItem> ClothingItems { get; set; } = new List<ClothingItem>();
        public ICollection<Outfit> Outfits { get; set; } = new List<Outfit>();
        public ICollection<AiStylistHistory> AiStylistHistories { get; set; } = new List<AiStylistHistory>();
    }
}
