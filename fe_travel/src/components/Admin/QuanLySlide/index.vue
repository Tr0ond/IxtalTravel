<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">🖼️ Quản Lý Slide (Banner)</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý và cập nhật hình ảnh trình chiếu trên trang chủ.</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 200px 150px; gap: 15px; align-items: flex-end;">
                <div style="position: relative;">
                    <input v-model="searchQuery" 
                        type="text" 
                        placeholder="Tìm kiếm theo tiêu đề slide..."
                        @input="filterData"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                </div>

                <select v-model="statusFilter" 
                    @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Trạng Thái</option>
                    <option value="1">Đang Hiển Thị</option>
                    <option value="0">Đang Ẩn</option>
                </select>

                <button @click="openModal('add')" class="btn-primary-gradient">
                    <i class="fa-solid fa-plus me-2"></i>Thêm Mới
                </button>
            </div>
        </div>

        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; width: 60px;">ID</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 100px;">Thứ Tự</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 250px;">Hình Ảnh</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Tiêu Đề</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Trạng Thái</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredSlides.length === 0">
                            <td colspan="6" style="padding: 30px; text-align: center; color: #999;">
                                <i class="fa-solid fa-images me-2" style="font-size: 1.5rem;"></i>
                                <p style="margin: 10px 0 0 0;">Không có slide nào</p>
                            </td>
                        </tr>
                        <tr v-for="slide in filteredSlides" :key="slide.id" style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;"
                            @mouseenter="(e) => e.currentTarget.style.background = '#f9fafb'"
                            @mouseleave="(e) => e.currentTarget.style.background = ''">
                            
                            <td style="padding: 15px; color: #666; font-weight: 600;">#{{ slide.id }}</td>
                            
                            <td style="padding: 15px; text-align: center; color: #333; font-weight: 700;">
                                <span style="background: #f1f5f9; padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1;">
                                    {{ slide.thu_tu }}
                                </span>
                            </td>

                            <td style="padding: 15px; text-align: center;">
                                <div style="width: 200px; height: 100px; border-radius: 8px; overflow: hidden; margin: 0 auto; border: 1px solid #e2e8f0; background: #f0f0f0;">
                                    <img :src="getImageUrl(slide.hinh_anh)" alt="Slide Image" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </td>
                            
                            <td style="padding: 15px; color: #333; font-weight: 600; font-size: 1.05rem;">
                                {{ slide.tieu_de || 'Không có tiêu đề' }}
                            </td>
                            
                            <td style="padding: 15px; text-align: center;">
                                <span :style="{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    background: slide.tinh_trang == 1 ? '#e0f2fe' : '#fef3c7',
                                    color: slide.tinh_trang == 1 ? '#0369a1' : '#d97706',
                                    border: slide.tinh_trang == 1 ? '1px solid #bae6fd' : '1px solid #fde68a'
                                }" @click="changeStatus(slide)">
                                    {{ slide.tinh_trang == 1 ? 'Đang Hiển Thị' : 'Đang Ẩn' }}
                                </span>
                            </td>
                            
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button @click="openModal('edit', slide)" class="action-btn btn-edit" title="Chỉnh sửa">
                                        <i class="fa-solid fa-pen-nib"></i>
                                    </button>
                                    <button @click="openDeleteModal(slide)" class="action-btn btn-delete" title="Xóa">
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
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">{{ modalMode === 'add' ? 'Thêm Slide Mới' : 'Cập Nhật Slide' }}</h2>
                    <button @click="showModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                
                <div style="color: #333;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Tiêu Đề Slide
                        </label>
                        <input v-model="formData.tieu_de" type="text" placeholder="Nhập tiêu đề (Không bắt buộc)"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Thứ tự vị trí hiển thị (Số nhỏ đứng trước, nhập được cả số âm)
                        </label>
                        <input v-model.number="formData.thu_tu" type="number" placeholder="Ví dụ: -1, 0, 1, 2..."
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Phương thức tải ảnh
                        </label>
                        <div style="display: flex; gap: 20px; margin-bottom: 10px;">
                            <label style="cursor: pointer;">
                                <input type="radio" v-model="uploadType" value="url" name="uploadType"> Dùng Link URL
                            </label>
                            <label style="cursor: pointer;">
                                <input type="radio" v-model="uploadType" value="file" name="uploadType"> Tải file từ máy
                            </label>
                        </div>

                        <input v-if="uploadType === 'url'" v-model="formData.hinh_anh_url" type="text" placeholder="https://domain.com/image.png"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                        
                        <div v-if="uploadType === 'file'" style="position: relative;">
                            <input type="file" @change="handleFileUpload" accept="image/*"
                                style="width: 100%; padding: 8px; border: 2px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; cursor: pointer;">
                            <small v-if="previewFileUrl" style="color: #10b981; margin-top: 5px; display: block;">Đã chọn tệp: {{ selectedFileName }}</small>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;" v-if="previewImageUrl">
                        <label style="display: block; font-weight: 600; color: #999; margin-bottom: 8px; font-size: 0.85rem;">Xem trước</label>
                        <div style="width: 100%; height: 180px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; background: #f0f0f0;">
                            <img :src="previewImageUrl" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Trạng Thái
                        </label>
                        <select v-model="formData.tinh_trang"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="1">Hiển Thị</option>
                            <option value="0">Ẩn</option>
                        </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showModal = false"
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="submitForm" :disabled="isSubmitting"
                            style="padding: 12px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            {{ isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
                        </button>
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
                    <h2 style="margin: 0 0 10px 0; color: #333;">Xóa Slide?</h2>
                    <p style="color: #666; margin: 0 0 20px 0;">
                        Bạn có chắc chắn muốn xóa slide này?<br><span style="font-size: 0.85rem; color: #999;">Hành động này không thể hoàn tác!</span>
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
            slides: [],
            filteredSlides: [],
            searchQuery: '',
            statusFilter: '',
            
            showModal: false,
            showDeleteModal: false,
            modalMode: 'add', 
            
            uploadType: 'url', 
            selectedFile: null,
            selectedFileName: '',
            previewFileUrl: '',
            
            formData: {
                id: null,
                tieu_de: '',
                hinh_anh_url: '',
                tinh_trang: 1,
                thu_tu: 0 // Đã thêm trường lưu trữ dữ liệu Thứ tự
            },
            
            selectedSlideId: null,
            isSubmitting: false,
        }
    },
    computed: {
        previewImageUrl() {
            if (this.uploadType === 'file') {
                return this.previewFileUrl || (this.formData.hinh_anh_url ? this.getImageUrl(this.formData.hinh_anh_url) : '');
            }
            if (this.uploadType === 'url' && this.formData.hinh_anh_url) {
                return this.getImageUrl(this.formData.hinh_anh_url);
            }
            return '';
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            axios.get(apiUrl('admin/slide/get-data'), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
            .then(res => {
                if (res.data.status) {
                    this.slides = res.data.data;
                    this.filterData();
                }
            })
            .catch(err => {
                this.$toast.error('Lỗi khi tải dữ liệu slide');
            });
        },
        
        filterData() {
            this.filteredSlides = this.slides.filter(s => {
                const matchSearch = !this.searchQuery || 
                    (s.tieu_de && s.tieu_de.toLowerCase().includes(this.searchQuery.toLowerCase()));
                const matchStatus = this.statusFilter === '' || s.tinh_trang.toString() === this.statusFilter;
                
                return matchSearch && matchStatus;
            });
        },
        
        getImageUrl(url) {
            if (!url) return 'https://via.placeholder.com/600x300?text=No+Image';
            
            if (url.startsWith('http') || url.startsWith('data:')) {
                return url; 
            }

            const baseApiUrl = apiUrl(''); 
            const backendDomain = baseApiUrl.replace(/\/api\/?$/, ''); 

            return backendDomain + (url.startsWith('/') ? '' : '/') + url;
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedFile = file;
                this.selectedFileName = file.name;
                this.previewFileUrl = URL.createObjectURL(file);
            }
        },

        openModal(mode, slide = null) {
            this.modalMode = mode;
            this.showModal = true;
            this.selectedFile = null;
            this.previewFileUrl = '';
            this.selectedFileName = '';
            
            if (mode === 'add') {
                this.uploadType = 'url';
                this.formData = { id: null, tieu_de: '', hinh_anh_url: '', tinh_trang: 1, thu_tu: 0 };
            } else {
                this.formData = { 
                    id: slide.id, 
                    tieu_de: slide.tieu_de || '', 
                    hinh_anh_url: slide.hinh_anh || '', 
                    tinh_trang: slide.tinh_trang,
                    thu_tu: slide.thu_tu ?? 0 // Gán giá trị thứ tự cũ khi sửa
                };
                if (slide.hinh_anh && slide.hinh_anh.startsWith('http')) {
                    this.uploadType = 'url';
                } else {
                    this.uploadType = 'file'; 
                }
            }
        },

        submitForm() {
            if (this.uploadType === 'url' && !this.formData.hinh_anh_url) {
                this.$toast.error('Vui lòng nhập đường dẫn hình ảnh'); return;
            }
            if (this.uploadType === 'file' && !this.selectedFile && this.modalMode === 'add') {
                this.$toast.error('Vui lòng tải lên một tệp hình ảnh'); return;
            }

            this.isSubmitting = true;

            const payload = new FormData();
            payload.append('tieu_de', this.formData.tieu_de);
            payload.append('tinh_trang', this.formData.tinh_trang);
            payload.append('thu_tu', this.formData.thu_tu); // Gửi kèm dữ liệu thứ tự lên backend
            
            if (this.modalMode === 'edit') {
                payload.append('id', this.formData.id);
            }

            if (this.uploadType === 'file' && this.selectedFile) {
                payload.append('hinh_anh_file', this.selectedFile);
            } else if (this.uploadType === 'url') {
                payload.append('hinh_anh_url', this.formData.hinh_anh_url);
            }

            const url = this.modalMode === 'add' ? 'admin/slide/add-data' : 'admin/slide/update';

            axios.post(apiUrl(url), payload, {
                headers: { 
                    Authorization: "Bearer " + localStorage.getItem('key_admin'),
                    'Content-Type': 'multipart/form-data' 
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showModal = false;
                    this.loadData();
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                this.$toast.error('Có lỗi xảy ra khi lưu slide!');
            })
            .finally(() => {
                this.isSubmitting = false;
            });
        },

        changeStatus(slide) {
            axios.post(apiUrl('admin/slide/change-status'), { id: slide.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
            .then(res => {
                if(res.data.status) {
                    this.$toast.success(res.data.message);
                    this.loadData();
                } else {
                    this.$toast.error(res.data.message);
                }
            }).catch(() => this.$toast.error('Có lỗi xảy ra!'));
        },

        openDeleteModal(slide) {
            this.selectedSlideId = slide.id;
            this.showDeleteModal = true;
        },

        confirmDelete() {
            if (!this.selectedSlideId) return;
            axios.post(apiUrl('admin/slide/delete'), { id: this.selectedSlideId }, {
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
            .catch(() => this.$toast.error('Lỗi khi xóa dữ liệu'));
        }
    }
}
</script>

<style scoped>
.btn-primary-gradient {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
.btn-primary-gradient:hover {
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
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

.btn-edit { background: #f0f4f8; color: #10b981; }
.btn-edit:hover { background: #10b981; color: white; }

.btn-delete { background: #fee; color: #f56565; }
.btn-delete:hover { background: #f56565; color: white; }
</style>