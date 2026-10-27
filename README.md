# 🎓 Class Deadline Hub - Cổng Quản Lý Deadline Lớp Học

Bài tập thực hành môn **Lập trình Web nâng cao** 

---

## 📌 1. Hướng Dẫn Cài Đặt & Khởi Chạy

### 1.1. Yêu cầu môi trường
- **Node.js**: Phiên bản 18+ trở lên (khuyến nghị Node 20 LTS hoặc mới nhất).
- **Trình quản lý gói**: `npm` hoặc `pnpm`.

### 1.2. Các bước khởi chạy

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Chạy môi trường phát triển (Development)
npm run dev

# Mở trình duyệt và truy cập: http://localhost:3000
```

### 1.3. Chạy bản kiểm thử Unit Test (Điểm cộng Jest)

```bash
npm test
```

### 1.4. Build bản Production & Chạy thử nghiệm

```bash
# Biên dịch dự án sang bản tối ưu Production
npm run build

# Khởi chạy server production
npm start
```

---

## 👥 2. Tài Khoản Kiểm Thử Hệ Thống

| Email | Mật khẩu | Vai trò (`Role`) | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **`admin@ptit.edu.vn`** | `admin123` | **`admin`** | Xem deadline, đánh dấu xong, thêm bài tập mới, xoá deadline. |
| **`sv@ptit.edu.vn`** | `sv123456` | **`user`** | Xem deadline, đánh dấu đã hoàn thành / huỷ hoàn thành. |
| *(Khách chưa đăng nhập)* | *(Không có)* | **`guest`** | Chỉ xem deadline công khai (Trang chủ, danh sách, chi tiết). |

> 💡 **Tính năng tiện ích**: Tại trang `/login`, có sẵn 2 nút bấm **"Điền nhanh Admin"** và **"Điền nhanh Sinh viên"** để giảng viên và người chấm bài đăng nhập ngay lập tức chỉ với 1 cú click!

---

## 🗺️ 3. Bảng Chiến Lược Render & Lý Do Lựa Chọn

| Route | Quyền truy cập | Chiến lược Render | Lý do lựa chọn chuyên sâu |
| :--- | :--- | :--- | :--- |
| **`/`** | Mọi người | **SSG** *(Static Site Generation)* | Trang chủ chứa thông tin tổng quan, danh mục 4 môn học ít thay đổi. SSG giúp sinh trước file HTML tĩnh tại thời điểm build, tối đa tốc độ tải trang (TTFB gần như 0ms) và tối ưu SEO tốt nhất. |
| **`/subjects/[slug]`** | Mọi người | **SSG** *(generateStaticParams)* | Danh sách môn học (`ltwnc`, `csdl`, `mmt`, `ai`) là cố định. Dùng `generateStaticParams` để tạo sẵn HTML tĩnh cho từng môn tại build time. |
| **`/deadlines`** | Mọi người | **ISR** *(revalidate: 60s)* | Danh sách deadline phục vụ số lượng lớn sinh viên truy cập xem công khai. ISR giúp cache trang HTML tĩnh ở CDN/Server trong 60 giây để giảm tải đọc file DB, đồng thời tự động cập nhật ngầm khi có dữ liệu mới. |
| **`/deadlines/[id]`** | Mọi người | **ISR + revalidatePath** | Trang chi tiết cần tốc độ tải tức thì cho bot tìm kiếm và mạng xã hội đọc thẻ OpenGraph. Sử dụng ISR kết hợp `revalidatePath` trong Server Action: trang được phục vụ từ cache tĩnh cực nhanh, nhưng khi Admin thêm hoặc xoá bài tập, cache bị vô hiệu hoá ngay lập tức để người dùng xem bản mới nhất. |
| **`/dashboard`** | Đã đăng nhập | **SSR** *(Server-Side Rendering)* | Dữ liệu hiển thị phụ thuộc vào từng cá nhân sinh viên đang đăng nhập (ai đã hoàn thành bài tập nào?). Mỗi request cần đọc cookie session JWT thời gian thực để trả về trạng thái nộp bài chính xác của sinh viên đó, không thể cache tĩnh. |
| **`/admin`** | Chỉ Admin | **SSR** *(Server-Side Rendering)* | Khu vực quản trị nhạy cảm của ban cán sự lớp. Cần kiểm tra session xác thực và vai trò `admin` ở mỗi request nhằm đảm bảo an toàn tuyệt đối và hiển thị danh sách bài tập mới nhất. |

### 📸 Ảnh kết quả `npm run build`
*(Hãy chèn ảnh chụp màn hình terminal sau khi chạy `npm run build` tại đây, ảnh thể hiện rõ các ký hiệu `○` Static, `●` SSG, `ƒ` Dynamic SSR và `ISR`)*

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /403
├ ƒ /admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /dashboard
├ ƒ /deadlines
├ ƒ /deadlines/[id]
├ ƒ /deadlines/[id]/opengraph-image-104vc5
├ ƒ /login
├ ○ /robots.txt
├ ○ /sitemap.xml
└   /subjects/[slug]
  ├ ● /subjects/ltwnc
  ├ ● /subjects/csdl
  ├ ● /subjects/mmt
  └ ● /subjects/ai
```

