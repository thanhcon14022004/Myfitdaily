using MYFITDAILY_EXE201_Group6.DTOs.Ai;
using MYFITDAILY_EXE201_Group6.Services.Interfaces;

namespace MYFITDAILY_EXE201_Group6.Services.Implementations
{
    public class FashionEcommerceTrendService : IFashionEcommerceTrendService
    {
        private readonly List<EcommerceTrendDto> _trends = new()
        {
            new EcommerceTrendDto
            {
                AgeGroupKey = "GenZ",
                AgeGroupLabel = "Gen Z (16 - 24 tuổi)",
                AgeRange = "16 - 24",
                PrimaryChannels = new List<string> { "TikTok Shop", "Shopee Hot Trend", "Taobao / Douyin Trend", "Local Brands (DirtyCoins, Hades, Levents)" },
                SignatureStyles = new List<string> { "Y2K Revival", "Streetwear Bụi Bặm", "Blokecore (Thể thao retro)", "Balletcore (Nơ ren)", "Clean Girl", "Gorpcore (Cargo cá tính)" },
                HotTrendingItems = new List<string>
                {
                    "Baby Tee in hình graphic cá tính",
                    "Quần suông ống rộng cạp trễ / cạp cao (Wide-leg Pants)",
                    "Quần túi hộp dù Parachute Pants / Cargo Pants",
                    "Áo khoác Zip Hoodie phom Boxy Fit",
                    "Chân váy bí ngô (Bubble Skirt) / Chân váy xếp ly Tennis",
                    "Giày Sneaker Retro (Adidas Samba / Gazelle / Chunky)",
                    "Túi kẹp nách Baguette da bóng / Túi Canvas quai dài",
                    "Áo gile len croptop phối sơ mi trắng"
                },
                ColorPalette = new List<string> { "Bạc ánh kim (Silver Metallic)", "Đỏ Cherry Red", "Hồng phấn Pastel", "Xanh bơ (Butter Green)", "Xám tro Wash" },
                TopEcomHashtags = new List<string> { "#outfitinspo", "#shopeehaul", "#tiktokmademebuyit", "#y2kfashion", "#streetwearvietnam" },
                StylistAdviceSummary = "Độ tuổi Gen Z ưu tiên sự phá cách, cá tính và tính viral trên mạng xã hội. Phối đồ theo quy tắc 'trên ôm dưới thụng' (baby tee + quần ống rộng) hoặc 'trên rộng dưới ngắn' (oversized hoodie + chân váy mini).",
                BestSellingInsight = "Mặt hàng bán chạy số 1 trên TikTok Shop & Shopee cho nhóm 16-24 tuổi: Quần ống rộng cạp cao hack chân, Baby tee chất thun cotton co giãn và Giày retro thể thao."
            },
            new EcommerceTrendDto
            {
                AgeGroupKey = "Millennials",
                AgeGroupLabel = "Millennials & Công Sở Trẻ (25 - 34 tuổi)",
                AgeRange = "25 - 34",
                PrimaryChannels = new List<string> { "Shopee Mall", "Zara", "Uniqlo LifeWear", "Mango", "Routine", "Shein Premium" },
                SignatureStyles = new List<string> { "Smart Casual", "Quiet Luxury", "Minimalist Chic", "Office Siren", "Soft Tailoring", "Parisian Elegance" },
                HotTrendingItems = new List<string>
                {
                    "Áo Blazer phom Relaxed Fit vai đệm nhẹ",
                    "Áo sơ mi Poplin Cotton phom Oversized hiện đại",
                    "Quần tây xếp ly cạp cao ống suông đứng tôn dáng",
                    "Áo Gile len dệt kim (Knit Vest) mỏng nhẹ",
                    "Đầm Midi lụa Satin xẻ tà nhã nhặn",
                    "Áo thun T-shirt Cotton Supima cao cấp form chuẩn",
                    "Giày Loafer da bóng khóa ngựa / Giày Mary Jane / Mules gót nhọn",
                    "Túi xách Tote da mềm tối giản phom đứng đựng vừa iPad/Laptop"
                },
                ColorPalette = new List<string> { "Màu be yến mạch (Oatmeal Beige)", "Nâu Cacao ấm áp", "Trắng ngà (Ivory)", "Xanh Navy hoàng gia", "Đen tuyền", "Xám ghi đá" },
                TopEcomHashtags = new List<string> { "#quietluxury", "#capsulewardrobe", "#smartcasual", "#ootdoffice", "#zarahaul" },
                StylistAdviceSummary = "Độ tuổi 25-34 yêu thích sự linh hoạt 'Day-to-Night': Trang phục vừa đủ chỉn chu, chuyên nghiệp nơi công sở nhưng khi hết giờ làm đi cafe, hẹn hò vẫn toát lên khí chất sành điệu, sang chảnh không gượng gạo.",
                BestSellingInsight = "Mặt hàng bán chạy số 1 trên Shopee Mall & Zara/Uniqlo: Quần tây xếp ly ống suông hack chiều cao, Blazer dáng rộng tone trung tính và Giày loafer da."
            },
            new EcommerceTrendDto
            {
                AgeGroupKey = "MidCareer",
                AgeGroupLabel = "Chững Chạc & Đĩnh Đạc (35 - 49 tuổi)",
                AgeRange = "35 - 49",
                PrimaryChannels = new List<string> { "Massimo Dutti", "Uniqlo LifeWear", "Ivy Moda", "Elise", "Mango", "Giovanni" },
                SignatureStyles = new List<string> { "Old Money", "Classic Elegance", "Doanh Nhân Thanh Lịch", "Minimalist Tinh Hoa", "May Đo Tailoring Cao Cấp" },
                HotTrendingItems = new List<string>
                {
                    "Áo sơ mi lụa tơ tằm cổ Đức / Cổ nơ quý phái",
                    "Quần âu may đo ống đứng cắt cúp hoàn hảo che khuyết điểm",
                    "Áo khoác Dạ Tweed quý tộc đính khuy kim loại vàng",
                    "Đầm suông chữ A / Đầm Wrap Dress chiết eo giấu bụng tinh tế",
                    "Áo len Cashmere / Cardigan dệt kim sợi mảnh mềm mịn",
                    "Áo khoác Măng-tô (Trench Coat) dáng dài thanh lịch",
                    "Giày cao gót Kitten Heels mũi nhọn da thật / Loafer đế vuông",
                    "Khăn lụa vuông Bandana họa tiết hoàng gia quàng cổ"
                },
                ColorPalette = new List<string> { "Nâu Camel quý tộc", "Đỏ đô Burgundy", "Xanh rêu Olive", "Trắng ngọc trai", "Đen than chì (Charcoal)", "Xanh biển trầm" },
                TopEcomHashtags = new List<string> { "#oldmoneystyle", "#elegantlook", "#classicfashion", "#massimodutti", "#quyphai" },
                StylistAdviceSummary = "Độ tuổi 35-49 đặt chất liệu và phom dáng lên hàng đầu: Ưu tiên lụa, dạ tweed, cashmere; đường cắt may sắc nét giúp giấu bụng và bắp tay, toát lên phong thái tự tin, sang trọng và từng trải.",
                BestSellingInsight = "Mặt hàng bán chạy số 1 trên các thương hiệu TMĐT cao cấp: Đầm suông giấu bụng chất liệu lụa/tweed, Áo khoác Tweed đính cúc vàng và Quần âu may đo ống đứng."
            },
            new EcommerceTrendDto
            {
                AgeGroupKey = "Mature",
                AgeGroupLabel = "Trung Niên & Quý Phái (50+ tuổi)",
                AgeRange = "50+",
                PrimaryChannels = new List<string> { "Thương hiệu Thiết Kế Trung Niên Cao Cấp", "Uniqlo LifeWear", "Lụa Vạn Phúc / Nha Xá", "Đồ thêu tay thủ công" },
                SignatureStyles = new List<string> { "Thoải Mái Tối Đa", "Nhã Nhặn Quý Phái", "Phong Cách Trà Đạo / Zen", "Chất Liệu Thiên Nhiên Thoáng Khí" },
                HotTrendingItems = new List<string>
                {
                    "Áo form suông tay lỡ chất liệu Đũi / Linen thêu hoa nhã nhặn",
                    "Đầm suông Linen / Cotton dệt tự nhiên dáng dài qua gối",
                    "Quần ống suông cạp chun co giãn êm ái thoáng mát",
                    "Áo khoác Dệt kim mỏng nhẹ chắn gió điều hòa",
                    "Khăn choàng lụa tơ tằm mềm mại giữ ấm cổ",
                    "Giày búp bê đế bệt êm chân có đệm lót chỉnh hình chống trượt",
                    "Túi xách da mềm phom tròn kích thước vừa phải tiện dụng"
                },
                ColorPalette = new List<string> { "Xanh Lam Ngọc dịu mắt", "Tím hoa cà Pastel", "Trắng ngà tự nhiên", "Xanh Sage thanh bình", "Nâu đất Mộc mạc" },
                TopEcomHashtags = new List<string> { "#thoitrangtrungnien", "#linenfashion", "#quyba", "#thoaimai", "#thanhnha" },
                StylistAdviceSummary = "Độ tuổi 50+ ưu tiên tuyệt đối sự êm ái, thoáng khí và thuận tiện khi vận động. Phom dáng suông nhẹ nhàng, tone màu trầm ấm nền nã tôn vinh vẻ đẹp đằm thắm của độ tuổi chín muồi.",
                BestSellingInsight = "Mặt hàng bán chạy số 1: Đầm suông vải linen thêu hoa nhã nhặn, Quần ống suông cạp chun co giãn và Giày đế mềm êm chân."
            }
        };

