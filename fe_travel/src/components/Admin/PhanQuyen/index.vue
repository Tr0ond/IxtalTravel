<template>
    <div class="admin-container">
        <!-- Header -->
        <div class="admin-header shadow-sm">
            <div>
                <h1 class="admin-title"><i class="fa-solid fa-shield-halved text-primary me-2"></i> Quản Lý Phân Quyền</h1>
                <p class="admin-subtitle">Thiết lập chức vụ, quản lý quyền hạn và bảo mật hệ thống.</p>
            </div>
            <div class="header-actions">
                <button @click="openAddModal" class="btn-primary-gradient shadow-sm">
                    <i class="fa-solid fa-plus me-2"></i> Thêm Chức Vụ Mới
                </button>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
            <!-- Left: Danh sách Chức vụ -->
            <div class="left-section">
                <div class="card-container">
                    <div class="card-header bg-gradient-primary">
                        <h3><i class="fa-solid fa-users-gear me-2"></i> Danh Sách Chức Vụ</h3>
                    </div>

                    <!-- Search Bar -->
                    <div class="search-bar">
                        <div class="search-wrapper shadow-sm">
                            <i class="fa-solid fa-search"></i>
                            <input v-model="tim_kiem.noi_dung" type="text" placeholder="Tìm kiếm chức vụ..." @keyup="timKiem()">
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="table-wrapper">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th class="text-center">#</th>
                                    <th>Tên Chức Vụ</th>
                                    <th class="text-center">Trạng Thái</th>
                                    <th class="text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="list_chuc_vu.length === 0" class="empty-row">
                                    <td colspan="4">
                                        <i class="fa-solid fa-folder-open"></i>
                                        <p>Không tìm thấy chức vụ nào</p>
                                    </td>
                                </tr>
                                <tr v-for="(value, index) in list_chuc_vu" :key="index" :class="{'active-row': chon_chuc_vu.id === value.id}">
                                    <td class="col-number text-center">{{ index + 1 }}</td>
                                    <td class="col-name fw-bold text-dark">{{ value.ten_chuc_vu }}</td>
                                    <td class="col-status text-center">
                                        <span :class="['status-badge', value.tinh_trang == 1 ? 'status-active' : 'status-inactive']" @click="doiTrangThai(value)" style="cursor: pointer;" title="Nhấn để đổi trạng thái">
                                            <i :class="value.tinh_trang == 1 ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-pause'" class="me-1"></i>
                                            {{ value.tinh_trang == 1 ? 'Hoạt Động' : 'Tạm Dừng' }}
                                        </span>
                                    </td>
                                    <td class="col-actions">
                                        <div class="action-group">
                                            <button @click="phanQuyen(value)" class="action-btn btn-info shadow-sm" title="Phân Quyền">
                                                <i class="fa-solid fa-key"></i>
                                            </button>
                                            <button @click="openEditModal(value)" class="action-btn btn-edit shadow-sm" title="Chỉnh Sửa">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button @click="openDeleteModal(value)" class="action-btn btn-delete shadow-sm" title="Xóa">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Middle: Danh sách Chức năng -->
            <div class="middle-section">
                <div class="card-container">
                    <div class="card-header bg-gradient-info">
                        <h3><i class="fa-solid fa-list-check me-2"></i> Chức Năng Hệ Thống</h3>
                    </div>
                    <div class="functions-list">
                        <div v-if="list_chuc_nang.length === 0" class="empty-message">
                            <i class="fa-solid fa-inbox"></i>
                            <p>Không có chức năng nào</p>
                        </div>
                        <div v-for="(value, index) in list_chuc_nang" :key="index" class="function-item shadow-sm">
                            <div class="func-info">
                                <span class="func-index">{{ index + 1 }}</span>
                                <span class="func-name">{{ value.ten_chuc_nang }}</span>
                            </div>
                            <button @click="capQuyen(value.id)" class="btn-grant shadow-sm" :disabled="!chon_chuc_vu.id">
                                <i class="fa-solid fa-arrow-right-to-bracket me-1"></i> Cấp
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Quyền hiện tại -->
            <div class="right-section">
                <div class="card-container border-primary border-2">
                    <div class="card-header bg-gradient-success">
                        <h3>
                            <i class="fa-solid fa-user-shield me-2"></i> Quyền Của: 
                            <span class="position-name text-warning ms-1">{{ chon_chuc_vu.ten_chuc_vu || 'Chưa chọn...' }}</span>
                        </h3>
                    </div>
                    <div class="permissions-list">
                        <div v-if="!chon_chuc_vu.id" class="empty-message text-muted">
                            <i class="fa-solid fa-hand-pointer mb-3 fs-1 opacity-50"></i>
                            <h5>Vui lòng chọn chức vụ!</h5>
                            <p>Bấm vào nút hình chìa khóa ở cột bên trái để xem và phân quyền.</p>
                        </div>
                        <div v-else-if="list_phan_quyen.length === 0" class="empty-message text-warning">
                            <i class="fa-solid fa-triangle-exclamation mb-3 fs-1 opacity-50"></i>
                            <p>Chức vụ này hiện chưa được cấp bất kỳ quyền nào.</p>
                        </div>
                        
                        <div v-for="(value, index) in list_phan_quyen" :key="index" class="permission-item shadow-sm border-success">
                            <div class="func-info">
                                <span class="func-index bg-success text-white">{{ index + 1 }}</span>
                                <span class="perm-name text-success fw-bold">{{ value.ten_chuc_nang }}</span>
                            </div>
                            <button @click="xoaQuyen(value)" class="btn-remove shadow-sm" title="Thu hồi quyền">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ================= MODALS TỰ THIẾT KẾ ================= -->

        <!-- Modal: Thêm Chức Vụ -->
        <div v-if="showAddModal" class="custom-modal-overlay" @click.self="showAddModal = false">
            <div class="custom-modal-dialog shadow-lg">
                <div class="custom-modal-header bg-gradient-primary">
                    <h2><i class="fa-solid fa-circle-plus me-2"></i> Thêm Chức Vụ Mới</h2>
                    <button @click="showAddModal = false" class="custom-modal-close">&times;</button>
                </div>
                <div class="custom-modal-body">
                    <div class="form-group mb-4">
                        <label class="fw-bold text-dark mb-2">Tên Chức Vụ <span class="text-danger">*</span></label>
                        <input v-model="create_chuc_vu.ten_chuc_vu" type="text" class="form-input shadow-sm" placeholder="VD: Quản trị viên, Kế toán...">
                    </div>
                    <div class="form-group mb-4">
                        <label class="fw-bold text-dark mb-2">Slug Chức Vụ</label>
                        <input v-model="create_chuc_vu.slug_chuc_vu" type="text" class="form-input shadow-sm" placeholder="VD: quan-tri-vien, ke-toan...">
                    </div>
                    <div class="form-group mb-4">
                        <label class="fw-bold text-dark mb-2">Trạng Thái Hoạt Động</label>
                        <select v-model="create_chuc_vu.tinh_trang" class="form-select shadow-sm py-2">
                            <option value="1">🟢 Đang hoạt động</option>
                            <option value="0">🟠 Tạm dừng</option>
                        </select>
                    </div>
                </div>
                <div class="custom-modal-footer bg-light">
                    <button @click="showAddModal = false" class="btn-secondary">Hủy Bỏ</button>
                    <button @click="taoChucVu" class="btn-primary-gradient px-4"><i class="fa-solid fa-floppy-disk me-2"></i> Lưu Chức Vụ</button>
                </div>
            </div>
        </div>

        <!-- Modal: Cập Nhật Chức Vụ -->
        <div v-if="showEditModal" class="custom-modal-overlay" @click.self="showEditModal = false">
            <div class="custom-modal-dialog shadow-lg">
                <div class="custom-modal-header bg-gradient-warning">
                    <h2 class="text-dark"><i class="fa-solid fa-pen-to-square me-2"></i> Cập Nhật Chức Vụ</h2>
                    <button @click="showEditModal = false" class="custom-modal-close text-dark">&times;</button>
                </div>
                <div class="custom-modal-body">
                    <div class="form-group mb-4">
                        <label class="fw-bold text-dark mb-2">Tên Chức Vụ <span class="text-danger">*</span></label>
                        <input v-model="update_chuc_vu.ten_chuc_vu" type="text" class="form-input shadow-sm">
                    </div>
                    <div class="form-group mb-4">
                        <label class="fw-bold text-dark mb-2">Slug Chức Vụ</label>
                        <input v-model="update_chuc_vu.slug_chuc_vu" type="text" class="form-input shadow-sm">
                    </div>
                    <div class="form-group mb-4">
                        <label class="fw-bold text-dark mb-2">Trạng Thái</label>
                        <select v-model="update_chuc_vu.tinh_trang" class="form-select shadow-sm py-2">
                            <option value="1">🟢 Hoạt Động</option>
                            <option value="0">🟠 Tạm Dừng</option>
                        </select>
                    </div>
                </div>
                <div class="custom-modal-footer bg-light">
                    <button @click="showEditModal = false" class="btn-secondary">Hủy</button>
                    <button @click="capNhatChucVu" class="btn-warning text-dark fw-bold px-4"><i class="fa-solid fa-check-double me-2"></i> Lưu Thay Đổi</button>
                </div>
            </div>
        </div>

        <!-- Modal: Xóa Chức Vụ -->
        <div v-if="showDeleteModal" class="custom-modal-overlay" @click.self="showDeleteModal = false">
            <div class="custom-modal-dialog modal-sm shadow-lg text-center">
                <div class="custom-modal-header bg-danger text-white justify-content-center border-0 py-4" style="border-radius: 12px 12px 0 0;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem;"></i>
                </div>
                <div class="custom-modal-body pt-4">
                    <h3 class="fw-bold text-dark mb-3">Bạn chắc chắn chứ?</h3>
                    <p class="modal-text fs-6 text-muted mb-0">
                        Chức vụ <strong class="text-danger fs-5">{{ delete_chuc_vu.ten_chuc_vu }}</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống!
                    </p>
                </div>
                <div class="custom-modal-footer justify-content-center border-0 pb-4">
                    <button @click="showDeleteModal = false" class="btn-secondary px-4">Hủy</button>
                    <button @click="xoaChucVu" class="btn-danger px-4 shadow-sm"><i class="fa-solid fa-trash-can me-2"></i> Xóa Ngay</button>
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
            list_chuc_nang: [],
            list_chuc_vu: [],
            create_chuc_vu: { ten_chuc_vu: '', slug_chuc_vu: '', tinh_trang: 1 },
            update_chuc_vu: {},
            delete_chuc_vu: {},
            list_phan_quyen: [],
            tim_kiem: { noi_dung: '' },
            chon_chuc_vu: {},
            showAddModal: false,
            showEditModal: false,
            showDeleteModal: false,
        }
    },
    mounted() {
        this.layDataChucVu();
        this.layDataChucNang();
    },
    methods: {
        // ================= ĐIỀU KHIỂN MODAL =================
        openAddModal() {
            this.create_chuc_vu = { ten_chuc_vu: '', slug_chuc_vu: '', tinh_trang: 1 };
            this.showAddModal = true;
        },
        openEditModal(value) {
            this.update_chuc_vu = { ...value };
            this.showEditModal = true;
        },
        openDeleteModal(value) {
            this.delete_chuc_vu = { ...value };
            this.showDeleteModal = true;
        },

        // ================= CÁC HÀM XỬ LÝ DỮ LIỆU CHÍNH =================
        authHeader() {
            return {
                headers: { Authorization: 'Bearer ' + localStorage.getItem("key_admin") }
            };
        },
        handleError(err) {
            if (err.response?.data?.errors) {
                const list = Object.values(err.response.data.errors);
                list.forEach((v) => this.$toast.error(v[0]));
            } else if (err.response?.data?.message) {
                this.$toast.error(err.response.data.message);
            } else {
                this.$toast.error("Có lỗi hệ thống xảy ra!");
            }
        },

        timKiem() {
            axios.post(apiUrl('admin/chuc-vu/search'), this.tim_kiem, this.authHeader())
                .then(res => { this.list_chuc_vu = res.data.data; })
                .catch(this.handleError);
        },

        layDataChucVu() {
            axios.get(apiUrl('admin/chuc-vu/get-data'), this.authHeader())
                .then(res => {
                    if (res.data.status) {
                        this.list_chuc_vu = res.data.data;
                    }
                }).catch(this.handleError);
        },

        layDataChucNang() {
            axios.get(apiUrl('admin/chuc-nang/get-data'), this.authHeader())
                .then(res => {
                    if (res.data.status) {
                        this.list_chuc_nang = res.data.data;
                    }
                }).catch(this.handleError);
        },

        taoChucVu() {
            if(!this.create_chuc_vu.ten_chuc_vu) {
                this.$toast.warning("Vui lòng nhập tên chức vụ!");
                return;
            }
            axios.post(apiUrl('admin/chuc-vu/add-data'), this.create_chuc_vu, this.authHeader())
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showAddModal = false;
                        this.layDataChucVu();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                }).catch(this.handleError);
        },

        capNhatChucVu() {
            axios.post(apiUrl('admin/chuc-vu/update'), this.update_chuc_vu, this.authHeader())
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showEditModal = false;
                        this.layDataChucVu();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                }).catch(this.handleError);
        },

        xoaChucVu() {
            axios.post(apiUrl('admin/chuc-vu/destroy'), { id: this.delete_chuc_vu.id }, this.authHeader())
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showDeleteModal = false;
                        this.layDataChucVu();
                        // Nếu đang chọn chức vụ này thì reset màn hình phân quyền
                        if(this.chon_chuc_vu.id === this.delete_chuc_vu.id) {
                            this.chon_chuc_vu = {};
                            this.list_phan_quyen = [];
                        }
                    } else {
                        this.$toast.error(res.data.message);
                    }
                }).catch(this.handleError);
        },

        doiTrangThai(value) {
            axios.post(apiUrl('admin/chuc-vu/change-status'), { id: value.id, tinh_trang: value.tinh_trang == 1 ? 0 : 1 }, this.authHeader())
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success("Thay đổi trạng thái thành công!");
                        this.layDataChucVu();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                }).catch(this.handleError);
        },

        phanQuyen(value) {
            this.chon_chuc_vu = value;
            axios.post(apiUrl('admin/phan-quyen/chi-tiet-phan-quyen/data'), value, this.authHeader())
                .then(res => { this.list_phan_quyen = res.data.data; })
                .catch(this.handleError);
        },

        capQuyen(id_chuc_nang) {
            if(!this.chon_chuc_vu.id) {
                this.$toast.warning("Vui lòng chọn chức vụ ở bảng bên trái trước!");
                return;
            }
            axios.post(apiUrl('admin/phan-quyen/chi-tiet-phan-quyen/add-data'), {
                id_chuc_vu: this.chon_chuc_vu.id,
                id_chuc_nang
            }, this.authHeader())
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.phanQuyen(this.chon_chuc_vu); // Refresh lại danh sách quyền
                    } else {
                        this.$toast.error(res.data.message);
                    }
                }).catch(this.handleError);
        },

        xoaQuyen(value) {
            axios.post(apiUrl('admin/phan-quyen/chi-tiet-phan-quyen/delete'), value, this.authHeader())
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.phanQuyen(this.chon_chuc_vu); // Refresh lại danh sách quyền
                    } else {
                        this.$toast.error(res.data.message);
                    }
                }).catch(this.handleError);
        }
    }
}
</script>

