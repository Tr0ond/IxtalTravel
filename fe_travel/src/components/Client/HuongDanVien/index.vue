<template>
  <div style="background-color: #F4F7F6; min-height: 100vh; padding-bottom: 60px;">
    <div class="position-relative d-flex align-items-center justify-content-center" 
         style="height: 350px; background: linear-gradient(rgba(0, 0, 50, 0.6), rgba(0, 0, 50, 0.4)), url('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1920&q=80') center/cover;">
        <div class="text-center text-white z-2" style="margin-top: 50px;">
            <span class="badge bg-warning text-dark px-4 mt-1 py-3 rounded-pill mb-3 fw-bold tracking-wider" style="font-size: 13px">ĐỘI NGŨ CHUYÊN GIA</span>
            <h1 class="text-white fw-bold mb-3">Người Bạn Đồng Hành</h1>
            <p class="fs-5 opacity-75 fw-light w-75 mx-auto">Những đại sứ văn hóa nhiệt huyết, giàu kinh nghiệm sẽ mang đến cho bạn những câu chuyện chân thực nhất trên mỗi hành trình.</p>
        </div>
    </div>

    <div class="container" style="margin-top: -40px; position: relative; z-index: 10;">
        <div v-if="isLoading" class="text-center py-5 bg-white rounded-4 shadow-sm">
            <div class="spinner-border" style="color: #005baa;" role="status"></div>
            <p class="mt-2 text-muted">Đang tải danh sách chuyên gia...</p>
        </div>

        <div class="row g-4" v-else>
            <div class="col-lg-3 col-md-6" v-for="(hdv, index) in list_hdv" :key="index">
                <div class="card h-100 border-0 rounded-4 shadow-sm hdv-card overflow-hidden">
                    <div class="card-body text-center p-4">
                        <div class="avatar-wrapper mx-auto mb-4 position-relative">
                            <!-- ĐÃ CẬP NHẬT LOGIC AVATAR -->
                            <img :src="hdv.avatar ? hdv.avatar : `https://ui-avatars.com/api/?name=${hdv.ho_va_ten}&background=random&color=fff&size=150&font-size=0.33`" 
                                 class="rounded-circle shadow-sm border border-3 border-white bg-light" 
                                 width="120" height="120" style="object-fit: cover;">
                            <span class="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style="width: 20px; height: 20px;" title="Đang hoạt động"></span>
                        </div>
                        
                        <h5 class="fw-bold text-dark mb-1">{{ hdv.ho_va_ten }}</h5>
                        <p class="text-primary small fw-semibold mb-3">Tour Guide</p>
                        
                        <div class="d-flex flex-wrap justify-content-center gap-2 mb-4">
                            <span v-for="(lang, i) in (hdv.ngon_ngu || '').split(',')" :key="i" class="badge bg-light text-secondary border px-2 py-1">
                                <i class="fa-solid fa-language text-muted me-1"></i> {{ lang.trim() }}
                            </span>
                        </div>
                        
                        <hr class="text-muted opacity-25">
                        
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="text-start">
                                <small class="text-muted d-block" style="font-size: 0.7rem;">Liên hệ</small>
                                <span class="text-dark fw-medium small"><i class="fa-solid fa-phone text-success me-1"></i> {{ hdv.so_dien_thoai || 'Đang cập nhật' }}</span>
                            </div>
                            <router-link :to="`/client/chi-tiet-huong-dan-vien/${hdv.id}`" class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold hover-btn">
                                Xem Hồ Sơ
                            </router-link>
                        </div>
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
            isLoading: true,
            list_hdv: []
        }
    },
    mounted() {
        this.fetchDanhSachHDV();
    },
    methods: {
        async fetchDanhSachHDV() {
            try {
                const res = await axios.get(apiUrl('client/huong-dan-vien/danh-sach'));
                if (res.data.status) {
                    this.list_hdv = res.data.data;
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
.hdv-card {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    background: #ffffff;
}
.hdv-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
}
.avatar-wrapper img {
    transition: transform 0.4s ease;
}
.hdv-card:hover .avatar-wrapper img {
    transform: scale(1.08);
}
.hover-btn {
    transition: all 0.3s;
}
.hover-btn:hover {
    background-color: #005baa;
    color: white !important;
    transform: translateX(3px);
}
.tracking-wider {
    letter-spacing: 2px;
}
</style>