<template>
  <footer class="modern-footer-grid">
    <div class="footer-container">
      <div class="footer-content">
        
        <div class="link-group">
          <h3>VỀ IXTAL TOUR</h3>
          <a href="#" @click.prevent="openModal('cau_chuyen')">Câu chuyện thương hiệu</a>
          <a href="#" @click.prevent="openModal('cam_nang')">Cẩm nang du lịch</a>
          <a href="#" @click.prevent="openModal('doi_ngu')">Đội ngũ hướng dẫn viên</a>
          <a href="#" @click.prevent="openModal('tuyen_dung')">Tuyển dụng</a>
        </div>

        <div class="link-group">
          <h3>CHÍNH SÁCH & HỖ TRỢ</h3>
          <a href="#" @click.prevent="openModal('huong_dan_dat')">Hướng dẫn đặt tour</a>
          <a href="#" @click.prevent="openModal('thanh_toan')">Phương thức thanh toán</a>
          <a href="#" @click.prevent="openModal('chinh_sach_huy')">Chính sách hoàn hủy vé</a>
          <a href="#" @click.prevent="openModal('bao_hiem')">Bảo hiểm du lịch</a>
        </div>

        <div class="link-group">
          <h3>THÔNG TIN LIÊN HỆ</h3>
          <p><i class="fa-solid fa-location-dot me-2"></i> 03 Quang Trung, Hải Châu, Đà Nẵng</p>
          <p><i class="fa-solid fa-phone me-2"></i> Hotline: 0236 365 0403</p>
          <p><i class="fa-solid fa-envelope me-2"></i> Email: hotro@ixtaltour.com</p>
          <div class="social-icons mt-3">
            <a href="https://www.facebook.com/cuongphung1810" target="_blank"><i class="fa-brands fa-facebook"></i></a>
            <a href="https://www.facebook.com/cuongphung1810" target="_blank"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://www.facebook.com/cuongphung1810" target="_blank"><i class="fa-brands fa-youtube"></i></a>
            <a href="https://www.facebook.com/cuongphung1810" target="_blank"><i class="fa-brands fa-tiktok"></i></a>
          </div>
        </div>

        <div class="map-side">
          <div class="map-wrapper shadow-sm">
            <div class="map-search-box">
              <input type="text" v-model="searchQuery" @keyup.enter="searchLocation" placeholder="Tìm quốc gia, địa điểm...">
              <button @click="searchLocation"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div id="map" class="map-container"></div>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <p>© 2026 Ixtal Tour. Khám Phá Thế Giới Theo Cách Của Bạn.</p>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
        <div class="custom-modal-content shadow-lg">
          <div class="modal-header">
            <h4 class="fw-bold mb-0 text-uppercase" style="color: #125633; letter-spacing: 1px;">
              {{ modalData.title }}
            </h4>
            <button class="btn-close-modal" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body custom-scrollbar" v-html="modalData.content"></div>
        </div>
      </div>
    </Transition>

  </footer>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Trạng thái Bản đồ
let mapInstance = null;
const searchQuery = ref('');

// Trạng thái Modal
const showModal = ref(false);
const modalData = reactive({ title: '', content: '' });

