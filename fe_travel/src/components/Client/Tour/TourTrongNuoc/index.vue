<template>
  <div class="tour-browse-container" style="background-color: #F2F7FA; min-height: 100vh; padding-bottom: 50px;">

    <!-- PAGE HEADER -->
    <div class="page-header text-center py-5 text-white"
      style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&w=1920&q=80') center/cover;">
      <h1 class="fw-bold text-white">Khám Phá Việt Nam</h1>
      <p class="fs-5 mt-2">Hành trình tuyệt vời trên mọi miền Tổ quốc cùng Ixtal Tour</p>
    </div>

    <div class="container mt-5">
      <div class="row">

        <!-- CỘT BỘ LỌC BÊN TRÁI -->
        <div class="col-lg-3 col-md-4 mb-4">
          <div class="sidebar-sticky">

            <div class="filters-wrapper p-4 rounded-4 bg-white shadow-sm border-0 mb-4">
              <h5 class="fw-bold mb-4" style="color: #125633;">Bộ lọc tìm kiếm</h5>

              <!-- LỌC THEO VÙNG MIỀN -->
              <div class="filter-group mb-4">
                <h6 class="fw-bold mb-3 d-flex align-items-center"><i class="bi bi-geo-alt-fill text-success me-2"></i>
                  Khu vực (Vùng miền)</h6>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="regionBac" value="Miền Bắc" v-model="filterRegions">
                  <label class="form-check-label text-secondary" for="regionBac">Miền Bắc</label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="regionTrung" value="Miền Trung" v-model="filterRegions">
                  <label class="form-check-label text-secondary" for="regionTrung">Miền Trung</label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="regionNam" value="Miền Nam" v-model="filterRegions">
                  <label class="form-check-label text-secondary" for="regionNam">Miền Nam</label>
                </div>
              </div>

              <!-- LỌC THỜI GIAN -->
              <div class="filter-group mb-4">
                <h6 class="fw-bold mb-3 d-flex align-items-center"><i
                    class="bi bi-calendar-event-fill text-success me-2"></i> Thời gian</h6>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="radio" name="duration" id="dur1" value="1"
                    v-model="filterDuration">
                  <label class="form-check-label text-secondary" for="dur1">Trong ngày (1 ngày)</label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="radio" name="duration" id="dur2" value="2-3"
                    v-model="filterDuration">
                  <label class="form-check-label text-secondary" for="dur2">Trung bình (2 - 3 ngày)</label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="radio" name="duration" id="dur3" value="4+"
                    v-model="filterDuration">
                  <label class="form-check-label text-secondary" for="dur3">Dài ngày (Từ 4 ngày)</label>
                </div>
              </div>

              <!-- LỌC MỨC GIÁ -->
              <div class="filter-group mb-4">
                <h6 class="fw-bold mb-3 d-flex align-items-center"><i class="bi bi-cash-coin text-success me-2"></i> Mức
                  giá</h6>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="price1" value="<2000000" v-model="priceRanges">
                  <label class="form-check-label text-secondary" for="price1">Dưới 2 triệu</label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="price2" value="2000000-5000000"
                    v-model="priceRanges">
                  <label class="form-check-label text-secondary" for="price2">2 - 5 triệu</label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" id="price3" value=">5000000" v-model="priceRanges">
                  <label class="form-check-label text-secondary" for="price3">Trên 5 triệu</label>
                </div>
              </div>

              <button class="btn w-100 rounded-pill fw-bold" style="background-color: #8fdfb5; color: #125633;"
                @click="resetFilters">
                <i class="bi bi-arrow-clockwise me-1"></i> Đặt lại bộ lọc
              </button>
            </div>

            <!-- CẨM NANG DU LỊCH -->
            <div class="articles-wrapper p-3 rounded-4 shadow-sm bg-white border-0">
              <h6 class="fw-bold text-uppercase mb-3" style="color: #005baa;">
                <i class="fa-solid fa-map-location-dot me-2"></i> Cẩm nang du lịch
              </h6>

              <div class="article-item mb-3 pb-2 border-bottom" v-for="(bai, index) in baiVietNoiBat" :key="index">
                <router-link :to="`/client/chi-tiet-bai-viet/${bai.id}`"
                  class="text-decoration-none text-dark d-flex gap-2 align-items-start">
                  <img :src="bai.hinh_anh" class="rounded" style="width: 60px; height: 60px; object-fit: cover;" alt="">
                  <div>
                    <h6 class="mb-1" style="font-size: 0.85rem; font-weight: 600; line-height: 1.3;">{{ bai.tieu_de }}
                    </h6>
                    <small class="text-muted" style="font-size: 0.75rem;">{{ bai.tag }}</small>
                  </div>
                </router-link>
              </div>

              <router-link to="/client/bai-viet" class="text-primary small fw-bold text-decoration-none">Xem tất cả bài viết <i
                  class="fa-solid fa-arrow-right ms-1"></i></router-link>
            </div>

          </div>
        </div>

        <!-- CỘT DANH SÁCH TOUR BÊN PHẢI -->
        <div class="col-lg-9 col-md-8">

          <!-- TOOLBAR TÌM KIẾM, SẮP XẾP & CHUYỂN ĐỔI GIAO DIỆN -->
          <div class="d-flex flex-wrap justify-content-between align-items-center bg-white p-3 rounded-4 shadow-sm mb-4 gap-3 border-light">
            <div class="input-group" style="max-width: 350px;">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input type="text" class="form-control border-start-0 ps-0 shadow-none"
                placeholder="Tìm tên tour trong nước..." v-model="filterSearch">
            </div>

            <div class="d-flex align-items-center gap-3">
              <!-- NÚT CHUYỂN ĐỔI GRID/LIST -->
              <div class="d-none d-sm-flex align-items-center border rounded-pill overflow-hidden bg-light" style="height: 38px;">
                <button
                  class="btn border-0 d-flex align-items-center justify-content-center h-100 px-3 view-toggle-btn rounded-start-pill"
                  :class="{ 'active': viewMode === 'grid' }"
                  @click="viewMode = 'grid'">
                  <i class="bi bi-grid" style="font-size: 1.1rem; line-height: 0;"></i>
                </button>
                <button
                  class="btn border-0 d-flex align-items-center justify-content-center h-100 px-3 view-toggle-btn rounded-end-pill"
                  :class="{ 'active': viewMode === 'list' }"
                  @click="viewMode = 'list'">
                  <i class="bi bi-list-ul" style="font-size: 1.2rem; line-height: 0;"></i>
                </button>
              </div>

              <div class="d-flex align-items-center">
                <span class="me-2 text-muted small d-none d-md-inline">Sắp xếp:</span>
                <select class="form-select border-0 shadow-none fw-bold" style="background-color: #F2F7FA;"
                  v-model="sortBy">
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>
            </div>
          </div>

          <!-- TRẠNG THÁI LOADING / TRỐNG -->
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border" style="color: #8fdfb5;" role="status"></div>
            <p class="mt-2 text-muted">Đang tìm kiếm...</p>
          </div>

          <div v-else-if="filteredAndSortedTours.length === 0"
            class="alert bg-white shadow-sm border-0 text-center py-5 rounded-4">
            <i class="bi bi-geo-alt fs-1 text-muted"></i>
            <h5 class="mt-3 fw-bold">Không tìm thấy tour trong nước phù hợp</h5>
            <p class="text-muted">Vui lòng thử lại với các tiêu chí lọc khác.</p>
            <button class="btn btn-outline-success rounded-pill" @click="resetFilters">Xóa bộ lọc</button>
          </div>

          <!-- DANH SÁCH TOUR -->
          <div v-else>
            
            <!-- ====== GIAO DIỆN LƯỚI 2 CỘT (GRID VIEW) ====== -->
            <div v-if="viewMode === 'grid'" class="row">
              <template v-for="(value, index) in filteredAndSortedTours" :key="index">
                <div class="col-lg-6 col-md-6 mb-4 mt-2 tour-grid-item" :style="{ animationDelay: `${index * 0.05}s` }">
                  <div class="card h-100 bg-white rounded-4 overflow-hidden shadow-sm d-flex flex-column tour-card-custom"
                    @click="viewDetail(value.id)">
                    
                    <div class="position-relative overflow-hidden" style="height: 250px;">
                      <img :src="getImageUrl(getFirstImage(value.hinh_anh))"
                        class="w-100 h-100 object-fit-cover tour-image-custom">
                      
                      <div class="position-absolute top-0 start-0 w-100 h-100" 
                           style="background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%);"></div>

                      <span class="position-absolute top-0 start-0 m-3 text-white px-3 py-1 rounded-pill shadow-sm glass-badge">
                        Còn {{ value.so_nguoi_toi_da }} chỗ
                      </span>
                    </div>

                    <div class="card-body p-4 d-flex flex-column flex-grow-1">
                      
                      <!-- BADGE ĐỊA ĐIỂM -->
                      <div class="mb-2">
                        <span class="badge px-2 py-1 rounded-pill" style="background-color: #e6f2ec; color: #1b6b43; font-weight: 600; font-size: 0.75rem;">
                          <i class="fa-solid fa-location-dot me-1"></i> {{ value.quoc_gia ? value.quoc_gia.ten_quoc_gia : 'Việt Nam' }}
                        </span>
                      </div>

                      <h3 class="fw-bold mb-3 tour-title-custom" 
                          style="font-size: 1.25rem; line-height: 1.4; color: #1b6b43;">
                        {{ value.ten_tour }}
                      </h3>

                      <div class="d-flex align-items-center mb-3" style="font-size: 1rem;">
                        <div class="d-flex gap-1 me-2" style="color: #FEE715;">
                          <i v-for="i in 5" :key="i" :class="getStarClass(value.avg_sao, i)" style="font-size: 0.95rem;"></i>
                        </div>
                        <span class="fw-bold text-dark me-1">{{ value.avg_sao ? Number(value.avg_sao).toFixed(1) : '5.0' }}</span>
                        <span class="text-secondary" style="font-size: 0.9rem;">({{ value.so_luot_danh_gia || 0 }} đánh giá)</span>
                      </div>

                      <div class="d-flex flex-column gap-2 mb-4" style="font-size: 0.9rem;">
                        <div>
                          <span class="text-secondary">Đón tại:</span> 
                          <span class="fw-bold text-secondary ms-1">{{ value.diem_don }}</span>
                        </div>
                        <div>
                          <span class="text-secondary">Thời gian:</span> 
                          <span class="fw-bold text-secondary ms-1">{{ calculateDays(value.ngay_bat_dau, value.ngay_ket_thuc) }} ngày</span>
                        </div>
                      </div>

                      <div class="d-flex align-items-end justify-content-between mt-auto pt-3 border-top border-light">
                        <div>
                          <div class="text-secondary mb-1" style="font-size: 0.85rem;">Khởi hành: {{ formatDate(value.ngay_bat_dau) }}</div>
                          <div class="fw-bold" style="font-size: 1.25rem; color: rgb(27, 107, 67);">
                            {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value.gia) }}
                          </div>
                        </div>
                        <button class="border-0 text-white fw-semibold px-4 py-2 rounded-3 btn-book-custom"
                                style="background-color: #1b6b43; font-size: 0.85rem;"
                                @click.stop="viewDetail(value.id)">
                          Đặt ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- ====== GIAO DIỆN DANH SÁCH (LIST VIEW) ====== -->
            <div v-else class="d-flex flex-column gap-4 mt-2">
              <template v-for="(value, index) in filteredAndSortedTours" :key="'list-'+index">
                <div class="card bg-white rounded-4 overflow-hidden shadow-sm d-flex flex-column flex-md-row tour-card-custom tour-list-item"
                     @click="viewDetail(value.id)" :style="{ animationDelay: `${index * 0.05}s` }">
                  
                  <div class="position-relative overflow-hidden tour-image-container-list flex-shrink-0">
                    <img :src="getImageUrl(getFirstImage(value.hinh_anh))" :alt="value.ten_tour"
                      class="w-100 h-100 object-fit-cover tour-image-custom">
                    
                    <span class="position-absolute top-0 start-0 m-3 text-white px-3 py-1 rounded-pill shadow-sm glass-badge">
                      Còn {{ value.so_nguoi_toi_da }} chỗ
                    </span>
                  </div>

                  <div class="card-body p-4 d-flex flex-column flex-grow-1 min-w-0">
                    
                    <!-- BADGE ĐỊA ĐIỂM -->
                    <div class="mb-2">
                      <span class="badge px-2 py-1 rounded-pill" style="background-color: #e6f2ec; color: #1b6b43; font-weight: 600; font-size: 0.75rem;">
                        <i class="fa-solid fa-location-dot me-1"></i> {{ value.quoc_gia ? value.quoc_gia.ten_quoc_gia : 'Việt Nam' }}
                      </span>
                    </div>

                    <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                      <h3 class="fw-bold mb-0 tour-title-custom" 
                          style="font-size: 1.35rem; line-height: 1.4; color: #1b6b43;">
                        {{ value.ten_tour }}
                      </h3>
                    </div>

                    <div class="d-flex align-items-center mb-3" style="font-size: 1rem;">
                      <div class="d-flex gap-1 me-2" style="color: #FEE715;">
                        <i v-for="i in 5" :key="i" :class="getStarClass(value.avg_sao, i)" style="font-size: 0.95rem;"></i>
                      </div>
                      <span class="fw-bold text-dark me-1">{{ value.avg_sao ? Number(value.avg_sao).toFixed(1) : '5.0' }}</span>
                      <span class="text-secondary" style="font-size: 0.9rem;">({{ value.so_luot_danh_gia || 0 }} đánh giá)</span>
                    </div>

                    <!-- MÔ TẢ NGẮN (CHỈ HIỆN Ở LIST VIEW) -->
                    <p class="text-secondary tour-desc-custom mb-3" style="font-size: 0.95rem; line-height: 1.5;">
                      {{ value.mo_ta || 'Cùng khám phá những cảnh đẹp tuyệt vời và trải nghiệm văn hóa độc đáo trong chuyến hành trình này...' }}
                    </p>

                    <div class="d-flex flex-column gap-2 mb-4" style="font-size: 0.95rem;">
                      <div>
                        <span class="text-secondary">Đón tại:</span> 
                        <span class="fw-bold text-secondary ms-1">{{ value.diem_don }}</span>
                      </div>
                      <div>
                        <span class="text-secondary">Thời gian:</span> 
                        <span class="fw-bold text-secondary ms-1">{{ calculateDays(value.ngay_bat_dau, value.ngay_ket_thuc) }} ngày</span>
                      </div>
                    </div>

                    <div class="d-flex align-items-end justify-content-between mt-auto pt-3 border-top border-light">
                      <div>
                        <div class="text-secondary mb-1" style="font-size: 0.9rem;">Khởi hành: {{ formatDate(value.ngay_bat_dau) }}</div>
                        <div class="fw-bold text-danger" style="font-size: 1.35rem;">
                          {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value.gia) }}
                        </div>
                      </div>
                      <button class="border-0 text-white fw-semibold px-4 py-2 rounded-3 btn-book-custom"
                              style="background-color: #1b6b43; font-size: 0.9rem;"
                              @click.stop="viewDetail(value.id)">
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>

          </div>

          <!-- PHÂN TRANG -->
          <div v-if="totalPages > 1" class="d-flex justify-content-center mt-5 mb-3">
            <ul class="pagination shadow-sm custom-pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link px-3" @click="currentPage--">Trước</button>
              </li>
              <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <button class="page-link" @click="currentPage = page">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link px-3" @click="currentPage++">Sau</button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import apiUrl from '../../../../utils/api'

