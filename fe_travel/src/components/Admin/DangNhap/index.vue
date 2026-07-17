<template>
    <div class="auth-wrapper d-flex align-items-center justify-content-center min-vh-100">
        <div class="auth-bg-overlay"></div>

        <div class="container my-5">
            <div class="row g-0 auth-card shadow-lg rounded-4 overflow-hidden mx-auto" style="max-width: 900px;">
                
                <!-- Cột Trái (Brand) -->
                <div class="col-lg-5 d-none d-lg-flex flex-column justify-content-center align-items-center text-center p-5 auth-brand-panel">
                    <div class="d-flex align-items-center justify-content-center gap-3 mb-4">
                        <img src="https://logo.com/image-cdn/images/kts928pd/production/2422e0e54bc42735594cd2f3800bdd15ce7ab258-317x316.png?w=1080&q=72&fm=webp" alt="" class="img-fluid brand-logo m-0">
                        <h2 class="text-white fw-bold m-0" style="letter-spacing: 2px;">IXTAL</h2>
                    </div>
                    
                    <p class="text-white-50 mb-0">Hệ thống quản lý tổng thể dành cho rạp chiếu phim. Đăng nhập để truy cập khu vực quản trị an toàn.</p>
                </div>

                <!-- Cột Phải (Form) -->
                <div class="col-lg-7 d-flex align-items-center bg-white p-5 auth-form-panel">
                    <div class="w-100">
                        
                        <div class="d-flex justify-content-center align-items-center gap-2 d-lg-none mb-4">
                            <img src="https://logo.com/image-cdn/images/kts928pd/production/2422e0e54bc42735594cd2f3800bdd15ce7ab258-317x316.png?w=1080&q=72&fm=webp" alt="Logo" class="img-fluid" style="max-width: 60px;">
                            <h2 class="fw-bold text-dark m-0">IXTAL</h2>
                        </div>

                        <div class="mb-5">
                            <h2 class="fw-bold text-dark mb-2">Chào mừng trở lại! 👋</h2>
                            <p class="text-muted">Vui lòng đăng nhập bằng tài khoản quản trị.</p>
                        </div>

                        <div class="form-body">
                            <div class="row g-4">
                                <!-- Email Input -->
                                <div class="col-12">
                                    <label class="form-label fw-semibold text-dark">Email Quản Trị</label>
                                    <div class="input-group input-group-lg border rounded-3 p-1 custom-input-wrapper">
                                        <span class="input-group-text bg-transparent border-0 text-primary">
                                            <i class="fa-solid fa-envelope"></i>
                                        </span>
                                        <input v-model="user.email" type="email" 
                                            class="form-control border-0 shadow-none bg-transparent" 
                                            placeholder="admin@gmail.com"
                                            @keyup.enter="dangNhap">
                                    </div>
                                </div>

                                <!-- Password Input -->
                                <div class="col-12">
                                    <label class="form-label fw-semibold text-dark mb-1">Mật khẩu</label>
                                    <div class="input-group input-group-lg border rounded-3 p-1 custom-input-wrapper">
                                        <span class="input-group-text bg-transparent border-0 text-primary">
                                            <i class="fa-solid fa-lock"></i>
                                        </span>
                                        <input v-model="user.password" :type="passwordVisible ? 'text' : 'password'" 
                                            class="form-control border-0 shadow-none bg-transparent" 
                                            placeholder="••••••••"
                                            @keyup.enter="dangNhap">
                                        <span class="input-group-text bg-transparent border-0 text-muted" style="cursor: pointer;" @click="passwordVisible = !passwordVisible">
                                            <i :class="passwordVisible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                                        </span>
                                    </div>
                                </div>

                                <!-- ĐÃ SỬA: Ghi nhớ & Quên mật khẩu ngang hàng -->
                                <div class="col-12 mt-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="form-check custom-checkbox d-flex align-items-center m-0">
                                            <input class="form-check-input shadow-none mt-0 me-2" type="checkbox" id="rememberMe" v-model="rememberMe">
                                            <label class="form-check-label text-muted small fw-medium" for="rememberMe" style="cursor: pointer; user-select: none;">
                                                Ghi nhớ đăng nhập
                                            </label>
                                        </div>
                                        <a href="#" class="text-decoration-none fw-bold small forgot-link">Quên mật khẩu?</a>
                                    </div>
                                </div>

                                <!-- Nút Đăng nhập -->
                                <div class="col-12 mt-4">
                                    <button @click="dangNhap" :disabled="isLoading" 
                                        class="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm btn-login d-flex justify-content-center align-items-center gap-2">
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span v-else>Đăng Nhập <i class="fa-solid fa-arrow-right ms-1"></i></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mt-5 text-muted small">
                            &copy; 2026 IXTAL TOUR Team. Phiên bản 2.0
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
            user: {
                email: '',
                password: '',
            },
            passwordVisible: false,
            isLoading: false,
            rememberMe: false, // Biến lưu trạng thái checkbox
        }
    },
    mounted() {
        // TỰ ĐỘNG ĐIỀN THÔNG TIN NẾU TRƯỚC ĐÓ ĐÃ CHỌN "GHI NHỚ"
        const savedEmail = localStorage.getItem('ix_admin_email');
        const savedPass = localStorage.getItem('ix_admin_pass');
        
        if (savedEmail && savedPass) {
            this.user.email = savedEmail;
            this.user.password = atob(savedPass); // Giải mã base64 (atob) để hiển thị lại
            this.rememberMe = true;
        }
    },
    methods: {
        dangNhap() {
            if (!this.user.email || !this.user.password) {
                this.$toast.warning("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            this.isLoading = true;
            axios.post(apiUrl('admin/dang-nhap'), this.user)
                .then((res) => {
                    if (res.data.status) {
                        localStorage.setItem('key_admin', res.data.token);
                        
                        // XỬ LÝ LƯU TÀI KHOẢN (GHI NHỚ ĐĂNG NHẬP)
                        if (this.rememberMe) {
                            localStorage.setItem('ix_admin_email', this.user.email);
                            // Mã hóa base64 (btoa) để password không hiện rõ ràng trong Storage
                            localStorage.setItem('ix_admin_pass', btoa(this.user.password)); 
                        } else {
                            // Nếu khách bỏ tick thì xóa thông tin cũ đi
                            localStorage.removeItem('ix_admin_email');
                            localStorage.removeItem('ix_admin_pass');
                        }

                        this.$toast.success(res.data.message);
                        this.$router.push('/admin/dashboard');
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((err) => {
                    if (err.response && err.response.data && err.response.data.errors) {
                        const list = Object.values(err.response.data.errors);
                        list.forEach((v) => {
                            this.$toast.error(v[0]);
                        });
                    } else {
                        this.$toast.error("Hệ thống đang bận, vui lòng thử lại sau!");
                    }
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
}
</script>

<style scoped>
/* Toàn bộ nền */
.auth-wrapper {
    position: relative;
    background: #f4f7f6; 
    overflow: hidden;
}

/* Background trang trí chéo */
.auth-bg-overlay {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(-45deg, #4e54c8, #8f94fb);
    transform: rotate(30deg);
    z-index: 0;
}

/* Form container */
.container {
    position: relative;
    z-index: 1;
}

.auth-card {
    background: white;
}

/* Cột trái (Brand) */
.auth-brand-panel {
    background: linear-gradient(135deg, #1e1e2d, #151521);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-logo {
    max-width: 75px;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
    transition: transform 0.3s ease;
}
.brand-logo:hover {
    transform: scale(1.05);
}

/* Cột phải (Form) */
.auth-form-panel {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

/* Custom Input Wrapper */
.custom-input-wrapper {
    background-color: #f8f9fa;
    transition: all 0.3s ease;
}

.custom-input-wrapper:focus-within {
    background-color: #fff;
    border-color: #4e54c8 !important;
    box-shadow: 0 0 0 0.25rem rgba(78, 84, 200, 0.1);
}

.custom-input-wrapper input:focus {
    background-color: transparent !important;
}

/* Nút Submit */
.btn-login {
    background: linear-gradient(45deg, #4e54c8, #8f94fb);
    border: none;
    transition: all 0.3s ease;
}

.btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(78, 84, 200, 0.3) !important;
}

.btn-login:disabled {
    background: #aab0d4;
    transform: none;
    box-shadow: none !important;
}

/* --- TRANG TRÍ RIÊNG CHO PHẦN GHI NHỚ VÀ QUÊN MẬT KHẨU --- */
.forgot-link {
    color: #4e54c8;
    transition: all 0.2s ease;
}

.forgot-link:hover {
    color: #3b3f96;
    text-decoration: underline !important;
}

.custom-checkbox .form-check-input {
    border-color: #ced4da;
    cursor: pointer;
}

.custom-checkbox .form-check-input:checked {
    background-color: #4e54c8;
    border-color: #4e54c8;
}

/* Responsive bo góc */
@media (max-width: 991.98px) {
    .auth-form-panel {
        border-radius: 1rem;
    }
}
</style>