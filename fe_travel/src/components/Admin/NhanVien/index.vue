<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">👔 Quản Lý Tài Khoản Nhân Viên</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý thông tin và quyền hạn của nhân viên.</p>
        </div>

        <!-- Search & Filter Bar -->
        <div
            style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 1fr 150px 150px; gap: 15px; align-items: flex-end;">
                <!-- Search -->
                <div style="position: relative;">
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên hoặc email..."
                        @input="filterData"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    <i class="fa-solid fa-search"
                        style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                </div>

                <!-- Position Filter -->
                <select v-model="positionFilter" @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Chức Vụ</option>
                    <option v-for="pos in positions" :key="pos.id" :value="pos.id">{{ pos.ten_chuc_vu }}</option>
                </select>

                <!-- Status Filter -->
                <select v-model="statusFilter" @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Trạng Thái</option>
                    <option value="1">Hoạt Động</option>
                    <option value="0">Tạm Tắt</option>
                </select>

                <!-- Add Button -->
                <button @click="openAddModal" class="btn-primary-gradient">
                    <i class="fa-solid fa-user-plus me-2"></i>Thêm Mới
                </button>
            </div>
        </div>

        <!-- Table -->
        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th
                                style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">
                                Tên Nhân Viên</th>
                            <th
                                style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">
                                Email</th>
                            <th
                                style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">
                                Số Điện Thoại</th>
                            <th
                                style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">
                                Chức Vụ</th>
                            <th
                                style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">
                                Trạng Thái</th>
                            <th
                                style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">
                                Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredEmployees.length === 0">
                            <td colspan="6" style="padding: 30px; text-align: center; color: #999;">
                                <i class="fa-solid fa-inbox me-2" style="font-size: 1.5rem;"></i>
                                <p style="margin: 10px 0 0 0;">Không có nhân viên nào</p>
                            </td>
                        </tr>
                        <tr v-for="employee in paginatedEmployees" :key="employee.id"
                            style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;"
                            @mouseenter="(e) => e.currentTarget.style.background = '#f9fafb'"
                            @mouseleave="(e) => e.currentTarget.style.background = ''">
                            <td style="padding: 15px; color: #333; font-weight: 600;">{{ employee.ho_va_ten }}</td>
                            <td style="padding: 15px; color: #666;">{{ employee.email }}</td>
                            <td style="padding: 15px; color: #666;">{{ employee.so_dien_thoai }}</td>
                            <td style="padding: 15px; color: #667eea; font-weight: 600;">{{
                                getPositionName(employee.id_chuc_vu) }}</td>
                            <td style="padding: 15px; text-align: center;">
                                <span :style="{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: employee.tinh_trang == 1 ? '#e0f2fe' : '#fef3c7',
                                    color: employee.tinh_trang == 1 ? '#0369a1' : '#d97706'
                                }">
                                    {{ employee.tinh_trang == 1 ? 'Hoạt Động' : 'Tạm Tắt' }}
                                </span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button @click="viewEmployee(employee)" class="action-btn btn-view"
                                        title="Xem chi tiết">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button @click="editEmployee(employee)" class="action-btn btn-edit"
                                        title="Chỉnh sửa">
                                        <i class="fa-solid fa-pen-nib"></i>
                                    </button>
                                    <button @click="deleteEmployee(employee)" class="action-btn btn-delete" title="Xóa">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
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
        </div>

        <!-- View Modal -->
        <div v-if="showViewModal"
            style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Chi Tiết Nhân Viên</h2>
                    <button @click="showViewModal = false"
                        style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="selectedEmployee" style="color: #333;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Tên Nhân Viên</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedEmployee.ho_va_ten }}
                            </p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Email</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedEmployee.email }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Số Điện Thoại</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedEmployee.so_dien_thoai
                            }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Ngày Sinh</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{
                                formatDate(selectedEmployee.ngay_sinh) }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Chức Vụ</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem; color: #667eea;">{{
                                getPositionName(selectedEmployee.id_chuc_vu) }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Trạng Thái</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem; color: #667eea;">{{
                                selectedEmployee.tinh_trang == 1 ? 'Hoạt Động' : 'Tạm Tắt' }}</p>
                        </div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Địa Chỉ</p>
                        <p style="margin: 0; color: #555; line-height: 1.5;">{{ selectedEmployee.dia_chi || 'Chưa cập nhật' }}</p>
                    </div>
                    <button @click="showViewModal = false"
                        style="width: 100%; padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Đóng</button>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal"
            style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Cập Nhật Thông Tin</h2>
                    <button @click="showEditModal = false"
                        style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="editingEmployee" style="color: #333;">
                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Tên Nhân Viên
                        </label>
                        <input v-model="editingEmployee.ho_va_ten" type="text"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Email
                        </label>
                        <input v-model="editingEmployee.email" type="email"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Số Điện Thoại
                        </label>
                        <input v-model="editingEmployee.so_dien_thoai" type="text"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Ngày Sinh
                        </label>
                        <input v-model="editingEmployee.ngay_sinh" type="date"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Địa Chỉ
                        </label>
                        <input v-model="editingEmployee.dia_chi" type="text"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Chức Vụ
                        </label>
                        <select v-model="editingEmployee.id_chuc_vu"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="">Chọn chức vụ</option>
                            <option v-for="pos in positions" :key="pos.id" :value="pos.id">{{ pos.ten_chuc_vu }}
                            </option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Trạng Thái
                        </label>
                        <select v-model="editingEmployee.tinh_trang"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="0">Tạm Tắt</option>
                            <option value="1">Hoạt Động</option>
                        </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showEditModal = false"
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="saveEmployee"
                            style="padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Lưu</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Modal -->
        <div v-if="showAddModal"
            style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Thêm Nhân Viên Mới</h2>
                    <button @click="showAddModal = false"
                        style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div style="color: #333;">
                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Tên Nhân Viên
                        </label>
                        <input v-model="newEmployee.ho_va_ten" type="text"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Email
                        </label>
                        <input v-model="newEmployee.email" type="email"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Mật Khẩu
                        </label>
                        <input v-model="newEmployee.password" type="password"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Số Điện Thoại
                        </label>
                        <input v-model="newEmployee.so_dien_thoai" type="text"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Ngày Sinh
                        </label>
                        <input v-model="newEmployee.ngay_sinh" type="date"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Địa Chỉ
                        </label>
                        <input v-model="newEmployee.dia_chi" type="text"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label
                            style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Chức Vụ
                        </label>
                        <select v-model="newEmployee.id_chuc_vu"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="">Chọn chức vụ</option>
                            <option v-for="pos in positions" :key="pos.id" :value="pos.id">{{ pos.ten_chuc_vu }}
                            </option>
                        </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showAddModal = false"
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="addEmployee"
                            style="padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Thêm</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <div v-if="showDeleteModal"
            style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; padding: 30px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; color: #f56565; margin-bottom: 15px;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h2 style="margin: 0 0 10px 0; color: #333;">Xóa Nhân Viên?</h2>
                    <p v-if="selectedEmployee" style="color: #666; margin: 0 0 20px 0;">
                        Bạn chắc chắn muốn xóa nhân viên <strong>{{ selectedEmployee.ho_va_ten }}</strong>?<br><span
                            style="font-size: 0.85rem; color: #999;">Hành động này không thể hoàn tác!</span>
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showDeleteModal = false"
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="confirmDelete"
                            style="padding: 12px; background: #f56565; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Xóa</button>
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
            currentPage: 1, // Trang hiện tại
            pageSize: 10,
            employees: [],
            positions: [],
            filteredEmployees: [],
            searchQuery: '',
            positionFilter: '',
            statusFilter: '',
            showViewModal: false,
            showEditModal: false,
            showAddModal: false,
            showDeleteModal: false,
            selectedEmployee: null,
            editingEmployee: null,
            newEmployee: {},
            isLoading: false,
        }
    },
    mounted() {
        this.loadPositions();
        this.loadEmployees();
    },
    computed: {
        // 1. Tính tổng số trang
        totalPages() {
            return Math.ceil(this.filteredEmployees.length / this.pageSize);
        },
        // 2. Chỉ hiển thị dữ liệu của trang hiện tại
        paginatedEmployees() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredEmployees.slice(start, start + this.pageSize);
        }
    },
    methods: {
        loadPositions() {
            axios.get(apiUrl('admin/chuc-vu/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
                .then(res => {
                    if (res.data.status) {
                        this.positions = res.data.data;
                    }
                })
                .catch(err => {
                    console.error('Error loading positions:', err);
                });
        },
        loadEmployees() {
            this.isLoading = true;
            axios.get(apiUrl('admin/nhan-vien/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
                .then(res => {
                    if (res.data.status) {
                        this.employees = res.data.data;
                        this.filterData();
                        this.$toast.success('Tải dữ liệu thành công!');
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(err => {
                    console.error('Error:', err);
                    this.$toast.error('Lỗi khi tải dữ liệu nhân viên');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        filterData() {
            this.filteredEmployees = this.employees.filter(employee => {
                const matchSearch = !this.searchQuery ||
                    (employee.ho_va_ten && employee.ho_va_ten.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
                    (employee.email && employee.email.toLowerCase().includes(this.searchQuery.toLowerCase()));

                const matchPosition = !this.positionFilter || (employee.id_chuc_vu && parseInt(employee.id_chuc_vu) === parseInt(this.positionFilter));
                const matchStatus = !this.statusFilter || employee.tinh_trang.toString() === this.statusFilter;

                return matchSearch && matchPosition && matchStatus;
            });
            this.currentPage = 1;
        },
        getPositionName(id) {
            const pos = this.positions.find(p => p.id == id);
            return pos ? pos.ten_chuc_vu : 'Chưa xác định';
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        viewEmployee(employee) {
            this.selectedEmployee = employee;
            this.showViewModal = true;
        },
        editEmployee(employee) {
            this.selectedEmployee = employee;
            this.editingEmployee = JSON.parse(JSON.stringify(employee));
            this.showEditModal = true;
        },
        openAddModal() {
            this.newEmployee = {};
            this.showAddModal = true;
        },
        deleteEmployee(employee) {
            this.selectedEmployee = employee;
            this.showDeleteModal = true;
        },
        confirmDelete() {
            if (!this.selectedEmployee) return;

            axios.post(
                apiUrl('admin/nhan-vien/destroy'),
                {
                    id: this.selectedEmployee.id
                },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('key_admin')
                    }
                }
            )
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showDeleteModal = false;
                        this.loadEmployees();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(err => {
                    console.error('Error:', err);

                    const message =
                        err.response?.data?.message ||
                        'Lỗi khi xóa nhân viên';

                    this.$toast.error(message);
                });
        },
        saveEmployee() {
            if (!this.editingEmployee) return;

            axios.post(apiUrl('admin/nhan-vien/update'), this.editingEmployee, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showEditModal = false;
                        this.loadEmployees();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(err => {
                    console.error('Error:', err);
                    this.$toast.error('Lỗi khi cập nhật nhân viên');
                });
        },
        addEmployee() {
            if (!this.newEmployee.ho_va_ten || !this.newEmployee.email) {
                this.$toast.error('Vui lòng điền đầy đủ thông tin');
                return;
            }

            axios.post(apiUrl('admin/nhan-vien/add-data'), this.newEmployee, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
                .then(res => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showAddModal = false;
                        this.loadEmployees();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(err => {
                    console.error('Error:', err);
                    this.$toast.error('Lỗi khi thêm nhân viên');
                });
        }
    }
}
</script>

<style scoped>
.btn-primary-gradient {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary-gradient:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.action-btn {
    width: 35px;
    height: 35px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border: none;
}

.btn-view {
    background: #e3f2fd;
    color: #667eea;
}

.btn-view:hover {
    background: #667eea;
    color: white;
}

.btn-edit {
    background: #f0f4f8;
    color: #764ba2;
}

.btn-edit:hover {
    background: #764ba2;
    color: white;
}

.btn-delete {
    background: #fee;
    color: #f56565;
}

.btn-delete:hover {
    background: #f56565;
    color: white;
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
