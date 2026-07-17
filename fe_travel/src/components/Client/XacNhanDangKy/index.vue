<template>
  <div class="khung-xac-nhan">
    <div class="nen-xac-nhan"></div>

    <div class="bao-xac-nhan container">
      <div class="row justify-content-center">
        <!-- Khống chế độ rộng cột -->
        <div class="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
          
          <div class="vung-logo text-center mb-4">
            <div class="bieu-tuong-logo mb-3">
              <img src="https://i.pinimg.com/564x/48/e5/9e/48e59ef6ef580dad0e44420cf79f1f7a.jpg" alt="logo" class="rounded-circle shadow-sm">
            </div>
            <h2 class="tieu-de-logo">IXTAL TOUR</h2>
          </div>

          <div class="the-xac-nhan">
            <div class="noi-dung-the">
              
              <div class="text-center mb-4">
                <div class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" style="width: 70px; height: 70px; background-color: rgba(27, 125, 107, 0.1);">
                  <i class="fa-solid fa-envelope-circle-check fs-2" style="color: #1b7d6b;"></i>
                </div>
                <h3 class="tieu-de-the">XÁC NHẬN TÀI KHOẢN</h3>
                <p class="text-muted small mt-2">
                  Chúng tôi đã gửi một mã gồm 6 chữ số đến email <br>
                  <strong class="text-dark">{{ email }}</strong>
                </p>
              </div>

              <!-- Biểu mẫu -->
              <form @submit.prevent="xacNhan" class="bieu-mau-xac-nhan">
                <div class="nhom-nhap-lieu mb-4 text-center">
                  <label class="form-label text-secondary fw-semibold small mb-2">Nhập Mã Xác Nhận</label>
                  <input v-model="ma_kich_hoat" type="text" class="o-nhap-lieu text-center fw-bold fs-3 letter-spacing-custom" placeholder="------" maxlength="6" required>
                </div>

                <div class="d-flex flex-column gap-3 mt-2 pt-2">
                  <button type="submit" class="nut-chinh w-100 d-flex justify-content-center align-items-center gap-2" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                    <span v-else>XÁC NHẬN NGAY</span>
                    <i class="fa-solid fa-check" v-if="!isLoading"></i>
                  </button>
                  
                  <router-link to="/client/dang-nhap" class="text-decoration-none">
                    <button type="button" class="nut-phu w-100 d-flex justify-content-center align-items-center gap-2">
                      Để sau, quay lại đăng nhập
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
            email: this.$route.query.email || '',
            ma_kich_hoat: '',
            isLoading: false
        }
    },
    mounted() {
        if (!this.email) {
            this.$toast.warning("Không tìm thấy thông tin Email, vui lòng đăng ký lại.");
            this.$router.push('/client/dang-ky');
        }
    },
    methods: {
        xacNhan() {
            if(!this.ma_kich_hoat || this.ma_kich_hoat.length < 6) {
                this.$toast.warning("Vui lòng nhập đủ 6 số mã xác nhận!");
                return;
            }

            this.isLoading = true;
            
            var payload = { 
                email: this.email,
                ma_kich_hoat: this.ma_kich_hoat
            };
            
            axios.post(apiUrl('client/xac-nhan-dang-ky'), payload)
                .then((response) => {
                    if (response.data.status) {
                        this.$router.push('/client/dang-nhap');
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

.khung-xac-nhan {
  min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; padding: 50px 0;
}

.nen-xac-nhan {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><g opacity="0.08" fill="none" stroke="currentColor"><circle cx="100" cy="100" r="80"/><path d="M300 200 L400 150 L500 200 L450 300 Z"/><path d="M900 400 L1000 350 L1050 400 L1000 450 Z"/></g></svg>');
  background-repeat: repeat; background-size: 400px 400px;
  opacity: 0.5; pointer-events: none;
}

.bao-xac-nhan { position: relative; z-index: 1; }

.vung-logo { animation: truotXuong 0.6s ease-out; }
.bieu-tuong-logo {
  display: flex; justify-content: center; align-items: center;
  margin: 0 auto; width: 90px; height: 90px;
}
.bieu-tuong-logo img { width: 100%; height: 100%; object-fit: cover; }
.tieu-de-logo {
  font-size: 26px; font-weight: 800; color: #1b7d6b;
  letter-spacing: 2px; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.the-xac-nhan {
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

.o-nhap-lieu {
  width: 100%; border: 2px dashed #1b7d6b; border-radius: 12px;
  padding: 15px; font-family: monospace;
  transition: all 0.3s ease; background: #fcfcfd; color: #1b7d6b;
}
.o-nhap-lieu:focus {
  outline: none; border-style: solid; background: #ffffff;
  box-shadow: 0 0 0 4px rgba(27, 125, 107, 0.15);
}
.o-nhap-lieu::placeholder { color: #adb5bd; font-weight: 400; letter-spacing: 10px; }
.letter-spacing-custom { letter-spacing: 10px; }

.nut-chinh {
  background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%);
  color: #ffffff; border: none; border-radius: 12px;
  padding: 15px 24px; font-size: 15px; font-weight: 700;
  cursor: pointer; transition: all 0.3s ease; letter-spacing: 1px;
}
.nut-chinh:hover:not(:disabled) {
  background: linear-gradient(135deg, #156254 0%, #1b7d6b 100%);
  transform: translateY(-3px); box-shadow: 0 10px 25px rgba(27, 125, 107, 0.3);
}

.nut-phu {
  background: white; color: #6c757d;
  border: 1.5px solid #e1e5eb; border-radius: 12px;
  padding: 15px 24px; font-size: 14px; font-weight: 600;
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
}
</style>