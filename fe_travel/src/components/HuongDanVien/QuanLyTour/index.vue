<template>
    <div class="tour-manager-wrapper container-fluid px-4 py-4" style="background-color: #f8fafc; min-height: 100vh;">
        
        <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
            <div>
                <h1 style="font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1.6rem; color: #0f172a; margin: 0;">Quản Lý Tour Dẫn</h1>
                <p style="font-size: .9rem; color: #64748b; margin: 4px 0 0;">Nhận việc và theo dõi các chuyến đi của bạn</p>
            </div>

            <div class="d-flex gap-2 align-items-center">
                <div class="input-group shadow-sm rounded-pill overflow-hidden bg-white search-container">
                    <span class="input-group-text bg-white border-0 text-muted ps-3"><i class="fa-solid fa-magnifying-glass"></i></span>
                    <input type="text" v-model="searchQuery" class="form-control border-0 bg-white shadow-none py-2" placeholder="Tìm tên tour...">
                </div>
                <select v-model="sortOrder" class="form-select shadow-sm rounded-pill border-0 text-dark fw-medium py-2 px-4 sort-select">
                    <option value="asc">Gần nhất trước</option>
                    <option value="desc">Xa nhất trước</option>
                </select>
            </div>
        </div>

        <div class="vip-tabs-container mb-4">
            <button @click="switchTab('trong')" :class="['vip-tab', activeTab === 'trong' ? 'active' : '']">
                <i class="fa-solid fa-box-open me-2"></i> KHO TOUR CHỜ NHẬN
                <span class="badge rounded-pill bg-danger ms-2 shadow-sm" v-if="filteredTourTrong.length > 0">{{ filteredTourTrong.length }}</span>
            </button>
            <button @click="switchTab('cua-toi')" :class="['vip-tab', activeTab === 'cua-toi' ? 'active' : '']">
                <i class="fa-solid fa-briefcase me-2"></i> TOUR CỦA TÔI
                <span class="badge rounded-pill bg-warning text-dark ms-2 shadow-sm" v-if="filteredTourCuaToi.length > 0">{{ filteredTourCuaToi.length }}</span>
            </button>
        </div>

        <div v-if="activeTab === 'trong'" class="fade-in-up">
            <div v-if="isLoading" class="text-center py-5">
                <div class="spinner-border text-primary-custom" role="status"></div>
                <p class="text-muted mt-2 fw-medium">Đang tìm kiếm tour phù hợp...</p>
            </div>
            
            <div v-else-if="filteredTourTrong.length === 0" class="empty-state shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/7466/7466140.png" width="100" class="opacity-50 mb-3 mt-2" alt="Empty">
                <h5 class="text-dark fw-bold">Không tìm thấy tour nào!</h5>
                <p class="text-muted small pb-2">Thử thay đổi từ khóa tìm kiếm hoặc quay lại sau.</p>
            </div>

            <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                <div class="col" v-for="(tour, index) in filteredTourTrong" :key="index">
                    <div class="card premium-tour-card h-100 shadow-sm border-0 bg-white">
                        <div class="card-img-wrapper position-relative">
                            <img :src="getImageUrl(getFirstImage(tour.hinh_anh)) || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'" class="card-img-top" alt="Tour Image">
                            <div class="overlay-gradient"></div>
                            <span class="badge-status bg-white text-danger shadow-sm rounded-pill px-3 py-1 fw-bold">
                                <i class="fa-solid fa-fire me-1"></i> Đang cần HDV
                            </span>
                            <div class="tour-id-badge shadow-sm">#{{ tour.id_tour || tour.id }}</div>
                        </div>
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="card-title fw-bold text-dark text-truncate-2 mb-3" :title="tour.ten_tour">{{ tour.ten_tour }}</h5>
                            
                            <div class="tour-duration-badge mb-3 text-center fw-bold rounded-3 py-2 border">
                                {{ formatDate(tour.ngay_bat_dau) }} - {{ formatDate(tour.ngay_ket_thuc) }}
                            </div>
                            
                            <ul class="list-unstyled mb-4 flex-grow-1 tour-details-list">
                                <li class="mb-2"><i class="fa-solid fa-users text-primary-custom me-2 w-15px"></i> Khách tham gia: <strong>Tối đa {{ tour.so_nguoi_toi_da }} người</strong></li>
                                <li><i class="fa-solid fa-location-dot text-primary-custom me-2 w-15px"></i> Đón khách: <span class="text-muted fw-medium">{{ tour.diem_don }}</span></li>
                            </ul>
                            
                            <button @click="nhanTour(tour.id || tour.id_tour)" class="btn btn-gradient-vip w-100 fw-bold shadow-sm custom-hover-btn py-2 text-uppercase">
                                Nhận dẫn tour này <i class="fa-solid fa-paper-plane ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'cua-toi'" class="fade-in-up">
            <div v-if="isLoading" class="text-center py-5">
                <div class="spinner-border text-primary-custom" role="status"></div>
            </div>
            
            <div v-else-if="filteredTourCuaToi.length === 0" class="empty-state shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/4371/4371216.png" width="100" class="opacity-50 mb-3 mt-2" alt="Empty">
                <h5 class="text-dark fw-bold">Bạn chưa nhận tour nào hoặc không tìm thấy kết quả</h5>
                <p class="text-muted small pb-2">Hãy kiểm tra lại từ khóa tìm kiếm hoặc nhận tour mới.</p>
            </div>

            <div v-else class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                <div class="col" v-for="(tour, index) in filteredTourCuaToi" :key="index">
                    <div class="card premium-tour-card my-tour-card h-100 shadow-sm bg-white" style="border: 2px solid #1b7d6b !important;">
                        <div class="card-img-wrapper position-relative">
                            <img :src="getImageUrl(getFirstImage(tour.hinh_anh)) || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'" class="card-img-top" alt="Tour Image">
                            <div class="overlay-gradient"></div>
                            <span class="badge-status shadow-sm rounded-pill px-3 py-1 fw-bold text-white" style="background-color: #22c55e;">
                                <i class="fa-solid fa-check-circle me-1"></i> Đã nhận
                            </span>
                            <div class="tour-id-badge shadow-sm">#{{ tour.id_tour || tour.id }}</div>
                        </div>
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="card-title fw-bold text-dark text-truncate-2 mb-3">{{ tour.ten_tour }}</h5>
                            
                            <ul class="list-unstyled mb-4 flex-grow-1 tour-details-list bg-slate-50 p-3 rounded-3 border">
                                <li class="border-bottom pb-2 mb-2 d-flex align-items-start">
                                    <i class="fa-regular fa-calendar-check text-success me-2 mt-1"></i> 
                                    <span>Lịch: <strong class="text-dark">{{ formatDate(tour.ngay_bat_dau) }} - {{ formatDate(tour.ngay_ket_thuc) }}</strong></span>
                                </li>
                                <li class="border-bottom pb-2 mb-2">
                                    <i class="fa-solid fa-people-group text-success me-2 w-15px"></i> 
                                    Khách hàng: <strong class="text-dark">{{ tour.tong_khach_da_dat || 0 }}/{{ tour.so_nguoi_toi_da }} người</strong>
                                </li>
                                <li>
                                    <i class="fa-solid fa-handshake-angle text-success me-2 w-15px"></i> 
                                    Trạng thái: <strong class="text-success">Đã xác nhận</strong>
                                </li>
                            </ul>
                            
                            <button @click="goToSchedule(tour)" class="btn btn-outline-success bg-white w-100 fw-bold custom-hover-btn py-2 text-uppercase">
                                Xem lịch trình <i class="fa-solid fa-arrow-right-long ms-1"></i>
                            </button>
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
            activeTab: 'trong', 
            listTourTrong: [],
            listTourCuaToi: [],
            isLoading: false,
            searchQuery: '',
            sortOrder: 'asc'
        }
    },
    computed: {
        filteredTourTrong() {
            return this.processData(this.listTourTrong);
        },
        filteredTourCuaToi() {
            return this.processData(this.listTourCuaToi);
        }
    },
    mounted() {
        this.loadTourTrong();
        this.loadTourCuaToi(); 
    },
    methods: {
        // HÀM MỚI: Xử lý bóc tách mảng JSON để lấy ảnh đầu tiên của Tour
        getFirstImage(hinh_anh) {
        if (!hinh_anh) return '';
        let imgStr = hinh_anh;

        try {
            // Cố gắng dịch ngược chuỗi JSON mảng
            let parsed = JSON.parse(hinh_anh);
            if (Array.isArray(parsed) && parsed.length > 0) {
            imgStr = parsed[0];
            }
        } catch (e) {
            // Dự phòng nếu chuỗi không chuẩn JSON (loại bỏ dấu ngoặc vuông và nháy kép)
            if (typeof hinh_anh === 'string') {
            imgStr = hinh_anh.replace(/[\[\]"]/g, '').split(',')[0];
            }
        }

        // Xóa đuôi kích thước ảnh mờ (như -450x265) để lấy ảnh nét nhất
        if (typeof imgStr === 'string') {
            return imgStr.replace(/-\d+x\d+/g, '').trim();
        }

        return imgStr;
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
        processData(list) {
            let result = [...list];
            if (this.searchQuery.trim() !== '') {
                const q = this.searchQuery.toLowerCase();
                result = result.filter(tour => tour.ten_tour.toLowerCase().includes(q));
            }
            result.sort((a, b) => {
                const dateA = new Date(a.ngay_bat_dau).getTime();
                const dateB = new Date(b.ngay_bat_dau).getTime();
                return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
            return result;
        },
        getHeaders() { return { Authorization: "Bearer " + localStorage.getItem("key_hdv") }; },
        switchTab(tab) {
            this.activeTab = tab;
            this.searchQuery = ''; 
            if (tab === 'trong' && this.listTourTrong.length === 0) this.loadTourTrong();
            if (tab === 'cua-toi' && this.listTourCuaToi.length === 0) this.loadTourCuaToi();
        },
        formatDate(dateString) {
            if (!dateString) return "...";
            return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
        },
        // Chuyển sang trang Lịch Trình kèm theo Param
        goToSchedule(tour) {
            this.$router.push({
                path: '/huong-dan-vien/lich-trinh',
                query: { 
                    targetDate: tour.ngay_bat_dau, 
                    expandId: tour.id_tour || tour.id 
                }
            });
        },
        loadTourTrong() {
            this.isLoading = true;
            axios.get(apiUrl('huong-dan-vien/quan-ly-tour/tour-trong'), { headers: this.getHeaders() })
                .then(res => { if (res.data.status) this.listTourTrong = res.data.data; })
                .catch(err => console.error(err))
                .finally(() => this.isLoading = false);
        },
        loadTourCuaToi() {
            this.isLoading = true;
            axios.get(apiUrl('huong-dan-vien/quan-ly-tour/tour-cua-toi'), { headers: this.getHeaders() })
                .then(res => { if (res.data.status) this.listTourCuaToi = res.data.data; })
                .catch(err => console.error(err))
                .finally(() => this.isLoading = false);
        },
        nhanTour(id_tour) {
            if(confirm("Xác nhận nhận Tour này? Việc này đồng nghĩa bạn cam kết hoàn thành lịch trình.")) {
                axios.post(apiUrl('huong-dan-vien/quan-ly-tour/nhan-tour'), { id_tour: id_tour }, { headers: this.getHeaders() })
                    .then(res => {
                        if (res.data.status) {
                            this.$toast.success(res.data.message);
                            this.loadTourTrong(); 
                            this.loadTourCuaToi();
                            this.switchTab('cua-toi'); 
                        } else {
                            this.$toast.error(res.data.message);
                        }
                    })
                    .catch(err => this.$toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!"));
            }
        }
    }
}
</script>

<style scoped>
.text-primary-custom { color: #1b7d6b !important; }
.bg-slate-50 { background-color: #f8fafc !important; }
.w-15px { width: 18px; text-align: center; }

.search-container { border: 1px solid #e2e8f0; width: 280px; }
.search-container:focus-within { border-color: #1b7d6b; box-shadow: 0 0 0 3px rgba(27,125,107,0.1) !important; }
.sort-select { background-color: #ffffff; cursor: pointer; border: 1px solid #e2e8f0 !important; }
.sort-select:focus { border-color: #1b7d6b !important; box-shadow: 0 0 0 3px rgba(27,125,107,0.1) !important; }

.empty-state { text-align: center; padding: 50px 20px; background: #ffffff; border-radius: 20px; }

/* VIP TABS */
.vip-tabs-container { display: flex; background: #ffffff; padding: 8px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); gap: 10px; border: 1px solid #e2e8f0; }
.vip-tab { flex: 1; border: none; background: transparent; padding: 14px 20px; border-radius: 12px; font-weight: 700; color: #64748b; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
.vip-tab.active { background: #1b7d6b; color: #ffffff; box-shadow: 0 4px 12px rgba(27, 125, 107, 0.3); }

/* CARDS */
.premium-tour-card { border-radius: 20px; transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); overflow: hidden; }
.premium-tour-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.12) !important; }

.card-img-wrapper { height: 210px; overflow: hidden; border-radius: 20px 20px 0 0; }
.card-img-top { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.premium-tour-card:hover .card-img-top { transform: scale(1.1); }
.overlay-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%); }

.badge-status { position: absolute; top: 16px; left: 16px; font-size: 0.85rem; z-index: 2; }
.tour-id-badge { position: absolute; top: 16px; right: 16px; padding: 6px 14px; border-radius: 10px; font-weight: 800; font-size: 0.9rem; background: rgba(0,0,0,0.65); color: white; z-index: 2; backdrop-filter: blur(4px); }

/* KHẮC PHỤC LỖI CẮT CHỮ: Bỏ height cố định, dùng line-height chuẩn */
.text-truncate-2 { 
    display: -webkit-box; 
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical; 
    overflow: hidden; 
    line-height: 1.5;
    min-height: 3em; /* Đảm bảo luôn giữ form 2 dòng dù text ngắn */
}
.tour-duration-badge { color: #1b7d6b; background: #e6f9ef; border-color: #bbf7d0 !important; font-size: 0.95rem; }
.tour-details-list li { font-size: 0.95rem; color: #475569; }

/* NÚT BẤM */
.btn-gradient-vip { background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%); color: #fff; border: none; border-radius: 12px; }
.btn-outline-success { border: 2px solid #1b7d6b !important; color: #1b7d6b !important; border-radius: 12px; }
.btn-outline-success:hover { background-color: #1b7d6b !important; color: #fff !important; }

.custom-hover-btn { transition: all 0.3s ease; }
.custom-hover-btn:hover { box-shadow: 0 8px 20px rgba(27, 125, 107, 0.3) !important; transform: translateY(-3px); }

/* ANIMATION */
.fade-in-up { animation: fadeInUp 0.4s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 576px) { .vip-tabs-container { flex-direction: column; } }
</style>