// Dữ liệu nội dung 8 Modal
const modalsContent = {
  'cau_chuyen': {
    title: 'Câu chuyện thương hiệu',
    content: `
      <div class="text-center mb-4"><img src="https://ixtaltravel.deloydz.io.vn/assets/Logo-3-KgfldS.png" style="height:auto; width:100px; display:block; margin: 0 auto;" alt="Logo"></div>
      <p><strong>Ixtal Tour</strong> được thành lập với sứ mệnh mang đến những trải nghiệm du lịch đích thực và đẳng cấp nhất cho khách hàng. Chúng tôi không chỉ bán một chuyến đi, chúng tôi mang đến những câu chuyện, những kỷ niệm khó quên.</p>
      <p>Với nhiều năm kinh nghiệm trong ngành lữ hành, chúng tôi tự hào sở hữu mạng lưới đối tác toàn cầu, đội ngũ điều hành chuyên nghiệp và hàng ngàn khách hàng thân thiết. Hãy để Ixtal Tour đồng hành cùng bạn trên mọi nẻo đường khám phá thế giới.</p>
    `
  },
  'cam_nang': {
    title: 'Cẩm nang du lịch',
    content: `
      <h5 class="text-primary"><i class="fa-solid fa-book-open me-2"></i> Bí kíp cho mọi chuyến đi</h5>
      <p>Tại Ixtal Tour, chúng tôi liên tục cập nhật các thông tin cẩm nang du lịch hữu ích nhất:</p>
      <ul style="line-height: 1.8;">
        <li>Gợi ý các điểm đến hot nhất theo từng mùa trong năm.</li>
        <li>Kinh nghiệm xin Visa các nước Châu Á, Châu Âu tỷ lệ đậu cao.</li>
        <li>Mẹo chuẩn bị hành lý gọn nhẹ, tối ưu.</li>
        <li>Bản đồ ẩm thực đường phố không thể bỏ lỡ tại các quốc gia.</li>
      </ul>
      <p>Truy cập chuyên mục <b>Bài Viết / Cẩm Nang</b> trên menu chính để đọc thêm chi tiết.</p>
    `
  },
  'doi_ngu': {
    title: 'Đội ngũ hướng dẫn viên',
    content: `
      <h5 style="color: #125633;"><i class="fa-solid fa-users-viewfinder me-2"></i> Trái tim của Ixtal Tour</h5>
      <p>Đội ngũ Hướng dẫn viên (HDV) của chúng tôi được tuyển chọn khắt khe, đạt thẻ HDV Quốc tế và Nội địa do Tổng cục Du lịch cấp.</p>
      <p><strong>Tiêu chuẩn của một HDV Ixtal Tour:</strong></p>
      <ul>
        <li>Am hiểu sâu sắc về văn hóa, lịch sử, địa lý của điểm đến.</li>
        <li>Thành thạo ít nhất 2 ngoại ngữ (Anh, Trung, Hàn, Nhật...).</li>
        <li>Kỹ năng xử lý tình huống nhạy bén, luôn đặt an toàn của khách hàng lên hàng đầu.</li>
        <li>Nhiệt tình, vui vẻ, sẵn sàng trở thành một "nhiếp ảnh gia" có tâm cho du khách.</li>
      </ul>
    `
  },
  'tuyen_dung': {
    title: 'Tuyển dụng',
    content: `
      <h5 class="text-danger"><i class="fa-solid fa-briefcase me-2"></i> Gia nhập đại gia đình Ixtal Tour</h5>
      <p>Chúng tôi luôn mở rộng cửa chào đón những nhân tài đam mê xê dịch:</p>
      <ul>
        <li><strong>Vị trí Điều hành Tour:</strong> Yêu cầu 2 năm kinh nghiệm, kỹ năng sắp xếp lịch trình xuất sắc.</li>
        <li><strong>Vị trí Hướng dẫn viên Quốc tế:</strong> Yêu cầu thẻ HDV Quốc tế, IELTS 6.5 trở lên.</li>
        <li><strong>Chuyên viên Chăm sóc khách hàng:</strong> Không yêu cầu kinh nghiệm, được đào tạo bài bản.</li>
      </ul>
      <p>Gửi CV của bạn về email: <b>hr@ixtaltour.com</b> với tiêu đề [Vị trí ứng tuyển] - [Họ tên].</p>
    `
  },
  'huong_dan_dat': {
    title: 'Hướng dẫn đặt tour',
    content: `
      <h5><i class="fa-solid fa-cart-flatbed-suitcase me-2"></i> 4 Bước Đặt Tour Đơn Giản</h5>
      <ol style="line-height: 2;">
        <li><strong>Tìm kiếm:</strong> Nhập điểm đến hoặc tên tour vào thanh tìm kiếm trên trang chủ.</li>
        <li><strong>Chọn tour:</strong> Tham khảo kỹ lịch trình, giá cả, ngày khởi hành và số chỗ còn trống.</li>
        <li><strong>Điền thông tin:</strong> Nhập số lượng khách, thông tin người đi cùng và chọn Phương thức thanh toán.</li>
        <li><strong>Xác nhận:</strong> Hoàn tất thanh toán. Hệ thống sẽ tự động gửi <b>Vé điện tử (Mã QR)</b> về email của bạn.</li>
      </ol>
      <p class="text-muted fst-italic">Nếu cần hỗ trợ trong quá trình đặt, hãy sử dụng tính năng Chatbot AI hoặc gọi Hotline.</p>
    `
  },
  'thanh_toan': {
    title: 'Phương thức thanh toán',
    content: `
      <p>Ixtal Tour hỗ trợ đa dạng các hình thức thanh toán để mang lại sự tiện lợi tối đa cho quý khách:</p>
      <ul class="list-unstyled" style="line-height: 2.2;">
        <li><i class="fa-solid fa-credit-card text-primary me-2"></i> <strong>Cổng thanh toán VNPay:</strong> An toàn, bảo mật, hỗ trợ thẻ ATM nội địa, Visa/MasterCard.</li>
        <li><i class="fa-solid fa-qrcode text-success me-2"></i> <strong>Quét mã QR Ngân hàng:</strong> Tự động nhận diện nội dung chuyển khoản và số tiền.</li>
        <li><i class="fa-solid fa-money-bill-wave text-warning me-2"></i> <strong>Thanh toán tiền mặt:</strong> Trực tiếp tại văn phòng công ty (03 Quang Trung, Đà Nẵng).</li>
      </ul>
      <div class="alert alert-info mt-3"><i class="fa-solid fa-shield-halved me-2"></i> Mọi giao dịch trực tuyến đều được mã hóa SSL 256-bit an toàn tuyệt đối.</div>
    `
  },
  'chinh_sach_huy': {
    title: 'Điều khoản & Lưu ý',
    content: `
      <div style="margin-bottom: 20px;">
        <h5 style="color: #0d6efd; font-weight: bold;"><i class="fa-solid fa-child me-2"></i> Chính sách trẻ em</h5>
        <p style="font-weight: 600; margin-bottom: 5px;">1. Quy định chung:</p>
        <ul style="margin-bottom: 15px;">
          <li>Mỗi 02 người lớn được kèm 01 trẻ em.</li>
          <li>Từ trẻ thứ 02 trở đi, áp dụng mức giá theo quy định của từng nhóm tuổi.</li>
          <li>Trẻ em ngủ chung giường với bố mẹ.</li>
        </ul>
        <p style="font-weight: 600; margin-bottom: 5px;">2. Quy định theo độ tuổi:</p>
        <ul>
          <li><strong>Dưới 2 tuổi:</strong> Giá theo website. Ngủ chung giường với bố mẹ.</li>
          <li><strong>Từ 2 - 10 tuổi:</strong> Giá theo website. Bao gồm đầy đủ dịch vụ chương trình.</li>
          <li><strong>Từ 10 tuổi trở lên:</strong> Tính 100% giá người lớn.</li>
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <h5 style="color: #dc3545; font-weight: bold;"><i class="fa-solid fa-calendar-xmark me-2"></i> Chính sách hủy & thay đổi</h5>
        <table class="table table-bordered text-center" style="vertical-align: middle;">
          <thead class="table-light">
            <tr><th>Thời gian hủy</th><th>Mức phí áp dụng</th></tr>
          </thead>
          <tbody>
            <tr><td>Trước khởi hành 90 ngày</td><td class="fw-bold">5.000.000đ/khách</td></tr>
            <tr><td>Từ 45 - 89 ngày</td><td class="fw-bold">15.000.000đ/khách</td></tr>
            <tr><td>Từ 30 - 44 ngày</td><td class="fw-bold text-danger">50% tổng giá tour</td></tr>
            <tr><td>Từ 15 - 19 ngày</td><td class="fw-bold text-danger">100% tổng giá tour</td></tr>
          </tbody>
        </table>
        <p class="text-danger fst-italic mt-2"><i class="fa-solid fa-circle-exclamation me-1"></i> Lễ, Tết không hoàn, hủy, đổi: mất 100% giá trị tour.</p>
      </div>

      <div style="margin-bottom: 10px;">
        <h5 style="color: #0dcaf0; font-weight: bold;"><i class="fa-solid fa-passport me-2"></i> Thông tin Visa</h5>
        <ul>
          <li>Scan mặt hộ chiếu còn hạn trên 6 tháng.</li>
          <li>File ảnh 3,5 x 4,5 nền phông trắng, không đeo kính.</li>
          <li>Nộp hồ sơ ít nhất 15 ngày trước khởi hành.</li>
        </ul>
      </div>
      
      <div class="alert alert-warning py-2 mb-0" style="border-left: 4px solid #ffc107;">
        <i class="fa-solid fa-bell me-2"></i> <strong>Lưu ý:</strong> HDV sẽ liên lạc khoảng 2 ngày trước khởi hành để sắp xếp giờ đón.
      </div>
    `
  },
  'bao_hiem': {
    title: 'Bảo hiểm du lịch',
    content: `
      <h5 class="text-success"><i class="fa-solid fa-truck-medical me-2"></i> An tâm trên mọi nẻo đường</h5>
      <p>100% khách hàng đặt tour tại Ixtal Tour đều được tặng gói Bảo hiểm Du lịch nội địa hoặc Quốc tế cao cấp.</p>
      <ul>
        <li><strong>Tour trong nước:</strong> Mức bồi thường tối đa 100.000.000 VNĐ/vụ.</li>
        <li><strong>Tour quốc tế:</strong> Mức bồi thường tối đa 50.000 USD/vụ (bao gồm các chi phí y tế, thất lạc hành lý, trễ chuyến bay).</li>
      </ul>
      <p class="text-muted">Quý khách vui lòng cung cấp thông tin cá nhân chính xác (Họ tên, ngày sinh, CCCD/Hộ chiếu) để chúng tôi tiến hành mua bảo hiểm.</p>
    `
  }
};

