<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">Quản Lý Bài Viết</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Viết, quản lý và xuất bản bài viết du lịch cho khách hàng.</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 12px; align-items: flex-end; margin-bottom: 0;">
                <div style="flex: 1; position: relative;">
                    <label style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 6px; display: block;">🔍 Tìm kiếm Bài Viết</label>
                    <input type="text" v-model="searchKeyword" placeholder="Nhập tiêu đề bài viết để tìm kiếm..."
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 0.9rem;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; bottom: 14px; color: #999; font-size: 0.9rem;"></i>
                </div>
                <button @click="openAddModal" class="btn-add" style="height: 45px;">
                    <i class="fa-solid fa-plus me-2"></i>Viết Bài Mới
                </button>
            </div>
        </div>

        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 70px;">
                                <i class="fa-solid fa-hashtag me-1" style="color: #667eea;"></i>ID
                            </th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; flex: 1;">
                                <i class="fa-solid fa-newspaper me-2" style="color: #667eea;"></i>Tiêu Đề
                            </th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; width: 200px;">
                                <i class="fa-solid fa-tag me-2" style="color: #667eea;"></i>Tag
                            </th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 140px;">
                                <i class="fa-solid fa-toggle-on me-1" style="color: #667eea;"></i>Trạng Thái
                            </th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 160px;">
                                <i class="fa-solid fa-sliders me-1" style="color: #667eea;"></i>Hành Động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredArticles.length === 0" style="border-bottom: 1px solid #e2e8f0;">
                            <td colspan="5" style="padding: 50px 20px; text-align: center; color: #999;">
                                <div style="font-size: 3rem; margin-bottom: 15px;">📝</div>
                                <p style="margin: 0; font-size: 1rem;">Không tìm thấy bài viết nào</p>
                                <p style="margin: 8px 0 0 0; font-size: 0.85rem; color: #bbb;">Hãy nhấp nút "Viết Bài Mới" để bắt đầu</p>
                            </td>
                        </tr>
                        <tr v-for="article in paginatedArticles" :key="article.id" class="data-row" style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;">
                            <td style="padding: 15px; text-align: center; color: #667eea; font-weight: 700; font-size: 0.95rem;">
                                #{{ article.id }}
                            </td>
                            <td style="padding: 15px; color: #333; font-weight: 600; font-size: 0.95rem;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <img v-if="article.hinh_anh" :src="article.hinh_anh" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
                                    <span>{{ article.tieu_de }}</span>
                                </div>
                            </td>
                            <td style="padding: 15px; color: #666; font-size: 0.9rem;">
                                <span style="background: #e0f2fe; color: #0284c7; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">
                                    {{ article.tag || 'Chưa có' }}
                                </span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <button @click="changeStatus(article.id, article.tinh_trang == 1 ? 0 : 1)" 
                                    :style="{
                                        border: 'none', 
                                        padding: '6px 14px', 
                                        borderRadius: '6px', 
                                        fontSize: '0.8rem', 
                                        fontWeight: '600', 
                                        cursor: 'pointer', 
                                        transition: 'all 0.2s',
                                        background: article.tinh_trang == 1 ? '#dcfce7' : '#fee2e2',
                                        color: article.tinh_trang == 1 ? '#16a34a' : '#dc2626'
                                    }"
                                    :title="article.tinh_trang == 1 ? 'Nhấp để ẩn' : 'Nhấp để hiển thị'">
                                    <i :class="article.tinh_trang == 1 ? 'fa-solid fa-check me-1' : 'fa-solid fa-lock me-1'"></i>
                                    {{ article.tinh_trang == 1 ? 'Hoạt Động' : 'Ẩn' }}
                                </button>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                                    <button @click="openViewModal(article)" class="action-btn btn-view" title="Xem chi tiết" style="background: #e0f2fe; color: #0284c7; border: none; width: 36px; height: 36px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button @click="openEditModal(article)" class="action-btn btn-edit" title="Chỉnh sửa" style="background: #f0f4f8; color: #764ba2; border: none; width: 36px; height: 36px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                        <i class="fa-solid fa-pen-nib"></i>
                                    </button>
                                    <button @click="openDeleteModal(article)" class="action-btn btn-delete" title="Xóa bài viết" style="background: #fee2e2; color: #ef4444; border: none; width: 36px; height: 36px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="margin-top: 20px; padding: 15px 20px; background: #f0f4f8; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 0.9rem; color: #475569;">
            <div>
                <i class="fa-solid fa-info-circle me-2" style="color: #667eea;"></i>
                Tổng cộng: <strong>{{ list_articles.length }}</strong> bài viết | Tìm thấy: <strong>{{ filteredArticles.length }}</strong> bài viết
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

        <div v-if="showFormModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; width: 90%; max-width: 700px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div :style="{ 
                    background: isEdit ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #667eea, #764ba2)', 
                    padding: '25px 20px', 
                    color: 'white', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '4px solid rgba(255,255,255,0.1)'
                }">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i :class="isEdit ? 'fa-solid fa-pen-fancy' : 'fa-solid fa-feather'" style="font-size: 1.3rem;"></i>
                        <h2 style="margin: 0; font-size: 1.2rem;">{{ isEdit ? '✏️ Chỉnh Sửa Bài Viết' : '📝 Viết Bài Mới' }}</h2>
                    </div>
                    <button @click="showFormModal = false" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">×</button>
                </div>

                <div style="padding: 25px; color: #333;">
                    <div style="margin-bottom: 20px;">
                        <label class="form-label" style="font-weight: 700; color: #333; font-size: 0.95rem;">
                            <i class="fa-solid fa-heading me-2" style="color: #667eea;"></i>Tiêu Đề <span style="color: #ef4444;">*</span>
                        </label>
                        <input type="text" class="custom-input" v-model="form.tieu_de" placeholder="Nhập tiêu đề bài viết..." style="font-size: 0.95rem;">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label class="form-label" style="font-weight: 700; color: #333; font-size: 0.95rem;">
                            <i class="fa-solid fa-align-left me-2" style="color: #667eea;"></i>Mô Tả Ngắn <span style="color: #ef4444;">*</span>
                        </label>
                        <textarea class="custom-input" v-model="form.mo_ta_ngan" placeholder="Mô tả ngắn gọn bài viết..." style="font-size: 0.95rem; resize: vertical; min-height: 80px;"></textarea>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label class="form-label" style="font-weight: 700; color: #333; font-size: 0.95rem;">
                            <i class="fa-solid fa-align-justify me-2" style="color: #667eea;"></i>Nội Dung Đầy Đủ <span style="color: #ef4444;">*</span>
                        </label>
                        <textarea class="custom-input" v-model="form.noi_dung" placeholder="Viết nội dung chi tiết bài viết..." style="font-size: 0.95rem; resize: vertical; min-height: 150px;"></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label class="form-label" style="font-weight: 700; color: #333; font-size: 0.95rem;">
                                <i class="fa-solid fa-tag me-2" style="color: #667eea;"></i>Tag
                            </label>
                            <input type="text" class="custom-input" v-model="form.tag" placeholder="VD: Du lịch, Phượt, Ẩm thực..." style="font-size: 0.95rem;">
                        </div>
                        <div>
                            <label class="form-label" style="font-weight: 700; color: #333; font-size: 0.95rem;">
                                <i class="fa-solid fa-link me-2" style="color: #667eea;"></i>Link Hình Ảnh
                            </label>
                            <input type="text" class="custom-input" v-model="form.hinh_anh" placeholder="https://example.com/image.jpg" style="font-size: 0.95rem;">
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <label class="form-label" style="font-weight: 700; color: #333; font-size: 0.95rem;">
                            <i class="fa-solid fa-toggle-on me-2" style="color: #667eea;"></i>Trạng Thái
                        </label>
                        <select class="custom-input" v-model.number="form.tinh_trang" style="font-size: 0.95rem;">
                            <option :value="1">✅ Hoạt động (Hiển thị cho khách)</option>
                            <option :value="0">🔒 Tạm tắt (Ẩn khỏi khách)</option>
                        </select>
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 20px; border-top: 2px solid #e2e8f0;">
                        <button @click="showFormModal = false" style="padding: 11px 20px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; font-size: 0.9rem;">
                            <i class="fa-solid fa-times me-2"></i>Hủy Bỏ
                        </button>
                        <button @click="saveArticle" :style="{ 
                            background: isEdit ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #667eea, #764ba2)', 
                            color: 'white', 
                            padding: '11px 24px', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontWeight: '600', 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem',
                            boxShadow: isEdit ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }">
                            <i :class="isEdit ? 'fa-solid fa-check me-2' : 'fa-solid fa-save me-2'"></i>{{ isEdit ? 'Lưu Cập Nhật' : 'Đăng Bài' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showViewModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; width: 90%; max-width: 700px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 25px 20px; color: white; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fa-solid fa-eye" style="font-size: 1.3rem;"></i>
                        <h2 style="margin: 0; font-size: 1.2rem;">👀 Xem Chi Tiết Bài Viết</h2>
                    </div>
                    <button @click="showViewModal = false" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">×</button>
                </div>

                <div style="padding: 25px; color: #333;">
                    <div v-if="view_article.hinh_anh" style="margin-bottom: 20px;">
                        <img :src="view_article.hinh_anh" style="width: 100%; max-height: 300px; border-radius: 8px; object-fit: cover;">
                    </div>

                    <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 12px 0; color: #333;">{{ view_article.tieu_de }}</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <span style="background: #e0f2fe; color: #0284c7; padding: 5px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">
                            📌 {{ view_article.tag || 'Chưa có tag' }}
                        </span>
                    </div>

                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                        <p style="margin: 0; color: #475569; line-height: 1.6; font-style: italic;">{{ view_article.mo_ta_ngan }}</p>
                    </div>

                    <div style="color: #333; line-height: 1.8; white-space: pre-wrap;">{{ view_article.noi_dung }}</div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; display: flex; gap: 12px; justify-content: flex-end;">
                        <button @click="openEditModal(view_article)" style="padding: 11px 20px; background: #f0f4f8; border: none; border-radius: 8px; font-weight: 600; color: #764ba2; cursor: pointer; transition: all 0.2s; font-size: 0.9rem;">
                            <i class="fa-solid fa-pen-nib me-2"></i>Chỉnh Sửa
                        </button>
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
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.1rem; font-weight: 700;">Xác Nhận Xóa Bài Viết</h3>
                <p style="color: #666; margin: 15px 0; font-size: 0.95rem; line-height: 1.6;">
                    Bạn có chắc chắn muốn xóa <br><strong style="color: #ef4444; font-size: 1rem;">{{ del_article.tieu_de }}</strong>? <br>
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
    name: 'QuanLyBai',
    data() {
        return {
            currentPage: 1, // Khai báo trang hiện tại
            pageSize: 10,   // Số lượng bài viết trên 1 trang
            list_articles: [],
            filteredArticles: [],
            searchKeyword: '',
            
            showFormModal: false,
            showViewModal: false,
            showDeleteModal: false,
            isEdit: false,

            form: {
                id: null,
                tieu_de: '',
                mo_ta_ngan: '',
                noi_dung: '',
                hinh_anh: '',
                tag: '',
                tinh_trang: 1
            },
            view_article: {},
            del_article: {}
        }
    },
    computed: {
        // TÍNH TOÁN PHÂN TRANG
        totalPages() {
            return Math.ceil(this.filteredArticles.length / this.pageSize);
        },
        paginatedArticles() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredArticles.slice(start, start + this.pageSize);
        }
    },
    mounted() {
        this.getArticles();
    },
    watch: {
        searchKeyword() {
            this.filterArticles();
        }
    },
    methods: {
        getArticles() {
            axios.get(apiUrl('admin/bai-viet/get-data'), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.list_articles = res.data.data || [];
                        this.filterArticles();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((error) => {
                    console.error('Lỗi lấy dữ liệu:', error);
                    this.$toast.error('Lỗi khi tải bài viết');
                });
        },

        filterArticles() {
            this.filteredArticles = this.list_articles.filter(article => {
                const matchSearch = !this.searchKeyword || 
                    article.tieu_de.toLowerCase().includes(this.searchKeyword.toLowerCase());
                return matchSearch;
            });
            // Tự động nhảy về trang 1 khi người dùng gõ tìm kiếm
            this.currentPage = 1;
        },

        openAddModal() {
            this.isEdit = false;
            this.form = {
                id: null,
                tieu_de: '',
                mo_ta_ngan: '',
                noi_dung: '',
                hinh_anh: '',
                tag: '',
                tinh_trang: 1
            };
            this.showFormModal = true;
        },

        openEditModal(article) {
            this.isEdit = true;
            this.form = { ...article };
            this.showFormModal = true;
        },

        openViewModal(article) {
            this.view_article = { ...article };
            this.showViewModal = true;
        },

        openDeleteModal(article) {
            this.del_article = { ...article };
            this.showDeleteModal = true;
        },

        saveArticle() {
            if (!this.form.tieu_de.trim()) {
                this.$toast.warning('Vui lòng nhập tiêu đề!');
                return;
            }
            if (!this.form.mo_ta_ngan.trim()) {
                this.$toast.warning('Vui lòng nhập mô tả ngắn!');
                return;
            }
            if (!this.form.noi_dung.trim()) {
                this.$toast.warning('Vui lòng nhập nội dung!');
                return;
            }

            const url = this.isEdit ? 'admin/bai-viet/update' : 'admin/bai-viet/add-data';

            axios.post(apiUrl(url), this.form, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message || (this.isEdit ? 'Cập nhật bài viết thành công!' : 'Đăng bài viết thành công!'));
                        this.showFormModal = false;
                        this.getArticles();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    this.$toast.error('Lỗi khi lưu bài viết');
                });
        },

        confirmDelete() {
            axios.post(apiUrl('admin/bai-viet/delete'), { id: this.del_article.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message || 'Xóa bài viết thành công!');
                        this.showDeleteModal = false;
                        this.getArticles();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(() => this.$toast.error('Lỗi khi xóa bài viết'));
        },

        changeStatus(id, newStatus) {
            axios.post(apiUrl('admin/bai-viet/change-status'), { id: id, tinh_trang: newStatus }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.getArticles();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(() => this.$toast.error('Lỗi khi đổi trạng thái'));
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

.btn-view {
    background: #e0f2fe;
    color: #0284c7;
}

.btn-view:hover {
    background: #0284c7;
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
    background: #fee2e2;
    color: #ef4444;
}

.btn-delete:hover {
    background: #ef4444;
    color: white;
}

.form-label {
    display: block;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    font-size: 0.9rem;
}

.custom-input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s;
    background: #fff;
}

.custom-input:focus {
    outline: none;
    border-color: #667eea;
}

/* CSS BỔ SUNG CHO NÚT ĐIỀU HƯỚNG PHÂN TRANG */
.page-btn {
    padding: 6px 12px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
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
    padding: 0 10px;
    font-size: 0.85rem;
}

@keyframes shake {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1) rotate(-2deg); }
    50% { transform: scale(1.1) rotate(2deg); }
    75% { transform: scale(1.1) rotate(-2deg); }
}
</style>