<style scoped>
/* ============ Admin Container ============ */
.admin-container {
    padding: 1.5rem;
    background: #f0f2f5;
    min-height: 100vh;
    font-family: 'Inter', 'Roboto', sans-serif;
}

/* ============ Header ============ */
.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 15px;
    margin-bottom: 2rem;
}

.admin-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #2b3445;
    margin: 0 0 0.5rem 0;
}

.admin-subtitle {
    font-size: 0.95rem;
    color: #6c757d;
    margin: 0;
}

/* ============ Content Grid ============ */
.content-grid {
    display: grid;
    /* Chia 3 cột: cột trái to nhất, 2 cột còn lại bằng nhau */
    grid-template-columns: 2fr 1.3fr 1.3fr;
    gap: 1.5rem;
    /* ÉP BUỘC CẢ 3 CỘT LUÔN CÓ CHIỀU CAO BẰNG NHAU (DỰA THEO CỘT CAO NHẤT) */
    align-items: stretch; 
}

/* ============ Card Container ============ */
.card-container {
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    overflow: hidden;
    border: 1px solid #eef0f3;
    display: flex;
    flex-direction: column;
    /* ĐẢM BẢO CARD CHIẾM 100% CHIỀU CAO CỦA CỘT TRONG GRID */
    height: 100%; 
}