// Hàm Mở Modal
const openModal = (key) => {
  if (modalsContent[key]) {
    modalData.title = modalsContent[key].title;
    modalData.content = modalsContent[key].content;
    showModal.value = true;
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang
  }
};

// Hàm Đóng Modal
const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = 'auto'; // Mở lại cuộn trang
};

// Thiết lập bản đồ khi Component được mount
onMounted(() => {
  // 1. Tọa độ mặc định (Đại học Duy Tân - 03 Quang Trung, Đà Nẵng)
  const defaultLat = 16.0763;
  const defaultLng = 108.2213;

  // 2. Khởi tạo bản đồ
  mapInstance = L.map('map', {
    center: [defaultLat, defaultLng],
    zoom: 15,
    attributionControl: false 
  });

  // 3. Sử dụng lớp nền CartoDB sáng, hiện đại
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(mapInstance);

  // 4. Custom Icon đẹp mắt
  const customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  // 5. Thêm Marker mặc định tại 03 Quang Trung
  const defaultMarker = L.marker([defaultLat, defaultLng], { icon: customIcon }).addTo(mapInstance)
    .bindPopup(`
      <div style="text-align: center;">
        <b style="color: #125633; font-size: 14px;">Ixtal Tour (Trụ sở chính)</b><br>
        <span style="color: #666; font-size: 12px;">03 Quang Trung, Hải Châu, Đà Nẵng</span>
      </div>
    `);

  // 6. Xử lý Geolocation (Định vị tự động)
  mapInstance.locate({ setView: true, maxZoom: 16 });

  mapInstance.on('locationfound', function(e) {
    // Nếu lấy được vị trí người dùng, thêm một cờ báo vị trí của họ
    L.marker(e.latlng).addTo(mapInstance)
      .bindPopup('<b style="color: #0d6efd;">Vị trí hiện tại của bạn</b>').openPopup();
  });

  mapInstance.on('locationerror', function(e) {
    // Nếu người dùng từ chối chia sẻ vị trí -> Về lại 03 Quang Trung
    mapInstance.setView([defaultLat, defaultLng], 15);
    defaultMarker.openPopup();
  });
});

