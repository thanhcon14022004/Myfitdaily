using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Entities;

namespace MYFITDAILY_EXE201_Group6.Data
{
    public static class DbSeeder
    {
        public static async Task SeedDemoDataAsync(ApplicationDbContext context)
        {
            try
            {
                // 1. ─Éß║úm bß║úo Categories tß╗ôn tß║íi
                if (!await context.Categories.AnyAsync())
                {
                    var seedDate = DateTime.UtcNow;
                    context.Categories.AddRange(
                        new Category { Id = 1, Name = "Tops", Description = "├üo thun, s╞í mi, ├ío len, croptop", DisplayOrder = 1, IsActive = true, CreatedAt = seedDate },
                        new Category { Id = 2, Name = "Bottoms", Description = "Quß║ºn jeans, quß║ºn t├óy, ch├ón v├íy, quß║ºn short", DisplayOrder = 2, IsActive = true, CreatedAt = seedDate },
                        new Category { Id = 3, Name = "Dresses", Description = "─Éß║ºm liß╗ün th├ón, v├íy d├ái", DisplayOrder = 3, IsActive = true, CreatedAt = seedDate },
                        new Category { Id = 4, Name = "Outerwear", Description = "├üo kho├íc, blazer, cardigan, hoodie", DisplayOrder = 4, IsActive = true, CreatedAt = seedDate },
                        new Category { Id = 5, Name = "Shoes", Description = "Sneakers, gi├áy t├óy, cao g├│t, sandals, boots", DisplayOrder = 5, IsActive = true, CreatedAt = seedDate },
                        new Category { Id = 6, Name = "Accessories", Description = "T├║i x├ích, thß║»t l╞░ng, m┼⌐ n├│n, trang sß╗⌐c", DisplayOrder = 6, IsActive = true, CreatedAt = seedDate }
                    );
                    await context.SaveChangesAsync();
                }

                // 1.5. Tạo Admin User (admin@myfitdaily.com)
                var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == "admin@myfitdaily.com");
                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        Email = "admin@myfitdaily.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                        FullName = "Quản Trị Viên (Admin)",
                        Gender = "Nam",
                        Role = "Admin",
                        SubscriptionType = "PremiumPlus",
                        Height = 175,
                        Weight = 68,
                        Chest = 95,
                        Waist = 78,
                        Hips = 94,
                        BodyShape = "Thước kẻ",
                        Age = 30,
                        AgeGroup = "Millennials (25-34)",
                        CreatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(adminUser);
                    await context.SaveChangesAsync();
                }

