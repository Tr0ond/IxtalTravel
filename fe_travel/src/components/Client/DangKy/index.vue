<template>
  <div class="khung-dang-ky">
    <div class="nen-dang-ky"></div>

    <div class="bao-dang-ky container">
      <div class="row justify-content-center">
        <!-- Đã thu hẹp cột lại (col-lg-6 col-xl-5) để form 1 cột không bị quá to/bè ra -->
        <div class="col-12 col-md-8 col-lg-5 col-xl-4 mx-auto">
          <div class="the-dang-ky">
            <div class="noi-dung-the">
              <!-- Phần Logo & Tiêu đề -->
              <div class="vung-logo text-center mb-2">
                <div class="bieu-tuong-logo mb-2">
                  <img src="../../../assets/images/Logo.png" alt="logo">
                </div>
                <h2 class="tieu-de-logo">IxtalTour</h2>
              </div>
              <h3 class="tieu-de-the">TẠO TÀI KHOẢN</h3>
              <p class="text-center text-muted mb-4 small">Đăng ký thành viên để nhận ngay nhiều ưu đãi hấp dẫn từ hệ thống.</p>

              <form @submit.prevent="dangKy" class="bieu-mau-dang-ky">
                <!-- Xếp tất cả thành hàng dọc bằng gap-3 (khoảng cách đều nhau) -->
                <div class="d-flex flex-column gap-3">
                  
                  <!-- Họ và tên -->
                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-solid fa-user"></i></span>
                      <input v-model="user.ho_va_ten" type="text" class="o-nhap-lieu" placeholder="Họ và tên đầy đủ" />
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-solid fa-envelope"></i></span>
                      <input v-model="user.email" type="email" class="o-nhap-lieu" placeholder="Địa chỉ Email" />
                    </div>
                  </div>

                  <!-- Số điện thoại -->
                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-solid fa-phone"></i></span>
                      <input v-model="user.so_dien_thoai" type="text" class="o-nhap-lieu" placeholder="Số điện thoại" maxlength="10" />
                    </div>
                  </div>

                  <!-- Số CCCD -->
                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-regular fa-id-card"></i></span>
                      <input v-model="user.cccd" type="text" class="o-nhap-lieu" placeholder="Số CCCD" maxlength="12" />
                    </div>
                  </div>

                  <!-- Ngày sinh -->
                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-regular fa-calendar-days"></i></span>
                      <input v-model="user.ngay_sinh" type="date" class="o-nhap-lieu" title="Ngày sinh" />
                    </div>
                  </div>

                  <!-- Mật khẩu -->
                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-solid fa-lock"></i></span>
                      <input v-model="user.password" :type="showPassword ? 'text' : 'password'" class="o-nhap-lieu" placeholder="Mật khẩu" />
                      <span class="an-hien-mat-khau" @click="showPassword = !showPassword">
                        <i :class="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                      </span>
                    </div>
                  </div>

                  <!-- Nhập lại mật khẩu -->
                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-solid fa-shield-halved"></i></span>
                      <input v-model="user.re_password" :type="showRePassword ? 'text' : 'password'" class="o-nhap-lieu" placeholder="Nhập lại mật khẩu" />
                      <span class="an-hien-mat-khau" @click="showRePassword = !showRePassword">
                        <i :class="showRePassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                      </span>
                    </div>
                  </div>

                </div> <!-- Kết thúc d-flex column -->

                <div class="form-check mt-3 mb-4 d-flex align-items-center">
                  <input class="form-check-input me-2" type="checkbox" id="flexCheckDefault" checked>
                  <label class="form-check-label text-muted small" for="flexCheckDefault" style="padding-top: 2px;">
                    Tôi đồng ý với <a href="javascript:;" class="text-decoration-none fw-bold" style="color: #1b7d6b;">Điều khoản sử dụng</a> và <a href="javascript:;" class="text-decoration-none fw-bold" style="color: #1b7d6b;">Chính sách bảo mật</a>.
                  </label>
                </div>

                <button type="submit" class="nut-dang-ky w-100 d-flex justify-content-center align-items-center gap-2">
                  <span>XÁC NHẬN ĐĂNG KÝ</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </form>

              <p class="duong-dan-dang-nhap">
                Bạn đã có tài khoản?
                <router-link to="/client/dang-nhap">Đăng nhập tại đây</router-link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import apiUrl from "../../../utils/api";

