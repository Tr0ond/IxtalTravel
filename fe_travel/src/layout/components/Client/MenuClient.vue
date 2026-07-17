<template>
  <header class="header-vung shadow-sm" style="background-color: #f3fffd !important;">
    <nav class="navbar navbar-expand-lg py-2 px-3 px-lg-4">
      <div class="container-fluid px-2">
        
        <!-- LOGO -->
        <router-link to="/" class="navbar-brand fw-bold fs-4 d-flex align-items-center me-3">
          <img src="../../../assets/images/Logo1.png" alt="Ixtal Tour" class="logo-chinh">
        </router-link>

        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#menuChinh">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse d-lg-flex align-items-center" id="menuChinh">
          
          <!-- THANH TÌM KIẾM -->
          <div class="vung-tim-kiem d-none d-lg-block position-relative me-auto ms-2" ref="searchContainer">
            <div class="input-group search-box-premium shadow-sm">
              <input type="text" class="form-control vung-nhap-lieu border-0 ps-4 text-dark shadow-none"
                v-model="tuKhoaTimKiem" 
                @input="goiApiGoiYTimKiem"
                @focus="hienThiGoiY = true"
                @keyup.enter="thucHienTimKiem"
                placeholder="Tìm kiếm tour, điểm đến...">
              
              <span class="input-group-text bg-transparent border-0 cursor-pointer px-2" 
                v-if="tuKhoaTimKiem" @click="xoaTimKiem">
                <i class="fa-solid fa-xmark text-secondary small"></i>
              </span>

              <button class="btn btn-tim-kiem px-3 border-0" @click="thucHienTimKiem">
                <i class="fa-solid fa-magnifying-glass text-white"></i>
              </button>
            </div>

            <!-- Khung Gợi ý -->
            <transition name="fade-slide">
              <ul class="dropdown-menu show w-100 shadow-lg border-0 position-absolute mt-2 goiy-dropdown goi-y-container" 
                  v-if="hienThiGoiY && danhSachGoiY.length > 0">
                  <li class="px-3 py-2 text-muted small border-bottom fw-bold text-uppercase">Tour gợi ý</li>
                  <li v-for="(tour, index) in danhSachGoiY.slice(0, 5)" :key="index">
                      <a class="dropdown-item d-flex align-items-center py-2 hover-glow" href="javascript:void(0)" @click="chonTourTuGoiY(tour.id)">
                          <img :src="getImageUrl(getFirstImage(tour.hinh_anh))" class="rounded-3 me-3 shadow-sm" style="width: 45px; height: 45px; object-fit: cover;">
                          <div class="flex-grow-1 overflow-hidden">
                              <h6 class="mb-0 text-dark text-truncate fs-6 fw-bold">{{ tour.ten_tour }}</h6>
                              <small class="text-danger fw-bold">{{ formatVND(tour.gia) }}</small>
                          </div>
                      </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                      <a class="dropdown-item text-center text-primary fw-bold py-2 hover-glow" href="javascript:void(0)" @click="thucHienTimKiem">
                          Xem tất cả kết quả <i class="fa-solid fa-arrow-right ms-1"></i>
                      </a>
                  </li>
              </ul>
            </transition>
          </div>

          <!-- MENU ĐIỀU HƯỚNG CHÍNH (Icon không màu, Tour có mũi tên xuống) -->
          <ul class="navbar-nav align-items-center gap-1 me-3">
            <li class="nav-item dropdown">
              <a class="nav-link px-3 btn-hover-effect fw-semibold text-dark d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fa-solid fa-earth-americas me-1 text-secondary"></i> Tour 
                <i class="fa-solid fa-chevron-down ms-1" style="font-size: 0.7rem;"></i>
              </a>
              <ul class="dropdown-menu shadow-lg border-0 rounded-3 mt-2 dropdown-animation">
                <li>
                  <router-link class="dropdown-item py-2 hover-glow fw-medium d-flex align-items-center" to="/client/tour/tour-trong-nuoc">
                    <i class="fa-solid fa-angle-right me-2 text-muted" style="font-size: 0.75rem;"></i> Trong Nước
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item py-2 hover-glow fw-medium d-flex align-items-center" to="/client/tour/tour-ngoai-nuoc">
                    <i class="fa-solid fa-angle-right me-2 text-muted" style="font-size: 0.75rem;"></i> Nước Ngoài
                  </router-link>
                </li>
              </ul>
            </li>
            <li>
            <router-link to="/client/lich-su-dat-tour" class="nav-link position-relative btn-hover-effect p-2 rounded-3 d-flex align-items-center">
              <i class="fa-solid fa-file-invoice me-1 text-secondary"></i>
              <span class="fw-bold text-dark ms-2 d-none d-xl-inline">Hóa đơn</span>
              
              <span class="badge-thong-bao-so shadow-sm" v-if="isLoggedIn && so_luong_hoa_don_chua_tt > 0">
                {{ so_luong_hoa_don_chua_tt }}
              </span>
            </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/client/huong-dan-vien" class="nav-link px-3 btn-hover-effect fw-semibold text-dark">
                <i class="fa-solid fa-users me-1 text-secondary"></i> Hướng Dẫn Viên
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/client/bai-viet" class="nav-link px-3 btn-hover-effect fw-semibold text-dark">
                <i class="fa-solid fa-newspaper me-1 text-secondary"></i> Blog
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/client/lien-he" class="nav-link px-3 btn-hover-effect fw-semibold text-dark">
                <i class="fa-solid fa-headset me-1 text-secondary"></i> Liên Hệ
              </router-link>
            </li>
          </ul>

          <!-- NHÓM BIỂU TƯỢNG BÊN PHẢI -->
          <div class="d-flex align-items-center gap-3 nhom-bieu-tuong">
            <!-- TRẠNG THÁI CHƯA ĐĂNG NHẬP -->
            <template v-if="!isLoggedIn">
              <!-- Đăng nhập -->
              <div class="dropdown">
                <button class="btn btn-outline-primary rounded-pill px-3 fw-bold border-2 btn-sm-custom d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                  <i class="fa-solid fa-right-to-bracket me-1"></i> Đăng nhập 
                  <i class="fa-solid fa-chevron-down ms-1" style="font-size: 0.7rem;"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 p-2 dropdown-animation">
                  <li class="mb-1">
                    <router-link class="dropdown-item py-2 hover-glow rounded-2 d-flex align-items-center fw-medium" to="/client/dang-nhap">
                      <i class="fa-solid fa-user text-primary me-2 w-20px text-center"></i> Khách hàng
                    </router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item py-2 hover-glow rounded-2 d-flex align-items-center fw-medium" to="/huong-dan-vien/dang-nhap">
                      <i class="fa-solid fa-id-badge text-warning me-2 w-20px text-center"></i> Hướng dẫn viên
                    </router-link>
                  </li>
                </ul>
              </div>

              <!-- Đăng ký -->
              <div class="dropdown">
                <button class="btn btn-primary rounded-pill px-3 fw-bold btn-gradient border-0 btn-sm-custom text-white shadow-sm d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                  <i class="fa-solid fa-user-plus me-1"></i> Đăng ký 
                  <i class="fa-solid fa-chevron-down ms-1" style="font-size: 0.7rem;"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 p-2 dropdown-animation">
                  <li class="mb-1">
                    <router-link class="dropdown-item py-2 hover-glow rounded-2 d-flex align-items-center fw-medium" to="/client/dang-ky">
                      <i class="fa-solid fa-user text-success me-2 w-20px text-center"></i> Khách hàng
                    </router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item py-2 hover-glow rounded-2 d-flex align-items-center fw-medium" to="/huong-dan-vien/dang-ky">
                      <i class="fa-solid fa-id-badge text-info me-2 w-20px text-center"></i> Hướng dẫn viên
                    </router-link>
                  </li>
                </ul>
              </div>
            </template>

            <!-- TRẠNG THÁI ĐÃ ĐĂNG NHẬP (Hồ sơ) -->
            <template v-else>
              <div class="dropdown border-start border-secondary-subtle ps-3">
                <a class="nav-link d-flex align-items-center gap-2 p-1 btn-hover-effect rounded-pill pe-3" href="#" role="button" data-bs-toggle="dropdown" style="border: 1px solid #e2e8f0;">
                  <img :src="avatar_kh" class="anh-nguoi-dung rounded-circle shadow-sm" alt="User Avatar" />
                  <span class="fw-bold text-dark text-truncate d-none d-sm-block" style="max-width: 230px; font-size: 0.85rem;">
                    {{ ho_va_ten || 'Tài khoản' }}
                  </span>
                  <!-- Mũi tên xổ xuống cho phần Hồ sơ -->
                  <i class="fa-solid fa-chevron-down text-secondary" style="font-size: 0.7rem;"></i>
                </a>

                <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 dropdown-animation" style="min-width: 250px; border-radius: 12px; padding: 0;">
                  <li class="px-4 py-3 border-bottom text-center bg-light" style="border-top-left-radius: 12px; border-top-right-radius: 12px;">
                    <img :src="avatar_kh" class="rounded-circle mb-2 shadow-sm border border-2 border-white" width="60" height="60" style="object-fit: cover;">
                    <p class="mb-0 fw-bold text-dark fs-6 mt-1">{{ ho_va_ten }}</p>
                    <small class="text-muted">{{ email_kh }}</small>
                  </li>
                  
                  <div class="p-2">
                    <li>
                      <router-link class="dropdown-item py-2 fw-medium hover-glow rounded-2 d-flex align-items-center" to="/client/profile">
                        <i class="fa-solid fa-address-card text-primary me-2 w-20px text-center"></i> Thông tin cá nhân
                      </router-link>
                    </li>
                    <li>
                      <router-link class="dropdown-item py-2 fw-medium hover-glow rounded-2 d-flex align-items-center" to="/client/lich-su-dat-tour">
                        <i class="fa-solid fa-clock-rotate-left text-success me-2 w-20px text-center"></i> Lịch sử đặt tour
                      </router-link>
                    </li>
                    <li>
                      <router-link class="dropdown-item py-2 fw-medium hover-glow rounded-2 d-flex align-items-center" to="/client/tour-yeu-thich">
                        <i class="fa-solid fa-heart text-danger me-2 w-20px text-center"></i> Tour yêu thích
                      </router-link>
                    </li>
                  </div>
                  
                  <div class="border-top p-2 bg-light" style="border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                    <li>
                      <a class="dropdown-item py-2 fw-bold text-danger hover-glow rounded-2 d-flex align-items-center" @click="dangXuat()" href="javascript:void(0)">
                        <i class="fa-solid fa-right-from-bracket me-2 w-20px text-center"></i> Đăng xuất
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item py-2 fw-bold text-danger hover-glow rounded-2 d-flex align-items-center" @click="dangXuatAll()" href="javascript:void(0)">
                        <i class="fa-solid fa-power-off me-2 w-20px text-center"></i> Đăng xuất tất cả
                      </a>
                    </li>
                  </div>
                </ul>
              </div>
            </template>

          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import axios from "axios";