        public List<EcommerceTrendDto> GetAllTrends() => _trends;

        public EcommerceTrendDto GetTrendByAge(int? age)
        {
            if (!age.HasValue || age.Value <= 24)
            {
                return _trends[0]; // Gen Z
            }
            if (age.Value <= 34)
            {
                return _trends[1]; // Millennials
            }
            if (age.Value <= 49)
            {
                return _trends[2]; // Mid-Career
            }
            return _trends[3]; // Mature 50+
        }

        public EcommerceTrendDto GetTrendByGroupKey(string? groupKey)
        {
            if (string.IsNullOrWhiteSpace(groupKey)) return _trends[0];
            var found = _trends.FirstOrDefault(t => t.AgeGroupKey.Equals(groupKey, StringComparison.OrdinalIgnoreCase));
            return found ?? _trends[0];
        }

        public string DetermineAgeGroup(int? age)
        {
            if (!age.HasValue) return "Chưa xác định";
            if (age.Value <= 24) return "Gen Z (16 - 24 tuổi)";
            if (age.Value <= 34) return "Millennials & Công Sở Trẻ (25 - 34 tuổi)";
            if (age.Value <= 49) return "Chững Chạc & Đĩnh Đạc (35 - 49 tuổi)";
            return "Trung Niên & Quý Phái (50+ tuổi)";
        }

