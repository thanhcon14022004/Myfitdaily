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
            var userId = GetCurrentUserId();

            // Nếu người dùng chưa đăng nhập, trả về danh sách rỗng (để người dùng tự đẩy lên)
            if (!userId.HasValue)
            {
                return Ok(ApiResponse<List<ClothingItemDto>>.Ok(new List<ClothingItemDto>(), "Vui lòng đăng nhập để đồng bộ tủ đồ"));
            }

            var user = await _context.Users.FindAsync(userId.Value);
            bool isMale = user != null && (
                string.Equals(user.Gender, "Nam", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(user.Gender, "Male", StringComparison.OrdinalIgnoreCase) ||
                (user.Gender != null && user.Gender.ToLower().Contains("nam"))
            );

            var query = _context.ClothingItems
                .Include(c => c.Category)
                .Where(c => c.UserId == userId.Value);

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
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(ApiResponse<List<ClothingItemDto>>.Ok(items, "Lấy danh sách tủ đồ thành công"));
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

            // Kiểm tra hạn mức lưu trữ tủ đồ theo gói dịch vụ VIP
            var user = await _context.Users.FindAsync(finalUserId);
            var subType = user?.SubscriptionType ?? "Free";
            int maxLimit = subType switch
            {
                "PremiumPlus" or "premium_plus" => int.MaxValue,
                "Premium" or "premium" => 100,
                _ => 15
            };

            var currentItemCount = await _context.ClothingItems.CountAsync(c => c.UserId == finalUserId);
            if (currentItemCount >= maxLimit)
            {
                var planName = subType == "Free" ? "Free" : subType;
                return BadRequest(ApiResponse<object>.Fail($"Tủ đồ của bạn đã đạt hạn mức tối đa ({maxLimit} món) của gói {planName}. Vui lòng nâng cấp lên gói Premium hoặc Premium Plus để mở rộng không gian lưu trữ!"));
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
    }
}