import apiUrl from "../../../utils/api";

export default {
  data() {
    return {
      ho_va_ten: null,
      email_kh: null,
      avatar_kh: 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png',
      tuKhoaTimKiem: "",
      danhSachGoiY: [],
      hienThiGoiY: false,
      timKiemTimeout: null,
      so_luong_hoa_don_chua_tt: 0 // <--- Thêm biến này
    };
  },
  computed: {
    isLoggedIn() {
      return !!(localStorage.getItem("key_client"));
    },
  },
  mounted() {
    this.checkLogin();
    window.addEventListener("profile-updated", () => {
      this.ho_va_ten = localStorage.getItem("ho_va_ten") || this.ho_va_ten;
      const storedAvatar = localStorage.getItem("avatar");
      if (storedAvatar && storedAvatar !== "null" && storedAvatar !== "") {
        this.avatar_kh = storedAvatar;
      } else {
        this.avatar_kh = `https://ui-avatars.com/api/?name=${this.ho_va_ten || 'KH'}&background=random&color=fff`;
      }
    });
    document.addEventListener('click', this.clickOutsideSearch);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickOutsideSearch);
  },
  methods: {
    // THÊM 2 HÀM NÀY VÀO TRONG METHODS CỦA MENU CLIENT
    getFirstImage(hinh_anh) {
        if (!hinh_anh) return 'https://via.placeholder.com/40x40?text=No';
        if (Array.isArray(hinh_anh)) {
            return hinh_anh.length > 0 ? hinh_anh[0] : 'https://via.placeholder.com/40x40';
        }
        try {
            let parsed = JSON.parse(hinh_anh);
            return Array.isArray(parsed) ? parsed[0] : parsed;
        } catch (e) {
            return hinh_anh;
        }
    },
    
    getImageUrl(url) {
        if (!url) return 'https://via.placeholder.com/40x40';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        
        url = url.replace(/-\d+x\d+/g, '');
        const baseApiUrl = apiUrl('');
        const backendDomain = baseApiUrl.replace(/\/api\/?$/, '');
        return backendDomain + (url.startsWith('/') ? '' : '/') + url;
    },
    clickOutsideSearch(event) {
        if (this.$refs.searchContainer && !this.$refs.searchContainer.contains(event.target)) {
            this.hienThiGoiY = false;
        }
    },
    goiApiGoiYTimKiem() {
        if (!this.tuKhoaTimKiem.trim()) {
            this.danhSachGoiY = [];
            this.hienThiGoiY = false;
            return;
        }
        if (this.timKiemTimeout) clearTimeout(this.timKiemTimeout);
        this.timKiemTimeout = setTimeout(() => {
            axios.post(apiUrl("client/tour/search"), { tu_khoa: this.tuKhoaTimKiem })
                .then(res => {
                    if (res.data.status) {
                        this.danhSachGoiY = res.data.data;
                        this.hienThiGoiY = true;
                    }
                });
        }, 300);
    },
    chonTourTuGoiY(id) {
        this.hienThiGoiY = false;
        this.tuKhoaTimKiem = "";
        this.$router.push(`/client/chi-tiet-tour/${id}`);
    },
    thucHienTimKiem() {
      if (this.tuKhoaTimKiem.trim() !== "") {
        this.hienThiGoiY = false;
        this.$router.push({ 
            path: '/tim-kiem-tour', 
            query: { keyword: this.tuKhoaTimKiem.trim() } 
        });
      }
    },
    xoaTimKiem() {
      this.tuKhoaTimKiem = "";
      this.danhSachGoiY = [];
      this.hienThiGoiY = false;
    },
    formatVND(value) {
        if (!value) return "0 ₫";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    },

    checkLogin() {
      const token = localStorage.getItem("key_client");
      if (!token) {
          this.clearAuthData();
          return;
      }
      axios.get(apiUrl('client/check-token'), {
        headers: { Authorization: 'Bearer ' + token }
      }).then((res) => {
        if (res.data && res.data.status) {
          this.ho_va_ten = res.data.ho_ten;
          this.email_kh = res.data.email;
          this.so_luong_hoa_don_chua_tt = res.data.so_hoa_don_chua_tt;
          if (res.data.avatar) {
            this.avatar_kh = res.data.avatar;
            localStorage.setItem("avatar", res.data.avatar);
          } else {
            this.avatar_kh = `https://ui-avatars.com/api/?name=${this.ho_va_ten}&background=random&color=fff`;
            localStorage.removeItem("avatar");
          }
          localStorage.setItem("ho_va_ten", this.ho_va_ten);
        } else {
          this.clearAuthData();
        }
      }).catch(() => { 
          this.clearAuthData(); 
      });
    },
    dangXuat() {
      const token = localStorage.getItem("key_client");
      axios.post(apiUrl("client/dang-xuat"), {}, { headers: { Authorization: "Bearer " + token } }).then((res) => {
        this.clearAuthData();
        this.$router.push("/client/dang-nhap");
        if(res.data.status) {
          this.$toast.success(res.data.message);
        }
      }).catch(() => { this.clearAuthData(); this.$router.push("/client/dang-nhap"); });
    },
    dangXuatAll() {
      const token = localStorage.getItem("key_client");
      if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi tất cả các thiết bị không?")) {
        axios.post(apiUrl("client/dang-xuat-all"), {}, { headers: { Authorization: "Bearer " + token } }).then((res) => {
          this.clearAuthData();
          this.$router.push("/client/dang-nhap");
          if(res.data.status) {
            this.$toast.success(res.data.message || "Đã đăng xuất");
          }
        }).catch(() => { this.clearAuthData(); this.$router.push("/client/dang-nhap"); });
      }
    },
    clearAuthData() {
      localStorage.removeItem("key_client");
      localStorage.removeItem("ho_va_ten");
      localStorage.removeItem("avatar");
      this.ho_va_ten = null;
      this.email_kh = null;
      this.avatar_kh = 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png';
    }
  },
};
</script>

