<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">👥 Quản Lý Tài Khoản Khách Hàng
            </h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý thông tin, số CCCD và trạng thái hoạt động của khách
                hàng.</p>
        </div>

        <!-- Search & Filter Bar -->
        <div
            style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div
                style="display: grid; grid-template-columns: 1fr 1fr 150px 150px 150px; gap: 15px; align-items: flex-end;">
                <div style="position: relative;">
                    <input v-model="searchQuery" type="text" placeholder="Tìm tên, email hoặc CCCD..."
                        @input="filterData"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px;">
                </div>

                <select v-model="statusFilter" @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
                    <option value="">Tất cả Kích hoạt</option>
                    <option value="1">Đã Kích Hoạt</option>
                    <option value="0">Chưa Kích Hoạt</option>
                </select>

                <select v-model="blockFilter" @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
                    <option value="">Tất cả Trạng thái</option>
                    <option value="0">Đang Hoạt Động</option>
                    <option value="1">Bị Khóa</option>
                </select>

                <button @click="loadCustomers"
                    style="padding: 12px; background: #edf2f7; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fa-solid fa-rotate me-1"></i> Làm mới
                </button>

                <button @click="openAddModal" class="btn-primary-gradient">
                    <i class="fa-solid fa-user-plus me-2"></i>Thêm Mới
                </button>
            </div>
        </div>

        <!-- Table -->
        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                        <th style="padding: 15px; text-align: left;">Khách Hàng</th>
                        <th style="padding: 15px; text-align: left;">Email & SĐT</th>
                        <th style="padding: 15px; text-align: center;">CCCD</th>
                        <th style="padding: 15px; text-align: center;">Kích Hoạt</th>
                        <th style="padding: 15px; text-align: center;">Trạng Thái</th>
                        <th style="padding: 15px; text-align: center;">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="customer in paginatedCustomers" :key="customer.id"
                        style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 15px;">
                            <div style="font-weight: 600;">{{ customer.ho_va_ten }}</div>
                            <div style="font-size: 0.8rem; color: #999;">{{ formatDate(customer.ngay_sinh) }}</div>
                        </td>
                        <td style="padding: 15px;">
                            <div>{{ customer.email }}</div>
                            <div style="font-size: 0.85rem; color: #666;">{{ customer.so_dien_thoai }}</div>
                        </td>
                        <td style="padding: 15px; text-align: center; font-weight: 500;">{{ customer.cccd || '---' }}
                        </td>
                        <td style="padding: 15px; text-align: center;">
                            <span :class="customer.is_active == 1 ? 'badge-success' : 'badge-danger'">
                                {{ customer.is_active == 1 ? 'Đã Kích Hoạt' : 'Chưa Kích Hoạt' }}
                            </span>
                        </td>
                        <td style="padding: 15px; text-align: center;">
                            <button @click="changeStatus(customer)"
                                :class="customer.is_block == 0 ? 'badge-info' : 'badge-danger'"
                                style="border: none; cursor: pointer; font-family: inherit;">
                                {{ customer.is_block == 0 ? 'Đang Hoạt Động' : 'Bị Khóa' }}
                            </button>
                        </td>
                        <td style="padding: 15px; text-align: center;">
                            <div style="display: flex; gap: 8px; justify-content: center;">
                                <button @click="viewCustomer(customer)" class="action-btn btn-view"><i
                                        class="fa-solid fa-eye"></i></button>
                                <button @click="editCustomer(customer)" class="action-btn btn-edit"><i
                                        class="fa-solid fa-pen"></i></button>
                                <button @click="deleteCustomer(customer)" class="action-btn btn-delete"><i
                                        class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style="padding: 20px 0; display: flex; justify-content: center; align-items: center; gap: 5px;">
                <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>

                <span class="page-info">Trang {{ currentPage }} / {{ totalPages || 1 }}</span>

                <button @click="currentPage++" :disabled="currentPage >= totalPages" class="page-btn">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- Modal Xem Chi Tiết (Đã Fix) -->
        <div v-if="showViewModal" class="modal-overlay">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>🔍 Chi Tiết Khách Hàng</h2>
                    <button @click="showViewModal = false" class="close-btn">×</button>
                </div>
                <div class="modal-body" v-if="selectedCustomer">
                    <div style="display: flex; flex-direction: column; gap: 15px; padding: 10px;">
                        <div
                            style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
                            <span style="color: #718096;">Họ và tên:</span>
                            <span style="font-weight: 600;">{{ selectedCustomer.ho_va_ten }}</span>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
                            <span style="color: #718096;">Email:</span>
                            <span style="font-weight: 600;">{{ selectedCustomer.email }}</span>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
                            <span style="color: #718096;">Số điện thoại:</span>
                            <span style="font-weight: 600;">{{ selectedCustomer.so_dien_thoai || 'Chưa cập nhật'
                            }}</span>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
                            <span style="color: #718096;">Số CCCD:</span>
                            <span style="font-weight: 600;">{{ selectedCustomer.cccd || 'Chưa cập nhật' }}</span>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
                            <span style="color: #718096;">Ngày sinh:</span>
                            <span style="font-weight: 600;">{{ formatDate(selectedCustomer.ngay_sinh) }}</span>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
                            <span style="color: #718096;">Trạng thái tài khoản:</span>
                            <span :class="selectedCustomer.is_block == 0 ? 'text-success' : 'text-danger'"
                                style="font-weight: 700;">
                                {{ selectedCustomer.is_block == 0 ? 'Đang Hoạt Động' : 'Đang Bị Khóa' }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="showViewModal = false" class="btn-cancel" style="width: 100%;">Đóng</button>
                </div>
            </div>
        </div>

        <!-- Modal Thêm Mới -->
        <div v-if="showAddModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Thêm Khách Hàng</h2>
                    <button @click="showAddModal = false" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Họ tên <span style="color: red;">*</span></label>
                            <input v-model="newCustomer.ho_va_ten" type="text">
                        </div>
                        <div class="form-group">
                            <label>Email <span style="color: red;">*</span></label>
                            <input v-model="newCustomer.email" type="email">
                        </div>
                        <div class="form-group">
                            <label>Mật khẩu <span style="color: red;">*</span></label>
                            <input v-model="newCustomer.password" type="password">
                        </div>
                        <div class="form-group">
                            <label>Số điện thoại</label>
                            <input v-model="newCustomer.so_dien_thoai" type="text">
                        </div>
                        <div class="form-group">
                            <label>CCCD <span style="color: red;">*</span></label>
                            <input v-model="newCustomer.cccd" type="text">
                        </div>
                        <div class="form-group">
                            <label>Ngày sinh</label>
                            <input v-model="newCustomer.ngay_sinh" type="date">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="showAddModal = false" class="btn-cancel">Hủy</button>
                    <button @click="addCustomer" class="btn-save">Thêm Mới</button>
                </div>
            </div>
        </div>

        <!-- Modal Chỉnh Sửa -->
        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Chỉnh Sửa Thông Tin</h2>
                    <button @click="showEditModal = false" class="close-btn">×</button>
                </div>
                <div class="modal-body" v-if="editingCustomer">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Họ và Tên</label>
                            <input v-model="editingCustomer.ho_va_ten" type="text">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input v-model="editingCustomer.email" type="email">
                        </div>
                        <div class="form-group">
                            <label>Số Điện Thoại</label>
                            <input v-model="editingCustomer.so_dien_thoai" type="text">
                        </div>
                        <div class="form-group">
                            <label>Số CCCD</label>
                            <input v-model="editingCustomer.cccd" type="text">
                        </div>
                        <div class="form-group">
                            <label>Ngày Sinh</label>
                            <input v-model="editingCustomer.ngay_sinh" type="date">
                        </div>
                        <div class="form-group">
                            <label>Kích Hoạt</label>
                            <select v-model="editingCustomer.is_active"
                                style="padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
                                <option value="1">Đã Kích Hoạt</option>
                                <option value="0">Chưa Kích Hoạt</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="showEditModal = false" class="btn-cancel">Hủy</button>
                    <button @click="saveUpdate" class="btn-save">Lưu Thay Đổi</button>
                </div>
            </div>
        </div>

        <!-- Modal Xóa -->
        <div v-if="showDeleteModal" class="modal-overlay">
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <i class="fa-solid fa-triangle-exclamation"
                    style="font-size: 3rem; color: #ef4444; margin-bottom: 15px;"></i>
                <h2>Xác nhận xóa?</h2>
                <p>Khách hàng <b>{{ selectedCustomer?.ho_va_ten }}</b> sẽ bị xóa vĩnh viễn.</p>
                <div class="modal-footer" style="justify-content: center; margin-top: 20px;">
                    <button @click="showDeleteModal = false" class="btn-cancel">Hủy</button>
                    <button @click="confirmDelete" class="btn-save" style="background: #ef4444;">Xóa Ngay</button>
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
            currentPage: 1, // Trang hiện tại
            pageSize: 10,
            customers: [],
            filteredCustomers: [],
            searchQuery: '',
            statusFilter: '',
            blockFilter: '',
            showAddModal: false,
            showEditModal: false,
            showViewModal: false,
            showDeleteModal: false,
            selectedCustomer: null,
            editingCustomer: {},
            newCustomer: { ho_va_ten: '', email: '', password: '', so_dien_thoai: '', cccd: '', ngay_sinh: '' },
        }
    },
    mounted() {
        this.loadCustomers();
    },
    computed: {
        // 1. Tính tổng số trang
        totalPages() {
            return Math.ceil(this.filteredCustomers.length / this.pageSize);
        },
        // 2. Chỉ hiển thị dữ liệu của trang hiện tại
        paginatedCustomers() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredCustomers.slice(start, start + this.pageSize);
        }
    },
    methods: {
        loadCustomers() {
            axios.get(apiUrl('admin/khach-hang/get-data'), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then(res => {
                    if (res.data.status) {
                        this.customers = res.data.data;
                        this.filterData();
                    }
                })
                .catch(() => this.$toast.error('Lỗi tải dữ liệu'));
        },

        filterData() {
            this.filteredCustomers = this.customers.filter(c => {
                const search = this.searchQuery.toLowerCase();
                const matchSearch = !this.searchQuery ||
                    (c.ho_va_ten?.toLowerCase().includes(search)) ||
                    (c.email?.toLowerCase().includes(search)) ||
                    (c.cccd?.includes(search));
                const matchStatus = !this.statusFilter || c.is_active.toString() === this.statusFilter;
                const matchBlock = !this.blockFilter || c.is_block.toString() === this.blockFilter;
                return matchSearch && matchStatus && matchBlock;

            });
            this.currentPage = 1;
        },

        openAddModal() {
            this.newCustomer = { ho_va_ten: '', email: '', password: '', so_dien_thoai: '', cccd: '', ngay_sinh: '' };
            this.showAddModal = true;
        },

        addCustomer() {
            if (!this.newCustomer.ho_va_ten || !this.newCustomer.email || !this.newCustomer.password || !this.newCustomer.cccd) {
                this.$toast.error('Vui lòng điền đủ trường bắt buộc (*)');
                return;
            }
            axios.post(apiUrl('admin/khach-hang/add-data'), this.newCustomer, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showAddModal = false;
                        this.loadCustomers();
                    }
                });
        },

        // HÀM XEM CHI TIẾT (Đã sửa)
        viewCustomer(customer) {
            this.selectedCustomer = customer; // Gán dữ liệu dòng chọn vào biến selectedCustomer
            this.showViewModal = true; // Hiện modal
        },

        editCustomer(customer) {
            this.editingCustomer = { ...customer };
            this.showEditModal = true;
        },

        saveUpdate() {
            axios.post(apiUrl('admin/khach-hang/update'), this.editingCustomer, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showEditModal = false;
                        this.loadCustomers();
                    }
                });
        },

        changeStatus(customer) {
            const nextStatus = customer.is_block == 0 ? 1 : 0;
            axios.post(apiUrl('admin/khach-hang/change-status'), { id: customer.id, is_block: nextStatus }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.loadCustomers();
                    }
                });
        },

        deleteCustomer(customer) {
            this.selectedCustomer = customer;
            this.showDeleteModal = true;
        },

        confirmDelete() {
            axios.post(apiUrl('admin/khach-hang/destroy'), { id: this.selectedCustomer.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showDeleteModal = false;
                        this.loadCustomers();
                    }
                });
        },

        formatDate(date) {
            if (!date) return '---';
            return new Date(date).toLocaleDateString('vi-VN');
        }
    }
}
</script>

