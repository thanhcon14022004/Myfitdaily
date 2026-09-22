# Hướng Dẫn Sử Dụng AI Server Thử Đồ Trên Google Colab (100% Free)

Tài liệu này hướng dẫn bạn cách khởi chạy **AI Server Virtual Try-On riêng** trên Google Colab có GPU **NVIDIA Tesla T4 (16GB VRAM)** miễn phí, không tốn 1 xu, không lo giới hạn quota hay người khác tranh chấp hàng đợi!

---

## 🚀 Bước 1: Mở File Notebook Lên Google Colab

1. Mở trình duyệt và truy cập: **[https://colab.research.google.com/](https://colab.research.google.com/)**
2. Đăng nhập bằng bất kỳ tài khoản Google / Gmail nào của bạn.
3. Chọn tab **Upload (Tải lên)** ➔ Chọn file:
   `D:\EXE-Myfitdaily\AI_Colab\MyFitDaily_Virtual_TryOn_Colab.ipynb`

---

## ⚡ Bước 2: Bật Card Đồ Họa T4 Miễn Phí

1. Trên thanh menu trên cùng của Colab, chọn:
   **Runtime** ➔ **Change runtime type** (hoặc *Thời lượng chạy* ➔ *Thay đổi loại thời lượng chạy*).
2. Tại mục **Hardware accelerator (Trình tăng tốc phần cứng)**:
   - Chọn: **T4 GPU**
3. Bấm **Save (Lưu)**.

---

## ▶️ Bước 3: Chạy Server AI

1. Bấm tổ hợp phím **Ctrl + F9** (hoặc menu **Runtime ➔ Run all**).
2. Colab sẽ tự động:
   - Cài đặt thư viện AI CatVTON
   - Tải model vào GPU T4
   - Mở đường truyền bảo mật Cloudflare Tunnel
3. Sau khoảng 2-3 phút, ở ô code cuối cùng sẽ in ra dòng chữ màu xanh:
   ```
   ============================================================
   🎉 AI SERVER ĐÃ KHỞI CHẠY THÀNH CÔNG!
   👉 COPY LINK NÀY DÁN VÀO WEB MYFITDAILY: https://random-name.trycloudflare.com
   ============================================================
   ```
4. **Bạn chỉ cần bôi đen và Copy đường link `https://....trycloudflare.com` đó.**

---

## 🌐 Bước 4: Dán Link Vào MyFitDaily Web

1. Mở trang web MyFitDaily tại: `http://localhost:5173/studio`
2. Bấm vào biểu tượng **Chìa khóa 🔑 / Cài đặt AI** ở bên cạnh nút Thử đồ.
3. Dán link vừa copy vào ô **"Server Google Colab Riêng"** ➔ Bấm **Lưu & Kết Nối**.
4. Xong! Bây giờ mỗi khi bạn chọn áo và bấm thử đồ:
   - Web sẽ gửi trực tiếp đến GPU Colab riêng của bạn.
   - AI dệt đồ thật lên người mẫu trong vòng **4 – 6 giây**!
   - Không bị ai tranh chấp, hoàn toàn miễn phí.

---

## 🎓 Bước 5: Cách Huấn Luyện (Training / Fine-Tuning) Thêm

Trong chính file Colab đó, phần **Bước 5** đã có sẵn hướng dẫn và mã lệnh:
* Bạn chỉ cần chuẩn bị thư mục ảnh thời trang riêng (thương hiệu Việt Nam, phong cách đường phố, form người mẫu riêng).
* Chạy script huấn luyện để tạo trọng số LoRA riêng cho dự án MyFitDaily của bạn!
