<template>
  <div class="khung-lay-lai-mk">
    <div class="nen-lay-lai-mk"></div>

    <div class="bao-lay-lai-mk container">
      <div class="row justify-content-center">
        <!-- Khống chế độ rộng cột -->
        <div class="col-12 col-md-8 col-lg-5 col-xl-4 mx-auto">
          <!-- Thẻ Form Lấy lại MK -->
          <div class="the-lay-lai-mk">
            <div class="noi-dung-the">
              <!-- Phần Logo & Tiêu đề -->
              <div class="vung-logo text-center mb-2">
                <div class="bieu-tuong-logo mb-2">
                  <img src="../../../assets/images/Logo.png" alt="logo">
                </div>
                <h2 class="tieu-de-logo">IxtalTour</h2>
              </div>
              <div class="text-center mb-4">
                <h3 class="tieu-de-the">THIẾT LẬP MẬT KHẨU MỚI</h3>
                <p class="text-muted small mt-2">Vui lòng kiểm tra hộp thư email, lấy mã khôi phục và nhập vào bên dưới cùng với mật khẩu mới.</p>
              </div>

              <!-- Biểu mẫu -->
              <form @submit.prevent="doiMatKhau" class="bieu-mau-lay-lai-mk">
                <div class="d-flex flex-column gap-3">
                  
                  <!-- Mã khôi phục -->
                  <div class="nhom-nhap-lieu">
                    <label class="form-label text-secondary fw-semibold small mb-1">Mã Khôi Phục</label>
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-solid fa-shield-halved"></i></span>
                      <input v-model="reset.ma_khoi_phuc" type="text" class="o-nhap-lieu font-monospace fw-bold" placeholder="Nhập mã UUID khôi phục..." required>
                    </div>
                  </div>

                  <!-- Mật khẩu mới -->
                  <div class="nhom-nhap-lieu">
                    <label class="form-label text-secondary fw-semibold small mb-1">Mật khẩu mới</label>
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-solid fa-lock"></i></span>
                      <input v-model="reset.password" :type="showPassword ? 'text' : 'password'" class="o-nhap-lieu" placeholder="••••••••" required>
                      <span class="an-hien-mat-khau" @click="showPassword = !showPassword">
                        <i :class="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                      </span>
                    </div>
                  </div>

                  <!-- Xác nhận mật khẩu mới -->
                  <div class="nhom-nhap-lieu">
                    <label class="form-label text-secondary fw-semibold small mb-1">Xác nhận mật khẩu</label>
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap"><i class="fa-solid fa-lock-open"></i></span>
                      <!-- Ở đây logic gửi cho Controller yêu cầu new_password -->
                      <input v-model="reset.new_password" :type="showRePassword ? 'text' : 'password'" class="o-nhap-lieu" placeholder="••••••••" required>
                      <span class="an-hien-mat-khau" @click="showRePassword = !showRePassword">
                        <i :class="showRePassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                      </span>
                    </div>
                  </div>

                </div>

                <div class="d-flex flex-column gap-3 mt-4 pt-2 border-top">
                  <button type="submit" class="nut-chinh w-100 d-flex justify-content-center align-items-center gap-2">
                    XÁC NHẬN THAY ĐỔI <i class="fa-solid fa-check"></i>
                  </button>
                  
                  <router-link to="/client/dang-nhap" class="text-decoration-none">
                    <button type="button" class="nut-phu w-100 d-flex justify-content-center align-items-center gap-2">
                      <i class="fa-solid fa-arrow-left"></i> Quay lại đăng nhập
                    </button>
                  </router-link>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api';

export default {
    data() {
        return {
            reset: {
                ma_khoi_phuc: null,
                password: null,       // Gửi password (theo API yêu cầu)
                new_password: null,   // Dùng làm ô xác nhận
            },
            showPassword: false,
            showRePassword: false,
        }
    },
    methods: {
        doiMatKhau() {
            // Check mật khẩu khớp hay chưa ở phía Front-end
            if(this.reset.password !== this.reset.new_password) {
                this.$toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
                return;
            }

            axios.post(apiUrl('client/lay-lai-mat-khau'), this.reset)
                .then((response) => {
                    if (response.data.status) {
                        this.$router.push('/client/dang-nhap');
                        this.$toast.success(response.data.message);
                    } else {
                        this.$toast.error(response.data.message);
                    }
                })
                .catch((err) => {
                     this.$toast.error("Hệ thống đang bận hoặc mã khôi phục sai.");
                })
        }
    }
}
</script>

