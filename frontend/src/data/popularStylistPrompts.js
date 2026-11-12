/**
 * Danh sách các câu hỏi người dùng thường hỏi AI Stylist nhất tại MyFitDaily
 * Phân theo các danh mục thực tế: Đi làm, Hẹn hò, Thời tiết, Tôn dáng, Sự kiện & Phối đồ
 */

export const POPULAR_PROMPT_CATEGORIES = [
  { id: 'all', key: 'all', nameVi: '🔥 Tất Cả', labelVi: '🔥 Tất Cả (Nổi Bật)', nameEn: '🔥 All', labelEn: '🔥 All (Popular)' },
  { id: 'office', key: 'office', nameVi: '💼 Đi Làm', labelVi: '💼 Đi Làm / Công Sở', nameEn: '💼 Work', labelEn: '💼 Office & Work' },
  { id: 'dating', key: 'dating', nameVi: '☕ Hẹn Hò', labelVi: '☕ Hẹn Hò & Dạo Phố', nameEn: '☕ Dating', labelEn: '☕ Dating & Hangout' },
  { id: 'weather', key: 'weather', nameVi: '🌤️ Thời Tiết', labelVi: '🌤️ Theo Thời Tiết', nameEn: '🌤️ Weather', labelEn: '🌤️ Weather-based' },
  { id: 'bodyshape', key: 'bodyshape', nameVi: '👗 Tôn Dáng', labelVi: '👗 Tôn Dáng & Tỉ Lệ', nameEn: '👗 Body Fit', labelEn: '👗 Body Shape & Fit' },
  { id: 'party', key: 'party', nameVi: '🎉 Đi Tiệc', labelVi: '🎉 Đi Tiệc & Đám Cưới', nameEn: '🎉 Party', labelEn: '🎉 Wedding & Party' },
  { id: 'trend', key: 'trend', nameVi: '✨ Xu Hướng', labelVi: '✨ Xu Hướng & Món Đồ', nameEn: '✨ Trends', labelEn: '✨ Trends & Garments' }
];

