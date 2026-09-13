using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.Entities
{
    public class Outfit : BaseEntity
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(50)]
        public string? Occasion { get; set; } // Casual, Work, Date, Party, etc.

        [MaxLength(50)]
        public string? Season { get; set; }

        public bool IsFavorite { get; set; } = false;

        public bool CreatedByAi { get; set; } = false;

        // Navigation properties
        public User? User { get; set; }
        public ICollection<OutfitItem> OutfitItems { get; set; } = new List<OutfitItem>();
    }
}