// Hàm tìm kiếm địa điểm trên bản đồ bằng Nominatim API (OpenStreetMap)
const searchLocation = async () => {
  if (!searchQuery.value.trim()) return;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      const displayName = data[0].display_name;

      mapInstance.setView([lat, lon], 14);
      L.marker([lat, lon]).addTo(mapInstance)
        .bindPopup(`<div style="font-size: 12px; max-width: 200px;">${displayName}</div>`)
        .openPopup();
    } else {
      alert("Không tìm thấy địa điểm này. Vui lòng thử lại!");
    }
  } catch (error) {
    console.error("Lỗi tìm kiếm bản đồ:", error);
  }
};
</script>

<style scoped>
/* ================= CSS FOOTER ================= */
.modern-footer-grid { 
  background-color: #f4fdf8; 
  color: #1a3326; 
  padding: 4rem 24px 2rem; 
  border-top: 1px solid rgba(143, 223, 181, 0.4);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.footer-container { max-width: 1400px; margin: 0 auto; }

.footer-content { 
  display: grid; 
  grid-template-columns: 1fr 1fr 1.2fr 1.5fr; /* Chỉnh lại tỷ lệ chia cột để nhường chỗ cho bản đồ to hơn */
  gap: 30px; 
  padding-bottom: 3rem;
}

.link-group h3 { 
  font-size: 0.85rem; 
  font-weight: 700;
  letter-spacing: 0.15em; 
  color: #125633; 
  margin-bottom: 1.5rem; 
}

.link-group a { 
  display: block; 
  color: #2c5942; 
  text-decoration: none; 
  margin-bottom: 12px; 
  font-size: 0.95rem; 
  transition: all 0.3s ease;
}

.link-group p { color: #2c5942; margin-bottom: 12px; font-size: 0.95rem; }

.link-group a:hover { color: #8fdfb5; padding-left: 6px; font-weight: 500; }

.social-icons a {
  display: inline-block;
  color: #125633;
  font-size: 1.3rem;
  margin-right: 18px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.social-icons a:hover { color: #8fdfb5; transform: translateY(-4px); }

/* ================= BẢN ĐỒ & TÌM KIẾM ================= */
.map-wrapper {
  position: relative;
  width: 100%;
  height: 300px; /* Tăng chiều cao bản đồ */
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid rgba(143, 223, 181, 0.6);
  transition: box-shadow 0.3s ease;
}

.map-wrapper:hover { box-shadow: 0 10px 25px rgba(18, 86, 51, 0.15) !important; }

.map-container { width: 100%; height: 100%; }

/* Khung search đè lên bản đồ */
.map-search-box {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  background: white;
  border-radius: 25px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  overflow: hidden;
  width: 250px;
  border: 1px solid #e2e8f0;
}

.map-search-box input {
  border: none;
  padding: 8px 15px;
  outline: none;
  flex: 1;
  font-size: 0.85rem;
  background: transparent;
}

.map-search-box button {
  border: none;
  background: #125633;
  color: white;
  padding: 0 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.map-search-box button:hover { background: #1b7d6b; }

.footer-bottom { 
  text-align: center; 
  padding-top: 2rem; 
  border-top: 1px solid rgba(143, 223, 181, 0.3); 
  font-size: 0.9rem; 
  color: #6a9a80;
  font-weight: 500;
}

/* ================= MODAL HIỂN THỊ THÔNG TIN ================= */
.custom-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
}

.custom-modal-content {
  background: #ffffff;
  width: 100%; max-width: 650px;
  border-radius: 20px;
  max-height: 85vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.modal-header {
  padding: 20px 25px;
  background: #f4fdf8;
  border-bottom: 2px solid #8fdfb5;
  display: flex; justify-content: space-between; align-items: center;
}

.btn-close-modal {
  background: transparent; border: none; font-size: 1.5rem;
  color: #125633; cursor: pointer; transition: transform 0.2s;
}
.btn-close-modal:hover { transform: rotate(90deg); color: #dc3545; }

.modal-body { padding: 25px; overflow-y: auto; color: #333; line-height: 1.7; font-size: 0.95rem; }

/* Tùy chỉnh thanh cuộn trong modal */
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #8fdfb5; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #125633; }

/* Hiệu ứng Transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Reponsive */
@media (max-width: 1024px) {
  .footer-content { grid-template-columns: repeat(2, 1fr); }
  .map-wrapper { height: 350px; }
  .map-search-box { width: 200px; }
}

@media (max-width: 640px) {
  .footer-content { grid-template-columns: 1fr; }
  .custom-modal-content { width: 90%; max-height: 80vh; }
}
</style>