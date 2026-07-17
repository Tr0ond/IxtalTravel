<template>
  <div class="khung-dang-nhap">
    <div class="nen-dang-nhap"></div>

    <div class="bao-dang-nhap container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
          
          

          <div class="the-dang-nhap">
            <div class="noi-dung-the">
              <!-- CỤM TIÊU ĐỀ MỚI ĐÃ ĐƯỢC NÂNG CẤP KHÁC BIỆT -->
              <!-- Phần Logo & Tiêu đề -->
              <div class="vung-logo text-center mb-2">
                <div class="bieu-tuong-logo mb-2">
                  <img src="../../../assets/images/Logo.png" alt="logo">
                </div>
                <h2 class="tieu-de-logo">IxtalTour</h2>
              </div>
              <h3 class="tieu-de-the mt-3">Cổng Hướng Dẫn Viên</h3>
              <p class="text-center text-muted mb-4 small">Đăng nhập để quản lý Hướng dẫn viên của bạn</p>
              <form @submit.prevent="dangNhap" class="bieu-mau-dang-nhap">
                <div class="d-flex flex-column gap-3">
                  
                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap">
                        <i class="fa-solid fa-user"></i>
                      </span>
                      <input v-model="user.email" type="text" class="o-nhap-lieu" placeholder="Email đăng nhập" required />
                    </div>
                  </div>

                  <div class="nhom-nhap-lieu">
                    <div class="bao-o-nhap">
                      <span class="bieu-tuong-o-nhap">
                        <i class="fa-solid fa-lock"></i>
                      </span>
                      <input v-model="user.password" :type="hien_mat_khau ? 'text' : 'password'" class="o-nhap-lieu" placeholder="Mật khẩu" required />
                      <span class="an-hien-mat-khau" @click="hien_mat_khau = !hien_mat_khau">
                        <i :class="hien_mat_khau ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                      </span>
                    </div>
                  </div>

                </div>

                <div class="d-flex justify-content-between align-items-center mt-3 mb-4">
                  <label class="nhan-ghi-nho d-flex align-items-center m-0 cursor-pointer">
                    <input type="checkbox" v-model="rememberMe" class="form-check-input o-tich-ghi-nho m-0 me-2" />
                    <span class="text-muted small fw-medium">Ghi nhớ đăng nhập</span>
                  </label>
                  <router-link to="/huong-dan-vien/quen-mat-khau" class="duong-dan-quen-mk fw-bold">
                    Quên mật khẩu?
                  </router-link>
                </div>

                <button type="submit" class="nut-dang-nhap w-100 d-flex justify-content-center align-items-center gap-2" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                  <span v-else>ĐĂNG NHẬP ĐỐI TÁC</span>
                  <i class="fa-solid fa-arrow-right-to-bracket" v-if="!isLoading"></i>
                </button>
              </form>

              <p class="duong-dan-dang-ky mt-4">
                Chưa có tài khoản?
                <router-link to="/huong-dan-vien/dang-ky">Đăng ký ngay</router-link>
              </p>

              <!-- Box Đối Tác -->
              <div class="text-center mt-4">
                <router-link to="/client/dang-nhap" class="fw-bold ms-1 text-decoration-none link-doi-tac" style="font-size: 13px;">
                  <i class="fa-solid fa-user"></i>
                  Đăng nhập Khách hàng
                </router-link>
              </div>
              
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
        email: "",
        password: "",
      },
      hien_mat_khau: false,
      isLoading: false,
      rememberMe: false // Biến theo dõi trạng thái Ghi nhớ
    };
  },
  mounted() {
    // Khi trang tải lên, kiểm tra xem trước đó đã có lưu tài khoản chưa
    const savedEmail = localStorage.getItem("saved_email_hdv");
    const savedPassword = localStorage.getItem("saved_password_hdv");
    
    if (savedEmail && savedPassword) {
      this.user.email = savedEmail;
      this.user.password = savedPassword;
      this.rememberMe = true;
    }
  },
  methods: {
    dangNhap() {
      if(!this.user.email || !this.user.password) {
        this.$toast.warning("Vui lòng nhập Email và Mật khẩu!");
        return;
      }

      this.isLoading = true;

      axios.post(apiUrl("huong-dan-vien/dang-nhap"), this.user)
        .then((res) => {
            if (res.data.status) {
                // Lưu token tên là key_hdv
                localStorage.setItem("key_hdv", res.data.token);
                
                // XỬ LÝ LƯU TÀI KHOẢN VÀO MÁY TÍNH HIỆN TẠI
                if (this.rememberMe) {
                  localStorage.setItem("saved_email_hdv", this.user.email);
                  localStorage.setItem("saved_password_hdv", this.user.password);
                } else {
                  // Nếu không chọn ghi nhớ thì xóa dữ liệu cũ đi
                  localStorage.removeItem("saved_email_hdv");
                  localStorage.removeItem("saved_password_hdv");
                }

                // Đẩy về trang Lịch trình
                this.$router.push("/huong-dan-vien/lich-trinh");
                this.$toast.success(res.data.message);
            } else {
                this.$toast.error(res.data.message);
            }
        })
        .catch((err) => {
            this.$toast.error("Hệ thống đang bận hoặc thông tin không chính xác.");
        })
        .finally(() => {
            this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
* { box-sizing: border-box; }
.khung-dang-nhap { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%); font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; padding: 50px 0; }
.nen-dang-nhap { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><g opacity="0.08" fill="none" stroke="currentColor"><circle cx="100" cy="100" r="80"/><path d="M300 200 L400 150 L500 200 L450 300 Z"/><path d="M900 400 L1000 350 L1050 400 L1000 450 Z"/></g></svg>'); background-repeat: repeat; background-size: 400px 400px; opacity: 0.5; pointer-events: none; }
.bao-dang-nhap { position: relative; z-index: 1; }
/* LOGO & TIÊU ĐỀ */
.vung-logo { animation: truotXuong 0.5s ease-out; }
.bieu-tuong-logo { display: flex; justify-content: center; align-items: center; margin: 0 auto; width: 65px; height: 65px; border-radius: 16px; }
.bieu-tuong-logo img { width: 90%; height: 90%; object-fit: contain; }
.tieu-de-logo { font-size: 22px; font-weight: 800; color: #1b7d6b; margin: 0; }
.tieu-de-the { font-size: 25px; font-weight: 800; color: #1b7d6b; text-align: center; margin: 0 0 5px 0; }
.the-dang-nhap { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(10px); border-radius: 24px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); overflow: hidden; animation: truotLen 0.6s ease-out; border: 1px solid rgba(255,255,255,0.8); }
.noi-dung-the { padding: 40px 35px; }
.badge-vai-tro { display: inline-flex;  align-items: center;  background: #e6f9ef; color: #1b7d6b;  font-size: 18px;  font-weight: 800;  padding: 6px 16px;  border-radius: 30px;  letter-spacing: 1px;  border: 1px solid #bbf7d0;  text-transform: uppercase;}
.tieu-de-the { font-size: 26px; font-weight: 900; color: #1b7d6b; text-align: center; margin: 0 0 5px 0; letter-spacing: 1px; }
.bao-o-nhap { position: relative; display: flex; align-items: center; }
.bieu-tuong-o-nhap { position: absolute; left: 18px; color: #a0a5aa; font-size: 16px; display: flex; align-items: center; z-index: 5; }
.o-nhap-lieu { width: 100%; border: 1.5px solid #e1e5eb; border-radius: 12px; padding: 14px 16px 14px 48px; font-size: 14.5px; font-family: inherit; transition: all 0.3s ease; background: #fcfcfd; color: #333; }
.o-nhap-lieu:focus { outline: none; border-color: #1b7d6b; background: #ffffff; box-shadow: 0 0 0 4px rgba(27, 125, 107, 0.15); }
.o-nhap-lieu::placeholder { color: #adb5bd; font-weight: 400; }
.an-hien-mat-khau { position: absolute; right: 18px; color: #a0a5aa; cursor: pointer; font-size: 16px; display: flex; align-items: center; transition: color 0.3s ease; z-index: 5; }
.an-hien-mat-khau:hover { color: #1b7d6b; }
.form-check-input { width: 1.2em; height: 1.2em; cursor: pointer; }
.form-check-input:checked { background-color: #1b7d6b; border-color: #1b7d6b; }
.cursor-pointer { cursor: pointer; }
.duong-dan-quen-mk { font-size: 13.5px; color: #1b7d6b; text-decoration: none; transition: color 0.3s ease; }
.duong-dan-quen-mk:hover { color: #156254; text-decoration: underline; }
.nut-dang-nhap { background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%); color: #ffffff; border: none; border-radius: 12px; padding: 15px 24px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; }
.nut-dang-nhap:hover:not(:disabled) { background: linear-gradient(135deg, #156254 0%, #1b7d6b 100%); transform: translateY(-3px); box-shadow: 0 10px 25px rgba(27, 125, 107, 0.3); }
.duong-dan-dang-ky { text-align: center; font-size: 14.5px; color: #6c757d; margin: 0; }
.duong-dan-dang-ky a { color: #1b7d6b; text-decoration: none; font-weight: 700; transition: color 0.3s ease; }
.duong-dan-dang-ky a:hover { text-decoration: underline; color: #156254; }
.link-doi-tac { color: #1b7d6b; transition: color 0.2s ease; }
.link-doi-tac:hover { color: #115c4d; text-decoration: underline !important; }
@keyframes truotXuong { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes truotLen { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 576px) { .noi-dung-the { padding: 30px 20px; } .tieu-de-logo { font-size: 22px; } .tieu-de-the { font-size: 22px; } .o-nhap-lieu { padding: 12px 16px 12px 40px; font-size: 14px; } }
</style>