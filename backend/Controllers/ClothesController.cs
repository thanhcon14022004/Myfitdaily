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
        /// Lấy toàn bộ danh sách quần áo trong tủ đồ của người dùng hiện tại
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMyClothes()
        {
            try
            {
                var userId = GetCurrentUserId();

                // Nếu người dùng chưa đăng nhập, trả về danh sách quần áo của tài khoản Demo
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

                // Nếu tài khoản chưa có món đồ nào, tự động nạp bộ sưu tập đồ mẫu theo giới tính vào database
                if (userId.HasValue && !await _context.ClothingItems.AnyAsync(c => c.UserId == userId.Value))
                {
                    var seedList = isMale ? DbSeeder.GetMaleSeedClothes(userId.Value) : DbSeeder.GetFemaleSeedClothes(userId.Value);
                    _context.ClothingItems.AddRange(seedList);
                    await _context.SaveChangesAsync();
                }

                var query = _context.ClothingItems
                    .Include(c => c.Category)
                    .Where(c => c.UserId == (userId ?? 0));

                // Nếu người dùng là Nam, lọc bỏ hoàn toàn các loại trang phục phụ nữ (Đầm, Chân váy, v.v.)
                if (isMale)
                {
                    query = query.Where(c => 
                        c.CategoryId != 3 &&
                        !c.Name.ToLower().Contains("váy") &&
                        !c.Name.ToLower().Contains("đầm") &&
                        !c.Name.ToLower().Contains("croptop") &&
                        !c.Name.ToLower().Contains("tiểu thư") &&
                        !c.Name.ToLower().Contains("cao gót") &&
                        !c.Name.ToLower().Contains("chân váy") &&
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
                        Price = c.Price,
                        PriceFormatted = c.PriceFormatted,
                        AffiliateUrl = c.AffiliateUrl,
                        OriginalUrl = c.OriginalUrl,
                        Platform = c.Platform,
                        IsAffiliate = c.IsAffiliate,
                        CreatedAt = c.CreatedAt
                    })
                    .ToListAsync();

                return Ok(ApiResponse<List<ClothingItemDto>>.Ok(items, "Lấy danh sách tủ đồ thành công"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ClothesController DB Warning]: {ex.Message}. Trả về tủ đồ mẫu in-memory.");
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

                return Ok(ApiResponse<List<ClothingItemDto>>.Ok(dtoList, "Lấy danh sách tủ đồ thành công (Chế độ tương thích offline)"));
            }
        }

        /// <summary>
        /// Thêm một món đồ mới vào tủ đồ của người dùng
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddClothingItem([FromBody] CreateClothingItemDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            // Nếu chưa đăng nhập, sử dụng tài khoản mẫu hoặc yêu cầu đăng nhập
            int finalUserId;
            if (userId.HasValue)
            {
                finalUserId = userId.Value;
            }
            else
            {
                // Tìm hoặc tạo tài khoản mặc định cho khách trải nghiệm
                var firstUser = await _context.Users.FirstOrDefaultAsync();
                if (firstUser != null)
                {
                    finalUserId = firstUser.Id;
                }
                else
                {
                    return Unauthorized(ApiResponse<object>.Fail("Vui lòng đăng nhập để lưu món đồ vào tủ đồ của bạn"));
                }
            }

            // Kiểm tra danh mục hợp lệ
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
            {
                return BadRequest(ApiResponse<object>.Fail("Danh mục không tồn tại"));
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

            return Ok(ApiResponse<ClothingItemDto>.Ok(responseDto, "Đã thêm món đồ mới vào tủ đồ thành công"));
        }

        /// <summary>
        /// Thêm đồng loạt nhiều món đồ vào tủ đồ (sau khi quét AI OOTD)
        /// </summary>
        [HttpPost("batch-create")]
        public async Task<IActionResult> BatchAddClothingItems([FromBody] BatchCreateClothingItemDto request)
        {
            if (!ModelState.IsValid || request.Items == null || request.Items.Count == 0)
            {
                return BadRequest(ApiResponse<object>.Fail("Danh sách món đồ không được để trống"));
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
                    return Unauthorized(ApiResponse<object>.Fail("Vui lòng đăng nhập để lưu món đồ vào tủ đồ của bạn"));
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
                    Color = (itemDto.Color ?? "Trắng").Trim(),
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

            return Ok(ApiResponse<List<ClothingItemDto>>.Ok(addedItems, $"Đã thêm thành công {addedItems.Count} món đồ vào tủ đồ của bạn!"));
        }

        /// <summary>
        /// Xóa một món đồ khỏi tủ đồ của người dùng
        /// </summary>
        /// <summary>
        /// Xóa một món đồ khỏi tủ đồ của người dùng
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClothingItem(int id)
        {
            var userId = GetCurrentUserId();

            var item = await _context.ClothingItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(ApiResponse<object>.Fail("Không tìm thấy món đồ cần xóa"));
            }

            // Nếu có userId, kiểm tra quyền sở hữu
            if (userId.HasValue && item.UserId != userId.Value)
            {
                return Forbid();
            }

            // Xóa các bản ghi OutfitItem liên quan để tránh lỗi khóa ngoại Restrict
            var relatedOutfitItems = await _context.OutfitItems
                .Where(oi => oi.ClothingItemId == id)
                .ToListAsync();
            if (relatedOutfitItems.Any())
            {
                _context.OutfitItems.RemoveRange(relatedOutfitItems);
            }

            _context.ClothingItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<bool>.Ok(true, "Đã xóa món đồ khỏi tủ đồ thành công"));
        }

        /// <summary>
        /// Xóa hàng loạt nhiều món đồ khỏi tủ đồ
        /// </summary>
        [HttpPost("bulk-delete")]
        public async Task<IActionResult> BulkDeleteClothingItems([FromBody] List<int> ids)
        {
            var userId = GetCurrentUserId();

            if (ids == null || !ids.Any())
            {
                return BadRequest(ApiResponse<object>.Fail("Danh sách ID món đồ cần xóa không hợp lệ"));
            }

            var items = await _context.ClothingItems
                .Where(c => ids.Contains(c.Id) && (!userId.HasValue || c.UserId == userId.Value))
                .ToListAsync();

            if (!items.Any())
            {
                return NotFound(ApiResponse<object>.Fail("Không tìm thấy món đồ nào phù hợp để xóa"));
            }

            var itemIds = items.Select(i => i.Id).ToList();

            // Xóa các liên kết OutfitItem trước
            var relatedOutfitItems = await _context.OutfitItems
                .Where(oi => itemIds.Contains(oi.ClothingItemId))
                .ToListAsync();
            if (relatedOutfitItems.Any())
            {
                _context.OutfitItems.RemoveRange(relatedOutfitItems);
            }

            _context.ClothingItems.RemoveRange(items);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<int>.Ok(items.Count, $"Đã xóa {items.Count} món đồ khỏi tủ đồ thành công"));
        }

        /// <summary>
        /// Lấy danh sách các danh mục quần áo (hỗ trợ lọc theo giới tính người dùng)
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
                            cat.Description = "Quần jeans, quần tây, quần short, quần kaki nam";
                        }
                    }
                }

                return Ok(ApiResponse<List<Category>>.Ok(categories, "Lấy danh mục thành công"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Categories DB Warning]: {ex.Message}. Trả về danh mục mẫu.");
                var isMale = (gender ?? "").ToLower().Contains("nam");
                var fallbackCategories = new List<Category>
                {
                    new Category { Id = 1, Name = "Tops", Description = "Áo thun, áo sơ mi, áo len, áo khoác", DisplayOrder = 1, IsActive = true },
                    new Category { Id = 2, Name = "Bottoms", Description = isMale ? "Quần jeans, quần tây, quần short, quần kaki nam" : "Quần jeans, quần tây, chân váy", DisplayOrder = 2, IsActive = true },
                    new Category { Id = 4, Name = "Shoes", Description = "Giày sneaker, giày da, sandal, boots", DisplayOrder = 4, IsActive = true },
                    new Category { Id = 5, Name = "Accessories", Description = "Túi xách, thắt lưng, mũ, kính mắt", DisplayOrder = 5, IsActive = true },
                };
                if (!isMale)
                {
                    fallbackCategories.Insert(2, new Category { Id = 3, Name = "Dresses", Description = "Váy, đầm công sở, đầm dạ tiệc", DisplayOrder = 3, IsActive = true });
                }
                return Ok(ApiResponse<List<Category>>.Ok(fallbackCategories, "Lấy danh mục thành công (Chế độ tương thích offline)"));
            }
        }
    }
}