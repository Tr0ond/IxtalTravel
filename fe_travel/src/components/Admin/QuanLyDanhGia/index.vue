Chào bạn, để thêm chức năng phân trang cho trang **Quản Lý Đánh Giá Tour** này, mình sẽ thực hiện các bước tương tự: thêm biến `currentPage` và `pageSize` vào `data`, tính toán `paginatedRatings` trong `computed`, và cập nhật giao diện (template) để lặp qua danh sách đã cắt theo trang, cùng với các nút điều hướng trang.

Dưới đây là toàn bộ file `index.vue` đã được tích hợp chức năng phân trang hoàn chỉnh. Bạn có thể copy và chép đè vào file hiện tại của mình:

```vue
<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">Quản Lý Đánh Giá Tour</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý đánh giá và bình luận của khách hàng về các tour du lịch.</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 200px; gap: 15px; align-items: flex-end;">
                <div style="position: relative;">
                    <label style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 6px; display: block;">🔍 Tìm kiếm Tour</label>
                    <input type="text" v-model="searchTour" placeholder="Nhập tên tour..."
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 0.9rem;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; bottom: 14px; color: #999; font-size: 0.9rem;"></i>
                </div>
                <div style="position: relative;">
                    <label style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 6px; display: block;">👤 Tên Khách</label>
                    <input type="text" v-model="searchCustomer" placeholder="Nhập tên khách hàng..."
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 0.9rem;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; bottom: 14px; color: #999; font-size: 0.9rem;"></i>
                </div>
                <div>
                    <label style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 6px; display: block;">⭐ Lọc Sao</label>
                    <select v-model.number="filterStar" style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 0.9rem;">
                        <option :value="0">Tất cả sao</option>
                        <option :value="5">⭐⭐⭐⭐⭐ 5 sao</option>
                        <option :value="4">⭐⭐⭐⭐ 4 sao</option>
                        <option :value="3">⭐⭐⭐ 3 sao</option>
                        <option :value="2">⭐⭐ 2 sao</option>
                        <option :value="1">⭐ 1 sao</option>
                    </select>
                </div>
                <div style="padding-top: 0;">
                    <button @click="resetFilters" style="width: 100%; padding: 12px 15px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                        🔄 Đặt Lại
                    </button>
                </div>
            </div>
        </div>

        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 60px;">
                                <i class="fa-solid fa-hashtag me-1" style="color: #667eea;"></i>ID
                            </th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; width: 150px;">
                                <i class="fa-solid fa-map me-2" style="color: #667eea;"></i>Tour
                            </th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; width: 150px;">
                                <i class="fa-solid fa-user me-2" style="color: #667eea;"></i>Khách Hàng
                            </th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 120px;">
                                <i class="fa-solid fa-star me-1" style="color: #fbbf24;"></i>Đánh Giá
                            </th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; width: 200px;">
                                <i class="fa-solid fa-comment me-2" style="color: #667eea;"></i>Nội Dung
                            </th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 140px;">
                                <i class="fa-solid fa-toggle-on me-1" style="color: #667eea;"></i>Trạng Thái
                            </th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 150px;">
                                <i class="fa-solid fa-sliders me-1" style="color: #667eea;"></i>Hành Động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredRatings.length === 0" style="border-bottom: 1px solid #e2e8f0;">
                            <td colspan="8" style="padding: 50px 20px; text-align: center; color: #999;">
                                <div style="font-size: 3rem; margin-bottom: 15px;">⭐</div>
                                <p style="margin: 0; font-size: 1rem;">Không tìm thấy đánh giá nào</p>
                                <p style="margin: 8px 0 0 0; font-size: 0.85rem; color: #bbb;">Khách hàng chưa đánh giá tour nào</p>
                            </td>
                        </tr>
                        <tr v-for="rating in paginatedRatings" :key="rating.id" class="data-row" style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;">
                            <td style="padding: 15px; text-align: center; color: #667eea; font-weight: 700; font-size: 0.95rem;">
                                #{{ rating.id }}
                            </td>
                            <td style="padding: 15px; color: #333; font-weight: 600; font-size: 0.9rem;">
                                {{ rating.ten_tour || 'N/A' }}
                            </td>
                            <td style="padding: 15px; color: #333; font-size: 0.9rem;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <img v-if="rating.avatar" :src="rating.avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" :alt="rating.ho_va_ten">
                                    <span>{{ rating.ho_va_ten || 'Khách vãng lai' }}</span>
                                </div>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: inline-block; background: #fef3c7; color: #b45309; padding: 8px 12px; border-radius: 6px; font-weight: 700; font-size: 0.95rem;">
                                    {{ renderStars(rating.sao_danh_gia) }}
                                </div>
                            </td>
                            <td style="padding: 15px; color: #666; font-size: 0.85rem; max-width: 300px; word-wrap: break-word; white-space: normal; line-height: 1.4;" :title="rating.noi_dung">
                                {{ rating.noi_dung || 'Không có nội dung' }}
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <button @click="toggleStatus(rating.id, rating.tinh_trang == 1 ? 0 : 1)" 
                                    :style="{
                                        border: 'none', 
                                        padding: '6px 14px', 
                                        borderRadius: '6px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '600', 
                                        cursor: 'pointer', 
                                        transition: 'all 0.2s',
                                        background: rating.tinh_trang == 1 ? '#dcfce7' : '#fee2e2',
                                        color: rating.tinh_trang == 1 ? '#16a34a' : '#dc2626'
                                    }"
                                    :title="rating.tinh_trang == 1 ? 'Nhấp để ẩn' : 'Nhấp để hiển thị'">
                                    <i :class="rating.tinh_trang == 1 ? 'fa-solid fa-eye me-1' : 'fa-solid fa-eye-slash me-1'"></i>
                                    {{ rating.tinh_trang == 1 ? 'Hiển Thị' : 'Ẩn' }}
                                </button>
                            </td> 
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                                    <button @click="openViewModal(rating)" class="action-btn btn-view" title="Xem chi tiết" style="background: #e0f2fe; color: #0284c7; border: none; width: 36px; height: 36px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button @click="openDeleteModal(rating)" class="action-btn btn-delete" title="Xóa đánh giá" style="background: #fee2e2; color: #ef4444; border: none; width: 36px; height: 36px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="padding: 15px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="font-size: 0.9rem; color: #475569;">
                    <i class="fa-solid fa-info-circle me-2" style="color: #667eea;"></i>
                    Tổng cộng: <strong>{{ list_ratings.length }}</strong> đánh giá | Tìm thấy: <strong>{{ filteredRatings.length }}</strong> đánh giá
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>

                    <span class="page-info">Trang {{ currentPage }} / {{ totalPages || 1 }}</span>

                    <button @click="currentPage++" :disabled="currentPage >= totalPages || totalPages === 0" class="page-btn">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showViewModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; width: 90%; max-width: 600px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 25px 20px; color: white; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fa-solid fa-star" style="font-size: 1.3rem;"></i>
                        <h2 style="margin: 0; font-size: 1.2rem;">👀 Xem Chi Tiết Đánh Giá</h2>
                    </div>
                    <button @click="showViewModal = false" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">×</button>
                </div>

                <div style="padding: 25px; color: #333;">
                    <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="font-size: 1.5rem; margin-bottom: 8px;">{{ renderStars(view_rating.sao_danh_gia) }}</div>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;"><strong>{{ view_rating.sao_danh_gia }}</strong> trên 5 sao</p>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="font-weight: 600; color: #666; font-size: 0.85rem; display: block; margin-bottom: 5px;">📍 Tour</label>
                            <p style="margin: 0; color: #333; font-weight: 600;">{{ view_rating.ten_tour }}</p>
                        </div>
                        <div>
                            <label style="font-weight: 600; color: #666; font-size: 0.85rem; display: block; margin-bottom: 5px;">👤 Khách Hàng</label>
                            <p style="margin: 0; color: #333; font-weight: 600;">{{ view_rating.ho_va_ten || 'Khách vãng lai' }}</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: 600; color: #666; font-size: 0.85rem; display: block; margin-bottom: 8px;">💬 Nội Dung Đánh Giá</label>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; color: #475569; line-height: 1.6; white-space: pre-wrap;">
                            {{ view_rating.noi_dung || 'Không có nội dung' }}
                        </div>
                    </div>

                    <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label style="font-weight: 600; color: #666; font-size: 0.85rem; display: block; margin-bottom: 5px;">📅 Ngày Đánh Giá</label>
                            <p style="margin: 0; color: #333; font-size: 0.9rem;">{{ formatDate(view_rating.created_at) }}</p>
                        </div>
                        <div>
                            <label style="font-weight: 600; color: #666; font-size: 0.85rem; display: block; margin-bottom: 5px;">👁️ Trạng Thái</label>
                            <span :style="{ background: view_rating.tinh_trang == 1 ? '#dcfce7' : '#fee2e2', color: view_rating.tinh_trang == 1 ? '#16a34a' : '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }">
                                {{ view_rating.tinh_trang == 1 ? '✅ Hiển Thị' : '🔒 Ẩn' }}
                            </span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 20px; border-top: 2px solid #e2e8f0;">
                        <button @click="showViewModal = false" style="padding: 11px 20px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; font-size: 0.9rem;">
                            <i class="fa-solid fa-times me-2"></i>Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; width: 90%; max-width: 420px; padding: 30px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="font-size: 3.5rem; margin-bottom: 15px; animation: shake 0.5s;">⚠️</div>
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.1rem; font-weight: 700;">Xác Nhận Xóa Đánh Giá</h3>
                <p style="color: #666; margin: 15px 0; font-size: 0.95rem; line-height: 1.6;">
                    Bạn có chắc chắn muốn xóa đánh giá <br><strong style="color: #ef4444; font-size: 1rem;">{{ del_rating.sao_danh_gia }} sao</strong> từ <strong>{{ del_rating.ho_va_ten }}</strong>? <br>
                    <span style="font-size: 0.85rem; color: #999; display: inline-block; margin-top: 8px;">⚠️ Hành động này không thể hoàn tác!</span>
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 25px;">
                    <button @click="showDeleteModal = false" style="padding: 12px; background: #f1f5f9; border: 2px solid #e2e8f0; border-radius: 8px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; font-size: 0.9rem;">
                        <i class="fa-solid fa-arrow-left me-2"></i>Hủy Bỏ
                    </button>
                    <button @click="confirmDelete" style="padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                        <i class="fa-solid fa-trash me-2"></i>Xóa Ngay
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api';

export default {
    name: 'QuanLyDanhGia',
    data() {
        return {
            currentPage: 1, // Khai báo biến trang hiện tại
            pageSize: 10,   // Số lượng đánh giá hiển thị trên 1 trang
            list_ratings: [],
            filteredRatings: [],
            searchTour: '',
            searchCustomer: '',
            filterStar: 0,

            showViewModal: false,
            showDeleteModal: false,

            view_rating: {},
            del_rating: {}
        }
    },
    computed: {
        // TÍNH TOÁN PHÂN TRANG
        totalPages() {
            return Math.ceil(this.filteredRatings.length / this.pageSize);
        },
        paginatedRatings() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredRatings.slice(start, start + this.pageSize);
        }
    },
    mounted() {
        this.getRatings();
    },
    watch: {
        searchTour() {
            this.filterRatings();
        },
        searchCustomer() {
            this.filterRatings();
        },
        filterStar() {
            this.filterRatings();
        }
    },
    methods: {
        getRatings() {
            axios.get(apiUrl('admin/danh-gia/get-data'), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.list_ratings = res.data.data || [];
                        this.filterRatings();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((error) => {
                    console.error('Lỗi lấy dữ liệu:', error);
                    this.$toast.error('Lỗi khi tải đánh giá');
                });
        },

        filterRatings() {
            this.filteredRatings = this.list_ratings.filter(rating => {
                const matchTour = !this.searchTour || 
                    (rating.ten_tour && rating.ten_tour.toLowerCase().includes(this.searchTour.toLowerCase()));
                const matchCustomer = !this.searchCustomer ||
                    (rating.ho_va_ten && rating.ho_va_ten.toLowerCase().includes(this.searchCustomer.toLowerCase()));
                const matchStar = this.filterStar === 0 || rating.sao_danh_gia === this.filterStar;
                return matchTour && matchCustomer && matchStar;
            });
            // Reset về trang đầu tiên mỗi khi bộ lọc thay đổi
            this.currentPage = 1;
        },

        openViewModal(rating) {
            this.view_rating = { ...rating };
            this.showViewModal = true;
        },

        openDeleteModal(rating) {
            this.del_rating = { ...rating };
            this.showDeleteModal = true;
        },

        toggleStatus(id, newStatus) {
            axios.post(apiUrl('admin/danh-gia/doi-tinh-trang'), { id: id, tinh_trang: newStatus }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.getRatings();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(() => this.$toast.error('Lỗi khi đổi trạng thái'));
        },

        confirmDelete() {
            axios.post(apiUrl('admin/danh-gia/delete'), { id: this.del_rating.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message || 'Xóa đánh giá thành công!');
                        this.showDeleteModal = false;
                        this.getRatings();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(() => this.$toast.error('Lỗi khi xóa đánh giá'));
        },

        renderStars(star) {
            const fullStar = '⭐';
            const emptyStar = '☆';
            return fullStar.repeat(star) + emptyStar.repeat(5 - star);
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },

        resetFilters() {
            this.searchTour = '';
            this.searchCustomer = '';
            this.filterStar = 0;
            this.filterRatings();
        }
    }
}
</script>

<style scoped>
.data-row {
    border-bottom: 1px solid #e2e8f0;
    transition: background 0.2s;
}

.data-row:hover {
    background: #f8fafc !important;
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

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.btn-view {
    background: #e0f2fe;
    color: #0284c7;
}

.btn-view:hover {
    background: #0284c7;
    color: white;
}

.btn-delete {
    background: #fee2e2;
    color: #ef4444;
}

.btn-delete:hover {
    background: #ef4444;
    color: white;
}

/* THÊM CSS CHO CHỨC NĂNG CHUYỂN TRANG */
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

@keyframes shake {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1) rotate(-2deg); }
    50% { transform: scale(1.1) rotate(2deg); }
    75% { transform: scale(1.1) rotate(-2deg); }
}
</style>

```