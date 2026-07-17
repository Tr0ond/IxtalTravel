<template>
    <div class="topbar d-flex align-items-center custom-topbar">
        <nav class="navbar navbar-expand w-100 px-3 justify-content-between">
            
            <div class="d-flex align-items-center gap-3">
                <div class="mobile-toggle-menu d-lg-none">
                    <i class="bx bx-menu" style="font-size: 1.5rem; color: #475569;"></i>
                </div>
                
                <div class="d-none d-md-flex align-items-center text-muted" style="font-size: 1rem;">
                    <i class="fa-solid fa-house me-2" style="color: #64748b;"></i>
                    <i class="fa-solid fa-chevron-right me-2" style="font-size: 0.75rem; color: #94a3b8;"></i>
                    <span style="font-weight: 600; color: #334155;">{{ pageTitle }}</span>
                </div>
            </div>

            <div class="top-menu ms-auto d-flex align-items-center gap-3">
                <ul class="navbar-nav align-items-center">
                    
                    <li class="nav-item me-3">
                        <a class="nav-link position-relative" href="javascript:;">
                            <i class="fa-solid fa-bell text-muted" style="font-size: 1.1rem;"></i>
                            </a>
                    </li>

                    <li class="nav-item dropdown dropdown-large">
                        <a class="d-flex align-items-center nav-link dropdown-toggle dropdown-toggle-nocaret" href="#"
                            role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            
                            <div class="user-info text-end pe-2 d-none d-md-block">
                                <p class="mb-0 text-muted" style="font-size: 0.85rem;">Xin chào, <span class="fw-bold" style="color: #0f172a;">{{ userProfile.ho_va_ten || 'Hướng Dẫn Viên' }}</span></p>
                            </div>
                            
                            <img :src="userProfile.avatar || 'https://ui-avatars.com/api/?name=' + (userProfile.ho_va_ten || 'HDV') + '&background=random'" 
                                 class="user-img shadow-sm" alt="user avatar" 
                                 style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;" />
                        </a>
                        
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0" style="border-radius: 12px; min-width: 200px; padding: 8px 0; margin-top: 10px;">
                            <router-link to="/huong-dan-vien/profile" style="text-decoration: none;">
                                <li>
                                    <a class="dropdown-item d-flex align-items-center py-2 px-3 hover-bg">
                                        <i class="fa-solid fa-user me-3 text-primary"></i>
                                        <span style="font-weight: 500; color: #334155;">Thông tin cá nhân</span>
                                    </a>
                                </li>
                            </router-link>
                            
                            <li><hr class="dropdown-divider my-1"></li>
                            
                            <li>
                                <a class="dropdown-item d-flex align-items-center py-2 px-3 hover-bg text-danger" href="javascript:;" @click="dangXuat()">
                                    <i class="fa-solid fa-right-from-bracket me-3"></i>
                                    <span style="font-weight: 500;">Đăng xuất</span>
                                </a>
                            </li>
                            
                            <li>
                                <a class="dropdown-item d-flex align-items-center py-2 px-3 hover-bg text-danger" href="javascript:;" @click="dangXuatAll()">
                                    <i class="fa-solid fa-power-off me-3"></i>
                                    <span style="font-weight: 500;">Đăng xuất tất cả</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

        </nav>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api';

export default {
    name: 'TopHeader',
    data() {
        return {
            userProfile: {
                ho_va_ten: '',
                email: '',
                avatar: ''
            }
        }
    },
    computed: {
        // HÀM THEO DÕI ĐƯỜNG DẪN (ROUTE) VÀ HIỂN THỊ TÊN TƯƠNG ỨNG GIỐNG ADMIN
        pageTitle() {
            const path = this.$route.path;
            
            // Từ điển ánh xạ đường dẫn URL -> Tiêu đề hiển thị trên Topbar
            const routeMap = {
                '/huong-dan-vien/dashboard': 'Bảng điều khiển',
                '/huong-dan-vien/lich-trinh': 'Lịch Trình Công Việc',
                '/huong-dan-vien/quan-ly-tour': 'Quản Lý Tour Dẫn',
                '/huong-dan-vien/quan-ly-khach-hang': 'Quản Lý Khách Hàng',
                '/huong-dan-vien/profile': 'Thông tin cá nhân'
            };
            
            return routeMap[path] || 'Trang Hướng Dẫn Viên';
        }
    },
    mounted() {
        this.loadUserProfile();
        window.addEventListener('profile-updated', this.loadUserProfile);
    },
    beforeUnmount() {
        window.removeEventListener('profile-updated', this.loadUserProfile);
    },
    methods: {
        getHeaders() {
            return {
                Authorization: "Bearer " + localStorage.getItem("key_hdv"),
            };
        },
        
        loadUserProfile() {
            axios.get(apiUrl('huong-dan-vien/profile/get-data'), { headers: this.getHeaders() })
                .then(res => {
                    if (res.data.status) {
                        this.userProfile = res.data.data;
                        // Lưu tên vào localstorage để các màn hình khác có thể dùng
                        localStorage.setItem("ho_va_ten", this.userProfile.ho_va_ten);
                    }
                })
                .catch((err) => {
                    console.error("Lỗi lấy thông tin HDV:", err);
                    if(err.response && err.response.status === 401) {
                        localStorage.removeItem('key_hdv');
                        this.$router.push('/huong-dan-vien/dang-nhap');
                    }
                });
        },
        
        dangXuat() {
            axios.post(apiUrl('huong-dan-vien/dang-xuat'), {}, { headers: this.getHeaders() })
                .then(res => {
                    if (res.data.status) {
                        localStorage.removeItem('key_hdv');
                        localStorage.removeItem('ho_va_ten');
                        this.$toast.success(res.data.message);
                        this.$router.push('/huong-dan-vien/dang-nhap');
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((err) => {
                    this.$toast.error("Đã có lỗi xảy ra khi đăng xuất.");
                });
        },

        dangXuatAll() {
            if(confirm("Bạn có chắc chắn muốn đăng xuất khỏi tất cả các thiết bị?")) {
                axios.post(apiUrl('huong-dan-vien/dang-xuat-all'), {}, { headers: this.getHeaders() })
                    .then(res => {
                        if (res.data.status) {
                            localStorage.removeItem('key_hdv');
                            localStorage.removeItem('ho_va_ten');
                            this.$toast.success(res.data.message);
                            this.$router.push('/huong-dan-vien/dang-nhap');
                        }
                    })
                    .catch((err) => {
                        this.$toast.error("Đã có lỗi xảy ra.");
                    });
            }
        }
    },
    watch: {
        '$route'() {
            this.loadUserProfile();
        }
    }
}
</script>

<style scoped>
/* Màu nền Topbar và cấu hình hiển thị */
.custom-topbar {
    background-color: #f3fffd !important;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02) !important;
    height: 65px;
    position: relative;
    z-index: 10;
}

.hover-bg {
    transition: background-color 0.2s ease;
}
.hover-bg:hover {
    background-color: #f8fafc !important;
}

.dropdown-menu {
    border: 1px solid #f1f5f9 !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}

.text-danger i {
    color: #dc2626 !important;
}
</style>