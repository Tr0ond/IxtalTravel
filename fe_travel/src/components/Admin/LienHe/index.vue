<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">📩 Quản Lý Liên Hệ & Hỗ Trợ</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý các yêu cầu, thắc mắc từ phía khách hàng.</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 200px 150px; gap: 15px; align-items: flex-end;">
                <div style="position: relative;">
                    <input v-model="searchQuery" 
                        type="text" 
                        placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
                        @input="filterData"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                </div>

                <select v-model="statusFilter" 
                    @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Trạng Thái</option>
                    <option value="0">Chưa Xử Lý (Mới)</option>
                    <option value="1">Đã Phản Hồi</option>
                </select>

                <button @click="loadData" class="btn-primary-gradient">
                    <i class="fa-solid fa-arrows-rotate me-2"></i>Làm Mới
                </button>
            </div>
        </div>

        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Tên Khách Hàng</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Liên Hệ</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Nội Dung (Trích)</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Ngày Gửi</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Trạng Thái</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredContacts.length === 0">
                            <td colspan="6" style="padding: 30px; text-align: center; color: #999;">
                                <i class="fa-solid fa-inbox me-2" style="font-size: 1.5rem;"></i>
                                <p style="margin: 10px 0 0 0;">Không có thư liên hệ nào</p>
                            </td>
                        </tr>
                        <tr v-for="contact in filteredContacts" :key="contact.id" style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;"
                            @mouseenter="(e) => e.currentTarget.style.background = '#f9fafb'"
                            @mouseleave="(e) => e.currentTarget.style.background = ''">
                            
                            <td style="padding: 15px; color: #333;">
                                <div style="font-weight: 600;">{{ contact.ho_ten }}</div>
                                <div v-if="contact.id_khach_hang" style="font-size: 0.75rem; color: #2db88a; margin-top: 4px;">
                                    <i class="fa-solid fa-user-check"></i> Đã đăng nhập
                                </div>
                            </td>
                            <td style="padding: 15px; color: #666; font-size: 0.9rem;">
                                <div><i class="fa-solid fa-envelope me-1 text-muted"></i> {{ contact.email }}</div>
                                <div v-if="contact.so_dien_thoai" style="margin-top: 4px;"><i class="fa-solid fa-phone me-1 text-muted"></i> {{ contact.so_dien_thoai }}</div>
                            </td>
                            <td style="padding: 15px; color: #666; max-width: 250px;">
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    {{ contact.noi_dung }}
                                </div>
                            </td>
                            <td style="padding: 15px; text-align: center; color: #666; font-size: 0.9rem;">
                                {{ formatDate(contact.created_at) }}
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <span :style="{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: contact.trang_thai == 1 ? '#e0f2fe' : '#fee2e2',
                                    color: contact.trang_thai == 1 ? '#0369a1' : '#dc2626'
                                }">
                                    {{ contact.trang_thai == 1 ? 'Đã Xử Lý' : 'Chưa Xử Lý' }}
                                </span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button @click="viewContact(contact)" class="action-btn btn-view" title="Đọc nội dung">
                                        <i class="fa-solid fa-envelope-open-text"></i>
                                    </button>
                                    <button @click="changeStatus(contact)" class="action-btn btn-edit" :title="contact.trang_thai == 1 ? 'Đánh dấu chưa xử lý' : 'Đánh dấu đã xử lý'">
                                        <i class="fa-solid fa-check-double"></i>
                                    </button>
                                    <button @click="deleteContact(contact)" class="action-btn btn-delete" title="Xóa">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showViewModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Nội Dung Liên Hệ</h2>
                    <button @click="showViewModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="selectedContact" style="color: #333;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Họ và Tên</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedContact.ho_ten }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Ngày gửi</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ formatDateTime(selectedContact.created_at) }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Email</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem; word-break: break-all;">{{ selectedContact.email }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Số Điện Thoại</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedContact.so_dien_thoai || 'Không cung cấp' }}</p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 8px 0;">Nội Dung Lời Nhắn:</p>
                        <div style="background: #eef2f6; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; line-height: 1.6; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;">
                            {{ selectedContact.noi_dung }}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button @click="changeStatus(selectedContact)" 
                            :style="{background: selectedContact.trang_thai == 0 ? '#10b981' : '#f59e0b'}"
                            style="padding: 12px 20px; border: none; border-radius: 8px; font-weight: 600; color: white; cursor: pointer;">
                            {{ selectedContact.trang_thai == 0 ? 'Đánh dấu đã xử lý' : 'Chuyển về chưa xử lý' }}
                        </button>
                        <button @click="showViewModal = false" style="padding: 12px 20px; background: #e2e8f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Đóng</button>
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
                    <h2 style="margin: 0 0 10px 0; color: #333;">Xóa Liên Hệ?</h2>
                    <p v-if="selectedContact" style="color: #666; margin: 0 0 20px 0;">
                        Bạn chắc chắn muốn xóa tin nhắn từ <strong>{{ selectedContact.ho_ten }}</strong>?<br><span style="font-size: 0.85rem; color: #999;">Hành động này không thể hoàn tác!</span>
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
            contacts: [],
            filteredContacts: [],
            searchQuery: '',
            statusFilter: '',
            showViewModal: false,
            showDeleteModal: false,
            selectedContact: null,
            isLoading: false,
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.isLoading = true;
            axios.get(apiUrl('admin/lien-he/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.contacts = res.data.data;
                    this.filterData();
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi tải dữ liệu liên hệ');
            })
            .finally(() => {
                this.isLoading = false;
            });
        },
        filterData() {
            this.filteredContacts = this.contacts.filter(c => {
                const searchStr = this.searchQuery.toLowerCase();
                const matchSearch = !this.searchQuery || 
                    (c.ho_ten && c.ho_ten.toLowerCase().includes(searchStr)) ||
                    (c.email && c.email.toLowerCase().includes(searchStr)) ||
                    (c.so_dien_thoai && c.so_dien_thoai.includes(searchStr));
                
                const matchStatus = this.statusFilter === '' || c.trang_thai.toString() === this.statusFilter;
                
                return matchSearch && matchStatus;
            });
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        },
        formatDateTime(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            const day = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            return `${time} - ${day}`;
        },
        viewContact(contact) {
            this.selectedContact = contact;
            this.showViewModal = true;
        },
        changeStatus(contact) {
            axios.post(apiUrl('admin/lien-he/change-status'), { id: contact.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
            .then(res => {
                if(res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showViewModal = false;
                    this.loadData();
                } else {
                    this.$toast.error(res.data.message);
                }
            }).catch(err => {
                console.error(err);
                this.$toast.error('Có lỗi xảy ra!');
            });
        },
        deleteContact(contact) {
            this.selectedContact = contact;
            this.showDeleteModal = true;
        },
        confirmDelete() {
            if (!this.selectedContact) return;
            
            axios.post(apiUrl('admin/lien-he/destroy'), { id: this.selectedContact.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showDeleteModal = false;
                    this.loadData();
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi xóa dữ liệu');
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
    color: #0284c7;
}
.btn-view:hover {
    background: #0284c7;
    color: white;
}

.btn-edit {
    background: #f0f4f8;
    color: #10b981;
}
.btn-edit:hover {
    background: #10b981;
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