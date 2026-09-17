# MYFITDAILY - Your Personal AI Stylist Ecosystem

Hệ sinh thái thời trang thông minh MYFITDAILY gồm 2 thành phần chính:
- **`backend/`**: ASP.NET Core 8 Web API, Entity Framework Core, PostgreSQL Supabase, JWT Authentication, Gemini AI Stylist.
- **`frontend/`**: React 19, Vite, Three.js 3D Virtual Mannequin, Tailwind/Modern CSS UI.

---

## Cấu Trúc Dự Án

```
MYFITDAILY_EXE201_Group6/
├── backend/            # Thư mục chứa mã nguồn Web API (.NET 8)
│   ├── Controllers/
│   ├── DTOs/
│   ├── Entities/
│   ├── Services/
│   ├── Data/
│   ├── Migrations/
│   ├── Program.cs
│   └── MYFITDAILY_EXE201_Group6.csproj
├── frontend/           # Thư mục chứa giao diện người dùng (React + Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── MYFITDAILY.sln      # Solution file mở bằng Visual Studio / Rider
├── run-app.bat         # Chạy 1-Click cả Backend + Frontend & tự mở Web UI
└── run-app.ps1         # Script chạy nhanh cho PowerShell
```

---

## Cách Khởi Chạy Dự Án

### Cách 1: Chạy 1-Click (Khuyên dùng khi test giao diện)
- Nhấp đúp chuột vào file **`run-app.bat`** (hoặc chạy `.\run-app.bat` / `.\run-app.ps1` trong terminal).
- Hệ thống sẽ tự động bật đồng thời cả API lẫn Frontend và tự mở trình duyệt tại:
  - **Giao diện Web:** `http://localhost:5173`
  - **Tài liệu API (Swagger):** `http://localhost:5240/swagger`

---

### Cách 2: Chạy riêng từng phần

#### 1. Chạy Backend API:
```bash
cd backend
dotnet run
```
*API lắng nghe tại: `http://localhost:5240`*

#### 2. Chạy Frontend React:
```bash
cd frontend
npm run dev
```
*Giao diện mở tại: `http://localhost:5173` (đã cấu hình sẵn proxy `/api` sang `http://localhost:5240`)*

---

### Cách 3: Chạy bằng Visual Studio
1. Mở file **`MYFITDAILY.sln`** bằng Visual Studio 2022.
2. Nhấn nút Run (Play) hoặc phím `F5`. Hệ thống đã được thiết lập để ưu tiên mở trực tiếp giao diện Web (`http://localhost:5173`).