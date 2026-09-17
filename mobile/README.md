# MYFITDAILY Mobile App (Flutter)

Ứng dụng di động **MYFITDAILY – Your Personal AI Stylist** được xây dựng bằng Flutter, kết nối trực tiếp với Backend ASP.NET Core (`D:\EXE-Myfitdaily\Web`).

---

## Các tính năng chính

1. **Xác thực (Authentication)**: Đăng nhập, Đăng ký, lưu phiên làm việc an toàn với JWT Bearer Token.
2. **Trang chủ thời trang (Home / Feed)**: Gợi ý trang phục theo thời tiết thời gian thực, bảng tin xu hướng.
3. **Tủ đồ thông minh (Smart Wardrobe)**:
   - Quản lý quần áo theo từng danh mục (Áo, Quần, Váy, Áo khoác, Giày).
   - **Chụp ảnh thêm đồ mới (Camera & Gallery)**: Tích hợp tính năng tự động gọi Gemini AI scan ảnh để nhận diện loại trang phục, màu sắc, phong cách.
4. **Trợ lý AI Stylist**:
   - Chọn Dịp (Đi làm, Tiệc tối, Dạo phố...), Phong cách & Thời tiết.
   - AI phối set đồ từ tủ của người dùng, tính điểm hài hòa (Harmony Score) và đưa ra Stylist Notes chi tiết.
5. **Outfit Studio (Mix & Match)**: Ghép từng món đồ (Áo + Quần + Giày) trực quan trên điện thoại.
6. **Hồ sơ vóc dáng (Body Metrics)**: Cập nhật số đo 3 vòng, chiều cao, cân nặng và dáng người (Đồng hồ cát, Quả lê...) để AI tư vấn chuẩn xác.

---

## Cấu hình kết nối Backend

Địa chỉ API được đặt tại: `lib/core/constants/api_constants.dart`

```dart
// Nếu chạy trên Máy ảo Android (Android Emulator):
static const String baseUrl = 'http://10.0.2.2:5240/api';

// Nếu cắm điện thoại thật qua cáp USB:
// Thay bằng địa chỉ IP máy tính trong mạng Wi-Fi (ví dụ):
// static const String baseUrl = 'http://192.168.1.15:5240/api';
```

---

## Cách chạy dự án

1. **Khởi động Backend C# trước**:
   ```powershell
   cd D:\EXE-Myfitdaily\Web
   dotnet run
   ```

2. **Chạy ứng dụng Mobile**:
   ```powershell
   cd D:\EXE-Myfitdaily\Mobile
   flutter pub get
   flutter run
   ```
   Hoặc mở thư mục `D:\EXE-Myfitdaily\Mobile` bằng **Android Studio** hoặc **VS Code**, chọn thiết bị và nhấn **Run / F5**.