export default {
  data() {
    return {
      user: {
        ho_va_ten: "",
        email: "",
        so_dien_thoai: "",
        cccd: "",
        ngay_sinh: "",
        password: "",
        re_password: "", 
      },
      showPassword: false,
      showRePassword: false,
    };
  },
  methods: {
    dangKy() {
      if (!this.user.ho_va_ten || !this.user.email || !this.user.so_dien_thoai || !this.user.cccd || !this.user.ngay_sinh || !this.user.password || !this.user.re_password) {
        this.$toast.error("Vui lòng điền đầy đủ tất cả thông tin!");
        return;
      }

      if (this.user.password !== this.user.re_password) {
        this.$toast.error("Mật khẩu xác nhận không khớp!");
        return;
      }

      axios.post(apiUrl("client/dang-ky"), this.user)
        .then((res) => {
          if (res.data.status) {
            this.$toast.success(res.data.message);
            // ĐẨY SANG TRANG XÁC NHẬN KÈM THEO EMAIL
            this.$router.push({
                path: '/client/xac-nhan-dang-ky',
                query: { email: this.user.email }
            });
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch((err) => {
          if(err.response && err.response.data && err.response.data.errors) {
            const listErr = Object.values(err.response.data.errors);
            listErr.forEach((v) => {
              this.$toast.error(v[0]);
            });
          } else {
            this.$toast.error("Đăng ký thất bại, vui lòng thử lại sau!");
          }
        });
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.khung-dang-ky {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 50px 0; /* Tăng padding trên dưới để form dài có không gian thở */
}

.nen-dang-ky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><g opacity="0.08" fill="none" stroke="currentColor"><circle cx="100" cy="100" r="80"/><path d="M300 200 L400 150 L500 200 L450 300 Z"/><path d="M900 400 L1000 350 L1050 400 L1000 450 Z"/></g></svg>');
  background-repeat: repeat;
  background-size: 400px 400px;
  opacity: 0.5;
  pointer-events: none;
}

.bao-dang-ky {
  position: relative;
  z-index: 1;
}

/* Phần Logo */
/* LOGO & TIÊU ĐỀ */
.vung-logo { animation: truotXuong 0.5s ease-out; }
.bieu-tuong-logo { display: flex; justify-content: center; align-items: center; margin: 0 auto; width: 65px; height: 65px; border-radius: 16px; }
.bieu-tuong-logo img { width: 90%; height: 90%; object-fit: contain; }
.tieu-de-logo { font-size: 22px; font-weight: 800; color: #1b7d6b; margin: 0; }
.tieu-de-the { font-size: 25px; font-weight: 800; color: #1b7d6b; text-align: center; margin: 0 0 5px 0; }

/* Card Đăng Ký */
.the-dang-ky {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 24px; /* Bo góc mềm mại hơn */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); /* Bóng đổ sang trọng */
  overflow: hidden;
  animation: truotLen 0.6s ease-out;
  border: 1px solid rgba(255,255,255,0.8);
}

.noi-dung-the {
  padding: 40px 35px;
}

.tieu-de-the {
  font-size: 22px;
  font-weight: 800;
  color: #1b7d6b;
  text-align: center;
  margin: 0 0 5px 0;
  letter-spacing: 1px;
}

/* Biểu mẫu */
.bao-o-nhap {
  position: relative;
  display: flex;
  align-items: center;
}

.bieu-tuong-o-nhap {
  position: absolute;
  left: 18px;
  color: #a0a5aa;
  font-size: 16px;
  display: flex;
  align-items: center;
  z-index: 5;
}

.o-nhap-lieu {
  width: 100%;
  border: 1.5px solid #e1e5eb; /* Viền nét đứt nhẹ */
  border-radius: 12px; /* Bo góc ô nhập liệu */
  padding: 15px 16px 15px 48px; /* Tăng padding để ô nhập liệu nhìn cao cấp */
  font-size: 14.5px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fcfcfd;
  color: #333;
}

.o-nhap-lieu:focus {
  outline: none;
  border-color: #1b7d6b;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(27, 125, 107, 0.1);
}

.o-nhap-lieu::placeholder {
  color: #adb5bd;
  font-weight: 400;
}

.an-hien-mat-khau {
  position: absolute;
  right: 18px;
  color: #a0a5aa;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  z-index: 5;
}

.an-hien-mat-khau:hover {
  color: #1b7d6b;
}

/* Form check checkbox màu đồng bộ */
.form-check-input {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0;
  cursor: pointer;
}
.form-check-input:checked {
  background-color: #1b7d6b;
  border-color: #1b7d6b;
}

/* Nút Đăng Ký */
.nut-dang-ky {
  background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nut-dang-ky:hover {
  background: linear-gradient(135deg, #156254 0%, #1b7d6b 100%);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(27, 125, 107, 0.3);
}

/* Link Đăng Nhập */
.duong-dan-dang-nhap {
  text-align: center;
  font-size: 14.5px;
  color: #6c757d;
  margin: 25px 0 0 0;
}

.duong-dan-dang-nhap a {
  color: #1b7d6b;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
}

.duong-dan-dang-nhap a:hover {
  text-decoration: underline;
  color: #156254;
}

/* Animations */
@keyframes truotXuong {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes truotLen {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 576px) {
  .noi-dung-the { padding: 30px 20px; }
  .tieu-de-logo { font-size: 20px; }
  .tieu-de-the { font-size: 20px; }
  .o-nhap-lieu { padding: 12px 16px 12px 40px; font-size: 14px; }
}
</style>