<style scoped>
* { box-sizing: border-box; }

.khung-lay-lai-mk {
  min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; padding: 50px 0;
}

.nen-lay-lai-mk {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><g opacity="0.08" fill="none" stroke="currentColor"><circle cx="100" cy="100" r="80"/><path d="M300 200 L400 150 L500 200 L450 300 Z"/><path d="M900 400 L1000 350 L1050 400 L1000 450 Z"/></g></svg>');
  background-repeat: repeat; background-size: 400px 400px;
  opacity: 0.5; pointer-events: none;
}

.bao-lay-lai-mk { position: relative; z-index: 1; }

.vung-logo { animation: truotXuong 0.5s ease-out; }
.bieu-tuong-logo { display: flex; justify-content: center; align-items: center; margin: 0 auto; width: 65px; height: 65px; border-radius: 16px; }
.bieu-tuong-logo img { width: 90%; height: 90%; object-fit: contain; }
.tieu-de-logo { font-size: 22px; font-weight: 800; color: #1b7d6b; margin: 0; }
.tieu-de-the { font-size: 25px; font-weight: 800; color: #1b7d6b; text-align: center; margin: 0 0 5px 0; }

.the-lay-lai-mk {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px); border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); overflow: hidden;
  animation: truotLen 0.6s ease-out; border: 1px solid rgba(255,255,255,0.8);
}
.noi-dung-the { padding: 40px 35px; }

.tieu-de-the {
  font-size: 22px; font-weight: 800; color: #1b7d6b;
  margin: 0; letter-spacing: 1px;
}

.bao-o-nhap { position: relative; display: flex; align-items: center; }
.bieu-tuong-o-nhap {
  position: absolute; left: 18px; color: #a0a5aa;
  font-size: 16px; display: flex; align-items: center; z-index: 5;
}
.an-hien-mat-khau {
  position: absolute; right: 18px; color: #a0a5aa; cursor: pointer;
  font-size: 16px; display: flex; align-items: center; transition: color 0.3s ease; z-index: 5;
}
.an-hien-mat-khau:hover { color: #1b7d6b; }

.o-nhap-lieu {
  width: 100%; border: 1.5px solid #e1e5eb; border-radius: 12px;
  padding: 15px 16px 15px 48px; font-size: 14.5px; font-family: inherit;
  transition: all 0.3s ease; background: #fcfcfd; color: #333;
}
.o-nhap-lieu:focus {
  outline: none; border-color: #1b7d6b; background: #ffffff;
  box-shadow: 0 0 0 4px rgba(27, 125, 107, 0.15);
}
.o-nhap-lieu::placeholder { color: #adb5bd; font-weight: 400; }

.nut-chinh {
  background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%);
  color: #ffffff; border: none; border-radius: 12px;
  padding: 15px 24px; font-size: 15px; font-weight: 700;
  cursor: pointer; transition: all 0.3s ease; letter-spacing: 1px;
}
.nut-chinh:hover {
  background: linear-gradient(135deg, #156254 0%, #1b7d6b 100%);
  transform: translateY(-3px); box-shadow: 0 10px 25px rgba(27, 125, 107, 0.3);
}

.nut-phu {
  background: white; color: #6c757d;
  border: 1.5px solid #e1e5eb; border-radius: 12px;
  padding: 15px 24px; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.3s ease;
}
.nut-phu:hover {
  background: #f8f9fa; color: #1b7d6b; border-color: #1b7d6b;
}

@keyframes truotXuong { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes truotLen { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 576px) {
  .noi-dung-the { padding: 30px 20px; }
  .tieu-de-logo { font-size: 22px; }
  .o-nhap-lieu { padding: 12px 16px 12px 40px; font-size: 14px; }
}
</style>