<style scoped>
/* ================= CSS CƠ BẢN VÀ MENU ================= */
.logo-chinh { max-height: 50px; width: auto; transition: all 0.3s ease; }
.header-vung { position: sticky; top: 0; z-index: 1050; border-bottom: 1px solid #f3fffd; }

.nav-link { 
    white-space: nowrap; 
    font-size: 0.9rem; 
    transition: color 0.3s;
}

/* ================= THANH TÌM KIẾM ================= */
.vung-tim-kiem { 
    width: 320px; 
    transition: all 0.3s ease;
}
.search-box-premium {
    border-radius: 50px; 
    overflow: hidden;
    border: 1px solid #cbd5e1;
    background: #f3fffd; /* Màu cũ tệp với header */
    transition: all 0.3s ease;
}

/* Khi hover hoặc focus thì thanh tìm kiếm chuyển sang màu trắng */
.search-box-premium:hover,
.search-box-premium:focus-within {
    background: #ffffff;
    border-color: #334155;
}
.search-box-premium:focus-within {
    box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.1) !important;
}

.vung-nhap-lieu { 
    background-color: transparent !important; 
    font-size: 0.9rem;
}
.btn-tim-kiem {
    background: #334155; 
    border-radius: 0 50px 50px 0;
}
.btn-tim-kiem:hover {
    background: #0f172a;
}

