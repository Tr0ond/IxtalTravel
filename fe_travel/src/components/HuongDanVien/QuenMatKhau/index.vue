<template>
  <div class="khung-quen-mk">
    <div class="nen-quen-mk"></div>

    <div class="bao-quen-mk container">
      <div class="row justify-content-center">
        <!-- Khống chế độ rộng cột y hệt form đăng nhập -->
        <div class="col-12 col-md-8 col-lg-5 col-xl-4 mx-auto">
          <!-- Thẻ Form Quên MK -->
          <div class="the-quen-mk">
            <div class="noi-dung-the">
              
              <!-- Icon & Tiêu đề -->
              <div class="text-center mb-4 pb-2 border-bottom">
                <!-- Phần Logo & Tiêu đề -->
            <div class="vung-logo text-center mb-2">
              <div class="bieu-tuong-logo mb-2">
                <img src="../../../assets/images/Logo.png" alt="logo">
              </div>
              <h2 class="tieu-de-logo">IxtalTour</h2>
            </div>
                <h3 class="tieu-de-the">QUÊN MẬT KHẨU HƯỚNG DẪN VIÊN?</h3>
                <p class="text-muted small mt-2">Đừng lo lắng! Hãy nhập địa chỉ email của bạn, chúng tôi sẽ gửi mã khôi phục ngay lập tức.</p>
              </div>

              <!-- Biểu mẫu nhập liệu -->
              <form @submit.prevent="guiMail" class="bieu-mau-quen-mk">
                <div class="nhom-nhap-lieu mb-4">
                  <label class="form-label text-secondary small fw-bold mb-2">Địa chỉ Email đã đăng ký</label>
                  <div class="bao-o-nhap">
                    <span class="bieu-tuong-o-nhap">
                      <i class="fa-regular fa-envelope"></i>
                    </span>
                    <input v-model="email" type="email" class="o-nhap-lieu form-control-lg" placeholder="Nhập email của bạn..." required>
                  </div>
                </div>

                <!-- Nút Hành động -->
                <div class="d-flex flex-column gap-3 mt-4">
                  <button type="submit" class="nut-chinh w-100 d-flex justify-content-center align-items-center gap-2" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                    <span v-else>GỬI MÃ KHÔI PHỤC</span>
                    <i class="fa-regular fa-paper-plane" v-if="!isLoading"></i>
                  </button>
                  
                  <router-link to="/huong-dan-vien/dang-nhap" class="text-decoration-none">
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
            email: null,
            isLoading: false
        }
    },
    methods: {
        guiMail() {
            if(!this.email) {
                this.$toast.warning("Vui lòng nhập địa chỉ email!");
                return;
            }

            this.isLoading = true; 
            
            var payload = { email: this.email };
            
            axios.post(apiUrl('huong-dan-vien/quen-mat-khau'), payload)
                .then((response) => {
                    if (response.data.status) {
                        this.$router.push('/huong-dan-vien/lay-lai-mat-khau');
                        this.$toast.success(response.data.message);
                    } else {
                        this.$toast.error(response.data.message);
                    }
                })
                .catch((err) => {
                     this.$toast.error("Hệ thống đang bận hoặc có lỗi xảy ra.");
                })
                .finally(() => {
                     this.isLoading = false; 
                });
        }
    }
}
</script>

<style scoped>
* { box-sizing: border-box; }

.khung-quen-mk {
  min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; padding: 50px 0;
}

.nen-quen-mk {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><g opacity="0.08" fill="none" stroke="currentColor"><circle cx="100" cy="100" r="80"/><path d="M300 200 L400 150 L500 200 L450 300 Z"/><path d="M900 400 L1000 350 L1050 400 L1000 450 Z"/></g></svg>');
  background-repeat: repeat; background-size: 400px 400px;
  opacity: 0.5; pointer-events: none;
}

.bao-quen-mk { position: relative; z-index: 1; }

.vung-logo { animation: truotXuong 0.5s ease-out; }
.bieu-tuong-logo { display: flex; justify-content: center; align-items: center; margin: 0 auto; width: 65px; height: 65px; border-radius: 16px; }
.bieu-tuong-logo img { width: 90%; height: 90%; object-fit: contain; }
.tieu-de-logo { font-size: 22px; font-weight: 800; color: #1b7d6b; margin: 0; }
.tieu-de-the { font-size: 25px; font-weight: 800; color: #1b7d6b; text-align: center; margin: 0 0 5px 0; }

.the-quen-mk {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px); border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); overflow: hidden;
  animation: truotLen 0.6s ease-out; border: 1px solid rgba(255,255,255,0.8);
}
.noi-dung-the { padding: 40px 35px; }

.tieu-de-the {
  font-size: 24px; font-weight: 800; color: #1b7d6b;
  margin: 0; letter-spacing: 1px;
}

.bao-o-nhap { position: relative; display: flex; align-items: center; }
.bieu-tuong-o-nhap {
  position: absolute; left: 18px; color: #a0a5aa;
  font-size: 16px; display: flex; align-items: center; z-index: 5;
}

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
  padding: 15px 24px; font-size: 16px; font-weight: 700;
  cursor: pointer; transition: all 0.3s ease; letter-spacing: 1px;
}
.nut-chinh:hover:not(:disabled) {
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