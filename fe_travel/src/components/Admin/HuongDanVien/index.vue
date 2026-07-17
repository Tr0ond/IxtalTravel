<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">👨‍💼 Quản Lý Tài Khoản Hướng Dẫn Viên</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý thông tin và trạng thái của các hướng dẫn viên.</p>
        </div>

        <!-- Search & Filter Bar -->
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 1fr auto auto; gap: 15px; align-items: flex-end;">
                <!-- Search -->
                <div style="position: relative;">
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên hoặc email..." @input="filterData"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                </div>

                <!-- Status Filter -->
                <select v-model="statusFilter" @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Trạng Thái</option>
                    <option value="1">Đã Kích Hoạt</option>
                    <option value="0">Chưa Kích Hoạt</option>
                </select>

                <!-- Refresh Button -->
                <button @click="loadGuides" :disabled="isLoading"
                    style="padding: 12px 20px; background: #f0f0f0; border: 2px solid #e2e8f0; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer; transition: all 0.3s;">
                    <i :class="isLoading ? 'fa-solid fa-spinner fa-spin me-2' : 'fa-solid fa-refresh me-2'"></i>
                    {{ isLoading ? 'Đang tải...' : 'Làm mới' }}
                </button>

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
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333;">Tên Hướng Dẫn Viên</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333;">Email</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333;">Số Điện Thoại</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333;">Ngôn Ngữ</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333;">Trạng Thái</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333;">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredGuides.length === 0">
                            <td colspan="6" style="padding: 30px; text-align: center; color: #999;">
                                <i class="fa-solid fa-inbox me-2" style="font-size: 1.5rem;"></i>
                                <p style="margin: 10px 0 0 0;">Không có dữ liệu</p>
                            </td>
                        </tr>
                        <tr v-for="guide in filteredGuides" :key="guide.id" style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 15px; color: #333; font-weight: 600;">{{ guide.ho_va_ten }}</td>
                            <td style="padding: 15px; color: #666;">{{ guide.email }}</td>
                            <td style="padding: 15px; color: #666;">{{ guide.so_dien_thoai }}</td>
                            <td style="padding: 15px; color: #666;">{{ guide.ngon_ngu }}</td>
                            <td style="padding: 15px; text-align: center;">
                                <span :style="{
                                    display: 'inline-block', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600',
                                    background: guide.is_active == 1 ? '#dcfce7' : '#fee2e2',
                                    color: guide.is_active == 1 ? '#16a34a' : '#dc2626'
                                }">
                                    {{ guide.is_active == 1 ? 'Đã Kích Hoạt' : 'Chưa Kích Hoạt' }}
                                </span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button @click="viewGuide(guide)" class="action-btn btn-view" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>
                                    <button @click="editGuide(guide)" class="action-btn btn-edit" title="Chỉnh sửa"><i class="fa-solid fa-pen-nib"></i></button>
                                    <button @click="deleteGuide(guide)" class="action-btn btn-delete" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- View Modal -->
        <div v-if="showViewModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">Chi Tiết Hướng Dẫn Viên</h2>
                    <button @click="showViewModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="selectedGuide" style="color: #333;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div><p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Tên</p><p style="margin: 0; font-weight: 600;">{{ selectedGuide.ho_va_ten }}</p></div>
                        <div><p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Email</p><p style="margin: 0; font-weight: 600;">{{ selectedGuide.email }}</p></div>
                        <div><p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Số Điện Thoại</p><p style="margin: 0; font-weight: 600;">{{ selectedGuide.so_dien_thoai }}</p></div>
                        <div><p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Ngôn Ngữ</p><p style="margin: 0; font-weight: 600;">{{ selectedGuide.ngon_ngu }}</p></div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Trạng Thái</p>
                            <p style="margin: 0; font-weight: 600;" :style="{ color: selectedGuide.is_active == 1 ? '#16a34a' : '#dc2626' }">
                                {{ selectedGuide.is_active == 1 ? 'Đã Kích Hoạt' : 'Chưa Kích Hoạt' }}
                            </p>
                        </div>
                    </div>
                    <button @click="showViewModal = false" style="width: 100%; padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Đóng</button>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">Cập Nhật Thông Tin</h2>
                    <button @click="showEditModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="editingGuide" style="color: #333;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Tên Hướng Dẫn Viên</label>
                        <input v-model="editingGuide.ho_va_ten" type="text" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Email</label>
                        <input v-model="editingGuide.email" type="email" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Số Điện Thoại</label>
                        <input v-model="editingGuide.so_dien_thoai" type="text" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Ngôn Ngữ</label>
                        <input v-model="editingGuide.ngon_ngu" type="text" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Trạng Thái</label>
                        <select v-model.number="editingGuide.is_active" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; background: white;">
                            <option :value="0">Chưa Kích Hoạt</option>
                            <option :value="1">Đã Kích Hoạt</option>
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showEditModal = false" style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Hủy</button>
                        <button @click="saveGuide" style="padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Lưu</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Modal -->
        <div v-if="showAddModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">Thêm Hướng Dẫn Viên Mới</h2>
                    <button @click="showAddModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div style="color: #333;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Tên Hướng Dẫn Viên</label>
                        <input v-model="newGuide.ho_va_ten" type="text" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Email</label>
                        <input v-model="newGuide.email" type="email" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Mật Khẩu</label>
                        <input v-model="newGuide.password" type="password" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Số Điện Thoại</label>
                        <input v-model="newGuide.so_dien_thoai" type="text" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Ngôn Ngữ</label>
                        <input v-model="newGuide.ngon_ngu" type="text" placeholder="Ví dụ: Tiếng Việt, Tiếng Anh" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px;">Trạng Thái</label>
                        <select v-model.number="newGuide.is_active" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; background: white;">
                            <option :value="0">Chưa Kích Hoạt</option>
                            <option :value="1">Đã Kích Hoạt</option>
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showAddModal = false" style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Hủy</button>
                        <button @click="addGuide" style="padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Thêm</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <div v-if="showDeleteModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 400px; width: 90%; text-align: center;">
                <div style="font-size: 3rem; color: #f56565; margin-bottom: 15px;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <h2 style="margin: 0 0 10px 0; color: #333;">Xóa Hướng Dẫn Viên?</h2>
                <p v-if="selectedGuide" style="color: #666; margin: 0 0 20px 0;">
                    Bạn chắc chắn muốn xóa <strong>{{ selectedGuide.ho_va_ten }}</strong>?<br>
                    <span style="font-size: 0.85rem; color: #999;">Hành động này không thể hoàn tác!</span>
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <button @click="showDeleteModal = false" style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Hủy</button>
                    <button @click="confirmDelete" style="padding: 12px; background: #f56565; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Xóa</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api'; // Đường dẫn api của bạn

