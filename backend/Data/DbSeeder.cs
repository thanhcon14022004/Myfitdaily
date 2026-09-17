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

                // 2. Tß║ío Demo User Nß╗» (demo@myfitdaily.com)
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
                    Name = "T├║i Da Kß║╣p N├ích Baguette ─Éen",
                    Color = "─Éen",
                    Style = "Minimalist",
                    Season = "AllSeason",
                    Brand = "Pedro",
                    Size = "Freesize",
                    ImageUrl = "assets/clothes/bag_leather.svg",
                    Description = "T├║i x├ích da kß║╣p n├ích thß╗¥i th╞░ß╗úng, kh├│a kim loß║íi mß║í v├áng sang trß╗ìng.",
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
                    Name = "T├║i Da ─Éeo Ch├⌐o Messenger Nam Tß╗æi Giß║ún",
                    Color = "N├óu ─Éß║Ñt",
                    Style = "Minimalist",
                    Season = "AllSeason",
                    Brand = "Coach",
                    Size = "Freesize",
                    ImageUrl = "assets/clothes/bag_leather.svg",
                    Description = "T├║i messenger da b├▓ d├íng chß╗» nhß║¡t gß╗ìn g├áng, ─æß╗▒ng vß╗½a iPad, v├¡ tiß╗ün v├á phß╗Ñ kiß╗çn c├┤ng nghß╗ç.",
                    CreatedAt = now
                }
            };
        }
    }
}