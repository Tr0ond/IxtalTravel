<template>
    <div class="profile-page-wrapper">
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-12 col-lg-10 col-xl-8">
                    
                    <div class="card premium-card border-0 shadow-sm overflow-hidden">
                        
                        <!-- PHẦN HEADER -->
                        <div class="profile-header-solid text-center pt-5 pb-4">
                            <div class="avatar-wrapper mb-3">
                                <!-- ĐÃ SỬA THÀNH UPDATE_PROFILE ĐỂ PREVIEW ẢNH NGAY KHI PASTE LINK -->
                                <img :src="update_profile.avatar || 'https://ui-avatars.com/api/?name=' + (update_profile.ho_va_ten || 'HDV') + '&background=1b7d6b&color=fff'" 
                                     alt="Avatar" 
                                     class="profile-avatar shadow-sm" />
                            </div>
                            
                            <h3 class="fw-bold mb-1 text-dark">{{ profile.ho_va_ten || 'Hướng Dẫn Viên' }}</h3>
                            <p class="text-muted mb-3">
                                <i class="fa-solid fa-envelope me-1" style="color: #1b7d6b;"></i> {{ profile.email }}
                            </p>
                            
                            <div class="badge-premium d-inline-flex align-items-center">
                                <i class="fa-solid fa-star text-warning me-2 fs-6"></i> 
                                <span>Chuyên Gia Dẫn Tour</span>
                            </div>
                        </div>

                        <!-- MENU TABS NẰM NGANG -->
                        <div class="horizontal-tabs d-flex justify-content-center border-bottom px-4">
                            <button @click="activeTab = 'profile'" 
                                    :class="['tab-btn', activeTab === 'profile' ? 'active' : '']">
                                <i class="fa-solid fa-user-pen me-2"></i> Thông Tin Cá Nhân
                            </button>
                            <button @click="activeTab = 'password'" 
                                    :class="['tab-btn', activeTab === 'password' ? 'active' : '']">
                                <i class="fa-solid fa-shield-halved me-2"></i> Đổi Mật Khẩu
                            </button>
                        </div>

                        <!-- PHẦN NỘI DUNG FORM -->
                        <div class="card-body p-4 p-md-5 bg-white">
                            
                            <!-- TAB: THÔNG TIN CÁ NHÂN -->
                            <div v-if="activeTab === 'profile'" class="slide-in">
                                <div class="mb-4 border-left-title ps-3">
                                    <h5 class="fw-bold text-dark mb-1">HỒ SƠ ĐỐI TÁC</h5>
                                    <p class="text-muted small mb-0">Quản lý thông tin liên hệ và ngôn ngữ dẫn tour của bạn.</p>
                                </div>
                                
                                <div class="row g-4">
                                    <!-- Họ và Tên -->
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-secondary small text-uppercase letter-spacing-1">Họ và tên</label>
                                        <div class="input-group premium-input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                                            <input v-model="update_profile.ho_va_ten" type="text" class="form-control" placeholder="Nhập họ và tên đầy đủ" />
                                        </div>
                                    </div>
                                    
                                    <!-- Email -->
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-secondary small text-uppercase letter-spacing-1">Email (Tài khoản)</label>
                                        <div class="input-group premium-input-group disabled-group">
                                            <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                            <input v-model="update_profile.email" type="email" class="form-control" disabled />
                                        </div>
                                    </div>
                                    
                                    <!-- Số điện thoại -->
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-secondary small text-uppercase letter-spacing-1">Số điện thoại</label>
                                        <div class="input-group premium-input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                                            <input v-model="update_profile.so_dien_thoai" type="text" class="form-control" placeholder="Nhập số điện thoại" maxlength="10" />
                                        </div>
                                    </div>
                                    
                                    <!-- Ngôn ngữ giao tiếp -->
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-secondary small text-uppercase letter-spacing-1">Ngôn ngữ dẫn tour</label>
                                        <div class="input-group premium-input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-language"></i></span>
                                            <input v-model="update_profile.ngon_ngu" type="text" class="form-control" placeholder="VD: Tiếng Việt, Tiếng Anh" />
                                        </div>
                                    </div>

                                    <!-- Link Avatar -->
                                    <div class="col-12">
                                        <label class="form-label fw-bold text-secondary small text-uppercase letter-spacing-1">Đường dẫn ảnh đại diện (URL)</label>
                                        <div class="input-group premium-input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-link"></i></span>
                                            <input v-model="update_profile.avatar" type="text" class="form-control" placeholder="https://..." />
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="text-end mt-5">
                                    <button @click="updateProfile()" class="btn btn-gradient-primary rounded-pill px-5 py-2 fw-bold shadow-sm custom-hover-btn">
                                        LƯU THAY ĐỔI <i class="fa-solid fa-floppy-disk ms-2"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- TAB: ĐỔI MẬT KHẨU -->
                            <div v-if="activeTab === 'password'" class="slide-in">
                                <div class="mb-4 border-left-title ps-3 border-warning">
                                    <h5 class="fw-bold text-dark mb-1">BẢO MẬT TÀI KHOẢN</h5>
                                    <p class="text-muted small mb-0">Đổi mật khẩu định kỳ để bảo vệ tài khoản hướng dẫn viên của bạn.</p>
                                </div>
                                
                                <div class="row justify-content-center">
                                    <div class="col-12 col-md-10 col-lg-8">
                                        <div class="mb-4">
                                            <label class="form-label fw-bold text-secondary small text-uppercase letter-spacing-1">Mật khẩu hiện tại</label>
                                            <div class="input-group premium-input-group">
                                                <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                                                <input :type="showPassword.password ? 'text' : 'password'" v-model="update_password_profile.password" class="form-control border-end-0" placeholder="Nhập mật khẩu cũ" />
                                                <button type="button" @click="showPassword.password = !showPassword.password" class="btn btn-eye border-start-0">
                                                    <i :class="showPassword.password ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="mb-4">
                                            <label class="form-label fw-bold text-secondary small text-uppercase letter-spacing-1">Mật khẩu mới</label>
                                            <div class="input-group premium-input-group">
                                                <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                                                <input :type="showPassword.new_password ? 'text' : 'password'" v-model="update_password_profile.new_password" class="form-control border-end-0" placeholder="Mật khẩu mới" />
                                                <button type="button" @click="showPassword.new_password = !showPassword.new_password" class="btn btn-eye border-start-0">
                                                    <i :class="showPassword.new_password ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="mb-4">
                                            <label class="form-label fw-bold text-secondary small text-uppercase letter-spacing-1">Xác nhận mật khẩu mới</label>
                                            <div class="input-group premium-input-group">
                                                <span class="input-group-text"><i class="fa-solid fa-circle-check"></i></span>
                                                <input :type="showPassword.confirm_password ? 'text' : 'password'" v-model="update_password_profile.confirm_password" class="form-control border-end-0" placeholder="Nhập lại mật khẩu mới" />
                                                <button type="button" @click="showPassword.confirm_password = !showPassword.confirm_password" class="btn btn-eye border-start-0">
                                                    <i :class="showPassword.confirm_password ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div class="text-end mb-4">
                                            <router-link to="/huong-dan-vien/quen-mat-khau" class="text-decoration-none small text-primary fw-semibold">
                                                Quên mật khẩu?
                                            </router-link>
                                        </div>
                                        
                                        <div class="text-center">
                                            <button @click="updatePasswordProfile()" type="button" class="btn btn-gradient-warning text-dark rounded-pill px-5 py-2 fw-bold shadow-sm custom-hover-btn w-100">
                                                XÁC NHẬN ĐỔI MẬT KHẨU
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
            activeTab: 'profile',
            profile: {
                ho_va_ten: "",
                email: "",
                ngon_ngu: "",
                so_dien_thoai: "",
                avatar: ""
            },
            update_profile: {
                ho_va_ten: "",
                email: "",
                ngon_ngu: "",
                so_dien_thoai: "",
                avatar: ""
            },
            update_password_profile: {
                password: '',
                new_password: '',
                confirm_password: ''
            },
            showPassword: {
                password: false,
                new_password: false,
                confirm_password: false
            }
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        getHeaders() {
            return {
                Authorization: "Bearer " + localStorage.getItem("key_hdv"),
            };
        },
        loadData() {
            axios.get(apiUrl("huong-dan-vien/profile/get-data"), { headers: this.getHeaders() })
            .then((res) => {
                if (res.data.status) {
                    this.profile = res.data.data;
                    this.update_profile = { ...res.data.data };
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch((err) => {
                 console.error("Lỗi:", err);
            });
        },
        updateProfile() {
            axios.post(apiUrl("huong-dan-vien/profile/update"), this.update_profile, { headers: this.getHeaders() })
            .then((res) => {
                if (res.data.status) {
                    this.loadData();
                    this.$toast.success(res.data.message);
                    // Kích hoạt sự kiện để Header (TopRocker) tải lại ảnh ngay
                    window.dispatchEvent(new Event("profile-updated")); 
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch((res) => {
                if(res.response && res.response.data && res.response.data.errors) {
                    const list = Object.values(res.response.data.errors);
                    list.forEach((v) => {
                        this.$toast.error(v[0]);
                    });
                }
            });
        },
        updatePasswordProfile() {
            axios.post(apiUrl("huong-dan-vien/doi-mat-khau"), this.update_password_profile, { headers: this.getHeaders() })
            .then((res) => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.update_password_profile = {
                        password: '',
                        new_password: '',
                        confirm_password: ''
                    };
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch((res) => {
                if(res.response && res.response.data && res.response.data.errors) {
                    const list = Object.values(res.response.data.errors);
                    list.forEach((v) => {
                        this.$toast.error(v[0]);
                    });
                }
            });
        }
    },
};
</script>

<style scoped>
.profile-header-solid {
    background: linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

/* CARD SANG TRỌNG */
.premium-card {
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
}

/* AVATAR */
.avatar-wrapper {
    display: inline-block;
    position: relative;
}
.profile-avatar {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 5px solid #ffffff;
    background: #fff;
    object-fit: cover;
}

/* BADGE */
.badge-premium {
    background-color: rgba(27, 125, 107, 0.1);
    color: #1b7d6b;
    padding: 8px 20px;
    border-radius: 50px;
    font-weight: 700;
}

/* MENU TABS NẰM NGANG */
.horizontal-tabs {
    background-color: #ffffff;
    gap: 15px;
}
.tab-btn {
    background: transparent;
    border: none;
    padding: 15px 20px;
    color: #64748b;
    font-weight: 600;
    font-size: 15px;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
}
.tab-btn:hover {
    color: #1b7d6b;
}
.tab-btn.active {
    color: #1b7d6b;
    border-bottom: 3px solid #1b7d6b;
}

/* TIÊU ĐỀ SECTION */
.border-left-title {
    border-left: 4px solid #1b7d6b;
}
.border-left-title.border-warning {
    border-left-color: #f59e0b !important;
}

/* PREMIUM INPUTS */
.letter-spacing-1 {
    letter-spacing: 0.5px;
}
.premium-input-group .input-group-text {
    background-color: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-right: none;
    color: #94a3b8;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    padding: 0.85rem 1.25rem;
}
.premium-input-group .form-control {
    background-color: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-left: none;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    padding: 0.85rem 1rem 0.85rem 0;
    color: #334155;
    font-weight: 500;
}
.premium-input-group .btn-eye {
    background-color: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    color: #94a3b8;
}

/* Hiệu ứng khi focus */
.premium-input-group:focus-within .input-group-text,
.premium-input-group:focus-within .form-control,
.premium-input-group:focus-within .btn-eye {
    background-color: #ffffff;
    border-color: #1b7d6b;
}
.premium-input-group:focus-within .form-control {
    box-shadow: none; 
}
.premium-input-group:focus-within {
    box-shadow: 0 0 0 4px rgba(27, 125, 107, 0.1);
    border-radius: 12px;
}

/* Khóa input (disabled) */
.disabled-group .input-group-text,
.disabled-group .form-control {
    background-color: #f1f5f9;
    color: #94a3b8;
}

/* BUTTONS */
.btn-gradient-primary {
    background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%);
    border: none;
    color: #fff;
}
.btn-gradient-warning {
    background: linear-gradient(to right, #deaa3b, #E3CC81);
    border: none;
    color: #000;
}
.custom-hover-btn {
    transition: all 0.3s ease;
}
.custom-hover-btn:hover {
    transform: translateY(-3px);
    filter: brightness(1.05);
    box-shadow: 0 8px 20px rgba(27, 125, 107, 0.25) !important;
}

/* ANIMATION */
.slide-in {
    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 576px) {
    .horizontal-tabs {
        flex-direction: column;
        align-items: center;
        padding-bottom: 10px;
    }
    .tab-btn {
        width: 100%;
        text-align: center;
        padding: 10px;
    }
}
</style>