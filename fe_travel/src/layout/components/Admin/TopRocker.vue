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
                                <p class="mb-0 text-muted" style="font-size: 0.85rem;">Xin chào, <span class="fw-bold" style="color: #0f172a;">{{ adminName }}</span></p>
                            </div>
                            
                            <img src="https://www.shutterstock.com/image-vector/admin-icon-strategy-collection-thin-600nw-2307398667.jpg" 
                                 class="user-img shadow-sm" alt="user avatar" 
                                 style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;" />
                        </a>
                        
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0" style="border-radius: 12px; min-width: 200px; padding: 8px 0; margin-top: 10px;">
                            <router-link to="/admin/profile" style="text-decoration: none;">
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
import axios from "axios";
import apiUrl from "../../../utils/api";

export default {
    data() {
        return {
            adminName: "Admin Master",
        }
    },
    computed: {
        // HÀM THEO DÕI ĐƯỜNG DẪN (ROUTE) VÀ HIỂN THỊ TÊN TƯƠNG ỨNG
        pageTitle() {
            const path = this.$route.path;
            
            // Từ điển ánh xạ đường dẫn URL -> Tiêu đề hiển thị trên Topbar
            const routeMap = {
                '/admin/dashboard': 'Admin Dashboard',
                '/admin/nhan-vien': 'Quản lý Nhân Viên',
                '/admin/khach-hang': 'Quản lý Khách Hàng',
                '/admin/huong-dan-vien': 'Quản lý Hướng Dẫn Viên',
                '/admin/quan-ly-tour': 'Quản lý Tour',
                '/admin/lich-trinh': 'Quản lý Lịch Trình',
                '/admin/ve': 'Quản lý Vé',
                '/admin/hoa-don': 'Quản lý Hoá Đơn',
                '/admin/quet-hoa-don': 'Quét Mã Vé',
                '/admin/quan-ly-phuong-tien': 'Quản lý Phương Tiện',
                '/admin/quan-ly-hdv-va-phan-cong': 'Quản lý Hướng Dẫn Viên & Phân Công',
                '/admin/phan-quyen': 'Phân Quyền',
                '/admin/bai-viet': 'Quản lý Bài Viết',
                '/admin/danh-gia': 'Quản lý Đánh Giá',
                '/admin/thong-ke/doanh-thu': 'Thống Kê Doanh Thu',
                '/admin/thong-ke/khach-hang-moi': 'Thống Kê Khách Hàng Mới',
                '/admin/thong-ke/ve-ban-ra': 'Thống Kê Vé Bán Ra',
                '/admin/thong-ke/chi-tieu-khach-hang': 'Thống Kê Chi Tiêu Khách Hàng',
                '/admin/thong-ke/tour': 'Thống Kê Tour',
                '/admin/lien-he': 'Quản lý Liên Hệ',
                '/admin/slide': 'Quản lý Slide',
                '/admin/profile': 'Thông tin cá nhân'
            };
            
            return routeMap[path] || 'Admin Dashboard';
        }
    },
    mounted() {
        // Lấy tên Admin từ localStorage
        const name = localStorage.getItem("ho_va_ten");
        if (name) {
            this.adminName = name;
        }
    },
    methods: {
        dangXuat() {
            axios.post(apiUrl("admin/dang-xuat"), {}, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("key_admin"),
                    },
                })
                .then((res) => {
                    if (res.data.status) {
                        localStorage.removeItem("key_admin");
                        localStorage.removeItem("ho_va_ten");
                        this.$router.push("/admin/dang-nhap");
                        this.$toast.success(res.data.message);
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((res) => {
                    if (res.response && res.response.data && res.response.data.errors) {
                        const list = Object.values(res.response.data.errors);
                        list.forEach((v) => {
                            this.$toast.error(v[0]);
                        });
                    }
                });
        },
        dangXuatAll() {
            axios.post(apiUrl("admin/dang-xuat-all"), {}, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("key_admin"),
                    },
                })
                .then((res) => {
                    if (res.data.status) {
                        localStorage.removeItem("key_admin");
                        localStorage.removeItem("ho_va_ten");
                        this.$router.push("/admin/dang-nhap");
                        this.$toast.success(res.data.message);
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((res) => {
                    if (res.response && res.response.data && res.response.data.errors) {
                        const list = Object.values(res.response.data.errors);
                        list.forEach((v) => {
                            this.$toast.error(v[0]);
                        });
                    }
                });
        },
    },
};
</script>

<style scoped>
/* Màu nền Topbar và cấu hình hiển thị */
.custom-topbar {
    background-color: #f3fffd !important;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02) !important;
    height: 65px;
    position: relative;
    z-index: 10; /* Đặt số nhỏ để bị Sidebar (Menu) đè lên */
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
</style>