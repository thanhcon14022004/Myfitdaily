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

        var userTestNam = await GetOrCreateUser(context, "testnam", "testnam@myfitdaily.com", "testnam", "Gentleman (Test Nam)", "Nam", "User", "Premium", 178, 70, 98, 78, 95, "Tam giác ngược", now);
        var userTestNu = await GetOrCreateUser(context, "testnu", "testnu@myfitdaily.com", "testnu", "Fashionista (Test Nữ)", "Nữ", "User", "Premium", 165, 52, 88, 64, 92, "Đồng hồ cát", now);
        var userAdmin = await GetOrCreateUser(context, "admin", "admin@myfitdaily.com", "admin", "Ban Quản Trị Hệ Thống", "Nam", "Admin", "PremiumPlus", 175, 68, 96, 76, 94, "Cân đối", now);

        // Seed clothes for demo and all existing users
        var allUsers = await context.Users.ToListAsync();
        foreach (var u in allUsers)
        {
            await SeedUserClothesAndOutfitsAsync(context, u.Id, now);
        }
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

    private static async Task<User> GetOrCreateUser(
        ApplicationDbContext context, 
        string usernameKey,
        string email, 
        string password, 
        string name, 
        string gender, 
        string role, 
        string subscription, 
        double height, 
        double weight, 
        double chest, 
        double waist, 
        double hips, 
        string bodyShape, 
        DateTime now)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == usernameKey.ToLower() || u.Email.ToLower() == email.ToLower());
        if (user != null)
        {
            // Ensure password hash matches username and role is up to date
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            user.Role = role;
            user.SubscriptionType = subscription;
            user.Gender = gender;
            user.FullName = name;
            user.Height = height;
            user.Weight = weight;
            user.Chest = chest;
            user.Waist = waist;
            user.Hips = hips;
            user.BodyShape = bodyShape;
            await context.SaveChangesAsync();
            return user;
        }

        user = new User
        {
            Email = usernameKey,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            FullName = name,
            Gender = gender,
            Role = role,
            SubscriptionType = subscription,
            Height = height,
            Weight = weight,
            Chest = chest,
            Waist = waist,
            Hips = hips,
            BodyShape = bodyShape,
            Age = gender == "Nam" ? 24 : 22,
            AgeGroup = "GenZ",
            CreatedAt = now
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    private static List<ClothingItem> CreateStylistEdit(int userId, DateTime now) =>
    [
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo ba lỗ Coolmate Relaxed", Color = "Nâu taupe", Style = "Minimal Street", Season = "Summer", Brand = "COOLMATE", Size = "M", Price = 179000, PriceFormatted = "179K", Platform = "Coolmate", ImageUrl = "/assets/stylist/coolmate-tank-top.png", Description = "Áo ba lỗ relaxed màu taupe.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Sweatshirt Frozen.HN Studio", Color = "Đen", Style = "Streetwear", Season = "Fall / Winter", Brand = "FROZEN.HN", Size = "M", Price = 263000, PriceFormatted = "263K", Platform = "Frozen.HN", ImageUrl = "/assets/stylist/frozen-sweatshirt.png", Description = "Sweatshirt cổ tròn form rộng màu đen.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo Sơ Mi Oxford Navy Slim-Fit", Color = "Xanh Navy", Style = "Smart Casual", Season = "AllSeason", Brand = "ZARA MAN", Size = "M", Price = 349000, PriceFormatted = "349K", Platform = "Zara", ImageUrl = "/assets/stylist/navy-shirt-essential.png", Description = "Áo sơ mi dài tay xanh navy phom dáng ôm vừa vặn.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo Sơ Mi Sọc Kẻ Dài Tay Boxy", Color = "Xanh Blue / Sọc", Style = "Korean Casual", Season = "AllSeason", Brand = "DAILY EDIT", Size = "L", Price = 320000, PriceFormatted = "320K", Platform = "Daily Edit", ImageUrl = "/assets/clothes/shirt_stripe_blue.png", Description = "Áo sơ mi dài tay form boxy rộng kẻ sọc xanh nhã nhặn, chất vải cotton thô mát.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo Polo Dệt Kim Cable Knit Trắng", Color = "Trắng", Style = "Old Money", Season = "Summer", Brand = "POLO CLUB", Size = "M", Price = 380000, PriceFormatted = "380K", Platform = "Polo Club", ImageUrl = "/assets/clothes/polo_cable_knit_white.png", Description = "Áo polo cộc tay dệt kim họa tiết xoắn thừng cable knit màu trắng sang trọng.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo Polo Phối Vai Đen Be Cát", Color = "Be Cát / Đen", Style = "Smart Casual", Season = "Summer", Brand = "PAZZIN", Size = "L", Price = 290000, PriceFormatted = "290K", Platform = "Pazzin", ImageUrl = "/assets/clothes/polo_pazzin_beige.png", Description = "Áo polo cộc tay cổ bẻ phối sọc vai đen trên nền be cát thể thao thanh lịch.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 2, Name = "Quần suông dây rút Cream", Color = "Kem", Style = "Relaxed", Season = "AllSeason", Brand = "STYLIST EDIT", Size = "M", Price = 320000, PriceFormatted = "320K", Platform = "Curated", ImageUrl = "/assets/stylist/cream-relaxed-pants.png", Description = "Quần ống suông dây rút màu kem.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 2, Name = "Quần Tây Xếp Ly Dáng Suông Xám Than", Color = "Xám Than Chì", Style = "Sartorial", Season = "AllSeason", Brand = "TAILOR LAB", Size = "M", Price = 390000, PriceFormatted = "390K", Platform = "Tailor Lab", ImageUrl = "/assets/clothes/trousers_pleated_grey.png", Description = "Quần âu xếp ly dáng suông đứng phom phẳng phiu màu xám than chì lịch sự.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 2, Name = "Quần Short Jean Cạp Chun Wash Xanh", Color = "Xanh Denim Wash", Style = "Streetwear", Season = "Summer", Brand = "DENIM CO", Size = "M", Price = 260000, PriceFormatted = "260K", Platform = "Denim Co", ImageUrl = "/assets/clothes/shorts_denim_wash.png", Description = "Quần short jean denim lưng thun cạp chun thoải mái wash màu bụi bặm trẻ trung.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 5, Name = "Sneaker Retro Cream / Black", Color = "Kem / Đen", Style = "Retro", Season = "AllSeason", Brand = "RETRO CLUB", Size = "42", Price = 450000, PriceFormatted = "450K", Platform = "Curated", ImageUrl = "/assets/stylist/retro-sneakers.png", Description = "Sneaker low-top retro với đế gum.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 5, Name = "Sneaker Chunky Trắng Xanh Navy", Color = "Trắng / Xanh Navy", Style = "Streetwear", Season = "AllSeason", Brand = "STREET LAB", Size = "42", Price = 420000, PriceFormatted = "420K", Platform = "Street Lab", ImageUrl = "/assets/clothes/sneaker_chunky_white_blue.png", Description = "Sneaker đế độn chunky màu trắng phối cổ và dây xanh navy trẻ trung năng động.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 5, Name = "Giày Tây Derby Da Đen Đế Răng Cưa", Color = "Đen", Style = "Sartorial", Season = "AllSeason", Brand = "CRAFT DERBY", Size = "42", Price = 590000, PriceFormatted = "590K", Platform = "Craft Derby", ImageUrl = "/assets/clothes/derby_leather_black.png", Description = "Giày tây Derby da bò đen bóng đế răng cưa chunky thời thượng, phù hợp phối quần âu hoặc jeans.", CreatedAt = now }
    ];

    // Kept for the wardrobe controller's first-login bootstrap path.
    public static List<ClothingItem> GetMaleSeedClothes(int userId) => CreateStylistEdit(userId, DateTime.UtcNow);
    public static List<ClothingItem> GetFemaleSeedClothes(int userId) => CreateStylistEdit(userId, DateTime.UtcNow);
}