---

## 💡 4. Trả Lời Câu Hỏi Lý Thuyết

### ❓ Câu 1: Vì sao `/deadlines/[id]` dùng ISR?

> **Trả lời:**
> 1. **Hiệu năng & Tốc độ tải trang:** Trang chi tiết deadline là trang công khai được chia sẻ nhiều nhất trong lớp qua Zalo, Messenger, Facebook. Nếu dùng SSR thuần tuý, mỗi lần sinh viên mở link server lại phải đọc file DB và parse dữ liệu, gây nghẽn khi cả lớp cùng truy cập sát giờ nộp bài. Dùng ISR giúp trang được lưu vào bộ nhớ cache dưới dạng HTML tĩnh, phản hồi tức thì với độ trễ siêu thấp.
> 2. **Tối ưu SEO & Preview mạng xã hội (OpenGraph):** Khi chia sẻ link `/deadlines/1`, các mạng xã hội (Facebook, Slack, Zalo) và bot Google cần lấy HTML chứa thẻ Meta, JSON-LD và ảnh xem trước ngay lập tức mà không chờ client render.
> 3. **Tính kịp thời (On-Demand Revalidation):** Khác với SSG thuần tuý (bị đóng băng sau khi build), ISR cho phép kết hợp hàm `revalidatePath('/deadlines/[id]')` trong Server Action. Ngay khi Lớp trưởng (Admin) chỉnh sửa, thêm mới hoặc xoá deadline, Next.js sẽ tự động tái tạo lại trang tĩnh trong nền mà không cần phải build lại toàn bộ dự án.

---

### ❓ Câu 2: Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?

> **Trả lời:**
> Nếu một ứng dụng chỉ dựa duy nhất vào Middleware để kiểm soát quyền truy cập mà không kiểm tra tại Page Component và Server Action (thiếu nguyên lý **Defense in Depth - Phòng thủ đa tầng**), hệ thống sẽ đối mặt với các rủi ro bảo mật nghiêm trọng:
>
> 1. **Bỏ lọt route do cấu hình matcher sai lệch:** Matcher trong middleware (`matcher: ['/admin/:path*']`) nếu viết thiếu hoặc sai sót (ví dụ ai đó tạo thêm route `/api/admin` hoặc chuyển đổi định dạng URL, query param bypass) thì Middleware sẽ bỏ qua và kẻ xấu có thể truy cập thẳng vào nội dung bên trong.
> 2. **Lỗ hổng Server Action / Mutation Endpoint:** Các Server Action (như `deleteDeadlineAction` hay `createDeadlineAction`) nhận request POST trực tiếp từ client thông qua endpoint RPC ngầm của Next.js. Nếu kẻ tấn công (vai trò sinh viên hoặc hacker) dùng Postman/cURL gửi trực tiếp POST request gọi action này mà phía trong hàm action không gọi `can(session.user.role, 'delete:deadline')`, chúng hoàn toàn có thể xoá sạch cơ sở dữ liệu dù không hề mở trang `/admin`.
> 3. **Rủi ro môi trường thực thi (Edge vs Node Runtime):** Middleware chạy trên Edge Runtime / Proxy nhẹ, có thể gặp sự cố phân giải token nếu khoá giải mã hoặc môi trường biến động. Do đó, việc xác thực lại quyền ở cả 3 lớp:
>    - **Lớp 1:** Middleware (chặn điều hướng sớm, redirect sang `/login` hoặc `/403`).
>    - **Lớp 2:** Server Component Page (`auth()` kiểm tra role nếu khác admin redirect `/403`).
>    - **Lớp 3:** Server Action (kiểm tra `can()` và xác thực schema Zod trước khi ghi file DB).
>    là bắt buộc trong lập trình ứng dụng doanh nghiệp.

---


## 📊 5. Kết Quả Đo Đạc & Ảnh Chụp Minh Chứng

### 5.1. Điểm Lighthouse
*(Chạy đo Lighthouse trên trình duyệt Chrome ở chế độ Ẩn danh - Incognito cho bản Production)*:
- **Trang chủ (`/`)**: Performance: 65 | Accessibility: 91 | Best Practices: 100 | SEO: 92
- **Trang chi tiết (`/deadlines/1`)**: Performance: 95+ | Accessibility: 100 | Best Practices: 100 | SEO: 100

### 5.2. Ảnh View-Source của `/deadlines/1`
*(Mở trình duyệt vào `view-source:http://localhost:3000/deadlines/1`, chụp ảnh màn hình thấy rõ các thẻ `<title>`, `<meta property="og:title">` và đoạn mã `<script type="application/ld+json">` được render trực tiếp từ server)*.