export default {
    data() {
        return {
            guides: [],
            filteredGuides: [],
            searchQuery: '',
            statusFilter: '',
            showViewModal: false,
            showEditModal: false,
            showAddModal: false,
            showDeleteModal: false,
            selectedGuide: null,
            editingGuide: null,
            newGuide: { is_active: 1 }, // Mặc định là đã kích hoạt
            isLoading: false,
        }
    },
    mounted() {
        this.loadGuides();
    },
    methods: {
        loadGuides() {
            this.isLoading = true;
            axios.get(apiUrl('admin/huong-dan-vien/get-data'), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
            .then(res => {
                if (res.data && res.data.status) {
                    this.guides = res.data.data || [];
                    this.filterData();
                } else {
                    this.$toast.error(res.data?.message || 'Lỗi tải dữ liệu');
                }
            })
            .catch(err => {
                console.error(err);
                this.$toast.error('Lỗi khi tải dữ liệu hướng dẫn viên');
            })
            .finally(() => {
                this.isLoading = false;
            });
        },
        filterData() {
            this.filteredGuides = this.guides.filter(guide => {
                const matchSearch = !this.searchQuery || 
                    (guide.ho_va_ten && guide.ho_va_ten.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
                    (guide.email && guide.email.toLowerCase().includes(this.searchQuery.toLowerCase()));

                const matchStatus = this.statusFilter === '' || (guide.is_active !== null && guide.is_active.toString() === this.statusFilter);

                return matchSearch && matchStatus;
            });
        },
        viewGuide(guide) {
            this.selectedGuide = guide;
            this.showViewModal = true;
        },
        editGuide(guide) {
            this.selectedGuide = guide;
            this.editingGuide = JSON.parse(JSON.stringify(guide));
            this.showEditModal = true;
        },
        openAddModal() {
            this.newGuide = { is_active: 1 };
            this.showAddModal = true;
        },
        deleteGuide(guide) {
            this.selectedGuide = guide;
            this.showDeleteModal = true;
        },
        confirmDelete() {
            if (!this.selectedGuide) return;
            axios.post(apiUrl('admin/huong-dan-vien/destroy'), { id: this.selectedGuide.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
            .then(res => {
                if (res.data && res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showDeleteModal = false;
                    this.loadGuides();
                } else {
                    this.$toast.error(res.data?.message || 'Lỗi xóa');
                }
            })
            .catch(err => this.$toast.error('Lỗi khi xóa hướng dẫn viên'));
        },
        saveGuide() {
            if (!this.editingGuide) return;
            axios.post(apiUrl('admin/huong-dan-vien/update'), this.editingGuide, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
            .then(res => {
                if (res.data && res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showEditModal = false;
                    this.loadGuides();
                } else {
                    this.$toast.error(res.data?.message || 'Lỗi cập nhật');
                }
            })
            .catch(err => this.$toast.error('Lỗi khi cập nhật hướng dẫn viên'));
        },
        addGuide() {
            if (!this.newGuide.ho_va_ten || !this.newGuide.email) {
                this.$toast.error('Vui lòng điền đầy đủ tên và email');
                return;
            }
            axios.post(apiUrl('admin/huong-dan-vien/store'), this.newGuide, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
            .then(res => {
                if (res.data && res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showAddModal = false;
                    this.loadGuides();
                } else {
                    this.$toast.error(res.data?.message || 'Lỗi thêm');
                }
            })
            .catch(err => this.$toast.error('Lỗi khi thêm hướng dẫn viên'));
        }
    }
}
</script>

<style scoped>
/* Giữ nguyên phần CSS style của bạn */
.btn-primary-gradient { padding: 12px 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
.btn-primary-gradient:hover { box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
.action-btn { width: 36px; height: 36px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn-view { background: #e0f2fe; color: #0369a1; }
.btn-view:hover { background: #0369a1; color: white; }
.btn-edit { background: #fef3c7; color: #d97706; }
.btn-edit:hover { background: #d97706; color: white; }
.btn-delete { background: #fee2e2; color: #dc2626; }
.btn-delete:hover { background: #dc2626; color: white; }
</style>