export const POPULAR_STYLIST_PROMPTS = [
  // 1. CÔNG SỞ & ĐI LÀM
  {
    id: 'p_off_01',
    category: 'office',
    questionVi: 'Gợi ý phối đồ đi làm công sở thanh lịch với áo sơ mi trắng để không bị già và cứng nhắc?',
    questionEn: 'How to style a white button-up shirt for the office without looking too rigid or old?',
    tag: 'Công Sở Trẻ',
    askedCount: 1840,
    badge: '🔥 Top 1 Hỏi Nhiều'
  },
  {
    id: 'p_off_02',
    category: 'office',
    questionVi: 'Set đồ Smart Casual đi gặp đối tác hoặc khách hàng vừa lịch thiệp vừa hiện đại?',
    questionEn: 'Smart Casual outfit ideas for meeting clients that look professional yet modern?',
    tag: 'Gặp Khách Hàng',
    askedCount: 1350,
    badge: '⭐ Đánh Giá Cao'
  },
  {
    id: 'p_off_03',
    category: 'office',
    questionVi: 'Thứ Hai đầu tuần nên mặc tone màu gì để tạo cảm giác tự tin và tràn đầy năng lượng?',
    questionEn: 'What color palette should I wear on Monday morning for maximum confidence and energy?',
    tag: 'Đầu Tuần',
    askedCount: 980,
    badge: 'Năng Lượng'
  },
  {
    id: 'p_off_04',
    category: 'office',
    questionVi: 'Trời hè oi bức mặc gì đi làm văn phòng vừa thoáng mát thấm mồ hôi vừa lịch sự?',
    questionEn: 'Breathable yet professional summer office outfits for hot humid weather?',
    tag: 'Mùa Hè Công Sở',
    askedCount: 1120,
    badge: 'Hot Mùa Hè'
  },

  // 2. HẸN HÒ & ĐI CHƠI
  {
    id: 'p_date_01',
    category: 'dating',
    questionVi: 'Gợi ý outfit cho buổi hẹn hò đầu tiên (First Date) cuốn hút, tinh tế theo phong cách Clean Fit?',
    questionEn: 'First date outfit ideas following Clean Fit aesthetic: attractive, subtle, effortless?',
    tag: 'Hẹn Hò Đầu Tiên',
    askedCount: 2150,
    badge: '🔥 Top 1 Hẹn Hò'
  },
  {
    id: 'p_date_02',
    category: 'dating',
    questionVi: 'Cuối tuần đi cafe dạo phố chụp ảnh sống ảo thì nên mặc tone màu và phong cách gì ăn ảnh nhất?',
    questionEn: 'Best aesthetic cafe photo outfit colors and styles for weekend street hangout?',
    tag: 'Sống Ảo Cafe',
    askedCount: 1670,
    badge: 'Ăn Ảnh'
  },
  {
    id: 'p_date_03',
    category: 'dating',
    questionVi: 'Buổi tối hẹn hò tại nhà hàng hoặc rooftop bar lãng mạn nên diện trang phục sang trọng nào?',
    questionEn: 'Romantic evening dinner or rooftop bar outfit ideas that look chic and classy?',
    tag: 'Dinner Date',
    askedCount: 1240,
    badge: 'Sang Chảnh'
  },
  {
    id: 'p_date_04',
    category: 'dating',
    questionVi: 'Set đồ dạo phố năng động, thoải mái phối cùng giày sneaker và quần jeans ống suông?',
    questionEn: 'Comfortable casual streetwear outfit paired with retro sneakers and straight-leg jeans?',
    tag: 'Casual Streetwear',
    askedCount: 1480,
    badge: 'Năng Động'
  },

  // 3. THEO THỜI TIẾT
  {
    id: 'p_wea_01',
    category: 'weather',
    questionVi: 'Hôm nay thời tiết thế này thì nên mặc mấy lớp (layering) và chất liệu gì là chuẩn nhất?',
    questionEn: 'Based on today\'s local weather, how many layers and what fabrics should I wear?',
    tag: 'Thời Tiết Hôm Nay',
    askedCount: 2890,
    badge: '⚡ Hỏi Mỗi Ngày'
  },
  {
    id: 'p_wea_02',
    category: 'weather',
    questionVi: 'Trời mưa gió ẩm ướt nên mang giày gì và mặc quần kiểu gì để tránh bị bắn bẩn?',
    questionEn: 'What shoes and pants should I wear on rainy days to prevent mud splashes and stay dry?',
    tag: 'Ngày Mưa',
    askedCount: 1390,
    badge: 'Tiện Ích'
  },
  {
    id: 'p_wea_03',
    category: 'weather',
    questionVi: 'Cách phối áo blazer dạ và áo len mỏng cho những ngày đầu mùa thu đông se lạnh 18-22°C?',
    questionEn: 'How to layer a wool blazer and thin knitwear for cool autumn days (18-22°C)?',
    tag: 'Thu Đông Se Lạnh',
    askedCount: 1750,
    badge: 'Thu Đông Hot'
  },

  // 4. TÔN DÁNG & CHE KHUYẾT ĐIỂM BODYSHAPE
  {
    id: 'p_body_01',
    category: 'bodyshape',
    questionVi: 'Tôi có dáng người quả lê (hông và đùi to, eo nhỏ) nên chọn quần và váy gì để tôn dáng thon gọn?',
    questionEn: 'I have a pear body shape (wider hips/thighs, slim waist). What pants & skirts flatter me best?',
    tag: 'Dáng Quả Lê',
    askedCount: 2420,
    badge: '🔥 Dáng Quả Lê'
  },
  {
    id: 'p_body_02',
    category: 'bodyshape',
    questionVi: 'Người vai rộng (tam giác ngược) nên mặc cổ áo và phom dáng nào để thân trên trông mềm mại hơn?',
    questionEn: 'Broad shoulders (inverted triangle shape): what necklines and fits soften my upper body?',
    tag: 'Tam Giác Ngược',
    askedCount: 1530,
    badge: 'Vai Rộng'
  },
  {
    id: 'p_body_03',
    category: 'bodyshape',
    questionVi: 'Chiều cao khiêm tốn 1m55 phối đồ thế nào theo tỷ lệ 1/3 để "hack" đôi chân dài trông như 1m65?',
    questionEn: 'How to use the 1/3-2/3 proportion rule to make a 155cm height look like 165cm legs?',
    tag: 'Hack Chiều Cao',
    askedCount: 2680,
    badge: '🔥 Hack Dáng 1m55'
  },
  {
    id: 'p_body_04',
    category: 'bodyshape',
    questionVi: 'Bụng dưới hơi to và bắp tay kém thon thì chọn áo sơ mi hoặc áo phông phom nào che khuyết điểm tốt?',
    questionEn: 'How to hide lower belly pooch and upper arm fullness with flattering shirt silhouettes?',
    tag: 'Che Khuyết Điểm',
    askedCount: 1980,
    badge: 'Che Khuyết Điểm'
  },
  {
    id: 'p_body_05',
    category: 'bodyshape',
    questionVi: 'Dáng người thước kẻ (chữ nhật) ít đường cong nên phối đồ và thắt lưng ra sao để tạo cảm giác eo thon?',
    questionEn: 'Rectangle body shape: how to create the illusion of waist curves using belts and silhouettes?',
    tag: 'Dáng Chữ Nhật',
    askedCount: 1210,
    badge: 'Tạo Eo'
  },

  // 5. ĐI TIỆC & ĐÁM CƯỚI
  {
    id: 'p_par_01',
    category: 'party',
    questionVi: 'Đi ăn cưới bạn thân mùa này nên mặc đồ gì lịch sự, nhã nhặn mà không bị trùng hoặc lấn át cô dâu?',
    questionEn: 'Wedding guest outfit ideas that look respectful, elegant without outshining the bride?',
    tag: 'Đi Ăn Cưới',
    askedCount: 2310,
    badge: '🔥 Khách Đám Cưới'
  },
  {
    id: 'p_par_02',
    category: 'party',
    questionVi: 'Dresscode tiệc công ty là "Old Money / Quiet Luxury" thì nam và nữ nên chuẩn bị trang phục thế nào?',
    questionEn: 'Company party dresscode is "Old Money / Quiet Luxury": what should men and women wear?',
    tag: 'Old Money Party',
    askedCount: 1470,
    badge: 'Old Money'
  },
  {
    id: 'p_par_03',
    category: 'party',
    questionVi: 'Gợi ý set đồ dự tiệc sinh nhật ngoài trời buổi tối vừa nổi bật, ăn ảnh vừa dễ di chuyển?',
    questionEn: 'Outdoor evening birthday party outfit: standout in photos yet comfortable to move around?',
    tag: 'Sinh Nhật Ngoài Trời',
    askedCount: 990,
    badge: 'Dự Tiệc Tối'
  },

  // 6. XU HƯỚNG & PHỐI MÓN ĐỒ CỤ THỂ
  {
    id: 'p_tre_01',
    category: 'trend',
    questionVi: 'Phong cách Quiet Luxury phối từ những món đồ cơ bản (Basic Items) trong tủ đồ ra sao?',
    questionEn: 'How to build a Quiet Luxury outfit using only essential basic capsule wardrobe pieces?',
    tag: 'Quiet Luxury Basic',
    askedCount: 1890,
    badge: '🔥 Hot Trend'
  },
  {
    id: 'p_tre_02',
    category: 'trend',
    questionVi: 'Quần tây xếp ly ống rộng (Wide-leg Pants) phối với giày nào đẹp nhất (Sneaker, Loafer hay Mules)?',
    questionEn: 'Which shoes pair best with wide-leg pleated trousers: sneakers, loafers, or mules?',
    tag: 'Giày & Quần Suông',
    askedCount: 1620,
    badge: 'Mix Giày'
  },
  {
    id: 'p_tre_03',
    category: 'trend',
    questionVi: 'Cách phối áo polo dệt kim (Knit Polo) cùng quần tây theo style các nam thần Hàn Quốc?',
    questionEn: 'How to style a knit polo with dress trousers for a Korean Oppa aesthetic?',
    tag: 'Knit Polo Style',
    askedCount: 1340,
    badge: 'Korean Style'
  },
  {
    id: 'p_tre_04',
    category: 'trend',
    questionVi: 'Màu sắc hot trend của mùa thời trang năm nay gồm những tông màu nào và phối thế nào không bị sến?',
    questionEn: 'What are the top trending fashion colors this season and how to combine them tastefully?',
    tag: 'Bảng Màu Hot Trend',
    askedCount: 1450,
    badge: 'Màu Sắc Trend'
  }
];

/**
 * Lấy danh sách câu hỏi theo danh mục và ngôn ngữ
 */
export function getPopularPromptsByCategory(categoryKey = 'all', isEnglish = false) {
  let list = POPULAR_STYLIST_PROMPTS;
  if (categoryKey && categoryKey !== 'all') {
    list = list.filter(p => p.category === categoryKey);
  }
  return list.map(p => ({
    id: p.id,
    category: p.category,
    question: isEnglish ? p.questionEn : p.questionVi,
    questionVi: p.questionVi,
    questionEn: p.questionEn,
    tag: p.tag,
    askedCount: p.askedCount,
    badge: p.badge
  }));
}
