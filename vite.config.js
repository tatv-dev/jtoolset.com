import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Đảm bảo các đường dẫn gốc được cấu hình chính xác
  root: process.cwd(), // Sử dụng thư mục gốc của dự án
  base: '/', // Đường dẫn gốc cho các asset

  plugins: [react()],
  resolve: {
    alias: {
      // Sử dụng path.resolve để tạo đường dẫn tuyệt đối
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Cấu hình server để giải quyết vấn đề load file
  server: {
    // Đảm bảo máy chủ phát triển hoạt động chính xác
    port: 3000, // Có thể thay đổi nếu cần
    open: true, // Tự động mở trình duyệt
    strictPort: true, // Báo lỗi nếu port bị chiếm
    
    // Cấu hình resolve module
    fs: {
      allow: [
        // Cho phép truy cập các thư mục
        path.resolve(__dirname, ''),
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'public'),
      ]
    }
  },

  // Cấu hình build 
  build: {
    // Thư mục đích cho các file build
    outDir: 'dist',
    
    // Kiểm soát việc chia nhỏ file
    rollupOptions: {
      input: {
        // Đảm bảo entry point được xác định chính xác
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
});