        public string GetTrendSummaryForAiPrompt(int? age, bool isMale = false)
        {
            var trend = GetTrendByAge(age);
            List<string> hotItems;
            string stylistAdvice;
            string signatureStyles;

            if (isMale)
            {
                if (!age.HasValue || age.Value <= 24)
                {
                    hotItems = new List<string> { "Áo Thun Cotton Boxy Fit 250gsm Streetwear", "Quần Parachute Pants / Cargo Pants túi hộp", "Quần Jeans ống suông rộng Wash Retro", "Áo Zip Hoodie nỉ bông form rộng", "Giày Sneaker Retro (Adidas Samba / Chunky)" };
                    stylistAdvice = "Độ tuổi Gen Z nam ưu tiên sự năng động, cá tính streetwear và form dáng phóng khoáng (Oversized / Boxy Fit). Phối đồ theo quy tắc 'trên rộng dưới đứng' (Boxy Tee/Hoodie + Quần Cargo/Jeans suông).";
                    signatureStyles = "Streetwear Bụi Bặm, Blokecore Nam Tính, Gorpcore Cá Tính, Clean Fit";
                }
                else if (age.Value <= 34)
                {
                    hotItems = new List<string> { "Áo Blazer Nam May Đo Relaxed Fit", "Áo Polo Pique Cotton / Dệt Kim Phóng Khoáng", "Quần Tây âu xếp ly may đo ống suông", "Áo Sơ mi Oxford Classic Dài Tay", "Giày Penny Loafer da bò cao cấp" };
                    stylistAdvice = "Độ tuổi 25-34 nam giới chuộng phong cách Smart Casual & Quiet Luxury: Lịch lãm, đĩnh đạc nơi công sở và tự tin, phong độ khi gặp gỡ đối tác hoặc hẹn hò.";
                    signatureStyles = "Smart Casual Quý Ông, Quiet Luxury, Minimalist Nam Tính, Soft Tailoring";
                }
                else if (age.Value <= 49)
                {
                    hotItems = new List<string> { "Áo Sơ mi May Đo Cổ Đức Classic", "Quần Âu May Đo Ống Đứng Che Khuyết Điểm", "Áo Blazer Nam Dạ Cao Cấp / Măng-tô", "Áo Len Cashmere Cổ Tròn / Cổ Lọ", "Giày Tây Oxford / Chelsea Boots Da Thật" };
                    stylistAdvice = "Độ tuổi 35-49 nam giới tôn vinh phong thái quý ông thành đạt, chất liệu len wool/cashmere thượng hạng và đường may may đo hoàn hảo.";
                    signatureStyles = "Old Money Quý Tộc, Doanh Nhân Thành Đạt, May Đo Tailoring Cao Cấp";
                }
                else
                {
                    hotItems = new List<string> { "Áo Polo / Sơ Mi Dệt Kim Đũi Mộc Thoáng Khí", "Quần Tây Cạp Chun Co Giãn Thoải Mái", "Áo Khoác Dệt Kim Mỏng Nhẹ Chắn Gió", "Giày Da Lười Đế Mềm Chống Trượt" };
                    stylistAdvice = "Độ tuổi 50+ nam giới chú trọng sự thoải mái tối đa, chất liệu tự nhiên thoáng mát và màu sắc trầm ấm phong độ.";
                    signatureStyles = "Thoải Mái Tối Đa, Nhã Nhặn Đĩnh Đạc, Chất Liệu Thiên Nhiên";
                }
            }
            else
            {
                hotItems = trend.HotTrendingItems.Take(5).ToList();
                stylistAdvice = trend.StylistAdviceSummary;
                signatureStyles = string.Join(", ", trend.SignatureStyles.Take(3));
            }

            var hotItemsStr = string.Join(", ", hotItems);
            var channelsStr = string.Join(", ", trend.PrimaryChannels);

            return $"ĐỘ TUỔI & XU HƯỚNG THƯƠNG MẠI ĐIỆN TỬ:\n" +
                   $"- Giới tính khách hàng: {(isMale ? "Nam giới" : "Nữ giới")}\n" +
                   $"- Nhóm tuổi khách hàng: {trend.AgeGroupLabel} (Tuổi thực tế: {(age.HasValue ? age.Value.ToString() : "Chưa khai báo - Mặc định Gen Z / Trẻ")})\n" +
                   $"- Kênh TMĐT thịnh hành nhất: {channelsStr}\n" +
                   $"- Phong cách & Trào lưu hot-trend: {signatureStyles}\n" +
                   $"- Các món đồ bán chạy & viral nhất trên sàn: {hotItemsStr}\n" +
                   $"- Lời khuyên định hướng: {stylistAdvice}\n" +
                   $"- Dữ liệu bán chạy thực tế: {trend.BestSellingInsight}";
        }
    }
}
