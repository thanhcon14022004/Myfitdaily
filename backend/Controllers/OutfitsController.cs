using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.Data;
using MYFITDAILY_EXE201_Group6.DTOs.Clothing;
using MYFITDAILY_EXE201_Group6.Entities;

namespace MYFITDAILY_EXE201_Group6.Controllers
{
    public class OutfitDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Occasion { get; set; }
        public string? Season { get; set; }
        public bool IsFavorite { get; set; }
        public bool CreatedByAi { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ClothingItemDto> Items { get; set; } = new();
    }

    [ApiController]
    [Route("api/[controller]")]
    public class OutfitsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OutfitsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(claim, out var id))
            {
                return id;
            }
            return null;
        }

        /// <summary>
        /// Lß║Ñy to├án bß╗Ö danh s├ích outfit ─æ├ú l╞░u trong database cß╗ºa ng╞░ß╗¥i d├╣ng
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetOutfits()
        {
            var userId = GetCurrentUserId();

            if (!userId.HasValue)
            {
                var demoUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == "demo@myfitdaily.com")
                               ?? await _context.Users.FirstOrDefaultAsync();
                if (demoUser != null)
                {
                    userId = demoUser.Id;
                }
            }

            var outfits = await _context.Outfits
                .Include(o => o.OutfitItems)
                    .ThenInclude(oi => oi.ClothingItem)
                        .ThenInclude(ci => ci!.Category)
                .Where(o => o.UserId == (userId ?? 1))
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OutfitDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    Name = o.Name,
                    Description = o.Description,
                    Occasion = o.Occasion,
                    Season = o.Season,
                    IsFavorite = o.IsFavorite,
                    CreatedByAi = o.CreatedByAi,
                    CreatedAt = o.CreatedAt,
                    Items = o.OutfitItems
                        .Where(oi => oi.ClothingItem != null)
                        .Select(oi => new ClothingItemDto
                        {
                            Id = oi.ClothingItem!.Id,
                            UserId = oi.ClothingItem.UserId,
                            CategoryId = oi.ClothingItem.CategoryId,
                            CategoryName = oi.ClothingItem.Category != null ? oi.ClothingItem.Category.Name : "Tops",
                            Name = oi.ClothingItem.Name,
                            Color = oi.ClothingItem.Color,
                            Style = oi.ClothingItem.Style,
                            Season = oi.ClothingItem.Season,
                            ImageUrl = oi.ClothingItem.ImageUrl,
                            Description = oi.ClothingItem.Description,
                            Brand = oi.ClothingItem.Brand,
                            Size = oi.ClothingItem.Size,
                            CreatedAt = oi.ClothingItem.CreatedAt
                        }).ToList()
                })
                .ToListAsync();

            return Ok(ApiResponse<List<OutfitDto>>.Ok(outfits, "Lß║Ñy danh s├ích outfit th├ánh c├┤ng"));
        }
    }
}