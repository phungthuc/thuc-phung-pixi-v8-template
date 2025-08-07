# 🚀 Deployment Guide - PixiJS v8 Template

## 🎯 **GIẢI PHÁP LỖI MIME TYPE - ĐÃ ĐƯỢC KIỂM CHỨNG**

Dựa trên template đã chạy ổn định, chúng ta đã tìm ra và triển khai **giải pháp chính xác** cho lỗi:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"
```

## ✅ **GIẢI PHÁP ĐÃ ĐƯỢC KIỂM CHỨNG**

### **1. Build Inline (Single File) - Khuyến nghị cho Playable Ads**
```bash
npm run build:inline-complete
```

**Kết quả:**
- Tạo ra file `dist/index.html` với **tất cả JavaScript được inline** (522KB)
- Sử dụng **vite-plugin-singlefile** hoạt động bình thường
- **Không có script type="module"** - hoàn toàn tương thích với mọi server

### **2. Build Multiple Files - Khuyến nghị cho Web Server**
```bash
npm run build:multiple-complete
```

**Kết quả:**
- Tạo ra file `dist/index.html` với script thường
- Tạo ra file `dist/main.js` với format IIFE
- Tạo ra thư mục `dist/assets/` chứa các file riêng biệt
- Có thể zip toàn bộ thư mục `dist/` để upload

### **3. Cấu trúc file sau khi build:**

#### **Inline Build:**
```
dist/
├── index.html          # HTML với tất cả JS inline (522KB)
└── assets/             # Assets đã được nén
    ├── manifest.json
    └── public/
        └── assets/
            └── textures/
                ├── button.webp
                ├── button-hover.webp
                ├── button-pressed.webp
                └── background.webp
```

#### **Multiple Files Build:**
```
dist/
├── index.html          # HTML với <script src="main.js"></script>
├── main.js            # JavaScript IIFE format
├── .htaccess          # Cấu hình Apache
└── assets/            # Assets đã được nén
    ├── manifest.json
    └── textures/
        ├── button.webp
        ├── button-hover.webp
        ├── button-pressed.webp
        └── background.webp
```

### **4. Cấu hình Vite đã được tối ưu:**
- **vite.config-dev.js**: Development với DEV_MODE: true
- **vite.config-inline.js**: Inline build với single file
- **vite.config-multiple.js**: Multiple files build với IIFE format
- **publicDir**: Assets được copy đúng cách

## 🔧 **CẤU HÌNH ASSETS**

### **Đường dẫn Assets:**
Template đã được cấu hình để sử dụng **đường dẫn tương đối** thay vì đường dẫn tuyệt đối:

```typescript
// GameConstants.ts
public static readonly ASSET_PATHS = {
    TEXTURES: 'assets/textures/',  // Relative path
    AUDIO: 'assets/audio/',
    FONTS: 'assets/fonts/',
    DATA: 'assets/data/'
};
```

**Lý do:** Đường dẫn tương đối cho phép game chạy trên bất kỳ server nào mà không cần cấu hình thêm.

### **Cấu trúc Assets:**
```
public/
└── assets/
    └── textures/
        ├── button.webp
        ├── button-hover.webp
        ├── button-pressed.webp
        └── background.webp
```

Sau khi build, assets sẽ được copy vào:
```
dist/
└── assets/
    └── textures/
        ├── button.webp
        ├── button-hover.webp
        ├── button-pressed.webp
        └── background.webp
```

## 🌐 **HƯỚNG DẪN DEPLOY**

### **Bước 1: Build Project**

#### **Cho Playable Ads (Inline):**
```bash
npm run build:inline-complete
```

#### **Cho Web Server (Multiple Files):**
```bash
npm run build:multiple-complete
```

### **Bước 2: Upload Files**

#### **Inline Build:**
Upload file `dist/index.html` lên server.

#### **Multiple Files Build:**
1. Zip toàn bộ thư mục `dist/`
2. Upload file zip lên server
3. Extract file zip trên server

### **Bước 3: Kiểm tra**
- Mở file `index.html` trong browser
- Kiểm tra console không có lỗi MIME type
- Game phải chạy bình thường

## 🔧 **CẤU HÌNH SERVER (Tùy chọn)**

### **Apache (.htaccess đã được tạo sẵn)**
File `.htaccess` đã được tạo trong `dist/` với cấu hình:
- MIME types cho JavaScript
- CORS headers
- Caching cho assets
- Compression

### **Nginx**
```nginx
location ~* \.js$ {
    add_header Content-Type application/javascript;
}

