using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Entities;

namespace MYFITDAILY_EXE201_Group6.Data;

/// <summary>Seeds the deliberately small, four-piece Stylist Edit inventory.</summary>
public static class DbSeeder
{
    public static async Task SeedDemoDataAsync(ApplicationDbContext context)
    {
        var now = DateTime.UtcNow;
        var existingCatIds = await context.Categories.Select(c => c.Id).ToListAsync();
        var allCats = new List<Category>
        {
            new Category { Id = 1, Name = "Tops", Description = "Áo", DisplayOrder = 1, IsActive = true, CreatedAt = now },
            new Category { Id = 2, Name = "Bottoms", Description = "Quần", DisplayOrder = 2, IsActive = true, CreatedAt = now },
            new Category { Id = 3, Name = "Dresses", Description = "Đầm & Váy", DisplayOrder = 3, IsActive = true, CreatedAt = now },
            new Category { Id = 4, Name = "Outerwear", Description = "Áo Khoác", DisplayOrder = 4, IsActive = true, CreatedAt = now },
            new Category { Id = 5, Name = "Shoes", Description = "Giày", DisplayOrder = 5, IsActive = true, CreatedAt = now },
            new Category { Id = 6, Name = "Accessories", Description = "Phụ Kiện", DisplayOrder = 6, IsActive = true, CreatedAt = now }
        };
        foreach (var cat in allCats)
        {
            if (!existingCatIds.Contains(cat.Id))
            {
                context.Categories.Add(cat);
            }
        }
        await context.SaveChangesAsync();

        var demoMale = await GetOrCreateUser(context, "test@myfitdaily.com", "Gentleman (Demo Nam)", "Nam", now);
        var demoFemale = await GetOrCreateUser(context, "demo@myfitdaily.com", "Fashionista (Demo Nữ)", "Nữ", now);

        if (!await context.ClothingItems.AnyAsync(c => c.UserId == demoMale.Id))
        {
            context.ClothingItems.AddRange(CreateStylistEdit(demoMale.Id, now));
        }
        if (!await context.ClothingItems.AnyAsync(c => c.UserId == demoFemale.Id))
        {
            context.ClothingItems.AddRange(CreateStylistEdit(demoFemale.Id, now));
        }
        await context.SaveChangesAsync();
    }

    private static async Task<User> GetOrCreateUser(ApplicationDbContext context, string email, string name, string gender, DateTime now)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);
        if (user != null) return user;
        user = new User { Email = email, PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"), FullName = name, Gender = gender, Role = "User", SubscriptionType = "Premium", CreatedAt = now };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    private static List<ClothingItem> CreateStylistEdit(int userId, DateTime now) =>
    [
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo ba lỗ Coolmate Relaxed", Color = "Nâu taupe", Style = "Minimal Street", Season = "Summer", Brand = "COOLMATE", Size = "M", Price = 179000, PriceFormatted = "179K", Platform = "Coolmate", ImageUrl = "/assets/stylist/coolmate-tank-top.png", Description = "Áo ba lỗ relaxed màu taupe.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Sweatshirt Frozen.HN Studio", Color = "Đen", Style = "Streetwear", Season = "Fall / Winter", Brand = "FROZEN.HN", Size = "M", Price = 263000, PriceFormatted = "263K", Platform = "Frozen.HN", ImageUrl = "/assets/stylist/frozen-sweatshirt.png", Description = "Sweatshirt cổ tròn form rộng màu đen.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 2, Name = "Quần suông dây rút Cream", Color = "Kem", Style = "Relaxed", Season = "AllSeason", Brand = "STYLIST EDIT", Size = "M", Price = 320000, PriceFormatted = "320K", Platform = "Curated", ImageUrl = "/assets/stylist/cream-relaxed-pants.png", Description = "Quần ống suông dây rút màu kem.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 5, Name = "Sneaker Retro Cream / Black", Color = "Kem / Đen", Style = "Retro", Season = "AllSeason", Brand = "RETRO CLUB", Size = "42", Price = 450000, PriceFormatted = "450K", Platform = "Curated", ImageUrl = "/assets/stylist/retro-sneakers.png", Description = "Sneaker low-top retro với đế gum.", CreatedAt = now }
    ];

    // Kept for the wardrobe controller's first-login bootstrap path.
    public static List<ClothingItem> GetMaleSeedClothes(int userId) => CreateStylistEdit(userId, DateTime.UtcNow);
    public static List<ClothingItem> GetFemaleSeedClothes(int userId) => CreateStylistEdit(userId, DateTime.UtcNow);
}