/* ================= NÚT BẤM ================= */
.btn-sm-custom {
    padding: 0.4rem 1.2rem;
    font-size: 0.85rem;
}

.btn-gradient {
    background: linear-gradient(135deg, #f7931e, #ff6b35); /* Màu cam rực rỡ */
    box-shadow: 0 4px 10px rgba(255, 107, 53, 0.2);
}
.btn-gradient:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(255, 107, 53, 0.3);
}

/* ================= HIỆU ỨNG HOVER MENU & DROPDOWN ================= */
.btn-hover-effect {
    position: relative;
    transition: all 0.3s ease;
    border-radius: 999px;
    z-index: 1;
}
.btn-hover-effect::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.06); 
    border-radius: 999px;
    z-index: -1;
    opacity: 0;
    transform: scale(0.85);
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.btn-hover-effect:hover::before {
    opacity: 1;
    transform: scale(1);
}
.btn-hover-effect:hover {
    color: #0f172a !important;
}

.dropdown-animation {
    animation: fadeInSlideUp 0.3s ease;
    transform-origin: top center;
}

@keyframes fadeInSlideUp {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
}

.hover-glow { 
    transition: all 0.2s ease; 
    white-space: nowrap; 
    font-size: 0.9rem;
}
.hover-glow:hover {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
    transform: translateX(4px); 
}

