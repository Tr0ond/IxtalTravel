import tenant from '../config/tenant.json';

export function apiUrl(path) {
  // 1. Ưu tiên lấy từ file .env trước (import.meta.env.VITE_API_URL)
  // 2. Nếu không có thì lấy từ file tenant.json
  // 3. Nếu cả 2 đều không có thì dùng mặc định localhost
  const rawBaseUrl = import.meta.env.VITE_API_URL || tenant.base_url || 'http://127.0.0.1:8000/api/';
  
  // Xóa dấu '/' ở cuối base_url (nếu có) để tránh bị lỗi URL //
  const base = rawBaseUrl.replace(/\/+$/, '') || '';
  
  // Xóa dấu '/' ở đầu path (nếu có)
  const p = String(path || '').replace(/^\/+/, '');
  
  // Nối lại thành URL hoàn chỉnh
  return `${base}/${p}`;
}

export default apiUrl;