const VIETNAM_REGIONS = {
  'Miền Bắc': [
    'Hà Nội', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Điện Biên', 'Lai Châu', 'Sơn La', 'Yên Bái', 'Hòa Bình', 'Thái Nguyên', 'Lạng Sơn', 'Quảng Ninh', 'Bắc Giang', 'Phú Thọ', 'Vĩnh Phúc', 'Bắc Ninh', 'Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình', 'Hà Nam', 'Nam Định', 'Ninh Bình'
  ],
  'Miền Trung': [
    'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng', 'Đà Lạt'
  ],
  'Miền Nam': [
    'Bình Phước', 'Tây Ninh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Bà Rịa Vũng Tàu', 'Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp', 'An Giang', 'Kiên Giang', 'Phú Quốc', 'Cần Thơ', 'Hậu Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau'
  ]
};

export default {
  data() {
    return {
      isLoading: true,
      allTours: [],
      filteredTours: [],

      baiVietNoiBat: [], 
      danhSachIdBaiViet: [1, 4, 5],

      filterSearch: '',
      filterRegions: [], 
      filterDuration: '',
      priceRanges: [],
      sortBy: 'newest',
      
      viewMode: 'grid', 

      currentPage: 1,
      pageSize: 8, 
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredTours.length / this.pageSize);
    },

    filteredAndSortedTours() {
      let results = this.filteredTours.slice();

      if (this.sortBy === 'price-asc') results.sort((a, b) => parseFloat(a.gia) - parseFloat(b.gia));
      else if (this.sortBy === 'price-desc') results.sort((a, b) => parseFloat(b.gia) - parseFloat(a.gia));
      else if (this.sortBy === 'newest') results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      else if (this.sortBy === 'rating') results.sort((a, b) => parseFloat(b.avg_sao || 0) - parseFloat(a.avg_sao || 0));

      const startIndex = (this.currentPage - 1) * this.pageSize;
      return results.slice(startIndex, startIndex + this.pageSize);
    }
  },
  mounted() {
    this.fetchDomesticTours();
    this.fetchArticles(); 
  },
  watch: {
    filterSearch() { this.applyFilters(); },
    filterRegions: { handler() { this.applyFilters(); }, deep: true },
    filterDuration() { this.applyFilters(); },
    priceRanges: { handler() { this.applyFilters(); }, deep: true },
    sortBy() { this.currentPage = 1; }
  },
  methods: {
    // Hàm lấy ảnh đầu tiên an toàn từ mảng hoặc chuỗi
    getFirstImage(hinh_anh) {
        if (!hinh_anh) return 'https://via.placeholder.com/400x300?text=No+Image';
        
        // Nếu là mảng
        if (Array.isArray(hinh_anh)) {
            return hinh_anh.length > 0 ? hinh_anh[0] : 'https://via.placeholder.com/400x300';
        }
        
        // Nếu là chuỗi JSON
        try {
            let parsed = JSON.parse(hinh_anh);
            return Array.isArray(parsed) ? parsed[0] : parsed;
        } catch (e) {
            return hinh_anh; // Trả về nguyên bản nếu là chuỗi URL thường
        }
    },

    // Hàm lấy URL ảnh chính xác
    getImageUrl(url) {
        if (!url) return 'https://via.placeholder.com/400x300';
        // Loại bỏ đuôi size (ví dụ: -450x265) để lấy ảnh gốc rõ nét nhất
        return url.replace(/-\d+x\d+/g, '');
    },
    async fetchDomesticTours() {
      this.isLoading = true;
      try {
        const response = await axios.get(apiUrl('client/tour/get-data'));
        if (response.data.status) {
          this.allTours = response.data.data
            .filter(tour => tour.id_quoc_gia === 1 && tour.so_nguoi_toi_da > 0)
            .map(tour => {
              // Ép kiểu hinh_anh thành mảng ngay khi tải về
              if (typeof tour.hinh_anh === 'string') {
                try {
                    tour.hinh_anh = JSON.parse(tour.hinh_anh);
                } catch(e) {
                    tour.hinh_anh = [tour.hinh_anh];
                }
              }
              return tour;
            });
          this.applyFilters();
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchArticles() {
      try {
        const response = await axios.get(apiUrl('client/trang-chu/get-data'));
        if (response.data.status) {
          const tatCaBaiViet = response.data.data.baiViets || [];
          this.baiVietNoiBat = tatCaBaiViet.filter(bai => this.danhSachIdBaiViet.includes(bai.id));
        }
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      }
    },

    applyFilters() {
      let results = this.allTours.slice();

      if (this.filterSearch) {
        results = results.filter(t => t.ten_tour.toLowerCase().includes(this.filterSearch.toLowerCase()));
      }

      if (this.filterRegions.length > 0) {
        let allowedCities = [];
        this.filterRegions.forEach(region => {
            allowedCities = allowedCities.concat(VIETNAM_REGIONS[region]);
        });

        results = results.filter(t => {
            if (t.lich_trinhs && t.lich_trinhs.length > 0) {
                return t.lich_trinhs.some(lt => {
                    if (lt.diem_den && lt.diem_den.thanh_pho) {
                        return allowedCities.some(city => lt.diem_den.thanh_pho.includes(city) || city.includes(lt.diem_den.thanh_pho));
                    }
                    return false;
                });
            }
            return false;
        });
      }

      if (this.filterDuration) {
        results = results.filter(t => {
          const days = this.calculateDays(t.ngay_bat_dau, t.ngay_ket_thuc);
          if (this.filterDuration === '1') return days <= 1;
          if (this.filterDuration === '2-3') return days >= 2 && days <= 3;
          if (this.filterDuration === '4+') return days >= 4;
        });
      }

      if (this.priceRanges.length > 0) {
        results = results.filter(t => {
          const price = parseFloat(t.gia);
          return this.priceRanges.some(r => {
            if (r === '<2000000') return price < 2000000;
            if (r === '2000000-5000000') return price >= 2000000 && price <= 5000000;
            if (r === '>5000000') return price > 5000000;
          });
        });
      }

      this.filteredTours = results;
      this.currentPage = 1;
    },

    resetFilters() {
      this.filterSearch = '';
      this.filterRegions = []; 
      this.filterDuration = '';
      this.priceRanges = [];
      this.sortBy = 'newest';
      this.applyFilters();
    },

    calculateDays(start, end) {
      if (!start || !end) return 1;
      return Math.ceil(Math.abs(new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const d = new Date(dateString);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    },

    viewDetail(id) { this.$router.push(`/client/chi-tiet-tour/${id}`); },

    getStarClass(rating, index) {
      const val = rating ? parseFloat(rating) : 5; 
      if (val >= index) {
        return 'fa-solid fa-star'; 
      } else if (val >= index - 0.5) {
        return 'fa-solid fa-star-half-alt'; 
      } else {
        return 'fa-regular fa-star text-secondary opacity-50'; 
      }
    }
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tour-grid-item, .tour-list-item {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.form-check-input:checked {
  background-color: #125633;
  border-color: #125633;
}

.sidebar-sticky {
  position: sticky;
  top: 20px;
  z-index: 10;
}
.sidebar-sticky::-webkit-scrollbar { width: 4px; }
.sidebar-sticky::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

.view-toggle-btn {
  color: #6c757d;
  background-color: transparent;
  transition: all 0.2s ease;
}
.view-toggle-btn:hover:not(.active) {
  background-color: #e9ecef;
  color: #343a40;
}
.view-toggle-btn.active {
  background-color: #1b6b43 !important;
  color: white !important;
}

.glass-badge {
  background: rgba(158, 247, 244, 0.65); 
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.tour-card-custom {
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}
.tour-card-custom:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(27, 107, 67, 0.12) !important;
  border-color: rgba(27, 107, 67, 0.2) !important;
}

.tour-image-custom {
  transition: transform 0.6s ease;
}
.tour-card-custom:hover .tour-image-custom {
  transform: scale(1.08); 
}

/* Fix lỗi thò thụt bằng việc cố định Height cho hình ảnh List View */
.tour-image-container-list { width: 100%; height: 350px; }
@media (min-width: 768px) {
  .tour-image-container-list { width: 320px; height: 360px; }
}

.tour-title-custom {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}
.tour-card-custom:hover .tour-title-custom {
  color: #125633 !important; 
}

/* CSS tự động cắt 2 dòng và thêm ... cho đoạn mô tả ngắn */
.tour-desc-custom {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-book-custom {
  transition: all 0.3s ease;
}
.btn-book-custom:hover {
  background-color: #155535 !important;
  transform: scale(1.05); 
  box-shadow: 0 4px 10px rgba(21, 85, 53, 0.3);
}

.custom-pagination .page-item.active .page-link {
  background-color: #1b6b43;
  border-color: #1b6b43;
  color: white;
  box-shadow: 0 4px 8px rgba(27, 107, 67, 0.3);
}
.custom-pagination .page-link {
  color: #1b6b43;
  border: none;
  margin: 0 4px;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.custom-pagination .page-link:hover {
  background-color: #e6f2ec;
  transform: translateY(-2px);
}
</style>