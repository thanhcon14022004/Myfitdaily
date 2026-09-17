using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MYFITDAILY_EXE201_Group6.Common;
using MYFITDAILY_EXE201_Group6.Data;
using MYFITDAILY_EXE201_Group6.DTOs.Clothing;
using MYFITDAILY_EXE201_Group6.Entities;

namespace MYFITDAILY_EXE201_Group6.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClothesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClothesController(ApplicationDbContext context)
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
        /// Lß║Ñy to├án bß╗Ö danh s├ích quß║ºn ├ío trong tß╗º ─æß╗ô cß╗ºa ng╞░ß╗¥i d├╣ng hiß╗çn tß║íi
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMyClothes()
        {
            try
            {
                var userId = GetCurrentUserId();

                // Nß║┐u ng╞░ß╗¥i d├╣ng ch╞░a ─æ─âng nhß║¡p, trß║ú vß╗ü danh s├ích quß║ºn ├ío cß╗ºa t├ái khoß║ún Demo
                if (!userId.HasValue)
                {
                    var demoUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == "demo@myfitdaily.com")
                                   ?? await _context.Users.FirstOrDefaultAsync();
                    if (demoUser != null)
                    {
                        userId = demoUser.Id;
                    }
                }

                var user = userId.HasValue ? await _context.Users.FindAsync(userId.Value) : null;
                bool isMale = user != null && (
                    string.Equals(user.Gender, "Nam", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(user.Gender, "Male", StringComparison.OrdinalIgnoreCase) ||
                    (user.Gender != null && user.Gender.ToLower().Contains("nam"))
                );

                // Nß║┐u t├ái khoß║ún ch╞░a c├│ m├│n ─æß╗ô n├áo, tß╗▒ ─æß╗Öng nß║íp bß╗Ö s╞░u tß║¡p ─æß╗ô mß║½u theo giß╗¢i t├¡nh v├áo database
                if (userId.HasValue && !await _context.ClothingItems.AnyAsync(c => c.UserId == userId.Value))
                {
                    var seedList = isMale ? DbSeeder.GetMaleSeedClothes(userId.Value) : DbSeeder.GetFemaleSeedClothes(userId.Value);
                    _context.ClothingItems.AddRange(seedList);
                    await _context.SaveChangesAsync();
                }

                var query = _context.ClothingItems
                    .Include(c => c.Category)
                    .Where(c => c.UserId == (userId ?? 0));

                // Nß║┐u ng╞░ß╗¥i d├╣ng l├á Nam, lß╗ìc bß╗Å ho├án to├án c├íc loß║íi trang phß╗Ñc phß╗Ñ nß╗» (─Éß║ºm, Ch├ón v├íy, v.v.)
                if (isMale)
                {
                    query = query.Where(c => 
                        c.CategoryId != 3 &&
                        !c.Name.ToLower().Contains("v├íy") &&
                        !c.Name.ToLower().Contains("─æß║ºm") &&
                        !c.Name.ToLower().Contains("croptop") &&
                        !c.Name.ToLower().Contains("tiß╗âu th╞░") &&
                        !c.Name.ToLower().Contains("cao g├│t") &&
                        !c.Name.ToLower().Contains("ch├ón v├íy") &&
                        !c.Name.ToLower().Contains("dress") &&
                        !c.Name.ToLower().Contains("skirt") &&
                        !c.Name.ToLower().Contains("heels")
                    );
                }

                var items = await query
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new ClothingItemDto
                    {
                        Id = c.Id,
                        UserId = c.UserId,
                        CategoryId = c.CategoryId,
                        CategoryName = c.Category != null ? c.Category.Name : "Tops",
                        Name = c.Name,
                        Color = c.Color,
                        Style = c.Style,
                        Season = c.Season,
                        ImageUrl = c.ImageUrl,
                        Description = c.Description,
                        Brand = c.Brand,
                        Size = c.Size,
                        CreatedAt = c.CreatedAt
                    })
                    .ToListAsync();

                return Ok(ApiResponse<List<ClothingItemDto>>.Ok(items, "Lß║Ñy danh s├ích tß╗º ─æß╗ô th├ánh c├┤ng"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ClothesController DB Warning]: {ex.Message}. Trß║ú vß╗ü tß╗º ─æß╗ô mß║½u in-memory.");
                var userClaimId = GetCurrentUserId() ?? 2;
                var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "";
                bool isMale = !emailClaim.ToLower().Contains("demo");
                var fallbackSeed = isMale ? DbSeeder.GetMaleSeedClothes(userClaimId) : DbSeeder.GetFemaleSeedClothes(userClaimId);
                var dtoList = fallbackSeed.Select(c => new ClothingItemDto
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    CategoryId = c.CategoryId,
                    CategoryName = c.CategoryId == 1 ? "Tops" : (c.CategoryId == 2 ? "Bottoms" : (c.CategoryId == 4 ? "Shoes" : "Accessories")),
                    Name = c.Name,
                    Color = c.Color,
                    Style = c.Style,
                    Season = c.Season,
                    ImageUrl = c.ImageUrl,
                    Description = c.Description,
                    Brand = c.Brand,
                    Size = c.Size,
                    CreatedAt = c.CreatedAt
                }).ToList();

                return Ok(ApiResponse<List<ClothingItemDto>>.Ok(dtoList, "Lß║Ñy danh s├ích tß╗º ─æß╗ô th├ánh c├┤ng (Chß║┐ ─æß╗Ö t╞░╞íng th├¡ch offline)"));
            }
        }

        /// <summary>
        /// Th├¬m mß╗Öt m├│n ─æß╗ô mß╗¢i v├áo tß╗º ─æß╗ô cß╗ºa ng╞░ß╗¥i d├╣ng
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddClothingItem([FromBody] CreateClothingItemDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            // Nß║┐u ch╞░a ─æ─âng nhß║¡p, sß╗¡ dß╗Ñng t├ái khoß║ún mß║½u hoß║╖c y├¬u cß║ºu ─æ─âng nhß║¡p
            int finalUserId;
            if (userId.HasValue)
            {
                finalUserId = userId.Value;
            }
            else
            {
                // T├¼m hoß║╖c tß║ío t├ái khoß║ún mß║╖c ─æß╗ïnh cho kh├ích trß║úi nghiß╗çm
                var firstUser = await _context.Users.FirstOrDefaultAsync();
                if (firstUser != null)
                {
                    finalUserId = firstUser.Id;
                }
                else
                {
                    return Unauthorized(ApiResponse<object>.Fail("Vui l├▓ng ─æ─âng nhß║¡p ─æß╗â l╞░u m├│n ─æß╗ô v├áo tß╗º ─æß╗ô cß╗ºa bß║ín"));
                }
            }

            // Kiß╗âm tra danh mß╗Ñc hß╗úp lß╗ç
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
            {
                return BadRequest(ApiResponse<object>.Fail("Danh mß╗Ñc kh├┤ng tß╗ôn tß║íi"));
            }

            var newItem = new ClothingItem
            {
                UserId = finalUserId,
                CategoryId = request.CategoryId,
                Name = request.Name.Trim(),
                Color = request.Color.Trim(),
                Style = request.Style.Trim(),
                Season = request.Season.Trim(),
                ImageUrl = request.ImageUrl.Trim(),
                Description = request.Description?.Trim(),
                Brand = request.Brand?.Trim(),
                Size = request.Size?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.ClothingItems.Add(newItem);
            await _context.SaveChangesAsync();

            var responseDto = new ClothingItemDto
            {
                Id = newItem.Id,
                UserId = newItem.UserId,
                CategoryId = newItem.CategoryId,
                CategoryName = category.Name,
                Name = newItem.Name,
                Color = newItem.Color,
                Style = newItem.Style,
                Season = newItem.Season,
                ImageUrl = newItem.ImageUrl,
                Description = newItem.Description,
                Brand = newItem.Brand,
                Size = newItem.Size,
                CreatedAt = newItem.CreatedAt
            };

            return Ok(ApiResponse<ClothingItemDto>.Ok(responseDto, "─É├ú th├¬m m├│n ─æß╗ô mß╗¢i v├áo tß╗º ─æß╗ô th├ánh c├┤ng"));
        }

        /// <summary>
        /// Th├¬m ─æß╗ông loß║ít nhiß╗üu m├│n ─æß╗ô v├áo tß╗º ─æß╗ô (sau khi qu├⌐t AI OOTD)
        /// </summary>
        [HttpPost("batch-create")]
        public async Task<IActionResult> BatchAddClothingItems([FromBody] BatchCreateClothingItemDto request)
        {
            if (!ModelState.IsValid || request.Items == null || request.Items.Count == 0)
            {
                return BadRequest(ApiResponse<object>.Fail("Danh s├ích m├│n ─æß╗ô kh├┤ng ─æ╞░ß╗úc ─æß╗â trß╗æng"));
            }

            var userId = GetCurrentUserId();
            int finalUserId;
            if (userId.HasValue)
            {
                finalUserId = userId.Value;
            }
            else
            {
                var firstUser = await _context.Users.FirstOrDefaultAsync();
                if (firstUser != null)
                {
                    finalUserId = firstUser.Id;
                }
                else
                {
                    return Unauthorized(ApiResponse<object>.Fail("Vui l├▓ng ─æ─âng nhß║¡p ─æß╗â l╞░u m├│n ─æß╗ô v├áo tß╗º ─æß╗ô cß╗ºa bß║ín"));
                }
            }

            var categories = await _context.Categories.ToDictionaryAsync(c => c.Id, c => c.Name);
            var addedItems = new List<ClothingItemDto>();

            foreach (var itemDto in request.Items)
            {
                if (string.IsNullOrWhiteSpace(itemDto.Name)) continue;

                var categoryId = categories.ContainsKey(itemDto.CategoryId) ? itemDto.CategoryId : 1;
                var newItem = new ClothingItem
                {
                    UserId = finalUserId,
                    CategoryId = categoryId,
                    Name = itemDto.Name.Trim(),
                    Color = (itemDto.Color ?? "Trß║»ng").Trim(),
                    Style = (itemDto.Style ?? "Casual").Trim(),
                    Season = (itemDto.Season ?? "AllSeason").Trim(),
                    ImageUrl = (itemDto.ImageUrl ?? "assets/clothes/shirt_white.svg").Trim(),
                    Description = itemDto.Description?.Trim(),
                    Brand = itemDto.Brand?.Trim(),
                    Size = itemDto.Size?.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.ClothingItems.Add(newItem);
                await _context.SaveChangesAsync();

                addedItems.Add(new ClothingItemDto
                {
                    Id = newItem.Id,
                    UserId = newItem.UserId,
                    CategoryId = newItem.CategoryId,
                    CategoryName = categories.GetValueOrDefault(categoryId, "Tops"),
                    Name = newItem.Name,
                    Color = newItem.Color,
                    Style = newItem.Style,
                    Season = newItem.Season,
                    ImageUrl = newItem.ImageUrl,
                    Description = newItem.Description,
                    Brand = newItem.Brand,
                    Size = newItem.Size,
                    CreatedAt = newItem.CreatedAt
                });
            }

            return Ok(ApiResponse<List<ClothingItemDto>>.Ok(addedItems, $"─É├ú th├¬m th├ánh c├┤ng {addedItems.Count} m├│n ─æß╗ô v├áo tß╗º ─æß╗ô cß╗ºa bß║ín!"));
        }

        /// <summary>
        /// X├│a mß╗Öt m├│n ─æß╗ô khß╗Åi tß╗º ─æß╗ô cß╗ºa ng╞░ß╗¥i d├╣ng
        /// </summary>
        /// <summary>
        /// X├│a mß╗Öt m├│n ─æß╗ô khß╗Åi tß╗º ─æß╗ô cß╗ºa ng╞░ß╗¥i d├╣ng
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClothingItem(int id)
        {
            var userId = GetCurrentUserId();

            var item = await _context.ClothingItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(ApiResponse<object>.Fail("Kh├┤ng t├¼m thß║Ñy m├│n ─æß╗ô cß║ºn x├│a"));
            }

            // Nß║┐u c├│ userId, kiß╗âm tra quyß╗ün sß╗ƒ hß╗»u
            if (userId.HasValue && item.UserId != userId.Value)
            {
                return Forbid();
            }

            // X├│a c├íc bß║ún ghi OutfitItem li├¬n quan ─æß╗â tr├ính lß╗ùi kh├│a ngoß║íi Restrict
            var relatedOutfitItems = await _context.OutfitItems
                .Where(oi => oi.ClothingItemId == id)
                .ToListAsync();
            if (relatedOutfitItems.Any())
            {
                _context.OutfitItems.RemoveRange(relatedOutfitItems);
            }

            _context.ClothingItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<bool>.Ok(true, "─É├ú x├│a m├│n ─æß╗ô khß╗Åi tß╗º ─æß╗ô th├ánh c├┤ng"));
        }

        /// <summary>
        /// X├│a h├áng loß║ít nhiß╗üu m├│n ─æß╗ô khß╗Åi tß╗º ─æß╗ô
        /// </summary>
        [HttpPost("bulk-delete")]
        public async Task<IActionResult> BulkDeleteClothingItems([FromBody] List<int> ids)
        {
            var userId = GetCurrentUserId();

            if (ids == null || !ids.Any())
            {
                return BadRequest(ApiResponse<object>.Fail("Danh s├ích ID m├│n ─æß╗ô cß║ºn x├│a kh├┤ng hß╗úp lß╗ç"));
            }

            var items = await _context.ClothingItems
                .Where(c => ids.Contains(c.Id) && (!userId.HasValue || c.UserId == userId.Value))
                .ToListAsync();

            if (!items.Any())
            {
                return NotFound(ApiResponse<object>.Fail("Kh├┤ng t├¼m thß║Ñy m├│n ─æß╗ô n├áo ph├╣ hß╗úp ─æß╗â x├│a"));
            }

            var itemIds = items.Select(i => i.Id).ToList();

            // X├│a c├íc li├¬n kß║┐t OutfitItem tr╞░ß╗¢c
            var relatedOutfitItems = await _context.OutfitItems
                .Where(oi => itemIds.Contains(oi.ClothingItemId))
                .ToListAsync();
            if (relatedOutfitItems.Any())
            {
                _context.OutfitItems.RemoveRange(relatedOutfitItems);
            }

            _context.ClothingItems.RemoveRange(items);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<int>.Ok(items.Count, $"─É├ú x├│a {items.Count} m├│n ─æß╗ô khß╗Åi tß╗º ─æß╗ô th├ánh c├┤ng"));
        }

        /// <summary>
        /// Lß║Ñy danh s├ích c├íc danh mß╗Ñc quß║ºn ├ío (hß╗ù trß╗ú lß╗ìc theo giß╗¢i t├¡nh ng╞░ß╗¥i d├╣ng)
        /// </summary>
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories([FromQuery] string? gender = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                bool isMale = false;

                if (userId.HasValue)
                {
                    var user = await _context.Users.FindAsync(userId.Value);
                    if (user != null && (
                        string.Equals(user.Gender, "Nam", StringComparison.OrdinalIgnoreCase) ||
                        string.Equals(user.Gender, "Male", StringComparison.OrdinalIgnoreCase) ||
                        (user.Gender != null && user.Gender.ToLower().Contains("nam"))
                    ))
                    {
                        isMale = true;
                    }
                }

                if (!isMale && !string.IsNullOrWhiteSpace(gender))
                {
                    isMale = string.Equals(gender, "Nam", StringComparison.OrdinalIgnoreCase) ||
                             string.Equals(gender, "Male", StringComparison.OrdinalIgnoreCase) ||
                             gender.ToLower().Contains("nam");
                }

                var query = _context.Categories.Where(c => c.IsActive);
                if (isMale)
                {
                    query = query.Where(c => c.Id != 3);
                }

                var categories = await query
                    .OrderBy(c => c.DisplayOrder)
                    .ToListAsync();

                if (isMale)
                {
                    foreach (var cat in categories)
                    {
                        if (cat.Id == 2)
                        {
                            cat.Description = "Quß║ºn jeans, quß║ºn t├óy, quß║ºn short, quß║ºn kaki nam";
                        }
                    }
                }

                return Ok(ApiResponse<List<Category>>.Ok(categories, "Lß║Ñy danh mß╗Ñc th├ánh c├┤ng"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Categories DB Warning]: {ex.Message}. Trß║ú vß╗ü danh mß╗Ñc mß║½u.");
                var isMale = (gender ?? "").ToLower().Contains("nam");
                var fallbackCategories = new List<Category>
                {
                    new Category { Id = 1, Name = "Tops", Description = "├üo thun, ├ío s╞í mi, ├ío len, ├ío kho├íc", DisplayOrder = 1, IsActive = true },
                    new Category { Id = 2, Name = "Bottoms", Description = isMale ? "Quß║ºn jeans, quß║ºn t├óy, quß║ºn short, quß║ºn kaki nam" : "Quß║ºn jeans, quß║ºn t├óy, ch├ón v├íy", DisplayOrder = 2, IsActive = true },
                    new Category { Id = 4, Name = "Shoes", Description = "Gi├áy sneaker, gi├áy da, sandal, boots", DisplayOrder = 4, IsActive = true },
                    new Category { Id = 5, Name = "Accessories", Description = "T├║i x├ích, thß║»t l╞░ng, m┼⌐, k├¡nh mß║»t", DisplayOrder = 5, IsActive = true },
                };
                if (!isMale)
                {
                    fallbackCategories.Insert(2, new Category { Id = 3, Name = "Dresses", Description = "V├íy, ─æß║ºm c├┤ng sß╗ƒ, ─æß║ºm dß║í tiß╗çc", DisplayOrder = 3, IsActive = true });
                }
                return Ok(ApiResponse<List<Category>>.Ok(fallbackCategories, "Lß║Ñy danh mß╗Ñc th├ánh c├┤ng (Chß║┐ ─æß╗Ö t╞░╞íng th├¡ch offline)"));
            }
        }
    }
}