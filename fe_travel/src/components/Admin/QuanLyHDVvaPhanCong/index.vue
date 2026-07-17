<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">👨‍💼 Quản Lý Hướng Dẫn Viên & Phân Công Tour</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý thông tin hướng dẫn viên và phân công tour du lịch.</p>
        </div>

        <!-- Tabs -->
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 15px; border-bottom: 2px solid #e2e8f0;">
                <button 
                    @click="activeTab = 'hdv'"
                    :style="{
                        padding: '15px 25px',
                        background: activeTab === 'hdv' ? '#667eea' : 'transparent',
                        color: activeTab === 'hdv' ? 'white' : '#666',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }">
                    <i class="fa-solid fa-users me-2"></i>Danh Sách Hướng Dẫn Viên
                </button>
                <button 
                    @click="activeTab = 'phancong'"
                    :style="{
                        padding: '15px 25px',
                        background: activeTab === 'phancong' ? '#667eea' : 'transparent',
                        color: activeTab === 'phancong' ? 'white' : '#666',
                        border: 'none',
                        borderRadius: '8px 8px 0 0',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }">
                    <i class="fa-solid fa-briefcase me-2"></i>Phân Công Tour
                </button>
            </div>
        </div>

        <!-- Tab: Danh sách HDV -->
        <div v-if="activeTab === 'hdv'">
            <!-- Search & Filter -->
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: grid; grid-template-columns: 1fr 150px 150px; gap: 15px; align-items: flex-end;">
                    <div style="position: relative;">
                        <input v-model="searchQueryHDV" type="text" placeholder="Tìm kiếm hướng dẫn viên..." @input="filterDataHDV" style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                        <i class="fa-solid fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                    </div>
                    <select v-model="statusFilterHDV" @change="filterDataHDV" style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                        <option value="">Tất cả Trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Tạm dừng</option>
                    </select>
                    <button @click="openAddHDVModal" class="btn-primary-gradient">
                        <i class="fa-solid fa-plus me-2"></i>Thêm HDV
                    </button>
                </div>
            </div>

            <!-- Table HDV -->
            <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Mã HDV</th>
                                <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Thông Tin HDV</th>
                                <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Ngôn Ngữ</th>
                                <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Trạng Thái</th>
                                <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredHDV.length === 0">
                                <td colspan="5" style="padding: 30px; text-align: center; color: #999;">
                                    <i class="fa-solid fa-inbox me-2" style="font-size: 1.5rem;"></i><p style="margin: 10px 0 0 0;">Không có hướng dẫn viên nào</p>
                                </td>
                            </tr>
                            <tr v-for="hdv in filteredHDV" :key="hdv.id" style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;" @mouseenter="(e) => e.currentTarget.style.background = '#f9fafb'" @mouseleave="(e) => e.currentTarget.style.background = ''">
                                <td style="padding: 15px; color: #333; font-weight: 600;">{{ hdv.ma_hdv }}</td>
                                <td style="padding: 15px; color: #666;">
                                    <div style="font-weight: 600; color: #2c3e50;">{{ hdv.ho_va_ten }}</div>
                                    <div style="font-size: 0.85rem; color: #999;"><i class="fa-solid fa-phone fa-xs me-1"></i> {{ hdv.so_dien_thoai }}</div>
                                </td>
                                <td style="padding: 15px; color: #666;">
                                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                        <span v-for="lang in Array.isArray(hdv.ngon_ngu) ? hdv.ngon_ngu : (hdv.ngon_ngu ? JSON.parse(hdv.ngon_ngu) : [])" :key="lang" style="display: inline-block; padding: 4px 8px; background: #e0f2fe; color: #0369a1; border-radius: 6px; font-weight: 600; font-size: 0.85rem;">
                                            {{ lang }}
                                        </span>
                                    </div>
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <span :style="{ display: 'inline-block', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', background: hdv.trang_thai == 1 ? '#dcfce7' : '#fee2e2', color: hdv.trang_thai == 1 ? '#16a34a' : '#dc2626' }">
                                        {{ hdv.trang_thai == 1 ? 'Hoạt động' : 'Tạm dừng' }}
                                    </span>
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <div style="display: flex; gap: 8px; justify-content: center;">
                                        <button @click="viewHDV(hdv)" class="action-btn btn-view" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></button>
                                        <button @click="editHDV(hdv)" class="action-btn btn-edit" title="Chỉnh sửa"><i class="fa-solid fa-pen-nib"></i></button>
                                        <button @click="deleteHDV(hdv)" class="action-btn btn-delete" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Tab: Phân công Tour -->
        <div v-if="activeTab === 'phancong'">
            <!-- Search & Filter -->
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: grid; grid-template-columns: 1fr 180px 150px; gap: 15px; align-items: flex-end;">
                    <div style="position: relative;">
                        <input v-model="searchQueryTour" type="text" placeholder="Tìm kiếm tên tour, mã tour..." @input="filterDataTour" style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                        <i class="fa-solid fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                    </div>
                    <select v-model="statusFilterTour" @change="filterDataTour" style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                        <option value="">Tất cả Trạng thái</option>
                        <option value="1">Đang & Sắp diễn ra</option>
                        <option value="0">Đã kết thúc</option>
                    </select>
                    <button @click="openAddAssignModal" class="btn-primary-gradient">
                        <i class="fa-solid fa-plus me-2"></i>Thêm Phân Công
                    </button>
                </div>
            </div>

            <!-- Table Phân công Tour -->
            <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                                <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Mã Tour</th>
                                <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Thông Tin Tour</th>
                                <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Hướng Dẫn Viên</th>
                                <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Thời Gian</th>
                                <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Trạng Thái</th>
                                <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredAssignments.length === 0">
                                <td colspan="6" style="padding: 30px; text-align: center; color: #999;">
                                    <i class="fa-solid fa-inbox me-2" style="font-size: 1.5rem;"></i><p style="margin: 10px 0 0 0;">Không có phân công nào</p>
                                </td>
                            </tr>
                            <tr v-for="assign in filteredAssignments" :key="assign.id_phan_cong" style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;" @mouseenter="(e) => e.currentTarget.style.background = '#f9fafb'" @mouseleave="(e) => e.currentTarget.style.background = ''">
                                <td style="padding: 15px; color: #333; font-weight: 600;">{{ assign.ma_tour }}</td>
                                <td style="padding: 15px; color: #666; font-weight: 500;">{{ assign.ten_tour }}</td>
                                <td style="padding: 15px; color: #666;">
                                    <div style="font-weight: 600; color: #0284c7;"><i class="fa-solid fa-user-tie me-1"></i> {{ assign.ten_hdv }}</div>
                                    <div style="font-size: 0.85rem; color: #999;"><i class="fa-solid fa-phone fa-xs me-1"></i> {{ assign.so_dien_thoai }}</div>
                                </td>
                                <td style="padding: 15px; text-align: center; color: #666; font-size: 0.85rem; font-weight: 500;">
                                    {{ formatDate(assign.ngay_bat_dau) }} <br>đến<br> {{ formatDate(assign.ngay_ket_thuc) }}
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <span :style="{ display: 'inline-block', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', background: assign.trang_thai == 1 ? '#dbeafe' : '#f3f4f6', color: assign.trang_thai == 1 ? '#0284c7' : '#64748b' }">
                                        {{ assign.trang_thai == 1 ? 'Đang diễn ra' : 'Đã kết thúc' }}
                                    </span>
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <div style="display: flex; gap: 8px; justify-content: center;">
                                        <button @click="editAssign(assign)" class="action-btn btn-edit" title="Sửa phân công"><i class="fa-solid fa-pen-nib"></i></button>
                                        <button @click="deleteAssign(assign)" class="action-btn btn-delete" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- ======================= MODALS ======================= -->

        <!-- Modal Xem/Thêm/Sửa HDV -->
        <div v-if="showHDVModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
                <h2 style="margin: 0 0 20px 0; color: #333; font-size: 1.3rem;">
                    <i :class="hdvFormMode === 'view' ? 'fa-solid fa-id-card text-info' : 'fa-solid fa-user-plus text-primary'" class="me-2"></i>
                    {{ hdvFormMode === 'view' ? 'Chi Tiết Hướng Dẫn Viên' : (hdvFormMode === 'edit' ? 'Chỉnh Sửa Thông Tin' : 'Thêm Hướng Dẫn Viên Mới') }}
                </h2>
                <div style="display: grid; gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Họ và Tên:</label>
                        <input v-model="hdvForm.ho_va_ten" type="text" placeholder="Nhập họ và tên" :disabled="hdvFormMode === 'view'" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 6px; font-family: inherit;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Email:</label>
                        <input v-model="hdvForm.email" type="email" placeholder="Nhập email" :disabled="hdvFormMode === 'view'" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 6px; font-family: inherit;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Số Điện Thoại:</label>
                        <input v-model="hdvForm.so_dien_thoai" type="tel" placeholder="Nhập số điện thoại" :disabled="hdvFormMode === 'view'" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 6px; font-family: inherit;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #333;">Ngôn Ngữ (Chọn nhiều):</label>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 12px; border: 2px solid #e2e8f0; border-radius: 6px; background: #fafbfc;">
                            <label v-for="lang in availableLanguages" :key="lang.value" style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" :value="lang.value" v-model="hdvForm.ngon_ngu" :disabled="hdvFormMode === 'view'" style="margin-right: 8px; cursor: pointer; width: 16px; height: 16px;">
                                <span style="color: #333; font-size: 0.9rem;">{{ lang.label }}</span>
                            </label>
                        </div>
                        <p v-if="hdvForm.ngon_ngu.length === 0" style="color: #999; font-size: 0.85rem; margin: 8px 0 0 0;">Vui lòng chọn ít nhất 1 ngôn ngữ</p>
                    </div>
                    <div v-if="hdvFormMode !== 'view'">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Mật Khẩu:</label>
                        <input v-model="hdvForm.password" type="password" :placeholder="hdvFormMode === 'edit' ? 'Để trống nếu không muốn đổi' : 'Nhập mật khẩu'" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 6px; font-family: inherit;">
                    </div>
                    <div v-if="hdvFormMode !== 'view'">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Trạng Thái:</label>
                        <select v-model="hdvForm.is_block" style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 6px; font-family: inherit; background: white;">
                            <option :value="0">Hoạt động</option>
                            <option :value="1">Tạm dừng (Khóa)</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button @click="closeHDVModal" style="padding: 10px 20px; background: #e2e8f0; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        {{ hdvFormMode === 'view' ? 'Đóng' : 'Hủy' }}
                    </button>
                    <button v-if="hdvFormMode !== 'view'" @click="saveHDV" class="btn-primary-gradient" style="padding: 10px 20px;">
                        <i class="fa-solid fa-save me-2"></i>{{ hdvFormMode === 'edit' ? 'Cập Nhật' : 'Thêm Mới' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Phân Công Tour -->
        <div v-if="showAssignModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; overflow-y: auto;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.2); margin: 20px auto;">
                <h2 style="margin: 0 0 20px 0; color: #333; font-size: 1.3rem;">
                    <i class="fa-solid fa-briefcase text-primary me-2"></i>
                    {{ assignFormMode === 'edit' ? 'Cập Nhật Phân Công' : 'Phân Công Tour Mới' }}
                </h2>
                
                <div style="display: grid; gap: 15px; margin-bottom: 25px;">
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Chọn Tour Du Lịch:</label>
                        <select v-model="assignForm.id_tour" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 6px; font-family: inherit; background: white;">
                            <option value="">-- Chọn Tour --</option>
                            <option v-for="tour in tourList" :key="tour.id" :value="tour.id">
                                {{ tour.ten_tour }} ({{ formatDate(tour.ngay_bat_dau) }})
                            </option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #333;">Chọn Hướng Dẫn Viên:</label>
                        <select v-model="assignForm.id_huong_dan_vien" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 6px; font-family: inherit; background: white;">
                            <option value="">-- Chọn Hướng Dẫn Viên --</option>
                            <option v-for="hdv in availableHDV" :key="hdv.id" :value="hdv.id">
                                {{ hdv.ho_va_ten }} ({{ hdv.ngon_ngu_text }})
                            </option>
                        </select>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button @click="closeAssignModal" style="padding: 10px 20px; background: #e2e8f0; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Hủy</button>
                    <button @click="saveAssign" class="btn-primary-gradient" style="padding: 10px 20px;">
                        <i class="fa-solid fa-save me-2"></i>{{ assignFormMode === 'edit' ? 'Lưu Thay Đổi' : 'Xác Nhận Phân Công' }}
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
    data() {
        return {
            activeTab: 'hdv',
            
            // HDV Data
            hdvList: [],
            filteredHDV: [],
            searchQueryHDV: '',
            statusFilterHDV: '',
            
            // Assignment Data
            assignments: [],
            filteredAssignments: [],
            searchQueryTour: '',
            statusFilterTour: '',
            
            // Tour Data
            tourList: [],
            availableHDV: [],
            
            // Modal HDV
            showHDVModal: false,
            hdvFormMode: 'add',
            hdvForm: { id: null, ho_va_ten: '', email: '', so_dien_thoai: '', ngon_ngu: [], password: '', is_block: 0 },
            
            availableLanguages: [
                { value: 'Tiếng Việt', label: 'Tiếng Việt' },
                { value: 'Tiếng Anh', label: 'Tiếng Anh' },
                { value: 'Tiếng Trung', label: 'Tiếng Trung' },
                { value: 'Tiếng Pháp', label: 'Tiếng Pháp' },
                { value: 'Tiếng Nhật', label: 'Tiếng Nhật' },
                { value: 'Tiếng Hàn', label: 'Tiếng Hàn' },
                { value: 'Tiếng Tây Ban Nha', label: 'Tiếng Tây Ban Nha' },
                { value: 'Tiếng Đức', label: 'Tiếng Đức' }
            ],
            
            // Modal Assignment
            showAssignModal: false,
            assignFormMode: 'add',
            assignForm: { id_phan_cong: null, id_tour: '', id_huong_dan_vien: '' },
            
            isLoading: false,
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.isLoading = true;
            Promise.allSettled([this.loadHDVList(), this.loadAssignments(), this.loadTourList()])
            .then(() => {
                this.filterDataHDV();
                this.filterDataTour();
                this.isLoading = false;
            }).catch(() => { this.isLoading = false; });
        },
        
        loadHDVList() {
            return new Promise((resolve, reject) => {
                axios.get(apiUrl('admin/quan-ly-hdv/danh-sach-hdv'), { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data.status) {
                        this.hdvList = res.data.data.map(hdv => ({
                            id: hdv.id,
                            ma_hdv: '#HDV-' + String(hdv.id).padStart(3, '0'),
                            ho_va_ten: hdv.ho_va_ten,
                            email: hdv.email,
                            so_dien_thoai: hdv.so_dien_thoai || 'N/A',
                            ngon_ngu: this.parseLanguages(hdv.ngon_ngu),
                            is_block: hdv.is_block,
                            trang_thai: hdv.is_block ? 0 : 1
                        }));
                        this.availableHDV = this.hdvList.filter(h => h.trang_thai === 1).map(h => ({
                            ...h, ngon_ngu_text: (Array.isArray(h.ngon_ngu) ? h.ngon_ngu : this.parseLanguages(h.ngon_ngu)).join(', ')
                        }));
                        resolve(res.data);
                    }
                }).catch(err => reject(err));
            });
        },
        
        loadAssignments() {
            return new Promise((resolve, reject) => {
                axios.get(apiUrl('admin/quan-ly-hdv/danh-sach-phan-cong'), { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data.status) {
                        this.assignments = res.data.data.map(assign => ({
                            id_phan_cong: assign.id_phan_cong,
                            id_tour: assign.id_tour,
                            id_hdv: assign.id_hdv,
                            ma_tour: '#TOUR-' + String(assign.id_tour).padStart(3, '0'),
                            ten_tour: assign.ten_tour,
                            ten_hdv: assign.ten_hdv,
                            so_dien_thoai: assign.so_dien_thoai || 'N/A',
                            ngon_ngu: this.parseLanguages(assign.ngon_ngu),
                            ngay_bat_dau: assign.ngay_bat_dau,
                            ngay_ket_thuc: assign.ngay_ket_thuc,
                            trang_thai: this.getTourStatus(assign.ngay_bat_dau, assign.ngay_ket_thuc)
                        }));
                        resolve(res.data);
                    }
                }).catch(err => reject(err));
            });
        },
        
        loadTourList() {
            return new Promise((resolve, reject) => {
                axios.get(apiUrl('admin/tour/get-data'), { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data.status) { this.tourList = res.data.data || []; resolve(res.data); }
                }).catch(err => reject(err));
            });
        },
        
        getTourStatus(ngay_bat_dau, ngay_ket_thuc) {
            const now = new Date();
            const endDate = new Date(ngay_ket_thuc);
            return (now > endDate) ? 0 : 1; // 0: Kết thúc, 1: Đang/Sắp diễn ra
        },
        
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        },
        
        parseLanguages(languageData) {
            if (!languageData) return [];
            if (Array.isArray(languageData)) return languageData;
            try { return JSON.parse(languageData); } catch { return [languageData]; }
        },
        stringifyLanguages(languageArray) {
            return (!languageArray || languageArray.length === 0) ? JSON.stringify(['Tiếng Việt']) : JSON.stringify(languageArray);
        },
        
        filterDataHDV() {
            this.filteredHDV = this.hdvList.filter(hdv => {
                const matchSearch = !this.searchQueryHDV || hdv.ho_va_ten.toLowerCase().includes(this.searchQueryHDV.toLowerCase()) || hdv.ma_hdv.toLowerCase().includes(this.searchQueryHDV.toLowerCase());
                const matchStatus = !this.statusFilterHDV || hdv.trang_thai.toString() === this.statusFilterHDV;
                return matchSearch && matchStatus;
            });
        },
        
        openAddHDVModal() {
            this.hdvFormMode = 'add';
            this.hdvForm = { id: null, ho_va_ten: '', email: '', so_dien_thoai: '', ngon_ngu: [], password: '', is_block: 0 };
            this.showHDVModal = true;
        },
        viewHDV(hdv) {
            this.hdvFormMode = 'view';
            this.hdvForm = { ...hdv, password: '' };
            this.showHDVModal = true;
        },
        editHDV(hdv) {
            this.hdvFormMode = 'edit';
            this.hdvForm = { ...hdv, password: '' };
            this.showHDVModal = true;
        },
        saveHDV() {
            if (!this.hdvForm.ho_va_ten || !this.hdvForm.email) return this.$toast.warning('Điền đủ thông tin!');
            if (this.hdvFormMode === 'add' && !this.hdvForm.password) return this.$toast.warning('Nhập mật khẩu!');
            
            const payload = { ...this.hdvForm, ngon_ngu: this.stringifyLanguages(this.hdvForm.ngon_ngu) };
            if (this.hdvFormMode === 'edit' && !this.hdvForm.password) delete payload.password;
            
            const url = this.hdvFormMode === 'add' ? 'admin/huong-dan-vien/store' : 'admin/huong-dan-vien/update';
            axios.post(apiUrl(url), payload, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.closeHDVModal();
                    this.loadData();
                } else this.$toast.error(res.data.message);
            });
        },
        deleteHDV(hdv) {
            if (confirm(`Xóa Hướng dẫn viên ${hdv.ho_va_ten}? Phân công cũng sẽ bị xóa.`)) {
                axios.post(apiUrl('admin/huong-dan-vien/destroy'), { id: hdv.id }, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data.status) { this.$toast.success('Xóa thành công!'); this.loadData(); }
                });
            }
        },
        closeHDVModal() { this.showHDVModal = false; },

        /* PHÂN CÔNG TOUR */
        filterDataTour() {
            this.filteredAssignments = this.assignments.filter(assign => {
                const matchSearch = !this.searchQueryTour || assign.ten_tour.toLowerCase().includes(this.searchQueryTour.toLowerCase()) || assign.ma_tour.toLowerCase().includes(this.searchQueryTour.toLowerCase());
                const matchStatus = !this.statusFilterTour || assign.trang_thai.toString() === this.statusFilterTour;
                return matchSearch && matchStatus;
            });
        },
        openAddAssignModal() {
            this.assignFormMode = 'add';
            this.assignForm = { id_phan_cong: null, id_tour: '', id_huong_dan_vien: '' };
            this.showAssignModal = true;
        },
        editAssign(assign) {
            this.assignFormMode = 'edit';
            this.assignForm = { id_phan_cong: assign.id_phan_cong, id_tour: assign.id_tour, id_huong_dan_vien: assign.id_hdv };
            this.showAssignModal = true;
        },
        saveAssign() {
            if (!this.assignForm.id_tour || !this.assignForm.id_huong_dan_vien) return this.$toast.warning('Chọn đủ Tour và HDV!');
            const url = this.assignFormMode === 'add' ? 'admin/quan-ly-hdv/tao-phan-cong' : 'admin/quan-ly-hdv/cap-nhat-phan-cong';
            
            axios.post(apiUrl(url), this.assignForm, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.closeAssignModal();
                    this.loadData();
                } else this.$toast.error(res.data.message);
            });
        },
        deleteAssign(assign) {
            if (confirm(`Xóa phân công này?`)) {
                axios.post(apiUrl('admin/quan-ly-hdv/xoa-phan-cong'), { id: assign.id_phan_cong }, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data.status) { this.$toast.success('Đã xóa thành công!'); this.loadData(); }
                });
            }
        },
        closeAssignModal() { this.showAssignModal = false; }
    }
}
</script>

<style scoped>
.btn-primary-gradient {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;
}
.btn-primary-gradient:hover { box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transform: translateY(-2px); }

.action-btn { width: 35px; height: 35px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border: none; }
.btn-view { background: #e3f2fd; color: #667eea; }
.btn-view:hover { background: #667eea; color: white; transform: scale(1.1); }
.btn-edit { background: #f0f4f8; color: #764ba2; }
.btn-edit:hover { background: #764ba2; color: white; transform: scale(1.1); }
.btn-delete { background: #fee; color: #f56565; }
.btn-delete:hover { background: #f56565; color: white; transform: scale(1.1); }
</style>