/* ================= GỢI Ý TÌM KIẾM ================= */
.goiy-dropdown {
    border-radius: 12px;
    max-height: 400px;
    overflow-y: auto;
}
.goiy-dropdown::-webkit-scrollbar { width: 5px; }
.goiy-dropdown::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }

/* 1. Ẩn thanh cuộn cho Chrome, Safari, Edge */
.goi-y-container::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
}

/* 2. Ẩn thanh cuộn cho Firefox */
.goi-y-container {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important; /* IE và Edge cũ */
    overflow-x: auto; /* Giữ thuộc tính này để vẫn kéo được */
    white-space: nowrap; /* Đảm bảo các phần tử nằm ngang */
}
/* ================= AVATAR & BADGE ================= */
.anh-nguoi-dung { 
    width: 34px; height: 34px; 
    object-fit: cover; 
    border: 2px solid #fff; 
}
.cham-thong-bao { 
    position: absolute; top: 2px; right: 2px; 
    width: 9px; height: 9px; 
    background-color: #ef4444; 
    border-radius: 50%; border: 2px solid #fff; 
}
/* Ẩn mũi tên mặc định của class dropdown-toggle */
.dropdown-toggle::after { display: none; }
.w-20px { width: 22px; text-align: center; }
.cursor-pointer { cursor: pointer; }

/* ================= RESPONSIVE ================= */
@media (max-width: 991px) { 
    .vung-tim-kiem { width: 100%; margin: 15px 0; } 
    .nhom-bieu-tuong { margin-top: 15px; border-top: 1px solid rgba(0, 0, 0, 0.1); padding-top: 15px; justify-content: flex-start; }
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.badge-thong-bao-so{
    position:absolute;
    top:-5px;
    right:-6px;
    width: 20px; height: 20px; 
    padding: 0; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    background:#ff3b30;
    color:#fff;
    font-size:11px;
    font-weight:bold;
    border-radius:20px;
    box-shadow: 0 6px 15px rgba(255,59,48,.45);
    animation: pulseBadge 2s infinite;
}

@keyframes pulseBadge{
    0%{
        transform:scale(1);
        box-shadow:0 0 0 0 rgba(255,59,48,.6);
    }

    70%{
        transform:scale(1.08);
        box-shadow:0 0 0 8px rgba(255,59,48,0);
    }

    100%{
        transform:scale(1);
        box-shadow:0 0 0 0 rgba(255,59,48,0);
    }
}

</style>