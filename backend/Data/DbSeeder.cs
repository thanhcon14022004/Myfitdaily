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

        // Seed 5 items for demo accounts if not already present
        await SeedUserClothesAndOutfitsAsync(context, demoMale.Id, now);
        await SeedUserClothesAndOutfitsAsync(context, demoFemale.Id, now);
    }

    private static async Task SeedUserClothesAndOutfitsAsync(ApplicationDbContext context, int userId, DateTime now)
    {
        var existingClothes = await context.ClothingItems.Where(c => c.UserId == userId).ToListAsync();
        var editItems = CreateStylistEdit(userId, now);

        foreach (var item in editItems)
        {
            if (!existingClothes.Any(c => c.Name == item.Name))
            {
                context.ClothingItems.Add(item);
            }
        }
        await context.SaveChangesAsync();

        if (!await context.Outfits.AnyAsync(o => o.UserId == userId))
        {
            var userClothes = await context.ClothingItems.Where(c => c.UserId == userId).ToListAsync();
            var sweat = userClothes.FirstOrDefault(c => c.Name.Contains("Sweatshirt"));
            var tank = userClothes.FirstOrDefault(c => c.Name.Contains("Coolmate"));
            var shirt = userClothes.FirstOrDefault(c => c.Name.Contains("Sơ Mi") || c.Name.Contains("Navy"));
            var pants = userClothes.FirstOrDefault(c => c.Name.Contains("Quần"));
            var shoes = userClothes.FirstOrDefault(c => c.Name.Contains("Sneaker"));

            if (pants != null && shoes != null)
            {
                var outfit1 = new Outfit { UserId = userId, Name = "Cream & Black Signature", Occasion = "Casual", Season = "AllSeason", IsFavorite = true, CreatedByAi = false, Description = "Sweatshirt đen, quần cream và sneaker retro.", CreatedAt = now };
                var outfit2 = new Outfit { UserId = userId, Name = "Summer Relaxed Street", Occasion = "Casual", Season = "Summer", IsFavorite = true, CreatedByAi = false, Description = "Áo ba lỗ taupe cùng quần suông cream và sneaker retro.", CreatedAt = now };
                var outfit3 = new Outfit { UserId = userId, Name = "Smart Casual Navy Look", Occasion = "Formal", Season = "AllSeason", IsFavorite = true, CreatedByAi = false, Description = "Áo sơ mi navy kết hợp quần suông kem thanh lịch.", CreatedAt = now };

                context.Outfits.AddRange(outfit1, outfit2, outfit3);
                await context.SaveChangesAsync();

                if (sweat != null) context.OutfitItems.Add(new OutfitItem { OutfitId = outfit1.Id, ClothingItemId = sweat.Id, CreatedAt = now });
                context.OutfitItems.Add(new OutfitItem { OutfitId = outfit1.Id, ClothingItemId = pants.Id, CreatedAt = now });
                context.OutfitItems.Add(new OutfitItem { OutfitId = outfit1.Id, ClothingItemId = shoes.Id, CreatedAt = now });

                if (tank != null) context.OutfitItems.Add(new OutfitItem { OutfitId = outfit2.Id, ClothingItemId = tank.Id, CreatedAt = now });
                context.OutfitItems.Add(new OutfitItem { OutfitId = outfit2.Id, ClothingItemId = pants.Id, CreatedAt = now });
                context.OutfitItems.Add(new OutfitItem { OutfitId = outfit2.Id, ClothingItemId = shoes.Id, CreatedAt = now });

                if (shirt != null) context.OutfitItems.Add(new OutfitItem { OutfitId = outfit3.Id, ClothingItemId = shirt.Id, CreatedAt = now });
                context.OutfitItems.Add(new OutfitItem { OutfitId = outfit3.Id, ClothingItemId = pants.Id, CreatedAt = now });
                context.OutfitItems.Add(new OutfitItem { OutfitId = outfit3.Id, ClothingItemId = shoes.Id, CreatedAt = now });

                await context.SaveChangesAsync();
            }
        }
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
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo Sơ Mi Oxford Navy Slim-Fit", Color = "Xanh Navy", Style = "Smart Casual", Season = "AllSeason", Brand = "ZARA MAN", Size = "M", Price = 349000, PriceFormatted = "349K", Platform = "Zara", ImageUrl = "/assets/stylist/navy-shirt-essential.png", Description = "Áo sơ mi dài tay xanh navy phom dáng ôm vừa vặn.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 2, Name = "Quần suông dây rút Cream", Color = "Kem", Style = "Relaxed", Season = "AllSeason", Brand = "STYLIST EDIT", Size = "M", Price = 320000, PriceFormatted = "320K", Platform = "Curated", ImageUrl = "/assets/stylist/cream-relaxed-pants.png", Description = "Quần ống suông dây rút màu kem.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 5, Name = "Sneaker Retro Cream / Black", Color = "Kem / Đen", Style = "Retro", Season = "AllSeason", Brand = "RETRO CLUB", Size = "42", Price = 450000, PriceFormatted = "450K", Platform = "Curated", ImageUrl = "/assets/stylist/retro-sneakers.png", Description = "Sneaker low-top retro với đế gum.", CreatedAt = now }
    ];

    // Kept for the wardrobe controller's first-login bootstrap path.
    public static List<ClothingItem> GetMaleSeedClothes(int userId) => CreateStylistEdit(userId, DateTime.UtcNow);
    public static List<ClothingItem> GetFemaleSeedClothes(int userId) => CreateStylistEdit(userId, DateTime.UtcNow);
}
