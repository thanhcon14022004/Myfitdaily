using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.Entities
{
    public class Category : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public ICollection<ClothingItem> ClothingItems { get; set; } = new List<ClothingItem>();
    }
}