<style scoped>
.text-success {
    color: #16a34a;
}

.text-danger {
    color: #dc2626;
}

/* Giữ nguyên các style cũ của bạn */
.btn-primary-gradient {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 650px;
    padding: 25px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #333;
}

.form-group input {
    padding: 10px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    outline: none;
}

.modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 25px;
}

.btn-save {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

.btn-cancel {
    background: #f0f0f0;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
}

.badge-success {
    background: #dcfce7;
    color: #16a34a;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
}

.badge-danger {
    background: #fee2e2;
    color: #dc2626;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
}

.badge-info {
    background: #e0f2fe;
    color: #0369a1;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
}

.action-btn {
    width: 35px;
    height: 35px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
}

.btn-view {
    background: #f0f9ff;
    color: #0ea5e9;
}

.btn-edit {
    background: #f5f3ff;
    color: #8b5cf6;
}

.btn-delete {
    background: #fff1f2;
    color: #f43f5e;
}

.page-btn {
    padding: 8px 16px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    color: #4a5568;
    display: flex;
    align-items: center;
}

.page-btn:hover:not(:disabled) {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.page-btn:disabled {
    background: #f7fafc;
    color: #cbd5e0;
    cursor: not-allowed;
}

.page-info {
    font-weight: 600;
    color: #4a5568;
    padding: 0 15px;
    font-size: 0.9rem;
}
</style>