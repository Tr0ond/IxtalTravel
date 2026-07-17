<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;"><i class="fa-solid fa-car" style="color: rgb(177, 151, 252);"></i> Quản lý Phương tiện</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý và theo dõi thông tin, tình trạng các phương tiện của hệ thống.</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 250px 150px; gap: 15px; align-items: flex-end;">
                <div style="position: relative;">
                    <input v-model="searchQuery" 
                        type="text" 
                        placeholder="Tìm theo loại hoặc số hiệu..."
                        @input="filterData"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                </div>

                <select v-model="statusFilter" 
                    @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Trạng thái</option>
                    <option value="available">Sẵn sàng</option>
                    <option value="in_use">Đang dùng</option>
                    <option value="maintenance">Bảo trì</option>
                </select>

                <button @click="openAdd" class="btn-add">
                    <i class="fa-solid fa-plus me-2"></i>Thêm Mới
                </button>
            </div>
        </div>

        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">ID</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Loại Phương Tiện</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Số Hiệu</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Trạng Thái</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filtered.length === 0">
                            <td colspan="5" style="padding: 30px; text-align: center; color: #999;">
                                <i class="fa-solid fa-car-side me-2" style="font-size: 1.5rem;"></i>
                                <p style="margin: 10px 0 0 0;">Không có phương tiện nào</p>
                            </td>
                        </tr>

                        <tr v-for="item in filtered" :key="item.id" class="vehicle-row">
                            <td style="padding: 15px; color: #333; font-weight: 600;">{{ item.id }}</td>
                            <td style="padding: 15px; color: #333;">{{ item.loai_phuong_tien }}</td>
                            <td style="padding: 15px; color: #667eea; font-weight: 600;">{{ item.so_hieu }}</td>
                            <td style="padding: 15px;">
                                <span :style="{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: getStatusBg(item.tinh_trang),
                                    color: getStatusColor(item.tinh_trang)
                                }">
                                    {{ getStatusText(item.tinh_trang) }}
                                </span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button @click="edit(item)" class="action-btn btn-edit" title="Chỉnh sửa">
                                        <i class="fa-solid fa-pen-nib"></i>
                                    </button>
                                    <button @click="changeStatus(item)" class="action-btn btn-status" title="Đổi trạng thái nhanh">
                                        <i class="fa-solid fa-rotate"></i>
                                    </button>
                                    <button @click="openDelete(item)" class="action-btn btn-delete" title="Xóa">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">{{ isEdit ? 'Cập Nhật Phương Tiện' : 'Thêm Phương Tiện Mới' }}</h2>
                    <button @click="showModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>

                <div style="color: #333;">
                    <label style="display: block; font-weight: 600; color: #333; margin-bottom: 5px; font-size: 0.9rem;">Loại Phương Tiện</label>
                    <input v-model="form.loai_phuong_tien" placeholder="Nhập loại (VD: Xe 45 chỗ...)" 
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; margin-bottom: 15px;">

                    <label style="display: block; font-weight: 600; color: #333; margin-bottom: 5px; font-size: 0.9rem;">Số Hiệu</label>
                    <input v-model="form.so_hieu" placeholder="Nhập biển số / số hiệu..." 
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; margin-bottom: 15px;">

                    <label style="display: block; font-weight: 600; color: #333; margin-bottom: 5px; font-size: 0.9rem;">Tình Trạng</label>
                    <select v-model="form.tinh_trang" 
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; margin-bottom: 15px; background: white;">
                        <option value="available">Sẵn sàng</option>
                        <option value="in_use">Đang dùng</option>
                        <option value="maintenance">Bảo trì</option>
                    </select>

                    <label style="display: block; font-weight: 600; color: #333; margin-bottom: 5px; font-size: 0.9rem;">Mô Tả</label>
                    <textarea v-model="form.mo_ta" placeholder="Mô tả chi tiết (nếu có)..." 
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; margin-bottom: 25px; min-height: 80px; resize: vertical;"></textarea>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showModal = false" 
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="save" 
                            style="padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Lưu Dữ Liệu</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; color: #f56565; margin-bottom: 15px;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h2 style="margin: 0 0 10px 0; color: #333;">Xóa Phương Tiện?</h2>
                    <p v-if="selectedItem" style="color: #666; margin: 0 0 20px 0;">
                        Bạn chắc chắn muốn xóa phương tiện <strong>{{ selectedItem.so_hieu }}</strong>?<br>
                        <span style="font-size: 0.85rem; color: #999;">Hành động này không thể hoàn tác!</span>
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
import axios from "axios";
import apiUrl from "../../../utils/api";

