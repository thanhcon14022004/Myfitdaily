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
        var userDemo = await GetOrCreateUser(context, "demo", "demo@myfitdaily.com", "demo123456", "Tài Khoản Trải Nghiệm Demo", "Nam", "User", "Premium", 175, 68, 96, 76, 94, "Cân đối", now);

        // CHỈ NẠP TỦ ĐỒ CHO CÁC TÀI KHOẢN MẪU (DEMO)
        await SeedUserClothesAndOutfitsAsync(context, userTestNam.Id, isMale: true, now);
        await SeedUserClothesAndOutfitsAsync(context, userTestNu.Id, isMale: false, now);
        await SeedUserClothesAndOutfitsAsync(context, userDemo.Id, isMale: true, now);

        // DỌN DẸP: Xóa các món đồ mẫu và outfit mẫu đã bị gán nhầm vào tài khoản người dùng thực tế
        var demoUserIds = new HashSet<int> { userTestNam.Id, userTestNu.Id, userDemo.Id, userAdmin.Id };
        var realUserIds = await context.Users
            .Where(u => !demoUserIds.Contains(u.Id) && !u.Email.ToLower().Contains("demo") && !u.Email.ToLower().Contains("test"))
            .Select(u => u.Id)
            .ToListAsync();

        if (realUserIds.Any())
        {
            var seedOutfits = await context.Outfits
                .Where(o => realUserIds.Contains(o.UserId) && (!o.CreatedByAi && (
                    o.Name.Contains("Signature") || 
                    o.Name.Contains("Summer Relaxed") || 
                    o.Name.Contains("Smart Casual") || 
                    o.Name.Contains("Camisole") ||
                    o.Name.Contains("Croptop") ||
                    o.Name.Contains("Slip Dress")
                )))
                .ToListAsync();

            if (seedOutfits.Any())
            {
                var outfitIds = seedOutfits.Select(o => o.Id).ToList();
                var outfitItems = await context.OutfitItems.Where(oi => outfitIds.Contains(oi.OutfitId)).ToListAsync();
                context.OutfitItems.RemoveRange(outfitItems);
                context.Outfits.RemoveRange(seedOutfits);
            }

            var allSeedNames = CreateMaleStylistEdit(0, now).Select(i => i.Name)
                .Concat(CreateFemaleStylistEdit(0, now).Select(i => i.Name))
                .ToHashSet();

            var seededClothesToRemove = await context.ClothingItems
                .Where(c => realUserIds.Contains(c.UserId) && (
                    allSeedNames.Contains(c.Name) ||
                    c.ImageUrl.StartsWith("/assets/stylist/") ||
                    c.Brand == "STYLIST EDIT" ||
                    c.Brand == "FROZEN.HN" ||
                    c.Brand == "RETRO CLUB" ||
                    c.Brand == "TAILOR LAB" ||
                    c.Brand == "DAILY EDIT" ||
                    c.Brand == "POLO CLUB" ||
                    c.Brand == "PAZZIN" ||
                    c.Brand == "DENIM CO" ||
                    c.Brand == "CRAFT DERBY"
                ))
                .ToListAsync();

            if (seededClothesToRemove.Any())
            {
                context.ClothingItems.RemoveRange(seededClothesToRemove);
            }

            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedUserClothesAndOutfitsAsync(ApplicationDbContext context, int userId, bool isMale, DateTime now)
    {
        var existingClothes = await context.ClothingItems.Where(c => c.UserId == userId).ToListAsync();
        var editItems = isMale ? CreateMaleStylistEdit(userId, now) : CreateFemaleStylistEdit(userId, now);

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
            if (isMale)
            {
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
            else
            {
                var cami = userClothes.FirstOrDefault(c => c.Name.Contains("2 Dây") || c.Name.Contains("Camisole"));
                var crop = userClothes.FirstOrDefault(c => c.Name.Contains("Croptop"));
                var skirt = userClothes.FirstOrDefault(c => c.Name.Contains("Váy"));
                var jeans = userClothes.FirstOrDefault(c => c.Name.Contains("Quần"));
                var shoes = userClothes.FirstOrDefault(c => c.Name.Contains("Sneaker"));

                if (skirt != null && shoes != null)
                {
                    var outfit1 = new Outfit { UserId = userId, Name = "Chic Camisole & Pleated Skirt", Occasion = "Casual", Season = "Summer", IsFavorite = true, CreatedByAi = false, Description = "Áo hai dây lụa đen kết hợp chân váy xếp ly chữ A màu be thanh lịch.", CreatedAt = now };
                    context.Outfits.Add(outfit1);
                    await context.SaveChangesAsync();

                    if (cami != null) context.OutfitItems.Add(new OutfitItem { OutfitId = outfit1.Id, ClothingItemId = cami.Id, CreatedAt = now });
                    context.OutfitItems.Add(new OutfitItem { OutfitId = outfit1.Id, ClothingItemId = skirt.Id, CreatedAt = now });
                    context.OutfitItems.Add(new OutfitItem { OutfitId = outfit1.Id, ClothingItemId = shoes.Id, CreatedAt = now });
                    await context.SaveChangesAsync();
                }
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

    private static List<ClothingItem> CreateMaleStylistEdit(int userId, DateTime now) =>
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

    private static List<ClothingItem> CreateFemaleStylistEdit(int userId, DateTime now) =>
    [
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo Croptop Baby Tee Trắng", Color = "Trắng", Style = "Y2K Minimal", Season = "Summer", Brand = "UNIQLO", Size = "S", Price = 159000, PriceFormatted = "159K", Platform = "Uniqlo", ImageUrl = "/assets/clothes/shirt_white_formal.jpg", Description = "Áo croptop baby tee dáng ôm khoe eo thon năng động.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo 2 Dây Lụa Satin Đen", Color = "Đen", Style = "Chic Minimal", Season = "Summer", Brand = "ZARA", Size = "S", Price = 179000, PriceFormatted = "179K", Platform = "Zara", ImageUrl = "/assets/clothes/shirt_black_formal.jpg", Description = "Áo hai dây lụa satin đen quyến rũ, quai mảnh tôn vai.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo Sơ Mi Trắng Cổ Đức Basic", Color = "Trắng", Style = "Smart Casual", Season = "AllSeason", Brand = "UNIQLO", Size = "S", Price = 320000, PriceFormatted = "320K", Platform = "Uniqlo", ImageUrl = "/assets/clothes/shirt_white_formal.jpg", Description = "Áo sơ mi trắng dài tay cổ Đức phom dáng công sở chuẩn mực.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 1, Name = "Áo Sơ Mi Xanh Nhạt Dài Tay", Color = "Xanh Nhạt", Style = "Korean Minimal", Season = "AllSeason", Brand = "DAILY EDIT", Size = "M", Price = 340000, PriceFormatted = "340K", Platform = "Daily Edit", ImageUrl = "/assets/clothes/shirt_oxford_light_blue.jpg", Description = "Áo sơ mi dài tay màu xanh pastel nhã nhặn tôn da.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 2, Name = "Chân Váy Xếp Ly Chữ A Màu Be", Color = "Be Cát", Style = "Preppy Chic", Season = "Summer", Brand = "ZARA", Size = "S", Price = 250000, PriceFormatted = "250K", Platform = "Zara", ImageUrl = "/assets/clothes/pants_wide_beige.jpg", Description = "Chân váy ngắn xếp ly chữ A màu be thanh lịch, cạp cao tôn dáng.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 3, Name = "Váy Suông Lụa 2 Dây Đen Minimalist", Color = "Đen", Style = "Elegance", Season = "Summer", Brand = "MANGO", Size = "S", Price = 350000, PriceFormatted = "350K", Platform = "Mango", ImageUrl = "/assets/clothes/pants_wide_black.jpg", Description = "Đầm suông hai dây lụa đen rủ nhẹ sang trọng qua gối.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 2, Name = "Quần Vải Suông Ống Rộng Beige", Color = "Beige", Style = "Korean Minimal", Season = "AllSeason", Brand = "DAILY EDIT", Size = "M", Price = 380000, PriceFormatted = "380K", Platform = "Daily Edit", ImageUrl = "/assets/clothes/pants_wide_beige.jpg", Description = "Quần vải suông ống rộng màu beige rủ tự nhiên, thoải mái và hợp thời trang.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 2, Name = "Quần Jeans Ống Suông Vintage Xanh Denim", Color = "Xanh Denim", Style = "Vintage Denim", Season = "AllSeason", Brand = "LEVIS", Size = "M", Price = 420000, PriceFormatted = "420K", Platform = "Levis", ImageUrl = "/assets/clothes/jeans_wide_light_blue.jpg", Description = "Quần jeans dài ống suông thẳng đứng màu xanh denim wash nhẹ tôn dáng.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 5, Name = "Giày Sneaker Trắng Tối Giản Basic", Color = "Trắng", Style = "Smart Casual", Season = "AllSeason", Brand = "ADIDAS", Size = "38", Price = 490000, PriceFormatted = "490K", Platform = "Adidas", ImageUrl = "/assets/clothes/shoes_sneaker_white_real.jpg", Description = "Sneaker da trắng đế bằng tối giản thanh lịch, phù hợp mọi outfit.", CreatedAt = now },
        new ClothingItem { UserId = userId, CategoryId = 5, Name = "Giày Sneaker Retro Xám Trắng", Color = "Xám / Trắng", Style = "Denim Casual", Season = "AllSeason", Brand = "NEW BALANCE", Size = "38", Price = 530000, PriceFormatted = "530K", Platform = "New Balance", ImageUrl = "/assets/clothes/shoes_sneaker_grey_white.jpg", Description = "Sneaker retro running phối xám trắng thời thượng và tôn dáng.", CreatedAt = now }
    ];

    public static bool IsDemoUser(User? user)
    {
        if (user == null) return false;
        var email = (user.Email ?? string.Empty).Trim().ToLower();
        return email == "demo@myfitdaily.com" ||
               email == "demo" ||
               email == "testnam" ||
               email == "testnam@myfitdaily.com" ||
               email == "testnu" ||
               email == "testnu@myfitdaily.com";
    }

    // Kept for the wardrobe controller's demo bootstrap path.
    public static List<ClothingItem> GetMaleSeedClothes(int userId) => CreateMaleStylistEdit(userId, DateTime.UtcNow);
    public static List<ClothingItem> GetFemaleSeedClothes(int userId) => CreateFemaleStylistEdit(userId, DateTime.UtcNow);
}