.card-header {
    padding: 1rem 1.5rem;
    color: white;
}

.card-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
}

.bg-gradient-primary { background: linear-gradient(135deg, #4e54c8, #8f94fb); }
.bg-gradient-info { background: linear-gradient(135deg, #00b4db, #0083b0); }
.bg-gradient-success { background: linear-gradient(135deg, #11998e, #38ef7d); }
.bg-gradient-warning { background: linear-gradient(135deg, #f2c94c, #f2994a); }

/* ============ Search Bar ============ */
.search-bar {
    padding: 1.2rem;
    background: white;
    border-bottom: 1px solid #f1f3f5;
}

.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 30px;
}

.search-wrapper input {
    width: 100%;
    padding: 0.7rem 1rem 0.7rem 2.8rem;
    border: 1px solid #e2e8f0;
    border-radius: 30px;
    font-size: 0.95rem;
    background: #f8f9fa;
    transition: all 0.3s;
}

.search-wrapper input:focus {
    outline: none;
    border-color: #4e54c8;
    background: white;
    box-shadow: 0 0 0 4px rgba(78, 84, 200, 0.1);
}

.search-wrapper i {
    position: absolute;
    left: 1rem;
    color: #a0aec0;
    font-size: 1rem;
}

/* ============ Tables ============ */
.table-wrapper {
    overflow-x: auto;
    /* Cho phép bảng chiếm hết khoảng trống còn lại */
    flex: 1; 
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-table thead {
    background: #f8f9fa;
}

.admin-table th {
    padding: 1rem;
    font-weight: 700;
    color: #495057;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e9ecef;
}

.admin-table td {
    padding: 1.2rem 1rem;
    vertical-align: middle;
    border-bottom: 1px solid #f1f3f5;
}

.admin-table tr {
    transition: background 0.2s;
}

.admin-table tr:hover {
    background: #f8faff;
}

.active-row {
    background: #f0f4ff !important;
    border-left: 4px solid #4e54c8;
}

/* ============ Status Badge ============ */
.status-badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
}

.status-active { background: #d4edda; color: #155724; }
.status-inactive { background: #fff3cd; color: #856404; }

/* ============ Buttons ============ */
.btn-primary-gradient {
    background: linear-gradient(135deg, #4e54c8, #8f94fb);
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 700;
    transition: all 0.3s ease;
}

.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(78, 84, 200, 0.3);
}

.btn-warning { border: none; border-radius: 8px; transition: all 0.3s; }
.btn-warning:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(242, 201, 76, 0.3); }

.btn-secondary {
    background: #e9ecef;
    color: #495057;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 700;
    transition: all 0.3s ease;
}

.btn-secondary:hover { background: #dde2e5; }

.btn-danger {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 700;
    transition: all 0.3s ease;
}
.btn-danger:hover { background: #c82333; transform: translateY(-2px); }

/* Table Action Buttons */
.action-group {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.action-btn {
    width: 35px;
    height: 35px;
    border: none;
    border-radius: 8px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-info { background: #00b4db; }
.btn-info:hover { background: #0083b0; transform: translateY(-2px); }
.btn-edit { background: #f2c94c; color: #333;}
.btn-edit:hover { background: #f2994a; transform: translateY(-2px); color: white;}
.btn-delete { background: #ff4d4d; }
.btn-delete:hover { background: #ff3333; transform: translateY(-2px); }

/* ============ Danh Sách Chức Năng & Phân Quyền ============ */
.functions-list, .permissions-list {
    padding: 1.5rem;
    /* XÓA BỎ CUỘN, ÉP DANH SÁCH GIÃN FULL HẾT MỨC TỰ NHIÊN ĐỂ VÔ TẬN */
    flex: 1; 
}

.function-item, .permission-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1rem;
    background: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 0.8rem;
    border-left: 4px solid #00b4db;
    transition: all 0.2s ease;
}

.permission-item {
    border-left: 4px solid #11998e;
}

.function-item:hover, .permission-item:hover {
    background: white;
    transform: translateX(5px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.func-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.func-index {
    background: #e2e8f0;
    color: #4a5568;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.8rem;
    font-weight: bold;
}

.func-name, .perm-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2d3748;
}

.btn-grant {
    background: white;
    color: #00b4db;
    border: 1px solid #00b4db;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 700;
    transition: all 0.2s;
}
.btn-grant:hover:not(:disabled) { background: #00b4db; color: white; }
.btn-grant:disabled { opacity: 0.5; cursor: not-allowed; border-color: #ccc; color: #ccc;}

.btn-remove {
    background: #ffe5e5;
    color: #ff4d4d;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}
.btn-remove:hover { background: #ff4d4d; color: white; }

.empty-message { text-align: center; padding: 2rem; }

/* ============ MODAL ============ */
.custom-modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.custom-modal-dialog {
    background: white;
    border-radius: 15px;
    width: 100%;
    max-width: 500px;
    animation: slideUp 0.3s ease;
    border: none;
    /* GIÚP INPUT NHẬN SỰ KIỆN GÕ PHÍM BÌNH THƯỜNG */
    pointer-events: auto; 
}
.custom-modal-dialog.modal-sm { max-width: 400px; }

@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.custom-modal-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 15px 15px 0 0;
    color: white;
}

.custom-modal-header h2 { margin: 0; font-size: 1.3rem; font-weight: 800; }

.custom-modal-close {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.8rem;
    line-height: 1;
    transition: transform 0.2s;
}
.custom-modal-close:hover { transform: scale(1.2); }

.custom-modal-body { padding: 1.5rem; }

.form-input, .form-select {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #f8f9fa;
    transition: all 0.3s;
}

.form-input:focus, .form-select:focus {
    outline: none;
    border-color: #4e54c8;
    background: white;
    box-shadow: 0 0 0 4px rgba(78, 84, 200, 0.1);
}

.custom-modal-footer {
    padding: 1.2rem 1.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    border-top: 1px solid #eef0f3;
    border-radius: 0 0 15px 15px;
}

/* ============ Responsive ============ */
@media (max-width: 1200px) {
    .content-grid { grid-template-columns: 1fr; }
    .admin-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
}
</style>