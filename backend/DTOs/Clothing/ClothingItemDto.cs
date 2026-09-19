namespace MYFITDAILY_EXE201_Group6.DTOs.Clothing
{
    public class ClothingItemDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Style { get; set; } = string.Empty;
        public string Season { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Brand { get; set; }
        public string? Size { get; set; }
        public decimal? Price { get; set; }
        public string? PriceFormatted { get; set; }
        public string? AffiliateUrl { get; set; }
        public string? OriginalUrl { get; set; }
        public string? Platform { get; set; }
        public bool IsAffiliate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
