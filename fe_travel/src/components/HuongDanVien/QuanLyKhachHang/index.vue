<template>
    <div class="customer-manager-wrapper container-fluid px-4 py-4" style="background-color: #f8fafc; min-height: 100vh;">

        <div class="row mb-4 align-items-end">
            <div class="col-md-6 mb-3 mb-md-0">
                <h1 style="font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1.6rem; color: #0f172a; margin: 0;">Quản Lý Khách Hàng</h1>
                <p class="mb-0" style="font-size: .9rem; color: #64748b; margin-top: 4px;">Danh sách khách hàng thuộc các tour bạn phụ trách</p>
            </div>
            <div class="col-md-6 d-flex justify-content-md-end gap-3">
                <div class="stat-card shadow-sm bg-white">
                    <i class="fa-solid fa-map-location-dot stat-icon text-primary-custom bg-light"></i>
                    <div><p class="stat-title">TỔNG TOUR</p><h4 class="stat-value">{{ totalTours }}</h4></div>
                </div>
                <div class="stat-card shadow-sm bg-white">
                    <i class="fa-solid fa-users stat-icon text-warning bg-warning bg-opacity-10"></i>
                    <div><p class="stat-title">TỔNG KHÁCH</p><h4 class="stat-value">{{ totalCustomers }}</h4></div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 mb-4 bg-white p-3">
            <div class="input-group input-group-lg border rounded-pill overflow-hidden bg-light focus-ring-custom">
                <span class="input-group-text bg-transparent border-0 text-muted"><i class="fa-solid fa-search"></i></span>
                <input type="text" v-model="searchQuery" class="form-control bg-transparent border-0 shadow-none fs-6" placeholder="Tìm tên khách hàng, số điện thoại, CCCD hoặc tên tour...">
                <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-link text-muted text-decoration-none shadow-none"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>

        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary-custom" role="status"></div>
            <p class="text-muted mt-3 fw-medium">Đang đồng bộ dữ liệu khách hàng...</p>
        </div>

        <div v-else-if="listData.length === 0" class="card premium-card border-0 shadow-sm text-center py-5">
            <div class="card-body">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png" width="130" class="opacity-50 mb-4" alt="Empty">
                <h4 class="text-dark fw-bold">Bạn chưa phụ trách Tour nào!</h4>
                <p class="text-muted mb-4">Hãy nhận Tour để bắt đầu xem danh sách Khách hàng của mình.</p>
                <router-link to="/huong-dan-vien/quan-ly-tour" class="btn btn-gradient-primary rounded-pill px-5 py-3 fw-bold shadow-sm custom-hover-btn">
                    <i class="fa-solid fa-briefcase me-2"></i> TỚI KHO TOUR NHẬN VIỆC
                </router-link>
            </div>
        </div>
        
        <div v-else-if="filteredListData.length === 0" class="card premium-card border-0 shadow-sm text-center py-5">
            <h5 class="text-muted fw-bold">Không tìm thấy kết quả phù hợp với "{{ searchQuery }}"</h5>
        </div>

        <div v-else class="row">
            <div class="col-12" v-for="(tour, index) in filteredListData" :key="index">
                <div class="card premium-card border-0 shadow-sm mb-4 slide-in">
                    
                    <div class="card-header bg-white border-bottom p-4">
                        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <div>
                                <span class="badge bg-primary text-white px-3 py-2 rounded-pill mb-2 fw-bold shadow-sm">
                                    <i class="fa-solid fa-hashtag me-1"></i> MÃ TOUR: {{ tour.id || tour.id_tour }}
                                </span>
                                <h5 class="fw-bold text-dark mb-1 fs-5">{{ tour.ten_tour }}</h5>
                                <p class="text-muted mb-0 small bg-light d-inline-block px-2 py-1 rounded border mt-1">
                                    <i class="fa-regular fa-clock text-primary-custom me-1"></i> Khởi hành: <strong>{{ formatDate(tour.ngay_bat_dau) }}</strong> 
                                </p>
                            </div>
                            <div class="text-end">
                                <div class="stat-box shadow-sm border-start border-4 border-primary-custom">
                                    <span class="fs-4 fw-bold text-primary-custom">{{ tour.danh_sach_khach_hang.length }}</span>
                                    <span class="text-muted small"> khách (Lọc) / Tổng {{ tour.tong_khach_da_dat || tour.danh_sach_khach_hang.length }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle custom-table mb-0">
                                <thead class="bg-slate-50 text-secondary">
                                    <tr>
                                        <th class="text-center" width="5%">STT</th>
                                        <th width="22%">Khách Hàng / Người Đặt</th>
                                        <th width="15%">Liên Hệ</th>
                                        <th width="15%">CCCD/Passport</th>
                                        <th width="43%">Ghi Chú & Người Đi Cùng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(kh, khIndex) in tour.danh_sach_khach_hang" :key="khIndex">
                                        <td class="text-center text-muted fw-bold">{{ khIndex + 1 }}</td>
                                        
                                        <td>
                                            <div class="d-flex align-items-center my-1">
                                                <img v-if="kh.avatar" :src="kh.avatar" class="rounded-circle shadow-sm me-3 border border-2 border-white" style="width: 48px; height: 48px; object-fit: cover;">
                                                <div v-else class="avatar-circle me-3 text-white fw-bold shadow-sm border border-2 border-white">
                                                    {{ getInitials(kh.ho_va_ten) }}
                                                </div>
                                                <div>
                                                    <h6 class="mb-0 fw-bold text-dark">{{ kh.ho_va_ten || 'Đang cập nhật' }}</h6>
                                                    <span class="badge bg-light text-secondary border mt-1"><i class="fa-solid fa-receipt me-1"></i> MĐH: {{ kh.ma_hoa_don || 'N/A' }}</span>
                                                </div>
                                            </div>   
                                        </td>

                                        <td>
                                            <div class="d-flex flex-column gap-1">
                                                <span class="fw-bold text-dark" style="font-size: 0.9rem;">
                                                    <i class="fa-solid fa-phone text-success me-1"></i> {{ kh.so_dien_thoai || 'Trống' }}
                                                </span>
                                                <span class="text-muted small text-truncate" style="max-width: 150px;" :title="kh.email">
                                                    <i class="fa-solid fa-envelope text-secondary me-1"></i> {{ kh.email || 'Trống' }}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        <td>
                                            <span class="badge bg-slate-100 text-dark border px-2 py-1 fs-6 fw-bold text-monospace">{{ kh.cccd || 'Đang cập nhật' }}</span>
                                        </td>

                                        <td>
                                            <div class="bg-slate-50 p-3 rounded-3 border">
                                                <div class="d-flex align-items-center mb-2 border-bottom pb-2">
                                                    <i class="fa-solid fa-ticket text-warning me-2 fs-5"></i> 
                                                    <span class="fw-bold text-dark">Số lượng vé: <span class="badge bg-warning text-dark fs-6 ms-1">{{ kh.so_luong_nguoi }}</span></span>
                                                </div>
                                                <div v-if="kh.ghi_chu_danh_sach_nguoi_di" style="white-space: pre-line; font-size: 0.85rem; line-height: 1.5;" class="text-secondary fst-italic">
                                                    <i class="fa-solid fa-quote-left text-muted opacity-50 me-1"></i> {{ kh.ghi_chu_danh_sach_nguoi_di }}
                                                </div>
                                                <div v-else class="text-muted fst-italic small">Không có ghi chú thêm từ khách hàng.</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
            listData: [], 
            isLoading: true,
            searchQuery: ''
        }
    },
    computed: {
        totalTours() {
            return this.listData.length;
        },
        totalCustomers() {
            return this.listData.reduce((sum, tour) => sum + (tour.tong_khach_da_dat || (tour.danh_sach_khach_hang ? tour.danh_sach_khach_hang.length : 0)), 0);
        },
        filteredListData() {
            if (!this.searchQuery.trim()) return this.listData;
            
            const q = this.searchQuery.toLowerCase().trim();
            
            // Map qua từng tour, lọc danh sách KH bên trong. Nếu Tour rỗng thì bỏ qua.
            return this.listData.map(tour => {
                const isTourMatch = tour.ten_tour && tour.ten_tour.toLowerCase().includes(q);
                
                const filteredKhach = (tour.danh_sach_khach_hang || []).filter(kh => 
                    (kh.ho_va_ten && kh.ho_va_ten.toLowerCase().includes(q)) ||
                    (kh.so_dien_thoai && kh.so_dien_thoai.includes(q)) ||
                    (kh.cccd && kh.cccd.includes(q)) ||
                    (kh.ma_hoa_don && kh.ma_hoa_don.toString().includes(q))
                );

                // Nếu tên tour khớp với từ khóa -> Hiện tất cả KH của tour đó
                // Nếu tên tour không khớp -> Chỉ hiện các KH khớp với từ khóa
                return {
                    ...tour,
                    danh_sach_khach_hang: isTourMatch ? tour.danh_sach_khach_hang : filteredKhach
                };
            }).filter(tour => tour.danh_sach_khach_hang && tour.danh_sach_khach_hang.length > 0);
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        getHeaders() { return { Authorization: "Bearer " + localStorage.getItem("key_hdv") }; },
        formatDate(dateString) {
            if (!dateString) return "...";
            return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
        },
        getInitials(name) {
            if (!name) return 'KH';
            let parts = name.trim().split(' ');
            return parts[parts.length - 1].charAt(0).toUpperCase();
        },
        loadData() {
            this.isLoading = true;
            axios.get(apiUrl('huong-dan-vien/quan-ly-khach-hang/get-data'), { headers: this.getHeaders() })
                .then((res) => { if (res.data.status) this.listData = res.data.data; })
                .catch((err) => console.error(err))
                .finally(() => this.isLoading = false);
        }
    }
}
</script>

