using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.Entities
{
    public class AiStylistHistory : BaseEntity
    {
        [Required]
        public int UserId { get; set; }

        [MaxLength(50)]
        public string? Occasion { get; set; }

        [MaxLength(50)]
        public string? Style { get; set; }

        [MaxLength(50)]
        public string? Weather { get; set; }

        [Required]
        public string RecommendedOutfitData { get; set; } = string.Empty;

        public int? FeedbackRating { get; set; } // 1-5 sao

        // Navigation properties
        public User? User { get; set; }
    }
}