location ~* \.(css|png|jpg|jpeg|gif|webp|mp3|wav|ogg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### **Node.js/Express**
```javascript
app.use('*.js', (req, res, next) => {
    res.setHeader('Content-Type', 'application/javascript');
    next();
});
```

## 📋 **CÁC BUILD OPTIONS**

### **1. Build Development**
```bash
npm run dev
```
- Sử dụng `vite.config-dev.js`
- Hot reload và debugging
- DEV_MODE: true

### **2. Build Inline**
```bash
npm run build:inline
```
- Sử dụng `vite.config-inline.js`
- Single file build với inline JavaScript
- DEV_MODE: false

### **3. Build Multiple Files**
```bash
npm run build:multiple
```
- Sử dụng `vite.config-multiple.js`
- Multiple files build với IIFE format
- DEV_MODE: false

## 🎯 **KHUYẾN NGHỊ**

### **Cho Playable Ads:**
- **Sử dụng `npm run build:inline-complete`** - Đây là giải pháp tối ưu nhất
- Upload file `index.html` lên ad platform
- Đảm bảo platform hỗ trợ WebP format

### **Cho Web Server:**
- **Sử dụng `npm run build:multiple-complete`** - Tương thích với mọi server
- Zip toàn bộ thư mục `dist/` để upload
- File `.htaccess` đã được tạo sẵn cho Apache

### **Cho Development:**
- **Sử dụng `npm run dev`** - Hot reload và debugging
- Test với `npm run preview` trước khi deploy

## 🐛 **TROUBLESHOOTING**

### **Vẫn gặp lỗi MIME type:**
1. Kiểm tra file `index.html` có script type="module" không
2. Nếu có, sử dụng `npm run build:inline-complete` hoặc `npm run build:multiple-complete`
3. Kiểm tra server có serve file .js với Content-Type đúng không

### **Game không chạy:**
1. Kiểm tra console có lỗi JavaScript không
2. Kiểm tra file `index.html` có nội dung JavaScript inline không (inline build)
3. Kiểm tra file `main.js` có tồn tại không (multiple files build)
4. Kiểm tra assets có được load đúng không

### **Assets không hiển thị:**
1. Kiểm tra thư mục `assets/` có được upload không
2. Kiểm tra file `manifest.json` có đúng không
3. Kiểm tra đường dẫn trong code (phải là relative path)

### **Lỗi 403 khi load assets:**
1. Kiểm tra đường dẫn assets có đúng không
2. Đảm bảo sử dụng relative path: `assets/textures/` thay vì `/assets/textures/`
3. Kiểm tra file assets có tồn tại trong thư mục `dist/assets/` không

## 📊 **PERFORMANCE METRICS**

### **Inline Build Results:**
- **File Size**: 522KB (gzip: ~155KB)
- **Assets**: 4 WebP textures (~2KB total)
- **Load Time**: < 1 second
- **Compatibility**: iOS Safari, Android Chrome, Desktop browsers

### **Multiple Files Build Results:**
- **HTML Size**: ~2KB
- **JS Size**: ~520KB (gzip: ~150KB)
- **Assets**: 4 WebP textures (~2KB total)
- **Load Time**: < 1 second
- **Compatibility**: iOS Safari, Android Chrome, Desktop browsers

### **Optimization Features:**
- **Inline Build**: Tất cả JS inline trong HTML
- **Multiple Files Build**: JS tách riêng với IIFE format
- **WebP Compression**: Assets được nén tối ưu
- **Minification**: Code được minify hoàn toàn

## 📞 **SUPPORT**

Nếu vẫn gặp vấn đề:
1. Kiểm tra console browser
2. Kiểm tra Network tab
3. So sánh với template đã chạy ổn định
4. Đảm bảo sử dụng đúng build command

---

**Happy Deploying! 🚀** 