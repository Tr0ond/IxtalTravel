<template>
    <div style="background-color: #F4F7F6; min-height: 100vh; padding-bottom: 60px;">
        
        <div class="profile-cover position-relative" style="height: 280px; background: url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;">
            <div class="position-absolute w-100 h-100 top-0 start-0" style="background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6));"></div>
        </div>

        <div class="container" style="margin-top: -100px; position: relative; z-index: 10;">
            <div class="row g-4">
                
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 mb-4" style="overflow: visible;">
                        <div class="card-body p-0 text-center pb-4">
                            <div class="mt-n5 mb-3 position-relative d-inline-block" style="margin-top: -65px;">
                                <!-- ĐÃ SỬA: Liên kết với update_profile.avatar để dán link xong preview ảnh liền -->
                                <!-- Nếu không có ảnh thì tự tạo UI-Avatars -->
                                <img :src="update_profile.avatar || `https://ui-avatars.com/api/?name=${update_profile.ho_va_ten || 'KH'}&background=random&color=fff&size=150&font-size=0.33`" 
                                     alt="Avatar" 
                                     class="rounded-circle shadow bg-white p-1" 
                                     width="130" height="130" 
                                     style="object-fit: cover;" />
                            </div>
                            
                            <h4 class="fw-bold mb-1 text-dark">{{ profile.ho_va_ten || 'Thành viên Ixtal Tour' }}</h4>
                            <p class="text-muted small mb-3">
                                <i class="fa-solid fa-envelope text-primary me-1"></i> {{ profile.email }}
                            </p>
                            
                            <span class="badge bg-success bg-opacity-10 text-white px-3 py-2 rounded-pill fw-semibold">
                                <i class="fa-solid fa-crown me-1"></i> Khách hàng thân thiết
                            </span>
                        </div>

                        <div class="list-group list-group-flush border-top" style="border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; overflow: hidden;">
                            <button @click="activeTab = 'profile'" 
                                    :class="['list-group-item list-group-item-action py-3 px-4 fw-medium border-0 d-flex align-items-center', activeTab === 'profile' ? 'active-menu' : '']">
                                <i class="fa-solid fa-user-pen fs-5 me-3" style="width: 20px;"></i> 
                                Thông Tin Cá Nhân
                            </button>
                            <button @click="activeTab = 'password'" 
                                    :class="['list-group-item list-group-item-action py-3 px-4 fw-medium border-0 d-flex align-items-center', activeTab === 'password' ? 'active-menu' : '']">
                                <i class="fa-solid fa-shield-halved fs-5 me-3" style="width: 20px;"></i> 
                                Đổi Mật Khẩu
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-lg-8">
                    
                    <div v-if="activeTab === 'profile'" class="card border-0 shadow-sm rounded-4 slide-in overflow-hidden">
                        <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                            <h5 class="fw-bold text-dark mb-0"><i class="fa-solid fa-address-card text-primary me-2"></i> Hồ Sơ Của Tôi</h5>
                            <p class="text-muted small mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản và đặt tour nhanh chóng hơn.</p>
                        </div>
                        <div class="card-body p-4">
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold text-secondary small">Họ và tên</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-user text-muted"></i></span>
                                        <input v-model="update_profile.ho_va_ten" type="text" class="form-control border-start-0 bg-light" placeholder="Nhập họ và tên" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold text-secondary small">Email (Không thể đổi)</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-envelope text-muted"></i></span>
                                        <input v-model="update_profile.email" type="email" class="form-control border-start-0 bg-light text-muted" disabled />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold text-secondary small">Ngày sinh</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-calendar-days text-muted"></i></span>
                                        <input v-model="update_profile.ngay_sinh" type="date" class="form-control border-start-0 bg-light" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold text-secondary small">Số điện thoại</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-phone text-muted"></i></span>
                                        <input v-model="update_profile.so_dien_thoai" type="text" class="form-control border-start-0 bg-light" placeholder="Nhập số điện thoại" maxlength="10" />
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-semibold text-secondary small">Đường dẫn ảnh đại diện (URL)</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-link text-muted"></i></span>
                                        <input v-model="update_profile.avatar" type="text" class="form-control border-start-0 bg-light" placeholder="Nhập link ảnh avatar của bạn" />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="text-end mt-5 border-top pt-4">
                                <button @click="updateProfile()" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm custom-btn">
                                    Lưu Thay Đổi
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeTab === 'password'" class="card border-0 shadow-sm rounded-4 slide-in overflow-hidden">
                        <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                            <h5 class="fw-bold text-dark mb-0"><i class="fa-solid fa-lock text-warning me-2"></i> Đổi Mật Khẩu</h5>
                            <p class="text-muted small mt-1">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.</p>
                        </div>
                        <div class="card-body p-4">
                            <div class="row align-items-center">
                                <div class="col-md-7 pe-md-4 border-end-md">
                                    <div class="mb-4">
                                        <label class="form-label fw-semibold text-secondary small">Mật khẩu hiện tại</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-key text-muted"></i></span>
                                            <input :type="showPassword.password ? 'text' : 'password'" v-model="update_password_profile.password" class="form-control border-start-0 border-end-0 bg-light" placeholder="Nhập mật khẩu cũ" />
                                            <button type="button" @click="showPassword.password = !showPassword.password" class="btn btn-light border border-start-0 text-muted">
                                                <i :class="showPassword.password ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <label class="form-label fw-semibold text-secondary small">Mật khẩu mới</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-lock text-muted"></i></span>
                                            <input :type="showPassword.new_password ? 'text' : 'password'" v-model="update_password_profile.new_password" class="form-control border-start-0 border-end-0 bg-light" placeholder="Mật khẩu mới (ít nhất 6 ký tự)" />
                                            <button type="button" @click="showPassword.new_password = !showPassword.new_password" class="btn btn-light border border-start-0 text-muted">
                                                <i :class="showPassword.new_password ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <label class="form-label fw-semibold text-secondary small">Xác nhận mật khẩu mới</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-circle-check text-muted"></i></span>
                                            <input :type="showPassword.confirm_password ? 'text' : 'password'" v-model="update_password_profile.confirm_password" class="form-control border-start-0 border-end-0 bg-light" placeholder="Nhập lại mật khẩu mới" />
                                            <button type="button" @click="showPassword.confirm_password = !showPassword.confirm_password" class="btn btn-light border border-start-0 text-muted">
                                                <i :class="showPassword.confirm_password ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="text-end mb-4">
                                        <router-link to="/client/quen-mat-khau" class="text-decoration-none small text-primary fw-semibold">
                                            Quên mật khẩu?
                                        </router-link>
                                    </div>
                                    
                                    <div class="text-center">
                                        <button @click="updatePasswordProfile()" type="button" class="btn btn-warning text-dark rounded-pill w-100 fw-bold shadow-sm custom-btn">
                                            Xác Nhận Đổi Mật Khẩu
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="col-md-5 d-none d-md-block text-center ps-md-4">
                                    <img src="https://media.gettyimages.com/id/1370097090/video/hacking-digital-data-protection-concept-stock-video.jpg?s=640x640&k=20&c=m_Y3agfXhk5Rg049mxf21dqJc6uOJpL93U7TGkt7Kh0=" alt="Security" 
                                        class="img-fluid" style="height: 300px; width: 100%; object-fit: cover; border-radius: 1rem;" />
                                    <p class="text-muted small mt-3 fst-italic">Bảo mật tài khoản của bạn là ưu tiên hàng đầu của chúng tôi.</p>
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
                ngay_sinh: "",
                so_dien_thoai: "",
                avatar: ""
            },
            update_profile: {
                ho_va_ten: "",
                email: "",
                ngay_sinh: "",
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
        loadData() {
            axios.get(apiUrl("client/profile/get-data"), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("key_client"),
                },
            })
            .then((res) => {
                if (res.data.status) {
                    this.profile = res.data.data;
                    this.update_profile = { ...res.data.data };
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
        updateProfile() {
            axios.post(apiUrl("client/profile/update"), this.update_profile, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("key_client"),
                },
            })
            .then((res) => {
                if (res.data.status) {
                    this.loadData();
                    this.$toast.success(res.data.message);
                    
                    // SỬA: Đảm bảo lưu đúng avatar để Header lấy dữ liệu nếu không trả về từ DB
                    localStorage.setItem("avatar", this.update_profile.avatar || "");
                    localStorage.setItem("ho_va_ten", this.update_profile.ho_va_ten || "");
                    
                    // Kích hoạt sự kiện để Header (TopRocker) cập nhật ngay
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
            axios.post(apiUrl("client/doi-mat-khau"), this.update_password_profile, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("key_client"),
                },
            })
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
.slide-in {
    animation: slideIn 0.4s ease-out;
}
@keyframes slideIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

.active-menu {
    background-color: #f0f7ff !important;
    color: #005baa !important;
    border-left: 4px solid #005baa !important;
}
.list-group-item {
    color: #4b5563;
    transition: all 0.3s;
    border-left: 4px solid transparent !important;
}
.list-group-item:hover:not(.active-menu) {
    background-color: #f8f9fa;
    color: #005baa;
}

.form-control:focus {
    box-shadow: none;
    border-color: #005baa;
    background-color: #fff !important;
}
.input-group-text {
    border-color: #dee2e6;
}
.input-group:focus-within .input-group-text, 
.input-group:focus-within .btn-light {
    border-color: #005baa;
    background-color: #fff !important;
}
.input-group:focus-within .form-control {
    border-color: #005baa;
}

.custom-btn {
    transition: transform 0.2s, box-shadow 0.2s;
}
.custom-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.15) !important;
}

@media (min-width: 768px) {
    .border-end-md {
        border-right: 1px dashed #e9ecef;
    }
}
</style>