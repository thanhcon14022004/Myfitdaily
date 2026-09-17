using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.Entities
{
    public class OutfitItem : BaseEntity
    {
        [Required]
        public int OutfitId { get; set; }

        [Required]
        public int ClothingItemId { get; set; }

        // Navigation properties
        public Outfit? Outfit { get; set; }
        public ClothingItem? ClothingItem { get; set; }
    }
}
