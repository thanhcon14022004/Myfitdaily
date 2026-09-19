using System.ComponentModel.DataAnnotations;

namespace MYFITDAILY_EXE201_Group6.Entities
{
    public class ClothingItem : BaseEntity
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Color { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Style { get; set; } = string.Empty; // Casual, Formal, Streetwear, Vintage, etc.

        [Required]
        [MaxLength(50)]
        public string Season { get; set; } = string.Empty; // Spring, Summer, Fall, Winter, AllSeason

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Brand { get; set; } // Zara, Uniqlo, Nike, Adidas, etc.

        [MaxLength(20)]
        public string? Size { get; set; } // XS, S, M, L, XL, 29, 30, 41, etc.

        // Affiliate Marketing & E-commerce integration
        public decimal? Price { get; set; }
        [MaxLength(50)]
        public string? PriceFormatted { get; set; } // e.g. "263K", "220.000đ"
        public string? AffiliateUrl { get; set; }
        public string? OriginalUrl { get; set; }
        [MaxLength(50)]
        public string? Platform { get; set; } // Shopee, TikTokShop, Lazada, Zara, etc.
        public bool IsAffiliate { get; set; } = false;

        // Navigation properties
        public User? User { get; set; }
        public Category? Category { get; set; }
        public ICollection<OutfitItem> OutfitItems { get; set; } = new List<OutfitItem>();
    }
}