                // 2. Tạo Demo User Nữ (demo@myfitdaily.com)
                var demoFemale = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == "demo@myfitdaily.com");
                if (demoFemale == null)
                {
                    demoFemale = new User
                    {
                        Email = "demo@myfitdaily.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                        FullName = "Fashionista (Demo Nß╗»)",
                        Gender = "Nß╗»",
                        Role = "User",
                        SubscriptionType = "Premium",
                        Height = 165,
                        Weight = 52,
                        Chest = 88,
                        Waist = 64,
                        Hips = 92,
                        BodyShape = "─Éß╗ông hß╗ô c├ít",
                        Age = 24,
                        AgeGroup = "GenZ (18-24)",
                        CreatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(demoFemale);
                    await context.SaveChangesAsync();
                }
                else
                {
                    // Cß║¡p nhß║¡t lß║íi sß╗æ ─æo chuß║⌐n nß║┐u thiß║┐u
                    demoFemale.Height ??= 165;
                    demoFemale.Weight ??= 52;
                    demoFemale.Chest ??= 88;
                    demoFemale.Waist ??= 64;
                    demoFemale.Hips ??= 92;
                    demoFemale.BodyShape ??= "─Éß╗ông hß╗ô c├ít";
                    await context.SaveChangesAsync();
                }

                // 3. Tß║ío Demo User Nam (test@myfitdaily.com)
                var demoMale = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == "test@myfitdaily.com");
                if (demoMale == null)
                {
                    demoMale = new User
                    {
                        Email = "test@myfitdaily.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                        FullName = "Gentleman (Demo Nam)",
                        Gender = "Nam",
                        Role = "User",
                        SubscriptionType = "Premium",
                        Height = 178,
                        Weight = 70,
                        Chest = 98,
                        Waist = 78,
                        Hips = 95,
                        BodyShape = "Tam gi├íc ng╞░ß╗úc",
                        Age = 26,
                        AgeGroup = "YoungAdult (25-34)",
                        CreatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(demoMale);
                    await context.SaveChangesAsync();
                }

                // 4. Th├¬m quß║ºn ├ío v├áo tß╗º ─æß╗ô cß╗ºa Demo Nß╗» (bß╗ò sung m├│n mß╗¢i nß║┐u ch╞░a c├│)
                if (!await context.ClothingItems.AnyAsync(c => c.UserId == demoFemale.Id))
                {
                    var femaleClothes = GetFemaleSeedClothes(demoFemale.Id);
                    context.ClothingItems.AddRange(femaleClothes);
                    await context.SaveChangesAsync();
                }
                else if (!await context.ClothingItems.AnyAsync(c => c.UserId == demoFemale.Id && c.Name.Contains("Frozen")))
                {
                    var femaleClothes = GetFemaleSeedClothes(demoFemale.Id);
                    var existingNames = await context.ClothingItems.Where(c => c.UserId == demoFemale.Id).Select(c => c.Name).ToListAsync();
                    var newItems = femaleClothes.Where(c => !existingNames.Contains(c.Name)).ToList();
                    if (newItems.Any())
                    {
                        context.ClothingItems.AddRange(newItems);
                        await context.SaveChangesAsync();
                    }
                }

                // 5. Th├¬m quß║ºn ├ío v├áo tß╗º ─æß╗ô cß╗ºa Demo Nam (bß╗ò sung m├│n mß╗¢i nß║┐u ch╞░a c├│)
                if (!await context.ClothingItems.AnyAsync(c => c.UserId == demoMale.Id))
                {
                    var maleClothes = GetMaleSeedClothes(demoMale.Id);
                    context.ClothingItems.AddRange(maleClothes);
                    await context.SaveChangesAsync();
                }
                else if (!await context.ClothingItems.AnyAsync(c => c.UserId == demoMale.Id && c.Name.Contains("Frozen")))
                {
                    var maleClothes = GetMaleSeedClothes(demoMale.Id);
                    var existingNames = await context.ClothingItems.Where(c => c.UserId == demoMale.Id).Select(c => c.Name).ToListAsync();
                    var newItems = maleClothes.Where(c => !existingNames.Contains(c.Name)).ToList();
                    if (newItems.Any())
                    {
                        context.ClothingItems.AddRange(newItems);
                        await context.SaveChangesAsync();
                    }
                }
                // 6. Reset v├á tß║ío lß║íi bß╗Ö outfit mß║½u cho Demo Nß╗» (─æß╗â lu├┤n cß║¡p nhß║¡t)
                var existingFemaleOutfits = await context.Outfits.Where(o => o.UserId == demoFemale.Id).ToListAsync();
                if (existingFemaleOutfits.Any())
                {
                    var femaleOutfitIds = existingFemaleOutfits.Select(o => o.Id).ToList();
                    var relatedItems = await context.OutfitItems.Where(oi => femaleOutfitIds.Contains(oi.OutfitId)).ToListAsync();
                    context.OutfitItems.RemoveRange(relatedItems);
                    context.Outfits.RemoveRange(existingFemaleOutfits);
                    await context.SaveChangesAsync();
                }

                // Th├¬m lß║íi quß║ºn ├ío nß║┐u thiß║┐u
                if (!await context.ClothingItems.AnyAsync(c => c.UserId == demoFemale.Id))
                {
                    context.ClothingItems.AddRange(GetFemaleSeedClothes(demoFemale.Id));
                    await context.SaveChangesAsync();
                }

                var femaleOutfit1 = new Outfit
                {
                    UserId = demoFemale.Id,
                    Name = "Streetwear Chill - Sweatshirt + Trackpants",
                    Description = "Phong c├ích H├á Nß╗Öi Streetwear: Sweatshirt navy Frozen.HN phß╗æi trackpants sß╗ìc viß╗ün trß║»ng v├á sneaker trß║»ng ─æen classic - thoß║úi m├íi, trß║╗ trung, c├í t├¡nh.",
                    Occasion = "Casual / Dß║ío phß╗æ",
                    Season = "Fall / Winter",
                    IsFavorite = true,
                    CreatedByAi = false,
                    CreatedAt = DateTime.UtcNow
                };
                var femaleOutfit2 = new Outfit
                {
                    UserId = demoFemale.Id,
                    Name = "Smart Chic - S╞í mi lß╗Ña + Jeans",
                    Description = "├üo s╞í mi lß╗Ña trß║»ng thanh lß╗ïch phß╗æi quß║ºn jeans ß╗æng su├┤ng xanh denim v├á gi├áy sneaker retro - chuß║⌐n phong c├ích c├┤ng sß╗ƒ hiß╗çn ─æß║íi.",
                    Occasion = "Work / Smart Casual",
                    Season = "AllSeason",
                    IsFavorite = false,
                    CreatedByAi = true,
                    CreatedAt = DateTime.UtcNow
                };
                context.Outfits.Add(femaleOutfit1);
                context.Outfits.Add(femaleOutfit2);
                await context.SaveChangesAsync();

                var femaleItems = await context.ClothingItems.Where(c => c.UserId == demoFemale.Id).ToListAsync();
                // Outfit 1: Sweatshirt + Trackpants + Sneakers
                var sweatshirt = femaleItems.FirstOrDefault(c => c.Name.Contains("Sweatshirt") || c.Name.Contains("Hoodie"));
                var trackpants = femaleItems.FirstOrDefault(c => c.Name.Contains("Trackpants") || c.Name.Contains("Track") || c.Name.Contains("Sß╗ìc"));
                var sneakers = femaleItems.FirstOrDefault(c => c.CategoryId == 5 && c.ImageUrl != null && c.ImageUrl.Contains("sneakers_white"));
                // Fallback
                sweatshirt ??= femaleItems.FirstOrDefault(c => c.CategoryId == 1);
                trackpants ??= femaleItems.FirstOrDefault(c => c.CategoryId == 2);
                sneakers ??= femaleItems.FirstOrDefault(c => c.CategoryId == 5);

                if (sweatshirt != null) context.OutfitItems.Add(new OutfitItem { OutfitId = femaleOutfit1.Id, ClothingItemId = sweatshirt.Id });
                if (trackpants != null) context.OutfitItems.Add(new OutfitItem { OutfitId = femaleOutfit1.Id, ClothingItemId = trackpants.Id });
                if (sneakers != null) context.OutfitItems.Add(new OutfitItem { OutfitId = femaleOutfit1.Id, ClothingItemId = sneakers.Id });

                // Outfit 2: Smart Chic
                var shirt = femaleItems.FirstOrDefault(c => c.CategoryId == 1 && c.Style == "Minimalist");
                var jeans = femaleItems.FirstOrDefault(c => c.CategoryId == 2 && c.Name.Contains("Jeans"));
                var blazer = femaleItems.FirstOrDefault(c => c.CategoryId == 4);
                shirt ??= femaleItems.FirstOrDefault(c => c.CategoryId == 1);
                jeans ??= femaleItems.FirstOrDefault(c => c.CategoryId == 2);
                var sneaker2 = femaleItems.FirstOrDefault(c => c.CategoryId == 5 && c.Id != sneakers?.Id);
                sneaker2 ??= sneakers;

                if (shirt != null) context.OutfitItems.Add(new OutfitItem { OutfitId = femaleOutfit2.Id, ClothingItemId = shirt.Id });
                if (jeans != null) context.OutfitItems.Add(new OutfitItem { OutfitId = femaleOutfit2.Id, ClothingItemId = jeans.Id });
                if (blazer != null) context.OutfitItems.Add(new OutfitItem { OutfitId = femaleOutfit2.Id, ClothingItemId = blazer.Id });
                if (sneaker2 != null) context.OutfitItems.Add(new OutfitItem { OutfitId = femaleOutfit2.Id, ClothingItemId = sneaker2.Id });
                await context.SaveChangesAsync();

                // 7. Reset v├á tß║ío lß║íi bß╗Ö outfit mß║½u cho Demo Nam
                var existingMaleOutfits = await context.Outfits.Where(o => o.UserId == demoMale.Id).ToListAsync();
                if (existingMaleOutfits.Any())
                {
                    var maleOutfitIds = existingMaleOutfits.Select(o => o.Id).ToList();
                    var relatedItems = await context.OutfitItems.Where(oi => maleOutfitIds.Contains(oi.OutfitId)).ToListAsync();
                    context.OutfitItems.RemoveRange(relatedItems);
                    context.Outfits.RemoveRange(existingMaleOutfits);
                    await context.SaveChangesAsync();
                }

                if (!await context.ClothingItems.AnyAsync(c => c.UserId == demoMale.Id))
                {
                    context.ClothingItems.AddRange(GetMaleSeedClothes(demoMale.Id));
                    await context.SaveChangesAsync();
                }

                var maleOutfit1 = new Outfit
                {
                    UserId = demoMale.Id,
                    Name = "Frozen.HN Streetwear - Sweatshirt + Trackpants",
                    Description = "Set ─æß╗ô streetwear H├á Nß╗Öi ─æß╗ënh cao: Sweatshirt navy Frozen.HN phß╗æi trackpants sß╗ìc v├á gi├áy sneaker trß║»ng ─æen - ngß║ºu, chill, ─æ├║ng trend local brand Viß╗çt.",
                    Occasion = "Casual / Dß║ío phß╗æ",
                    Season = "Fall / Winter",
                    IsFavorite = true,
                    CreatedByAi = false,
                    CreatedAt = DateTime.UtcNow
                };
                var maleOutfit2 = new Outfit
                {
                    UserId = demoMale.Id,
                    Name = "Gentleman Smart Casual - S╞í mi + Jeans",
                    Description = "S╞í mi Oxford cß╗ò ─æiß╗ân phß╗æi quß║ºn jeans xanh chuß║⌐n menswear v├á gi├áy sneaker retro - phong c├ích gentleman hiß╗çn ─æß║íi cho c├┤ng sß╗ƒ v├á hß║╣n h├▓.",
                    Occasion = "Work / Date",
                    Season = "AllSeason",
                    IsFavorite = false,
                    CreatedByAi = true,
                    CreatedAt = DateTime.UtcNow
                };
                context.Outfits.Add(maleOutfit1);
                context.Outfits.Add(maleOutfit2);
                await context.SaveChangesAsync();

                var maleItems = await context.ClothingItems.Where(c => c.UserId == demoMale.Id).ToListAsync();
                var mSweatshirt = maleItems.FirstOrDefault(c => c.Name.Contains("Frozen") || c.Name.Contains("Sweatshirt"));
                var mTrackpants = maleItems.FirstOrDefault(c => c.Name.Contains("Track") || c.Name.Contains("Sß╗ìc"));
                var mSneakers = maleItems.FirstOrDefault(c => c.CategoryId == 5 && c.ImageUrl != null && c.ImageUrl.Contains("sneakers_white"));
                mSweatshirt ??= maleItems.FirstOrDefault(c => c.CategoryId == 1);
                mTrackpants ??= maleItems.FirstOrDefault(c => c.CategoryId == 2);
                mSneakers ??= maleItems.FirstOrDefault(c => c.CategoryId == 5);

                if (mSweatshirt != null) context.OutfitItems.Add(new OutfitItem { OutfitId = maleOutfit1.Id, ClothingItemId = mSweatshirt.Id });
                if (mTrackpants != null) context.OutfitItems.Add(new OutfitItem { OutfitId = maleOutfit1.Id, ClothingItemId = mTrackpants.Id });
                if (mSneakers != null) context.OutfitItems.Add(new OutfitItem { OutfitId = maleOutfit1.Id, ClothingItemId = mSneakers.Id });

                var mShirt = maleItems.FirstOrDefault(c => c.CategoryId == 1 && c.Style == "Smart Casual");
                var mJeans = maleItems.FirstOrDefault(c => c.CategoryId == 2 && c.Name.Contains("Jeans"));
                var mBlazer = maleItems.FirstOrDefault(c => c.CategoryId == 4);
                mShirt ??= maleItems.FirstOrDefault(c => c.CategoryId == 1 && c.Id != mSweatshirt?.Id);
                mJeans ??= maleItems.FirstOrDefault(c => c.CategoryId == 2 && c.Id != mTrackpants?.Id);

                if (mShirt != null) context.OutfitItems.Add(new OutfitItem { OutfitId = maleOutfit2.Id, ClothingItemId = mShirt.Id });
                if (mJeans != null) context.OutfitItems.Add(new OutfitItem { OutfitId = maleOutfit2.Id, ClothingItemId = mJeans.Id });
                if (mBlazer != null) context.OutfitItems.Add(new OutfitItem { OutfitId = maleOutfit2.Id, ClothingItemId = mBlazer.Id });
                if (mSneakers != null) context.OutfitItems.Add(new OutfitItem { OutfitId = maleOutfit2.Id, ClothingItemId = mSneakers.Id });
                await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DbSeeder Warning]: {ex.Message}");
            }
        }

        public static List<ClothingItem> GetFemaleSeedClothes(int userId)
        {
            var now = DateTime.UtcNow;
            return new List<ClothingItem>
            {
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1, // Tops
                    Name = "├üo Sweater / Sweatshirt Navy Frozen.HN",
                    Color = "Navy",
                    Style = "Streetwear",
                    Season = "Fall / Winter",
                    Brand = "Frozen.HN",
                    Size = "M",
                    ImageUrl = "assets/clothes/sweatshirt_frozen_navy.png",
                    Description = "├üo sweater nß╗ë b├┤ng French Terry 380gsm d├áy dß║╖n, logo FROZEN.HN th├¬u nß╗òi, form oversize H├á Nß╗Öi streetwear chill nhß║Ñt.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1, // Tops
                    Name = "├üo s╞í mi lß╗Ña trß║»ng Oversized",
                    Color = "Trß║»ng",
                    Style = "Minimalist",
                    Season = "AllSeason",
                    Brand = "Zara",
                    Size = "M",
                    ImageUrl = "assets/clothes/shirt_white.svg",
                    Description = "S╞í mi form rß╗Öng chß║Ñt liß╗çu lß╗Ña satin mß╗Ång nhß║╣, thanh lß╗ïch v├á tho├íng m├ít.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Quß║ºn Trackpants Sß╗ìc ─Éen Viß╗ün Trß║»ng",
                    Color = "─Éen",
                    Style = "Streetwear",
                    Season = "AllSeason",
                    Brand = "Local Brand",
                    Size = "M",
                    ImageUrl = "assets/clothes/trackpants_stripe_black.png",
                    Description = "Quß║ºn thß╗â thao ß╗æng rß╗Öng vß║úi nß╗ë cotton, sß╗ìc viß╗ün trß║»ng 2 b├¬n, d├óy r├║t eo co gi├ún thoß║úi m├íi.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Quß║ºn Jeans ß╗Éng Su├┤ng Vintage Xanh Denim",
                    Color = "Xanh Denim",
                    Style = "Casual",
                    Season = "AllSeason",
                    Brand = "Levis",
                    Size = "27",
                    ImageUrl = "assets/clothes/jeans_blue.svg",
                    Description = "Jeans cß║íp cao ß╗æng su├┤ng che khuyß║┐t ─æiß╗âm, t├┤n d├íng v├á k├⌐o d├ái ch├ón.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1, // Tops
                    Name = "├üo thun Baby Tee Cotton trß║»ng",
                    Color = "Trß║»ng",
                    Style = "Casual",
                    Season = "Summer",
                    Brand = "Uniqlo",
                    Size = "S",
                    ImageUrl = "assets/clothes/tshirt_black.svg",
                    Description = "├üo thun cotton co gi├ún ├┤m d├íng nhß║╣, phong c├ích trß║╗ trung n─âng ─æß╗Öng.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1, // Tops
                    Name = "├üo Len Dß╗çt Kim Cß╗ò V Nude",
                    Color = "Be / Nude",
                    Style = "Quiet Luxury",
                    Season = "Winter",
                    Brand = "Mango",
                    Size = "S",
                    ImageUrl = "assets/clothes/shirt_white.svg",
                    Description = "Chß║Ñt len dß╗çt kim mß╗Ång nhß║╣, cß╗ò chß╗» V t├┤n x╞░╞íng quai xanh quyß║┐n r┼⌐.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Quß║ºn Jeans ß╗Éng Su├┤ng Vintage Xanh Denim",
                    Color = "Xanh Denim",
                    Style = "Casual",
                    Season = "AllSeason",
                    Brand = "Levis",
                    Size = "27",
                    ImageUrl = "assets/clothes/jeans_blue.svg",
                    Description = "Jeans cß║íp cao ß╗æng su├┤ng che khuyß║┐t ─æiß╗âm, t├┤n d├íng v├á k├⌐o d├ái ch├ón.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Quß║ºn T├óy Xß║┐p Ly ─Éen May ─Éo ß╗Éng ─Éß╗⌐ng",
                    Color = "─Éen",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Massimo Dutti",
                    Size = "S",
                    ImageUrl = "assets/clothes/pants_black.svg",
                    Description = "Quß║ºn ├óu xß║┐p ly phß║│ng phiu, chß║Ñt vß║úi wool pha tuyß║┐t m╞░a ─æß╗⌐ng d├íng.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Ch├ón V├íy Chß╗» A Xß║┐p Ly X├ím Kh├│i",
                    Color = "X├ím",
                    Style = "Minimalist",
                    Season = "AllSeason",
                    Brand = "COS",
                    Size = "S",
                    ImageUrl = "assets/clothes/pants_black.svg",
                    Description = "Ch├ón v├íy chß╗» A d├íng lß╗¡ng thanh lß╗ïch phong c├ích Parisian Chic.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 3, // Dresses
                    Name = "─Éß║ºm Lß╗Ña Hai D├óy Maxi D├íng Su├┤ng Champagne",
                    Color = "Champagne",
                    Style = "Elegance",
                    Season = "AllSeason",
                    Brand = "Reformation",
                    Size = "S",
                    ImageUrl = "assets/clothes/dress_silk.svg",
                    Description = "─Éß║ºm lß╗Ña mß╗üm rß╗º ├│ng ß║ú, khoe trß╗ìn v├│c d├íng ngß╗ìc ng├á trong c├íc buß╗òi tiß╗çc.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4, // Outerwear
                    Name = "├üo Blazer N├óu T├óy Relaxed Fit",
                    Color = "N├óu T├óy",
                    Style = "Smart Casual",
                    Season = "Fall",
                    Brand = "Zara",
                    Size = "M",
                    ImageUrl = "assets/clothes/blazer_brown.svg",
                    Description = "Blazer 2 h├áng khuy ─æß╗⌐ng d├íng, m├áu n├óu t├óy sang trß╗ìng dß╗à phß╗æi ─æß╗ô.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4, // Outerwear
                    Name = "├üo Kho├íc Tweed Tiß╗âu Th╞░ Kem ├ünh Kim",
                    Color = "Kem",
                    Style = "Formal",
                    Season = "Winter",
                    Brand = "Chic",
                    Size = "S",
                    ImageUrl = "assets/clothes/blazer_brown.svg",
                    Description = "Chß║Ñt liß╗çu dß║í tweed dß╗çt sß╗úi kim tuyß║┐n nhß║╣, khuy ngß╗ìc trai qu├╜ ph├íi.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5, // Shoes
                    Name = "Gi├áy Sneaker Trß║»ng ─Éen Retro Classic",
                    Color = "Trß║»ng / ─Éen",
                    Style = "Streetwear",
                    Season = "AllSeason",
                    Brand = "Local Brand",
                    Size = "37",
                    ImageUrl = "assets/clothes/sneakers_white_black.png",
                    Description = "Gi├áy sneaker da trß║»ng viß╗ün ─æen retro, ─æß║┐ chunky vintage, phß╗æi vß╗¢i bß║Ñt kß╗│ outfit streetwear hay casual n├áo ─æß╗üu ─æß║╣p.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5, // Shoes
                    Name = "Gi├áy Penny Loafer Da ─Éen",
                    Color = "─Éen",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Charles & Keith",
                    Size = "37",
                    ImageUrl = "assets/clothes/shoes_loafer.svg",
                    Description = "Gi├áy loafer da b├▓ b├│ng g├│t 3cm thanh lß╗ïch, t├┤n d├íng c├┤ng sß╗ƒ.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 6, // Accessories
                    Name = "Túi Da Kẹp Nách Baguette Đen",
                    Color = "Đen",
                    Style = "Minimalist",
                    Season = "AllSeason",
                    Brand = "Pedro",
                    Size = "Freesize",
                    ImageUrl = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
                    Description = "Túi xách da kẹp nách thời thượng, khóa kim loại mạ vàng sang trọng.",
                    CreatedAt = now
                },
                // [THÊM MỚI] Bổ sung 25 items nữ đa dạng hơn
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Croptop Cotton Trắng Basic",
                    Color = "Trắng",
                    Style = "Casual",
                    Season = "Summer",
                    Brand = "Zara",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo croptop cotton mềm mại, form ôm nhẹ, năng động và trẻ trung.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Blouse Lụa Hồng Phấn Cổ V",
                    Color = "Hồng Phấn",
                    Style = "Romantic",
                    Season = "Spring",
                    Brand = "Mango",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80",
                    Description = "Blouse lụa mềm rủ ông áo, cổ chữ V thanh lịch, hoàn hảo cho ngày hẹn hò.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Áo Sailor Kẻ Sọc Navy Trắng",
                    Color = "Navy / Trắng",
                    Style = "Preppy",
                    Season = "Summer",
                    Brand = "Tommy Hilfiger",
                    Size = "M",
                    ImageUrl = "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo thun kẻ sọc sailor cổ điển, phong cách hải quân thanh lịch và đáng yêu.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Bodysuit Đen Cổ Tròn Ôm Dáng",
                    Color = "Đen",
                    Style = "Minimalist",
                    Season = "AllSeason",
                    Brand = "COS",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
                    Description = "Bodysuit đen ôm cơ thể hoàn hảo, không lộ đường viền, phối được với mọi loại quần.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Ribbed Knit Top Kem Cổ Lọ",
                    Color = "Kem",
                    Style = "Quiet Luxury",
                    Season = "Winter",
                    Brand = "Uniqlo",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo len dệt gân sườn cổ lọ ấm áp, chất liệu cao cấp, phong cách tối giản tinh tế.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Culottes Beige Cạp Cao Ống Rộng",
                    Color = "Beige",
                    Style = "Elegant",
                    Season = "Spring",
                    Brand = "& Other Stories",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1594938298603-c8148c4b984b?w=600&auto=format&fit=crop&q=80",
                    Description = "Quần culottes ống rộng cạp cao tôn dáng, màu beige sang trọng dễ phối đồ.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Váy Tennis Trắng Xếp Ly Mini",
                    Color = "Trắng",
                    Style = "Sport Chic",
                    Season = "Summer",
                    Brand = "Lacoste",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80",
                    Description = "Váy tennis ngắn xếp ly, phong cách thể thao năng động, dễ thương và thoải mái.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Váy Midi Floral Hoa Nhí Nền Đen",
                    Color = "Đen / Hoa Nhí",
                    Style = "Romantic",
                    Season = "Spring",
                    Brand = "Zara",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
                    Description = "Váy midi họa tiết hoa nhí nền đen, nhẹ nhàng nữ tính, phong cách vintage cổ điển.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Chân Váy Plissé Tím Lavender",
                    Color = "Tím Lavender",
                    Style = "Romantic",
                    Season = "Spring",
                    Brand = "Reformation",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
                    Description = "Chân váy xếp nếp tím nhạt nhẹ nhàng bay bổng, tôn dáng và đầy nữ tính.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Denim Shorts Rách Nhẹ Cạp Cao",
                    Color = "Xanh Denim",
                    Style = "Casual",
                    Season = "Summer",
                    Brand = "Levis",
                    Size = "27",
                    ImageUrl = "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&auto=format&fit=crop&q=80",
                    Description = "Quần short denim cạp cao rách nhẹ vintage, năng động và cá tính.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 3,
                    Name = "Đầm Cocktail Đen Tay Ngắn Sang Trọng",
                    Color = "Đen",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Massimo Dutti",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&auto=format&fit=crop&q=80",
                    Description = "Đầm cocktail đen cổ điển tay ngắn, form ôm dáng, hoàn hảo cho tiệc tối.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 3,
                    Name = "Đầm Maxi Trắng Dự Tiệc Biển",
                    Color = "Trắng",
                    Style = "Elegance",
                    Season = "Summer",
                    Brand = "Reformation",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
                    Description = "Đầm maxi dài trắng tinh khôi nhẹ nhàng bay, sang trọng cho mọi dịp đặc biệt.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 3,
                    Name = "Slip Dress Satin Xanh Ánh Bạc Midi",
                    Color = "Xanh Ánh Bạc",
                    Style = "Glamour",
                    Season = "AllSeason",
                    Brand = "H&M Premium",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
                    Description = "Đầm slip satin ánh metallic bắt sáng tuyệt đẹp, hoàn hảo cho sự kiện đặc biệt.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 3,
                    Name = "Mini Dress Hoa Nhỏ Cổ Vuông",
                    Color = "Đỏ / Hoa Nhí",
                    Style = "Romantic",
                    Season = "Summer",
                    Brand = "ASOS",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
                    Description = "Váy mini ngắn cổ vuông hoa nhỏ nền đỏ, trẻ trung và đáng yêu cho ngày hè.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4,
                    Name = "Cardigan Len Kem Cúc Ngọc Trai",
                    Color = "Kem",
                    Style = "Quiet Luxury",
                    Season = "Winter",
                    Brand = "Mango",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo cardigan len mềm mịn màu kem, cúc ngọc trai tinh tế, ấm áp và sang trọng.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4,
                    Name = "Blazer Camel Tôn Dáng Relaxed Fit",
                    Color = "Camel",
                    Style = "Smart Casual",
                    Season = "Fall",
                    Brand = "Zara",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
                    Description = "Blazer màu camel đặc trưng Old Money, phối với jeans hay váy đều chuẩn.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4,
                    Name = "Teddy Coat Hồng Bơ Ấm Áp",
                    Color = "Hồng Bơ",
                    Style = "Y2K",
                    Season = "Winter",
                    Brand = "Topshop",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo khoác lông teddy gấu bông hồng bơ siêu ấm và cute, phong cách Y2K.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4,
                    Name = "Denim Jacket Nữ Wash Cổ Điển",
                    Color = "Xanh Denim",
                    Style = "Casual",
                    Season = "Spring",
                    Brand = "Levis",
                    Size = "S",
                    ImageUrl = "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo khoác jeans wash cổ điển dáng rộng, phối đồ cực dễ cho mọi hoàn cảnh.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5,
                    Name = "Mules Da Nâu Clatform Gót Vuông",
                    Color = "Nâu",
                    Style = "Elegant",
                    Season = "AllSeason",
                    Brand = "Charles & Keith",
                    Size = "37",
                    ImageUrl = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    Description = "Giày mules da nâu gót vuông thanh lịch, tôn dáng và thoải mái cả ngày.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5,
                    Name = "Ankle Boots Da Đen Gót Thấp",
                    Color = "Đen",
                    Style = "Smart Casual",
                    Season = "Winter",
                    Brand = "Steve Madden",
                    Size = "37",
                    ImageUrl = "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80",
                    Description = "Boots cổ ngắn da đen gót thấp bền đẹp, phối được với quần tây hay váy midi.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5,
                    Name = "Kitten Heels Nude Mũi Nhọn",
                    Color = "Nude",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Aldo",
                    Size = "37",
                    ImageUrl = "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop&q=80",
                    Description = "Giày cao gót nhỏ màu nude mũi nhọn tinh tế, kéo dài chân và phù hợp công sở.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5,
                    Name = "Sandal Quai Dây Vàng Thời Thượng",
                    Color = "Vàng Kim",
                    Style = "Glamour",
                    Season = "Summer",
                    Brand = "Aldo",
                    Size = "37",
                    ImageUrl = "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=600&auto=format&fit=crop&q=80",
                    Description = "Sandal quai mảnh màu vàng kim lấp lánh, hoàn hảo cho tiệc hè và dã ngoại.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 6,
                    Name = "Túi Tote Canvas Chữ In Hàng Ngày",
                    Color = "Kem / Đen",
                    Style = "Casual",
                    Season = "AllSeason",
                    Brand = "COS",
                    Size = "Freesize",
                    ImageUrl = "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
                    Description = "Túi tote vải canvas in chữ đơn giản, đựng được nhiều đồ cho ngày bận rộn.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 6,
                    Name = "Thắt Lưng Da Nâu Bạc Khóa Chữ Nhật",
                    Color = "Nâu",
                    Style = "Minimalist",
                    Season = "AllSeason",
                    Brand = "Pedro",
                    Size = "Freesize",
                    ImageUrl = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
                    Description = "Thắt lưng da bò thật màu nâu khóa bạc tối giản, hoàn thiện mọi outfit.",
                    CreatedAt = now
                }
            };
        }

        public static List<ClothingItem> GetMaleSeedClothes(int userId)
        {
            var now = DateTime.UtcNow;
            return new List<ClothingItem>
            {
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1, // Tops
                    Name = "├üo Sweater / Sweatshirt Navy Frozen.HN Nam",
                    Color = "Navy",
                    Style = "Streetwear",
                    Season = "Fall / Winter",
                    Brand = "Frozen.HN",
                    Size = "L",
                    ImageUrl = "assets/clothes/sweatshirt_frozen_navy.png",
                    Description = "├üo sweater cotton nß╗ë b├┤ng French Terry 380gsm d├áy dß║╖n, logo FROZEN.HN th├¬u nß╗òi, form oversize t├┤n d├íng bß╗¥ vai nam.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1, // Tops
                    Name = "├üo s╞í mi Oxford trß║»ng Classic",
                    Color = "Trß║»ng",
                    Style = "Smart Casual",
                    Season = "AllSeason",
                    Brand = "Uniqlo",
                    Size = "L",
                    ImageUrl = "assets/clothes/shirt_white.svg",
                    Description = "S╞í mi Oxford dß╗çt sß╗úi ─æ├┤i d├áy dß║╖n ─æß╗⌐ng form, cß╗ò button-down lß╗ïch l├úm nam t├¡nh.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1, // Tops
                    Name = "├üo thun Cotton ─æen Form Boxy Fit 250gsm",
                    Color = "─Éen",
                    Style = "Streetwear",
                    Season = "Summer",
                    Brand = "Zara Man",
                    Size = "L",
                    ImageUrl = "assets/clothes/tshirt_black.svg",
                    Description = "Cotton 100% 250gsm d├áy dß║╖n, ─æß╗⌐ng form chuß║⌐n streetwear hiß╗çn ─æß║íi phong ─æß╗Ö.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1, // Tops
                    Name = "├üo Len Dß╗çt Kim Cß╗ò Tr├▓n Be Melange",
                    Color = "Be",
                    Style = "Quiet Luxury",
                    Season = "Winter",
                    Brand = "Massimo Dutti",
                    Size = "L",
                    ImageUrl = "assets/clothes/shirt_white.svg",
                    Description = "Len dß╗çt kim mß╗üm mß╗ïn ß║Ñm ├íp, t├┤n bß╗¥ vai nam t├¡nh dß╗à phß╗æi vß╗¢i mß╗ìi trang phß╗Ñc.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Quß║ºn Jeans ß╗Éng Su├┤ng Vintage Xanh Denim",
                    Color = "Xanh Denim",
                    Style = "Casual",
                    Season = "AllSeason",
                    Brand = "Levis",
                    Size = "32",
                    ImageUrl = "assets/clothes/jeans_blue.svg",
                    Description = "Jeans wash retro cß╗ò ─æiß╗ân, form su├┤ng ─æß╗⌐ng ph├│ng kho├íng v├á thoß║úi m├íi vß║¡n ─æß╗Öng.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Quß║ºn Trackpants Sß╗ìc ─Éen Viß╗ün Trß║»ng Nam",
                    Color = "─Éen",
                    Style = "Streetwear",
                    Season = "AllSeason",
                    Brand = "Local Brand",
                    Size = "L",
                    ImageUrl = "assets/clothes/trackpants_stripe_black.png",
                    Description = "Quß║ºn thß╗â thao ß╗æng rß╗Öng cotton nß╗ë d├áy, sß╗ìc viß╗ün 2 b├¬n nam t├¡nh, d├óy r├║t l╞░ng co gi├ún dß╗à chß╗ïu.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Quß║ºn T├óy Xß║┐p Ly ─Éen May ─Éo ß╗Éng ─Éß╗⌐ng",
                    Color = "─Éen",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Tailored",
                    Size = "32",
                    ImageUrl = "assets/clothes/pants_black.svg",
                    Description = "Quß║ºn ├óu may ─æo phß║│ng phiu, chß║Ñt vß║úi wool pha tuyß║┐t m╞░a ─æß╗⌐ng d├íng nam t├¡nh.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2, // Bottoms
                    Name = "Quß║ºn Chino Kaki Be C├ít D├íng Slim-Straight",
                    Color = "Be",
                    Style = "Smart Casual",
                    Season = "AllSeason",
                    Brand = "Gap",
                    Size = "32",
                    ImageUrl = "assets/clothes/pants_black.svg",
                    Description = "Quß║ºn kaki co gi├ún nhß║╣, t├┤ng m├áu be s├íng trß║╗ trung lß╗ïch sß╗▒ cho c├┤ng sß╗ƒ v├á dß║ío phß╗æ.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4, // Outerwear
                    Name = "├üo Blazer Nam N├óu T├óy Relaxed Fit",
                    Color = "N├óu",
                    Style = "Formal",
                    Season = "Fall",
                    Brand = "Zara Man",
                    Size = "L",
                    ImageUrl = "assets/clothes/blazer_brown.svg",
                    Description = "Blazer nam vai ─æß╗çm vß╗½a phß║úi, ve ├ío notch lapel thanh lß╗ïch chuß║⌐n so├íi ca.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4, // Outerwear
                    Name = "├üo Kho├íc Bomber Kaki Tß╗æi Giß║ún",
                    Color = "─Éen",
                    Style = "Streetwear",
                    Season = "AllSeason",
                    Brand = "Alpha Industries",
                    Size = "L",
                    ImageUrl = "assets/clothes/blazer_brown.svg",
                    Description = "├üo kho├íc bomber bo gß║Ñu n─âng ─æß╗Öng, chß║Ñt vß║úi tr╞░ß╗út n╞░ß╗¢c bß║úo vß╗ç tß╗æi ─æa.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5, // Shoes
                    Name = "Gi├áy Sneaker Trß║»ng ─Éen Retro Classic Nam",
                    Color = "Trß║»ng / ─Éen",
                    Style = "Streetwear",
                    Season = "AllSeason",
                    Brand = "Local Brand",
                    Size = "42",
                    ImageUrl = "assets/clothes/sneakers_white_black.png",
                    Description = "Gi├áy sneaker da trß║»ng viß╗ün ─æen retro classic, ─æß║┐ chunky vintage ─æß╗⌐ng ch├ón, phß╗æi streetwear hay smart casual ─æß╗üu ß╗òn.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5, // Shoes
                    Name = "Gi├áy Penny Loafer Da B├▓ ─Éen Nam T├¡nh",
                    Color = "─Éen",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Dr. Martens",
                    Size = "42",
                    ImageUrl = "assets/clothes/shoes_loafer.svg",
                    Description = "Gi├áy da b├▓ m┼⌐i tr├▓n cß╗ò ─æiß╗ân, ─æß║┐ ├¬m ├íi t├┤n phong th├íi tß╗▒ tin th├ánh ─æß║ít.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 6, // Accessories
                    Name = "Túi Da Đeo Chéo Messenger Nam Tối Giản",
                    Color = "Nâu Đất",
                    Style = "Minimalist",
                    Season = "AllSeason",
                    Brand = "Coach",
                    Size = "Freesize",
                    ImageUrl = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
                    Description = "Túi messenger da bò dáng chữ nhật gọn gàng, đựng vừa iPad và phụ kiện công sở.",
                    CreatedAt = now
                },
                // [THÊM MỚI] Bổ sung 20 items nam đa dạng hơn
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Áo Polo Cotton Trắng Pique",
                    Color = "Trắng",
                    Style = "Smart Casual",
                    Season = "Summer",
                    Brand = "Lacoste",
                    Size = "L",
                    ImageUrl = "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo thun có cổ polo dệt pique thoáng mát, dáng regular fit lịch sự tôn vai.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Áo Len Cổ Lọ Turtleneck Đen",
                    Color = "Đen",
                    Style = "Quiet Luxury",
                    Season = "Winter",
                    Brand = "Massimo Dutti",
                    Size = "L",
                    ImageUrl = "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo len dệt kim mỏng nhẹ cổ lọ đen, phong cách tổng tài Hàn Quốc sang trọng.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Áo Henley Xám Melange Dài Tay",
                    Color = "Xám",
                    Style = "Casual",
                    Season = "Fall",
                    Brand = "Uniqlo",
                    Size = "L",
                    ImageUrl = "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo thun dài tay cổ cài cúc Henley khỏe khoắn, nam tính và tôn ngực.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 1,
                    Name = "Áo Thun Oversize Đồ Họa Vintage Xám",
                    Color = "Xám Tiêu",
                    Style = "Streetwear",
                    Season = "Summer",
                    Brand = "Local Brand",
                    Size = "XL",
                    ImageUrl = "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo thun form rộng graphic tee phong cách đường phố hiphop trẻ trung.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Quần Kaki Chino Slim Olive Xanh Rêu",
                    Color = "Xanh Rêu",
                    Style = "Smart Casual",
                    Season = "AllSeason",
                    Brand = "Gap",
                    Size = "32",
                    ImageUrl = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80",
                    Description = "Quần chino vải kaki cotton co giãn màu rêu nhã nhặn, đứng form và năng động.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Quần Jogger Nỉ Xám Melange Bo Gấu",
                    Color = "Xám",
                    Style = "Streetwear",
                    Season = "Winter",
                    Brand = "Nike",
                    Size = "L",
                    ImageUrl = "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80",
                    Description = "Quần jogger nỉ thể thao bo gấu ống, cạp chun thoải mái cho tập luyện hoặc dạo phố.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Quần Short Kaki Cargo Túi Hộp Be",
                    Color = "Be",
                    Style = "Casual",
                    Season = "Summer",
                    Brand = "Zara Man",
                    Size = "32",
                    ImageUrl = "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&auto=format&fit=crop&q=80",
                    Description = "Quần ngố short túi hộp phong cách dã ngoại outdoor thoải mái và phóng khoáng.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 2,
                    Name = "Quần Jeans Đen Slim Tối Giản",
                    Color = "Đen",
                    Style = "Casual",
                    Season = "AllSeason",
                    Brand = "Levis",
                    Size = "32",
                    ImageUrl = "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80",
                    Description = "Jeans đen tuyền dáng ôm vừa phải, dễ phối với áo thun trắng hay blazer.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4,
                    Name = "Bộ Suit Tuxedo Navy Dạ Hội",
                    Color = "Xanh Navy",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Tailored Luxury",
                    Size = "L",
                    ImageUrl = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
                    Description = "Bộ âu phục suit màu xanh navy sang trọng, ve nhung bóng chuẩn tiệc cưới và gala.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4,
                    Name = "Áo Khoác Da Biker Đen Men Lì",
                    Color = "Đen",
                    Style = "Streetwear",
                    Season = "Winter",
                    Brand = "AllSaints",
                    Size = "L",
                    ImageUrl = "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo da thật phong cách biker khóa kéo chéo ngực, cực kỳ nam tính và bụi bặm.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4,
                    Name = "Áo Hoodie Zip Nỉ Xám Melange",
                    Color = "Xám",
                    Style = "Streetwear",
                    Season = "Fall / Winter",
                    Brand = "Champion",
                    Size = "L",
                    ImageUrl = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
                    Description = "Hoodie nỉ khóa zip kéo tiện lợi, có nón ấm áp, chuẩn thời trang đại học.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 4,
                    Name = "Áo Khoác Kaki Trench Coat Dáng Dài Be",
                    Color = "Be",
                    Style = "Quiet Luxury",
                    Season = "Winter",
                    Brand = "Burberry Style",
                    Size = "L",
                    ImageUrl = "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
                    Description = "Áo măng tô kaki dáng dài hai hàng cúc cổ điển, tôn chiều cao vượt trội.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5,
                    Name = "Giày Tây Oxford Da Bò Nâu Classic",
                    Color = "Nâu Bò",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Clarks",
                    Size = "42",
                    ImageUrl = "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80",
                    Description = "Giày tây buộc dây da bò cao cấp đánh xi nâu chuyển màu patina quý phái.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5,
                    Name = "Chelsea Boots Da Lộn Nâu Cát",
                    Color = "Nâu Cát",
                    Style = "Smart Casual",
                    Season = "Winter",
                    Brand = "ASOS",
                    Size = "42",
                    ImageUrl = "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80",
                    Description = "Boots da lộn cổ chun tiện lợi, phối tuyệt đẹp cùng quần jeans skinny hoặc chinos.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 5,
                    Name = "Giày Lười Slip-on Trắng Tối Giản",
                    Color = "Trắng",
                    Style = "Casual",
                    Season = "Summer",
                    Brand = "Vans",
                    Size = "42",
                    ImageUrl = "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
                    Description = "Giày lười vải canvas trắng tiện dụng, êm chân và dễ đi hàng ngày.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 6,
                    Name = "Thắt Lưng Da Bò Đen Khóa Kim Kim Loại",
                    Color = "Đen",
                    Style = "Formal",
                    Season = "AllSeason",
                    Brand = "Montblanc Style",
                    Size = "Freesize",
                    ImageUrl = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
                    Description = "Thắt lưng da công sở khóa kim thép không gỉ bóng loáng chuẩn chỉnh.",
                    CreatedAt = now
                },
                new ClothingItem
                {
                    UserId = userId,
                    CategoryId = 6,
                    Name = "Mũ Lưỡi Trai Classic Baseball Cap Đen",
                    Color = "Đen",
                    Style = "Streetwear",
                    Season = "AllSeason",
                    Brand = "New Era",
                    Size = "Freesize",
                    ImageUrl = "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80",
                    Description = "Mũ lưỡi trai phong cách bóng chày tối giản, phối đồ streetwear năng động.",
                    CreatedAt = now
                }
            };
        }
    }
}