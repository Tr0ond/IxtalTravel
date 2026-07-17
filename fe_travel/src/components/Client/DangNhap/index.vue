<template>
  <div class="khung-dang-nhap">
    <div class="nen-dang-nhap"></div>

    <div class="bao-dang-nhap container">
      <div class="row justify-content-center">
        <div class="col-12 px-3">
          
          <div class="the-dang-nhap shadow-lg mx-auto">
            
            <div class="vung-logo text-center mb-2">
              <div class="bieu-tuong-logo mb-2">
                <img src="../../../assets/images/Logo.png" alt="logo">
              </div>
              <h2 class="tieu-de-logo">IxtalTour</h2>
            </div>
            
            <h3 class="tieu-de-the mt-3">Đăng Nhập</h3>
            <p class="text-center text-muted mb-4 small">Chào mừng trở lại! Hãy đăng nhập để tiếp tục</p>

            <form @submit.prevent="dangNhap" class="bieu-mau-dang-nhap">
              <div class="d-flex flex-column gap-3 mb-4">
                
                <div class="nhom-nhap-lieu">
                  <label class="nhan-nhap-lieu"><i class="fa-solid fa-envelope text-secondary me-2"></i>Email</label>
                  <div class="bao-o-nhap">
                    <input v-model="user.email" type="email" class="o-nhap-lieu" placeholder="example@email.com" required />
                  </div>
                </div>

                <div class="nhom-nhap-lieu">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="nhan-nhap-lieu mb-0"><i class="fa-solid fa-lock text-secondary me-2"></i>Mật khẩu</label>
                    <label class="nhan-ghi-nho d-flex align-items-center m-0 cursor-pointer">
                      <input type="checkbox" v-model="rememberMe" class="form-check-input m-0 me-1" style="width: 14px; height: 14px;" />
                      <span class="text-muted" style="font-size: 12px;">Ghi nhớ</span>
                    </label>
                  </div>
                  <div class="bao-o-nhap position-relative">
                    <input v-model="user.password" :type="hien_mat_khau ? 'text' : 'password'" class="o-nhap-lieu pe-5" placeholder="••••••" required />
                    <span class="an-hien-mat-khau" @click="hien_mat_khau = !hien_mat_khau">
                      <i :class="hien_mat_khau ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                    </span>
                  </div>
                </div>

              </div>

              <button type="submit" class="nut-dang-nhap w-100 d-flex justify-content-center align-items-center gap-2 shadow-sm" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                <template v-else>
                  <i class="fa-solid fa-arrow-right-to-bracket"></i>
                  <span>Đăng Nhập</span>
                </template>
              </button>
            </form>

            <div class="text-center mt-4">
              <router-link to="/client/quen-mat-khau" class="duong-dan-chinh fw-bold">
                <i class="fa-solid fa-key me-1"></i> Quên mật khẩu?
              </router-link>
            </div>

            <div class="vach-ngan my-3">
              <span class="px-3 bg-white text-muted small">hoặc</span>
            </div>

            <div class="text-center mb-4">
              <router-link to="/client/dang-ky" class="duong-dan-chinh fw-bold">
                <i class="fa-solid fa-user-plus me-1"></i> Tạo tài khoản mới
              </router-link>
            </div>

            <p class="text-center text-muted mb-3" style="font-size: 13px;">Hoặc đăng nhập với</p>
            
            <div class="dang-nhap-mxh d-flex flex-column gap-3 mx-auto">
              <div id="google-signin-button" class="w-100 d-flex justify-content-center"></div>
              
              <button type="button" class="nut-mxh nut-facebook shadow-sm" @click="facebookLogin">
                <div class="icon-tron">
                  <i class="fa-brands fa-facebook-f text-primary fs-5"></i>
                </div>
                <span class="text-mxh">Đăng nhập với Facebook</span>
              </button>
            </div>

            <div class="text-center mt-4">
              <span class="text-muted" style="font-size: 13px;">Bạn là đối tác?</span>
              <router-link to="/huong-dan-vien/dang-nhap" class="fw-bold ms-1 text-decoration-none link-doi-tac" style="font-size: 13px;">
                Đăng nhập Hướng dẫn viên
              </router-link>
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
      googleClientLoaded: false,
      fbLoaded: false,
      rememberMe: false,
    };
  },
  mounted() {
    this.initGoogleScript();
    this.initFacebookScript();

    const savedEmail = localStorage.getItem("saved_email_client");
    const savedPassword = localStorage.getItem("saved_password_client");
    
    if (savedEmail && savedPassword) {
      this.user.email = savedEmail;
      this.user.password = savedPassword;
      this.rememberMe = true;
    }
  },
  methods: {
    initGoogleScript() {
      const existingScript = document.getElementById('google-client-script');
      if (existingScript) {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          this.onGoogleScriptLoaded();
        } else {
          existingScript.addEventListener('load', () => this.onGoogleScriptLoaded());
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-client-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.onGoogleScriptLoaded();
      document.head.appendChild(script);
    },
    initFacebookScript() {
      // Avoid injecting multiple times
      if (document.getElementById('facebook-jssdk')) return;

      // Create root element required by FB SDK
      if (!document.getElementById('fb-root')) {
        const fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';
        document.body.appendChild(fbRoot);
      }

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          const appId = import.meta.env.VITE_FACEBOOK_APP_ID || '';
          if (!appId) {
            console.warn('VITE_FACEBOOK_APP_ID not set');
            return;
          }
          window.FB.init({
            appId: appId,
            cookie: true,
            xfbml: false,
            version: 'v16.0',
          });
          this.fbLoaded = true;
        } catch (e) {
          console.error('FB init error', e);
        }
      };
      document.head.appendChild(script);
    },

    facebookLogin() {
      if (!this.fbLoaded || !window.FB) {
        this.$toast.warning('Vui lòng chờ tải Facebook SDK.');
        return;
      }

      this.isLoading = true;
      // Request email and public_profile
      window.FB.login((response) => {
        if (response && response.authResponse && response.authResponse.accessToken) {
          const accessToken = response.authResponse.accessToken;
          // Send token to backend for verification / sign-in
          axios.post(apiUrl('client/dang-nhap-facebook'), { access_token: accessToken })
            .then((res) => {
              if (res.data.status) {
                localStorage.setItem('key_client', res.data.token);
                this.$router.push('/');
                this.$toast.success(res.data.message);
              } else {
                this.$toast.error(res.data.message || 'Đăng nhập Facebook thất bại.');
              }
            })
            .catch((err) => {
              console.error(err);
              this.$toast.error('Lỗi khi đăng nhập bằng Facebook.');
            })
            .finally(() => { this.isLoading = false; });
        } else {
          // If FB SDK login fails (common when app is in development or scopes invalid),
          // fallback to opening the OAuth dialog in a popup which shows FB's full consent page.
          this.isLoading = false;
          this.$toast.info('Chuyển sang OAuth popup Facebook...');
          const appId = import.meta.env.VITE_FACEBOOK_APP_ID || '';
          if (!appId) {
            this.$toast.error('Chưa cấu hình VITE_FACEBOOK_APP_ID.');
            return;
          }
          const redirectUri = `${window.location.origin}/facebook-callback.html`;
          const scope = encodeURIComponent('email,public_profile');
          const authUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&auth_type=rerequest`;

          const popup = window.open(authUrl, 'fb_oauth', 'width=520,height=700');

          const onMessage = (e) => {
            if (e.origin !== window.location.origin) return;
            if (!e.data || e.data.type !== 'fb-auth') return;
            window.removeEventListener('message', onMessage);
            const token = e.data.access_token || null;
            if (!token) {
              this.$toast.error('Không lấy được access token từ Facebook.');
              return;
            }
            this.isLoading = true;
            axios.post(apiUrl('client/dang-nhap-facebook'), { access_token: token })
              .then((res) => {
                if (res.data.status) {
                  localStorage.setItem('key_client', res.data.token);
                  this.$router.push('/');
                  this.$toast.success(res.data.message);
                } else {
                  this.$toast.error(res.data.message || 'Đăng nhập Facebook thất bại.');
                }
              })
              .catch((err) => {
                console.error(err);
                this.$toast.error('Lỗi khi đăng nhập bằng Facebook.');
              })
              .finally(() => { this.isLoading = false; });
          };

          window.addEventListener('message', onMessage);
        }
      }, { scope: 'email,public_profile', return_scopes: true });
    },
    
    onGoogleScriptLoaded() {
      this.googleClientLoaded = true;
      if (window.google && window.google.accounts && window.google.accounts.id) {
        
        // NHỚ THAY 'ID_CUA_BAN_THAY_VAO_DAY' BẰNG DÃY SỐ ID TRÊN GOOGLE CLOUD NẾU ĐẨY LÊN MẠNG (DEPLOY) BỊ LỖI K ĐỌC ĐƯỢC FILE .ENV
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'ID_CUA_BAN_THAY_VAO_DAY';
        
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') return;
        
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => this.handleGoogleCredentialResponse(response),
          });

          // Chờ giao diện render xong để vẽ nút Google
          this.$nextTick(() => {
            const btnContainer = document.getElementById("google-signin-button");
            if (btnContainer) {
              window.google.accounts.id.renderButton(
                btnContainer,
                { 
                  theme: "filled_blue", 
                  size: "large",        
                  shape: "pill",        
                  width: "280",         
                  text: "signin_with",  
                  logo_alignment: "left"
                }
              );
            }
          });
        } catch (error) {
          console.error("Lỗi Google SDK:", error);
        }
      }
    },
    
    handleGoogleCredentialResponse(response) {
      if (!response || !response.credential) return;

      this.isLoading = true;
      axios.post(apiUrl('client/dang-nhap-google'), { credential: response.credential })
        .then((res) => {
          if (res.data.status) {
            localStorage.setItem('key_client', res.data.token);
            this.$router.push('/');
            this.$toast.success(res.data.message);
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => { this.isLoading = false; });
    },
    
    dangNhap() {
      if(!this.user.email || !this.user.password) {
        this.$toast.warning("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      this.isLoading = true;

      axios.post(apiUrl("client/dang-nhap"), this.user)
        .then((res) => {
            if (res.data.status) {
                localStorage.setItem("key_client", res.data.token);
                
                // Xử lý ghi nhớ đăng nhập
                if (this.rememberMe) {
                  localStorage.setItem("saved_email_client", this.user.email);
                  localStorage.setItem("saved_password_client", this.user.password);
                } else {
                  localStorage.removeItem("saved_email_client");
                  localStorage.removeItem("saved_password_client");
                }

                this.$router.push("/");
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
.khung-dang-nhap { 
  min-height: 100vh; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  position: relative; 
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%); 
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; 
  padding: 40px 0; 
}
.nen-dang-nhap { 
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><g opacity="0.06" fill="none" stroke="currentColor"><circle cx="100" cy="100" r="80"/><path d="M300 200 L400 150 L500 200 L450 300 Z"/><path d="M900 400 L1000 350 L1050 400 L1000 450 Z"/></g></svg>'); 
  background-repeat: repeat; background-size: 400px 400px; opacity: 0.5; pointer-events: none; 
}
.bao-dang-nhap { position: relative; z-index: 1; }

/* THIẾT KẾ CARD THON GỌN Y HỆT ẢNH */
.the-dang-nhap { 
  background: #ffffff; 
  border-radius: 20px; 
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06); 
  animation: truotLen 0.5s ease-out; 
  border: 1px solid rgba(255,255,255,0.8); 
  max-width: 420px; /* Khống chế chiều ngang form cho thon gọn */
  width: 100%;
  padding: 35px 30px;
}
/* LOGO & TIÊU ĐỀ */
.vung-logo { animation: truotXuong 0.5s ease-out; }
.bieu-tuong-logo { display: flex; justify-content: center; align-items: center; margin: 0 auto; width: 65px; height: 65px; border-radius: 16px; }
.bieu-tuong-logo img { width: 90%; height: 90%; object-fit: contain; }
.tieu-de-logo { font-size: 22px; font-weight: 800; color: #1b7d6b; margin: 0; }
.tieu-de-the { font-size: 25px; font-weight: 800; color: #1b7d6b; text-align: center; margin: 0 0 5px 0; }
/* INPUT & LABEL THEO STYLE ẢNH */
.nhan-nhap-lieu {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #4b5563;
  margin-bottom: 8px;
}
.o-nhap-lieu { 
  width: 100%; 
  border: 1px solid transparent; 
  border-radius: 12px; 
  padding: 12px 16px; 
  font-size: 14.5px; 
  background: #eef2f6; /* Màu nền xanh nhạt giống ảnh */
  color: #1f2937;
  transition: all 0.2s ease; 
}
.o-nhap-lieu:focus { 
  outline: none; 
  background: #ffffff;
  border-color: #1b7d6b; 
  box-shadow: 0 0 0 4px rgba(27, 125, 107, 0.1); 
}
.o-nhap-lieu::placeholder { color: #9ca3af; font-weight: 400; }

.an-hien-mat-khau { 
  position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
  color: #9ca3af; cursor: pointer; font-size: 16px; 
  display: flex; align-items: center; transition: color 0.2s ease; 
}
.an-hien-mat-khau:hover { color: #1b7d6b; }

/* NÚT ĐĂNG NHẬP CHÍNH */
.nut-dang-nhap { 
  background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%); 
  color: #ffffff; 
  border: none; 
  border-radius: 12px; 
  padding: 14px 20px; 
  font-size: 16px; 
  font-weight: 700; 
  cursor: pointer; 
  transition: all 0.2s ease; 
}
.nut-dang-nhap:hover:not(:disabled) { 
  transform: translateY(-2px); 
  box-shadow: 0 8px 20px rgba(27, 125, 107, 0.25); 
}

/* CÁC LINK (QUÊN MK, TẠO TK) */
.duong-dan-chinh { font-size: 14.5px; color: #1b7d6b; text-decoration: none; transition: color 0.2s ease; }
.duong-dan-chinh:hover { color: #1b7d6b; text-decoration: underline; }

/* VẠCH NGĂN HOẶC */
.vach-ngan { position: relative; text-align: center; }
.vach-ngan::before { content: ""; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: #e5e7eb; z-index: 1; }
.vach-ngan span { position: relative; z-index: 2; color: #9ca3af; }

/* NÚT MẠNG XÃ HỘI MỚI (Ngắn lại, bo tròn vòng, icon trong ô trắng) */
.dang-nhap-mxh {
  max-width: 280px; /* Khống chế chiều ngang nút MXH ngắn lại */
}
.nut-mxh { 
  display: flex; 
  align-items: center; 
  border: none; 
  border-radius: 30px; /* Bo tròn hoàn toàn */
  padding: 4px; /* Padding nhỏ để tạo viền bọc icon */
  cursor: pointer; 
  transition: all 0.2s ease; 
}
.icon-tron {
  width: 34px; height: 34px;
  background: #ffffff;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
}
.text-mxh {
  flex: 1;
  text-align: center;
  font-size: 13.5px;
  font-weight: 600;
  color: #ffffff;
  padding-right: 18px; /* Cân bằng với icon bên trái */
}

/* Style riêng Facebook */
.nut-facebook { background: #1877f2; }
.nut-facebook:hover { background: #145dbf; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(24, 119, 242, 0.3); }

/* BOX ĐỐI TÁC DƯỚI CÙNG */
.link-doi-tac { color: #1b7d6b; transition: color 0.2s ease; }
.link-doi-tac:hover { color: #115c4d; text-decoration: underline !important; }

/* ANIMATIONS */
@keyframes truotXuong { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
@keyframes truotLen { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

/* RESPONSIVE */
@media (max-width: 576px) { 
  .the-dang-nhap { padding: 30px 20px; } 
  .tieu-de-the { font-size: 22px; } 
  .o-nhap-lieu { padding: 12px 14px; font-size: 14px; } 
}
</style>