<style scoped>
.customer-manager-wrapper { padding-bottom: 3rem; }
.text-primary-custom { color: #1b7d6b !important; }
.bg-primary { background-color: #1b7d6b !important; }
.bg-slate-50 { background-color: #f8fafc !important; }
.bg-slate-100 { background-color: #f1f5f9 !important; }
.text-monospace { font-family: monospace; letter-spacing: 1px; }

/* Thống Kê Nhanh */
.stat-card { display: flex; align-items: center; gap: 15px; padding: 15px 25px; border-radius: 16px; border: 1px solid #e2e8f0; min-width: 200px; }
.stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.stat-title { margin: 0; font-size: 0.75rem; font-weight: 800; color: #64748b; letter-spacing: 1px; }
.stat-value { margin: 0; font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1; }

.focus-ring-custom:focus-within { box-shadow: 0 0 0 4px rgba(27, 125, 107, 0.15); border-color: #1b7d6b !important; }

/* NÚT BẤM */
.btn-gradient-primary { background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%); border: none; color: #fff; }
.custom-hover-btn { transition: all 0.3s ease; }
.custom-hover-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(27, 125, 107, 0.3) !important; color: #fff; }

/* CARD CHÍNH */
.premium-card { border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; }
.stat-box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 24px; border-radius: 12px; display: inline-block; }

/* TABLE CUSTOM */
.custom-table th { font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; padding: 1.2rem 1rem; border-bottom: 2px solid #e2e8f0; }
.custom-table td { padding: 1.25rem 1rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
.custom-table tbody tr { transition: background-color 0.2s ease; }
.custom-table tbody tr:hover { background-color: #f8fafc; }

/* AVATAR CHỮ CÁI */
.avatar-circle { width: 48px; height: 48px; background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }

/* ANIMATION */
.slide-in { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>