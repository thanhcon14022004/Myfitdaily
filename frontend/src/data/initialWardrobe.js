// Dữ liệu mẫu quần áo và outfits chuẩn phong cách thời trang hiện đại cho MYFITDAILY

export const INITIAL_CLOTHING_ITEMS = [
  {
    id: 1,
    name: "Áo sơ mi lụa trắng Oversized",
    categoryId: 1,
    categoryName: "Tops",
    color: "Trắng",
    style: "Minimalist",
    season: "AllSeason",
    imageUrl: "/assets/clothes/shirt_white.svg",
    description: "Sơ mi form rộng chất liệu lụa satin mỏng nhẹ, thanh lịch và thoáng mát."
  },
  {
    id: 2,
    name: "Áo thun Cotton đen Form Boxy",
    categoryId: 1,
    categoryName: "Tops",
    color: "Đen",
    style: "Streetwear",
    season: "Summer",
    imageUrl: "/assets/clothes/tshirt_black.svg",
    description: "Cotton 100% 250gsm dày dặn, đứng form chuẩn streetwear hiện đại."
  },
  {
    id: 3,
    name: "Áo Len Dệt Kim Cổ Lọ Be",
    categoryId: 1,
    categoryName: "Tops",
    color: "Be / Nude",
    style: "Vintage",
    season: "Winter",
    imageUrl: "/assets/clothes/shirt_white.svg",
    description: "Len dệt kim mềm mịn, giữ ấm tốt, tông màu be ấm áp dễ phối."
  },
  {
    id: 4,
    name: "Quần Jeans Ống Suông Vintage",
    categoryId: 2,
    categoryName: "Bottoms",
    color: "Xanh Denim",
    style: "Casual",
    season: "AllSeason",
    imageUrl: "/assets/clothes/jeans_blue.svg",
    description: "Jeans wash retro cổ điển, cạp cao hack dáng cực đỉnh."
  },
  {
    id: 5,
    name: "Quần Tây Xếp Ly Đen Tinh Tế",
    categoryId: 2,
    categoryName: "Bottoms",
    color: "Đen",
    style: "Formal",
    season: "AllSeason",
    imageUrl: "/assets/clothes/pants_black.svg",
    description: "Quần âu may đo phẳng phiu, chất vải wool pha tuyết mưa đứng dáng."
  },
  {
    id: 6,
    name: "Chân Váy Chữ A Xếp Ly",
    categoryId: 2,
    categoryName: "Bottoms",
    color: "Xám Than",
    style: "School",
    season: "Spring",
    imageUrl: "/assets/clothes/pants_black.svg",
    description: "Váy tennis pleat xếp ly trẻ trung, năng động, phong cách học đường."
  },
  {
    id: 7,
    name: "Đầm Lụa Midi Cổ Yếm Pastel",
    categoryId: 3,
    categoryName: "Dresses",
    color: "Hồng Nhạt",
    style: "Elegant",
    season: "Summer",
    imageUrl: "/assets/clothes/dress_silk.svg",
    description: "Thiết kế đầm suông tha thướt, thích hợp cho các buổi hẹn hò lãng mạn."
  },
  {
    id: 8,
    name: "Áo Blazer Dạ Màu Nâu Cacao",
    categoryId: 4,
    categoryName: "Outerwear",
    color: "Nâu",
    style: "Formal",
    season: "Fall",
    imageUrl: "/assets/clothes/blazer_brown.svg",
    description: "Blazer 2 hàng khuy phom chuẩn thanh lịch, lót lụa mềm mại bên trong."
  },
  {
    id: 9,
    name: "Áo Khoác Da Biker Jacket",
    categoryId: 4,
    categoryName: "Outerwear",
    color: "Đen",
    style: "Streetwear",
    season: "Winter",
    imageUrl: "/assets/clothes/blazer_brown.svg",
    description: "Chất da cao cấp đính khóa kim loại ánh bạc, vẻ ngoài cá tính mạnh mẽ."
  },
  {
    id: 10,
    name: "Giày Sneaker Trắng Retro Classic",
    categoryId: 5,
    categoryName: "Shoes",
    color: "Trắng",
    style: "Casual",
    season: "AllSeason",
    imageUrl: "/assets/clothes/shoes_sneaker.svg",
    description: "Đôi sneaker cơ bản có thể cân mọi outfit từ công sở tới dạo phố."
  },
  {
    id: 11,
    name: "Giày Loafer Da Bóng Khóa Ngựa",
    categoryId: 5,
    categoryName: "Shoes",
    color: "Đen",
    style: "Formal",
    season: "AllSeason",
    imageUrl: "/assets/clothes/shoes_loafer.svg",
    description: "Giày da đế êm ái, điểm nhấn kim loại vàng kim sang trọng."
  },
  {
    id: 12,
    name: "Túi Da Đeo Chéo Dáng Baguette",
    categoryId: 6,
    categoryName: "Accessories",
    color: "Nâu Đất",
    style: "Minimalist",
    season: "AllSeason",
    imageUrl: "/assets/clothes/bag_leather.svg",
    description: "Túi kẹp nách nhỏ gọn tiện lợi, đựng vừa điện thoại và son phấn cá nhân."
  }
];

export const INITIAL_CATEGORIES = [
  { id: 1, name: "Tops", label: "Áo", count: 3, icon: "Shirt" },
  { id: 2, name: "Bottoms", label: "Quần & Váy", count: 3, icon: "Scissors" },
  { id: 3, name: "Dresses", label: "Đầm liền", count: 1, icon: "Sparkles" },
  { id: 4, name: "Outerwear", label: "Áo khoác", count: 2, icon: "Wind" },
  { id: 5, name: "Shoes", label: "Giày dép", count: 2, icon: "Footprints" },
  { id: 6, name: "Accessories", label: "Phụ kiện", count: 1, icon: "Watch" }
];

export const INITIAL_OUTFITS = [
  {
    id: 1,
    name: "Thanh Lịch Công Sở Thứ Hai",
    occasion: "Work",
    season: "AllSeason",
    isFavorite: true,
    createdByAi: false,
    itemIds: [1, 5, 8, 11],
    description: "Sơ mi lụa trắng kết hợp blazer nâu và quần âu đen, giày loafer hoàn thiện vẻ ngoài tự tin chuyên nghiệp."
  },
  {
    id: 2,
    name: "Weekend Coffee Chill",
    occasion: "Casual",
    season: "Summer",
    isFavorite: true,
    createdByAi: true,
    itemIds: [2, 4, 10, 12],
    description: "Áo thun đen boxy cùng quần jeans ống suông và sneaker trắng, túi đeo chéo nâu tạo điểm nhấn phóng khoáng."
  }
];