export default {
    data() {
        return {
            list: [],
            filtered: [],
            searchQuery: '',
            statusFilter: '',
            
            showModal: false,
            showDeleteModal: false,
            isEdit: false,
            selectedItem: null,

            form: {
                id: null,
                loai_phuong_tien: '',
                so_hieu: '',
                mo_ta: '',
                tinh_trang: 'available'
            }
        }
    },

    mounted() {
        this.load();
    },

    methods: {
        load() {
            axios.get(apiUrl('admin/phuong-tien/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            }).then(res => {
                this.list = res.data.data || [];
                this.filterData();
            }).catch(err => {
                console.error("Lỗi khi tải dữ liệu:", err);
            });
        },

        filterData() {
            // Lọc dữ liệu theo tìm kiếm và trạng thái
            let result = this.list.filter(i => {
                const search = this.searchQuery.toLowerCase();
                return (
                    (!this.searchQuery || i.loai_phuong_tien.toLowerCase().includes(search) || i.so_hieu.toLowerCase().includes(search)) &&
                    (!this.statusFilter || i.tinh_trang === this.statusFilter)
                );
            });

            // Sắp xếp mảng theo ID tăng dần (1, 2, 3...)
            this.filtered = result.sort((a, b) => a.id - b.id);
        },

        openAdd() {
            this.isEdit = false;
            this.form = {
                id: null,
                loai_phuong_tien: '',
                so_hieu: '',
                mo_ta: '',
                tinh_trang: 'available'
            };
            this.showModal = true;
        },

        edit(item) {
            this.isEdit = true;
            this.form = { ...item };
            this.showModal = true;
        },

        save() {
            const url = this.isEdit ? 'admin/phuong-tien/update' : 'admin/phuong-tien/add';

            axios.post(apiUrl(url), this.form, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            }).then(res => {
                alert(res.data.message || 'Lưu thành công!');
                this.showModal = false;
                this.load();
            }).catch(err => {
                alert('Có lỗi xảy ra trong quá trình lưu dữ liệu!');
                console.error(err);
            });
        },

        openDelete(item) {
            this.selectedItem = item;
            this.showDeleteModal = true;
        },

        confirmDelete() {
            if (!this.selectedItem) return;

            axios.post(apiUrl('admin/phuong-tien/destroy'), { id: this.selectedItem.id }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            }).then(() => {
                this.showDeleteModal = false;
                this.load();
            }).catch(err => {
                console.error("Lỗi khi xóa:", err);
            });
        },

        changeStatus(item) {
            axios.post(apiUrl('admin/phuong-tien/change-status'), { id: item.id }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            }).then(() => {
                this.load();
            });
        },

        getStatusText(status) {
            const map = {
                'available': 'Sẵn sàng',
                'in_use': 'Đang dùng',
                'maintenance': 'Bảo trì',
            };
            return map[status] || status;
        },

        getStatusBg(status) {
            const bgMap = {
                'available': '#dcfce7',
                'in_use': '#fef3c7',
                'maintenance': '#fee2e2',
            };
            return bgMap[status] || '#f3f4f6';
        },

        getStatusColor(status) {
            const colorMap = {
                'available': '#16a34a',
                'in_use': '#d97706',
                'maintenance': '#dc2626',
            };
            return colorMap[status] || '#666';
        }
    }
}
</script>

<style scoped>
.vehicle-row {
    border-bottom: 1px solid #e2e8f0;
    transition: background 0.2s;
}
.vehicle-row:hover {
    background: #f9fafb !important;
}

.btn-add {
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
.btn-add:hover {
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

.btn-edit {
    background: #f0f4f8;
    color: #764ba2;
}
.btn-edit:hover {
    background: #764ba2;
    color: white;
}

.btn-status {
    background: #e3f2fd;
    color: #0284c7;
}
.btn-status:hover {
    background: #0284c7;
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
</style>