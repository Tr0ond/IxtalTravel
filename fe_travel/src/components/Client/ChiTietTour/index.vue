<template>
    <div class="container">
        <h1 class="mt-3" style="color: rgb(143, 223, 181)">{{ chi_tiet_tour.ten_tour }}</h1>

        <div class="row mb-3">
            <div class="col-lg-12">
                <span>Ngày khởi hành: {{ formatDate(chi_tiet_tour.ngay_bat_dau) }}</span>
                <span class=" ms-4">Khởi hành từ: {{ chi_tiet_tour.diem_don }}</span>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-7">
                <div class="position-relative mb-4" style="overflow: hidden; border-radius: 15px; cursor: pointer;"
                    @click="openModal(getImageUrl(getFirstImage(chi_tiet_tour.hinh_anh)))">
                    <img style="width: 100%; height: 320px; object-fit: cover;"
                        :src="getImageUrl(getFirstImage(chi_tiet_tour.hinh_anh))" alt="Ảnh tour"
                        class="shadow-sm hover-zoom w-100">
                </div>
                <div class="card mb-4 border-0 shadow-sm" style="border-radius: 15px;" ref="tourDescription">
                    <div class="card-body">
                        

                        <div class="position-relative" style="transition: max-height 0.5s ease; overflow: hidden;"
                            :style="{ maxHeight: is_expanded_mo_ta ? '5000px' : '260px' }">

                            <div class="text-secondary mo-ta-html"
                                v-html="(chi_tiet_tour.mo_ta || '').replace(/<img /g, '<img style=\'max-width:100%;height:auto;display:block;margin:10px auto;border-radius:8px\' ')">
                            </div>

                            <div v-if="!is_expanded_mo_ta" class="fade-overlay"></div>
                        </div>

                        <div class="text-center mt-3">
                            <button @click="toggleMoTa" class="btn btn-sm rounded-pill px-4 fw-bold shadow-sm"
                                style="color: #198754; border: 2px solid #198754; background: white; transition: 0.3s;">
                                {{ is_expanded_mo_ta ? 'Thu gọn' : 'Đọc thêm' }}
                                <i :class="is_expanded_mo_ta ? 'fa-chevron-up' : 'fa-chevron-down'"
                                    class="fa-solid ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm mb-4" style="border-radius: 15px;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3 class="fw-bold mb-0">Chương trình tour</h3>
                            <button @click="toggleOpenAll" class="btn btn-link text-decoration-none fw-bold p-0"
                                style="color: rgb(143, 223, 181)">
                                {{ is_open_all ? 'Thu gọn' : 'Xem tất cả' }}
                            </button>
                        </div>
                        <div v-for="(item, index) in chi_tiet_tour.lich_trinh" :key="index" class="border-bottom py-3">
                            <div @click="toggleSingle(index)" class="d-flex align-items-center justify-content-between"
                                style="cursor: pointer;">
                                <div class="d-flex align-items-center">
                                    <img v-if="!index_mo.includes(index) && !is_open_all"
                                        :src="getImageUrl(getFirstImage(item.hinh_anh)) || 'https://via.placeholder.com/80x60?text=No+Image'"
                                        style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;"
                                        class="me-3">
                                    <div>
                                        <p class="text-primary mb-0 fw-bold">{{ item.thoi_gian }}</p>
                                        <h6 class="mb-0 fw-bold">{{ item.ten_diem_den }}</h6>
                                    </div>
                                </div>
                                <i :class="(index_mo.includes(index) || is_open_all) ? 'fa-chevron-up' : 'fa-chevron-down'"
                                    class="fa-solid text-secondary"></i>
                            </div>

                            <div v-if="index_mo.includes(index) || is_open_all"
                                class="mt-3 animate__animated animate__fadeIn">
                                <img :src="getImageUrl(getFirstImage(item.hinh_anh)) || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'"
                                    class="img-fluid rounded-3 mb-3"
                                    style="width: 100%; max-height: 300px; object-fit: cover;">

                                <div class="text-secondary mo-ta-html"
                                    v-html="(item.mo_ta || '').replace(/<img /g, '<img style=\'max-width:100%;height:auto;display:block;margin:10px auto;border-radius:8px\' ')">
                                </div>

                                <div v-if="item.loai_phuong_tien" class="mt-2">
                                    <span class="badge bg-light text-dark border">
                                        <i class="fa-solid fa-bus me-1"></i> {{ item.loai_phuong_tien }}
                                    </span>
                                </div>
                                <div v-else class="mt-2">
                                    <span class="badge bg-light text-dark border">
                                        <i class="fa-solid fa-person-walking me-1"></i> Tự túc / Đi bộ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm mb-4" style="border-radius: 15px; border: none; overflow: hidden;">
                    <div @click="is_policy_open = !is_policy_open"
                        style="cursor: pointer; padding: 20px; display: flex; justify-content: space-between; align-items: center; background-color: #fff;">
                        <h3 style="font-weight: 700; margin-bottom: 0; font-size: 1.5rem; color: #212529;">Điều khoản &
                            lưu ý</h3>
                        <i :class="is_policy_open ? 'fa-chevron-up' : 'fa-chevron-down'"
                            style="color: #6c757d; font-size: 1.2rem;" class="fa-solid"></i>
                    </div>

                    <div v-if="is_policy_open" style="padding: 0 20px 20px 20px; background-color: #fff;">
                        <hr style="margin-top: 0; border-top: 1px solid #eee;">

                        <div style="margin-bottom: 25px;">
                            <h5 style="font-weight: 700; color: #0d6efd; margin-bottom: 15px;">
                                <i class="fa-solid fa-child" style="margin-right: 10px;"></i>Chính sách trẻ em
                            </h5>
                            <div style="padding-left: 20px; color: #495057;">
                                <p style="font-weight: 600; margin-bottom: 8px;">1. Quy định chung:</p>
                                <ul style="padding-left: 20px; line-height: 1.8;">
                                    <li>Mỗi 02 người lớn được kèm 01 trẻ em.</li>
                                    <li>Từ trẻ thứ 02 trở đi, áp dụng mức giá theo quy định của từng nhóm tuổi.</li>
                                    <li>Trẻ em ngủ chung giường với bố mẹ.</li>
                                </ul>
                                <p style="font-weight: 600; margin-bottom: 8px; margin-top: 15px;">2. Quy định theo độ
                                    tuổi:</p>
                                <ul style="padding-left: 20px; line-height: 1.8;">
                                    <li><span style="font-weight: 600;">Dưới 2 tuổi:</span> Giá theo website. Ngủ chung
                                        giường với bố mẹ.</li>
                                    <li><span style="font-weight: 600;">Từ 2 - 10 tuổi:</span> Giá theo website. Bao gồm
                                        đầy đủ dịch vụ chương trình.</li>
                                    <li><span style="font-weight: 600;">Từ 10 tuổi trở lên:</span> Tính 100% giá người
                                        lớn.</li>
                                </ul>
                            </div>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h5 style="font-weight: 700; color: #dc3545; margin-bottom: 15px;">
                                <i class="fa-solid fa-calendar-xmark" style="margin-right: 10px;"></i>Chính sách hủy &
                                thay đổi
                            </h5>
                            <div style="padding-left: 20px; color: #495057;">
                                <div
                                    style="display: grid; grid-template-columns: 200px 1fr; gap: 10px; line-height: 2;">
                                    <span>Trước khởi hành 90 ngày:</span> <span
                                        style="font-weight: 700;">5.000.000đ/khách</span>
                                    <span>Từ 45 - 89 ngày:</span> <span
                                        style="font-weight: 700;">15.000.000đ/khách</span>
                                    <span>Từ 30 - 44 ngày:</span> <span style="font-weight: 700;">50% tổng giá
                                        tour</span>
                                    <span>Từ 15 - 19 ngày:</span> <span style="font-weight: 700;">100% tổng giá
                                        tour</span>
                                </div>
                                <p style="margin-top: 10px; font-style: italic; font-size: 0.9rem; color: #6c757d;">
                                    * Lễ, Tết không hoàn, hủy, đổi: mất 100% giá trị tour.
                                </p>
                            </div>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h5 style="font-weight: 700; color: #0dcaf0; margin-bottom: 15px;">
                                <i class="fa-solid fa-passport" style="margin-right: 10px;"></i>Thông tin Visa
                            </h5>
                            <ul style="padding-left: 40px; color: #495057; line-height: 1.8;">
                                <li>Scan mặt hộ chiếu còn hạn trên 6 tháng.</li>
                                <li>File ảnh 3,5 x 4,5 nền phông trắng, không đeo kính.</li>
                                <li>Nộp hồ sơ ít nhất 15 ngày trước khởi hành.</li>
                            </ul>
                        </div>

                        <div
                            style="background-color: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 5px solid #0d6efd;">
                            <p style="margin-bottom: 0; color: #6c757d; font-size: 0.95rem;">
                                <i class="fa-solid fa-circle-info" style="margin-right: 8px;"></i>
                                HDV sẽ liên lạc khoảng 2 ngày trước khởi hành để sắp xếp giờ đón.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <div class="col-lg-5">
                <div class="row">
                    <div v-for="(img, index) in list_hinh_anh" :key="index" class="col-lg-6 mb-3 position-relative"
                        @click="openModal(img.url)" style="cursor: pointer;">

                        <img :src="img.url" class="img-fluid rounded shadow-sm hover-zoom"
                            style="width: 100%; height: 150px; object-fit: cover;">

                        <div v-if="img.is_more"
                            class="position-absolute top-0 start-0 w-100 h-100 rounded d-flex align-items-center justify-content-center hover-overlay hover-zoom"
                            style="background: rgba(0,0,0,0.6); margin-left: 12px; width: calc(100% - 24px) !important; transition: all 0.3s;">
                            <span class="text-white fw-bold fs-5"><i class="fa-solid fa-images me-1 "></i> Khám phá
                                thêm</span>
                        </div>

                    </div>
                </div>

                <div class="card shadow-sm border-0"
                    style="border-radius: 15px; position: -webkit-sticky; position: sticky; top: 20px; z-index: 100;">
                    <div class="card-body">
                        <h4 class="fw-bold mb-3 text-dark">Đặt Tour</h4>
                        <hr>

                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-secondary">Giá tour:</span>
                            <span class="fw-bold text-danger fs-5">
                                {{ new Intl.NumberFormat('vi-VN', {
                                    style: 'currency', currency: 'VND'
                                }).format(chi_tiet_tour.gia) }}
                            </span>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold mb-2 text-dark">Số lượng khách:</label>
                            <div class="d-flex align-items-center">
                                <div class="input-group custom-qty-group shadow-sm">
                                    <button class="btn btn-qty" type="button" @click="giamSoLuong">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <input type="number" class="form-control text-center fw-bold input-qty"
                                        v-model.number="dat_tour.so_luong_nguoi" @blur="validateSoLuong">
                                    <button class="btn btn-qty" type="button" @click="tangSoLuong">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                <span class="ms-3 text-muted fw-medium" v-if="chi_tiet_tour.so_nguoi_toi_da"
                                    style="font-size: 0.9rem;">
                                    (Còn trống <strong class="text-danger">{{ chi_tiet_tour.so_nguoi_toi_da }}</strong>
                                    chỗ)
                                </span>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="fw-bold mb-1">
                                Thông tin người đi cùng
                                <span v-if="dat_tour.so_luong_nguoi >= 2" class="text-danger">* (Bắt buộc)</span>
                            </label>
                            <textarea class="form-control" rows="4" v-model="dat_tour.ghi_chu_danh_sach_nguoi_di"
                                placeholder="Ví dụ: &#10;Nguyễn Văn A, 0922222222, 27/05/1990 &#10;Trần Thị B, 0911111111, 10/02/1995"></textarea>
                            <div class="form-text text-muted">
                                <i class="fa-solid fa-circle-info me-1"></i>
                                Vui lòng nhập mỗi người một dòng theo định dạng: <b>Họ tên, Số điện thoại, Ngày
                                    sinh</b>.
                            </div>
                        </div>

                        <div class="p-3 mb-3" style="background-color: #f8f9fa; border-radius: 10px;">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">Tổng cộng:</span>
                                <h4 class="fw-bold mb-0" style="color: #198754;">
                                    {{ new Intl.NumberFormat('vi-VN', {
                                        style: 'currency', currency: 'VND'
                                    }).format(chi_tiet_tour.gia * dat_tour.so_luong_nguoi) }}
                                </h4>
                            </div>
                        </div>

                        <button class="btn w-100 fw-bold py-3 text-white shadow-sm" :disabled="is_loading" :style="{
                            background: is_loading ? '#ccc' : 'linear-gradient(135deg, #8fdfb5, #5bb883)',
                            borderRadius: '10px',
                            border: 'none',
                            transition: '0.3s',
                            cursor: is_loading ? 'not-allowed' : 'pointer'
                        }" @mouseover="!is_loading && ($event.target.style.background = 'linear-gradient(135deg, #78c9a0, #4da374)')"
                            @mouseleave="!is_loading && ($event.target.style.background = 'linear-gradient(135deg, #8fdfb5, #5bb883)')"
                            @click="thucHienDatTour()">
                            {{ is_loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT TOUR' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-lg-12 mt-4 review-section">
                <h3 class="review-main-title">Đánh giá khách hàng</h3>

                <div v-if="ds_danh_gia.length > 0" class="review-summary-box">
                    <div class="review-score-box">
                        <div class="review-score-number">{{ averageRating }}</div>
                        <div class="review-score-stars">
                            <i v-for="star in 5" :key="star" class="fa-star"
                                :class="star <= Math.floor(averageRatingNumber) ? 'fa-solid' : 'fa-regular'"></i>
                        </div>
                        <div class="review-total-text">{{ ds_danh_gia.length }} đánh giá</div>
                    </div>

                    <div class="review-rating-bars">
                        <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="review-bar-row"
                            :class="{ active: Number(filterStar) === Number(star) }"
                            @click="chonLocSao(star)">
                            <div class="review-bar-label">
                                {{ star }} <i class="fa-solid fa-star"></i>
                            </div>
                            <div class="review-progress">
                                <div class="review-progress-fill" :style="{ width: ratingPercent(star) + '%' }"></div>
                            </div>
                            <div class="review-percent">{{ ratingPercent(star) }}%</div>
                        </div>
                    </div>
                </div>

                <div v-if="filteredDanhGia.length > 0" class="review-list">
                    <div v-for="(v, k) in filteredDanhGia" :key="k" class="review-card">
                        <div class="review-avatar-wrap">
                            <img v-if="v.avatar" :src="v.avatar" class="review-avatar-img" alt="avatar">
                            <div v-else class="review-avatar-text">{{ reviewInitials(v.ho_va_ten) }}</div>
                        </div>

                        <div class="review-content">
                            <div class="review-head">
                                <div>
                                    <h6 class="review-name">{{ v.ho_va_ten || 'Khách hàng' }}</h6>
                                    <div class="review-stars-line">
                                        <i v-for="star in 5" :key="star" class="fa-star"
                                            :class="star <= Number(v.sao_danh_gia || 0) ? 'fa-solid' : 'fa-regular'"></i>
                                       
                                    </div>
                                </div>
                                <div class="review-date">{{ formatDate(v.created_at) }}</div>
                            </div>

                            <h6 class="review-title">{{ reviewTitle(v) }}</h6>
                            <p class="review-desc">
                                {{ v.noi_dung || 'Khách hàng không để lại bình luận.' }}
                            </p>

                            <button type="button" class="review-helpful-btn">
                                <i class="fa-regular fa-message"></i>
                                Hữu ích ({{ v.so_luot_huu_ich || v.huu_ich || 0 }})
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else class="review-empty-box">
                    <i class="fa-solid fa-comments"></i>
                    <p>
                        {{ filterStar === 'all' ? 'Chưa có đánh giá nào cho tour này. Hãy là người đầu tiên trải nghiệm!' : 'Không có đánh giá '+ filterStar + ' sao nào.' }}
                    </p>
                </div>
            </div>

            <div class="col-lg-12 mt-5 related-tour-section" v-if="filteredTourKhac && filteredTourKhac.length > 0">
                <div class="related-tour-head">
                    <div>
                        <p class="related-tour-subtitle">Gợi ý cho bạn</p>
                        <h3 class="related-tour-heading">Các tour khác bạn có thể thích</h3>
                    </div>
                </div>

                <div class="no-scrollbar track-container related-tour-track">
                    <div v-for="(value, index) in filteredTourKhac" :key="index" class="tour-poster hover-scale-img"
                        data-aos="fade-up" :data-aos-delay="index * 100"
                        @click="$router.push('/client/chi-tiet-tour/' + value.id)">
                        <img :src="getImageUrl(getFirstImage(value.hinh_anh))" :alt="value.ten_tour" class="tour-img" />
                        <div class="tour-overlay"></div>
                        <span class="tour-badge badge-primary">Còn {{ value.so_nguoi_toi_da }} chỗ</span>

                        <div class="tour-info">
                            <p class="tour-pickup">📍 Đón tại: {{ value.diem_don }}</p>
                            <h3 class="tour-title">{{ value.ten_tour }}</h3>

                            <div class="tour-meta-row">
                                <div>
                                    <div class="tour-rating-line">
                                        <span class="tour-stars"
                                            v-html="renderStars(value.avg_sao || value.sao_trung_binh || value.sao_danh_gia || 0)"></span>
                                        <span class="tour-rating-text">
                                            {{ Number(value.avg_sao || value.sao_trung_binh || value.sao_danh_gia || 0).toFixed(1) }}
                                            ({{ value.so_luot_danh_gia || value.so_danh_gia || 0 }})
                                        </span>
                                    </div>
                                    <span class="tour-price">{{ formatCurrency(value.gia) }}</span>
                                </div>
                                <span class="tour-duration">{{ formatDate(value.ngay_bat_dau) }}</span>
                            </div>

                            <div class="cta-reveal">
                                <button class="view-details-btn" @click.stop="$router.push('/client/chi-tiet-tour/' + value.id)">
                                    Xem Chi Tiết →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="show_modal_anh" class="modal-lightbox" @click.self="closeModal" tabindex="0"
            @keydown.left.prevent="prevImage" @keydown.right.prevent="nextImage">
            <button class="lightbox-close" @click="closeModal" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="lightbox-inner">
                <button class="lightbox-prev" @click="prevImage" v-if="all_images.length > 1" aria-label="Previous">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <div class="lightbox-frame animate__animated animate__zoomIn animate__faster">
                    <img :src="all_images[current_image_index]" alt="Zoomed Image" class="lightbox-img">
                    <div class="lightbox-counter text-white text-center">{{ current_image_index + 1 }} / {{
                        all_images.length }}
                    </div>
                </div>

                <button class="lightbox-next" @click="nextImage" v-if="all_images.length > 1" aria-label="Next">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            <div class="lightbox-thumbnails">
                <div class="thumb" v-for="(img, idx) in all_images" :key="idx" @click.stop="current_image_index = idx">
                    <img :src="img" :class="['thumb-img', { 'active': idx === current_image_index }]" alt="thumb">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api';

export default {
    props: ["id_tour"],
    data() {
        return {
            id: this.$route.params.id_tour,
            chi_tiet_tour: {},
            list_tour_khac: [],
            ds_danh_gia: [],
            list_hinh_anh: [],
            all_images: [],
            show_modal_anh: false,
            current_image_index: 0,
            index_mo: [],
            is_open_all: false,
            is_policy_open: false,
            dat_tour: {
                so_luong_nguoi: 1,
                ghi_chu_danh_sach_nguoi_di: '',
                phuong_thuc_thanh_toan: 'Chuyển khoản'
            },
            filterStar: 'all',
            is_expanded_mo_ta: false,
            open_scroll_y: 0,
            is_loading: false,
        }
    },

    // =========================================================================
    // LẮNG NGHE SỰ THAY ĐỔI VÀ VÒNG ĐỜI COMPONENT
    // =========================================================================

    watch: {
        /**
         * Lắng nghe sự thay đổi của id_tour trên thanh URL.
         * Cách thức: Khi người dùng click sang một tour khác (cùng route nhưng khác id),
         * biến newId sẽ nhận giá trị mới, ta cập nhật lại id, gọi API tải lại dữ liệu và cuộn lên đầu trang.
         */
        '$route.params.id_tour': function (newId) {
            this.id = newId;
            this.filterStar = 'all';
            this.LoadTour();
            this.layDanhSachDanhGia();
            this.scrollToTop();
        },
        current_image_index(newIndex) {
            this.scrollToActiveThumbnail(newIndex);
        }
    },
    mounted() {
        /**
         * Chạy ngay khi component được nạp vào DOM.
         * Cách thức: Gọi API lấy dữ liệu tour, lấy đánh giá và gắn sự kiện lắng nghe thao tác cuộn chuột (scroll) để xử lý phần mô tả.
         */
        this.LoadTour();
        this.layDanhSachDanhGia();
        window.addEventListener('scroll', this.handleScrollMoTa);

    },
    unmounted() {
        /**
         * Chạy khi component bị hủy (người dùng chuyển sang trang khác).
         * Cách thức: Dọn dẹp sự kiện cuộn chuột để tránh rò rỉ bộ nhớ (memory leak) và trả lại thanh cuộn mặc định cho body.
         */
        window.removeEventListener('scroll', this.handleScrollMoTa);
        document.body.style.overflow = '';
    },

    // =========================================================================
    // DỮ LIỆU ĐƯỢC TÍNH TOÁN TỰ ĐỘNG
    // =========================================================================

    computed: {
        /**
         * Lọc danh sách đánh giá theo số sao.
         * Cách thức: Dựa vào biến filterStar, nếu là 'all' thì trả về toàn bộ mảng ds_danh_gia. 
         * Nếu là số (1-5), dùng hàm filter() của mảng để giữ lại các đánh giá có sao khớp với filterStar.
         */
        filteredDanhGia() {
            if (this.filterStar === 'all') {
                return this.ds_danh_gia;
            }
            return this.ds_danh_gia.filter(item => Number(item.sao_danh_gia) === Number(this.filterStar));
        },
        averageRatingNumber() {
            if (!this.ds_danh_gia.length) return 0;
            const total = this.ds_danh_gia.reduce((sum, item) => sum + Number(item.sao_danh_gia || 0), 0);
            return total / this.ds_danh_gia.length;
        },
        averageRating() {
            return this.averageRatingNumber.toFixed(1);
        },
        filteredTourKhac() {
            // 1. Kiểm tra an toàn dữ liệu đầu vào
            if (!this.chi_tiet_tour || !this.list_tour_khac || !Array.isArray(this.list_tour_khac)) {
                return [];
            }

            // Lấy ID quốc gia hiện tại (Việt Nam có ID = 1)
            const currentQuocGiaId = Number(this.chi_tiet_tour.id_quoc_gia);
            const currentTourId = Number(this.chi_tiet_tour.id);

            // 2. Loại bỏ tour đang xem hiện tại và các tour bị khóa
            let danhSachHople = this.list_tour_khac.filter(tour => {
                return Number(tour.id) !== currentTourId && tour.tinh_trang != 0;
            });

            // 3. Tiến hành lọc NGHIÊM NGẶT theo Vùng / Nước
            let ketQuaLoc = danhSachHople.filter(tour => {
                const tourQuocGiaId = Number(tour.id_quoc_gia);
                
                if (currentQuocGiaId === 1) {
                    // Nếu đang xem tour Việt Nam -> CHỈ lấy tour Việt Nam
                    return tourQuocGiaId === 1;
                } else {
                    // Nếu đang xem tour Nước ngoài -> CHỈ lấy tour Nước ngoài (khác 1)
                    return tourQuocGiaId !== 1;
                }
            });

            // Trả về tối đa 3 tour để hiển thị đẹp nhất
            return ketQuaLoc.slice(0, 3);
        }
    },
    methods: {
        chonLocSao(star) {
            if (Number(this.filterStar) === Number(star)) {
                this.filterStar = 'all';
            } else {
                this.filterStar = star;
            }
        },

        // =========================================================================
        // CHỨC NĂNG: QUẢN LÝ TRÌNH XEM ẢNH FULL MÀN HÌNH (LIGHTBOX)
        // =========================================================================

        /**
         * Mở modal xem ảnh phóng to.
         * Cách thức: Nhận vào URL ảnh được click, tìm vị trí (index) của ảnh đó trong mảng all_images bằng indexOf.
         * Cập nhật current_image_index để hiển thị đúng ảnh, bật cờ show_modal_anh và khóa cuộn chuột (overflow = 'hidden').
         */
        openModal(imgUrl) {
            const index = this.all_images.indexOf(imgUrl);
            this.current_image_index = index !== -1 ? index : 0;
            this.show_modal_anh = true;
            document.body.style.overflow = 'hidden';
        },

        /**
         * Đóng modal xem ảnh.
         * Cách thức: Tắt cờ show_modal_anh và mở khóa thanh cuộn chuột của trang web.
         */
        closeModal() {
            this.show_modal_anh = false;
            document.body.style.overflow = '';
        },

        /**
         * Chuyển sang ảnh tiếp theo.
         * Cách thức: Kiểm tra nếu index hiện tại chưa phải là ảnh cuối cùng thì cộng thêm 1.
         * Nếu đang ở ảnh cuối thì vòng lại ảnh đầu tiên (index = 0).
         */
        nextImage() {
            if (this.current_image_index < this.all_images.length - 1) {
                this.current_image_index++;
            } else {
                this.current_image_index = 0;
            }
        },

        /**
         * Lùi về ảnh trước đó.
         * Cách thức: Kiểm tra nếu index > 0 thì trừ đi 1.
         * Nếu đang ở ảnh đầu tiên thì vòng lại ảnh cuối cùng trong mảng.
         */
        prevImage() {
            if (this.current_image_index > 0) {
                this.current_image_index--;
            } else {
                this.current_image_index = this.all_images.length - 1;
            }
        },
        /**
         * Tự động cuộn thanh Thumbnail để ảnh đang xem luôn hiển thị (và nằm giữa)
         */
        scrollToActiveThumbnail(index) {
            this.$nextTick(() => {
                const thumbs = this.$el.querySelectorAll('.lightbox-thumbnails .thumb');
                if (thumbs && thumbs[index]) {
                    
                    thumbs[index].scrollIntoView({
                        behavior: 'smooth', 
                        block: 'nearest',   
                        inline: 'center'    
                    });
                }
            });
        },

        // =========================================================================
        // CHỨC NĂNG: QUẢN LÝ SỐ LƯỢNG KHÁCH ĐẶT TOUR
        // =========================================================================

        /**
         * Giảm số lượng người đặt tour.
         * Cách thức: Kiểm tra nếu số lượng lớn hơn 1 thì mới cho phép giảm đi 1, đảm bảo luôn có ít nhất 1 người.
         */
        giamSoLuong() {
            if (this.dat_tour.so_luong_nguoi > 1) {
                this.dat_tour.so_luong_nguoi--;
            }
        },

        /**
         * Tăng số lượng người đặt tour.
         * Cách thức: Kiểm tra nếu số lượng hiện tại nhỏ hơn số người tối đa của tour thì cho phép tăng.
         * Nếu vượt quá, hiển thị thông báo toast cảnh báo không đủ chỗ.
         */
        tangSoLuong() {
            if (this.dat_tour.so_luong_nguoi < this.chi_tiet_tour.so_nguoi_toi_da) {
                this.dat_tour.so_luong_nguoi++;
            } else {
                this.$toast.warning("Tour này chỉ còn " + this.chi_tiet_tour.so_nguoi_toi_da + " chỗ trống!");
            }
        },

        /**
         * Kiểm tra (validate) giá trị nhập tay vào ô số lượng.
         * Cách thức: Chuyển dữ liệu người dùng nhập thành số nguyên. 
         * Nếu nhập sai (chữ, số âm, < 1) thì reset về 1.
         * Nếu nhập số lớn hơn số chỗ còn trống thì gán bằng số chỗ trống và báo lỗi.
         * Nếu hợp lệ thì gán đúng giá trị đó.
         */
        validateSoLuong() {
            let val = parseInt(this.dat_tour.so_luong_nguoi);
            if (isNaN(val) || val < 1) {
                this.dat_tour.so_luong_nguoi = 1;
            } else if (val > this.chi_tiet_tour.so_nguoi_toi_da) {
                this.dat_tour.so_luong_nguoi = this.chi_tiet_tour.so_nguoi_toi_da;
                this.$toast.warning("Tour này chỉ còn " + this.chi_tiet_tour.so_nguoi_toi_da + " chỗ trống!");
            } else {
                this.dat_tour.so_luong_nguoi = val;
            }
        },

        // =========================================================================
        // CHỨC NĂNG: XỬ LÝ VÀ ĐỊNH DẠNG HÌNH ẢNH
        // =========================================================================

        /**
         * Lấy ảnh đầu tiên từ một mảng hoặc chuỗi JSON hình ảnh.
         * Cách thức: Nếu đầu vào rỗng, trả về ảnh mặc định.
         * Nếu là mảng chuẩn, lấy phần tử [0].
         * Nếu là chuỗi JSON, dùng try-catch để parse thành mảng và lấy [0]. Nếu lỗi parse, trả về nguyên bản chuỗi đó.
         */
        getFirstImage(hinh_anh) {
            if (!hinh_anh) return 'https://via.placeholder.com/400x300?text=No+Image';
            if (Array.isArray(hinh_anh)) {
                return hinh_anh.length > 0 ? hinh_anh[0] : 'https://via.placeholder.com/400x300';
            }
            try {
                let parsed = JSON.parse(hinh_anh);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) {
                return hinh_anh;
            }
        },

        /**
         * Xóa định dạng kích thước khỏi URL ảnh (nếu có) để lấy ảnh gốc rõ nét.
         * Cách thức: Dùng biểu thức chính quy (Regex) tìm mẫu "-[số]x[số]" (vd: -400x300) và thay thế bằng chuỗi rỗng.
         */
        getImageUrl(url) {
            if (!url) return 'https://via.placeholder.com/400x300';
            return url.replace(/-\d+x\d+/g, '');
        },

        // =========================================================================
        // CHỨC NĂNG: XỬ LÝ GIAO DIỆN MÔ TẢ & LỊCH TRÌNH
        // =========================================================================

        /**
         * Ẩn/Hiện đoạn text mô tả dài của tour.
         * Cách thức: Đảo ngược trạng thái is_expanded_mo_ta (đóng/mở).
         * Nếu mở, lưu lại vị trí cuộn trang hiện tại (open_scroll_y).
         * Nếu đóng, tính toán tọa độ của vùng mô tả (ref tourDescription) và tự động cuộn màn hình mượt mà (smooth) về đó để không bị giật trang.
         */
        toggleMoTa() {
            this.is_expanded_mo_ta = !this.is_expanded_mo_ta;
            if (this.is_expanded_mo_ta) {
                this.open_scroll_y = window.scrollY;
            } else {
                if (this.$refs.tourDescription) {
                    const y = this.$refs.tourDescription.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        },

        /**
         * Tự động đóng mô tả khi cuộn chuột đi quá xa.
         * Cách thức: Tính khoảng cách (Math.abs) giữa vị trí cuộn lúc mở và vị trí hiện tại. 
         * Nếu người dùng cuộn vượt quá 600px, tự động gán is_expanded_mo_ta = false để thu gọn lại.
         */
        handleScrollMoTa() {
            if (this.is_expanded_mo_ta) {
                if (Math.abs(window.scrollY - this.open_scroll_y) > 600) {
                    this.is_expanded_mo_ta = false;
                }
            }
        },

        /**
         * Bật/Tắt chế độ xem toàn bộ lịch trình tour.
         * Cách thức: Đảo trạng thái cờ is_open_all.
         * Nếu bật, reset lại mảng index_mo về rỗng để nhường quyền điều khiển mở rộng cho is_open_all.
         */
        toggleOpenAll() {
            this.is_open_all = !this.is_open_all;
            if (this.is_open_all) {
                this.index_mo = [];
            }
        },

        /**
         * Mở/Đóng lịch trình của một ngày cụ thể (dựa vào index).
         * Cách thức: 
         * Nếu is_open_all đang bật, tắt nó đi và đẩy index của ngày vừa click vào mảng index_mo.
         * Nếu đang không mở tất cả: kiểm tra xem index đã có trong mảng chưa. Có rồi thì xóa đi (đóng), chưa có thì thêm vào (mở).
         */
        toggleSingle(index) {
            if (this.is_open_all) {
                this.is_open_all = false;
                this.index_mo = [index];
            } else {
                const idx = this.index_mo.indexOf(index);
                if (idx !== -1) {
                    this.index_mo.splice(idx, 1);
                } else {
                    this.index_mo.push(index);
                }
            }
        },

        // =========================================================================
        // CHỨC NĂNG: XỬ LÝ DỮ LIỆU HIỂN THỊ (UTILS)
        // =========================================================================

        /**
         * Đếm số lượng đánh giá theo số sao (1,2,3,4,5).
         * Cách thức: Lọc mảng ds_danh_gia để lấy ra các phần tử có sao bằng biến truyền vào, sau đó lấy độ dài (.length).
         */
        countStars(star) {
            return this.ds_danh_gia.filter(item => Number(item.sao_danh_gia) === Number(star)).length;
        },

        ratingPercent(star) {
            if (!this.ds_danh_gia.length) return 0;
            return Math.round((this.countStars(star) / this.ds_danh_gia.length) * 100);
        },

        reviewInitials(name) {
            const parts = (name || 'Khách hàng').trim().split(/\s+/);
            if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        },

        reviewTitle(review) {
            return review.tieu_de || review.tieu_de_danh_gia || 'Đánh giá của khách hàng';
        },

        /**
         * Định dạng tiền tệ Việt Nam cho card tour khác.
         */
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(Number(value || 0));
        },

        /**
         * Render sao đánh giá cho card tour khác.
         */
        renderStars(rating) {
            const score = Number(rating || 0);
            const fullStars = Math.floor(score);
            const hasHalfStar = score - fullStars >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            let html = '';
            for (let i = 0; i < fullStars; i++) {
                html += '<i class="fa-solid fa-star"></i>';
            }
            if (hasHalfStar) {
                html += '<i class="fa-solid fa-star-half-stroke"></i>';
            }
            for (let i = 0; i < emptyStars; i++) {
                html += '<i class="fa-regular fa-star"></i>';
            }
            return html;
        },

        /**
         * Định dạng lại ngày tháng chuẩn hiển thị.
         * Cách thức: Chuyển chuỗi ISO ngày tháng thành đối tượng Date. 
         * Lấy ngày, tháng (cộng 1 do tháng bắt đầu từ 0), năm. Dùng padStart(2, '0') để chèn số 0 nếu ngày/tháng < 10. Trả về định dạng DD/MM/YYYY.
         */
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },

        /**
         * Cuộn trang lên đầu cùng.
         * Cách thức: Dùng window.scrollTo với tọa độ top: 0, kèm hiệu ứng smooth.
         */
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // =========================================================================
        // CHỨC NĂNG: GỌI API LẤY DỮ LIỆU (GET DATA)
        // =========================================================================

        /**
         * Gọi API lấy danh sách bài đánh giá (review) của tour hiện tại.
         * Cách thức: Dùng axios get đường dẫn API, nếu có dữ liệu trả về thì gán vào biến ds_danh_gia.
         */
        layDanhSachDanhGia() {
            const id_tour = this.id;
            axios.get(apiUrl('client/danh-gia/get-danh-gia/' + id_tour))
                .then((res) => {
                    if (res.data.data) {
                        this.ds_danh_gia = res.data.data;
                    }
                })
                .catch((err) => { console.error("Lỗi khi tải đánh giá:", err); });
        },

        /**
         * Gọi API lấy thông tin chi tiết tour và danh sách ảnh.
         * Cách thức: 
         * 1. Gửi payload chứa ID tour kèm token để xác thực người dùng.
         * 2. Nhận dữ liệu gán cho chi_tiet_tour và lọc 4 tour khác đưa vào list_tour_khac (xử lý parse chuỗi ảnh).
         * 3. Gom nhặt toàn bộ hình ảnh liên quan (ảnh tour chính + ảnh trong lịch trình), lọc trùng bằng uniqueImages.
         * 4. Trộn 4 ảnh đưa vào list_hinh_anh để hiển thị làm thumbnail. Đánh dấu ảnh thứ 4 (is_more) nếu còn nhiều ảnh hơn để bật nút "Khám phá thêm".
         */
        LoadTour() {
            var payload = { id: this.id };
            axios.post(apiUrl('client/chi-tiet-tour/get-data'), payload, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
            })
                .then((res) => {
                    if (res.data.status) {
                        // 1. Gán chi tiết tour hiện tại
                        this.chi_tiet_tour = res.data.data;
                        
                        // Lấy ID quốc gia và ID tour đang xem
                        const currentQuocGiaId = Number(this.chi_tiet_tour.id_quoc_gia);
                        const currentTourId = Number(this.chi_tiet_tour.id);

                        // 2. Lọc mảng tour khác ngay khi API vừa trả về
                        let filteredTours = res.data.tour_khac.filter(tour => {
                            // Bỏ qua tour đang xem hiện tại
                            if (Number(tour.id) === currentTourId) return false;
                            
                            const tourQuocGiaId = Number(tour.id_quoc_gia);
                            
                            // Đang xem tour Việt Nam (ID = 1) -> Chỉ lấy tour Việt Nam
                            if (currentQuocGiaId === 1) {
                                return tourQuocGiaId === 1;
                            } 
                            // Đang xem tour Nước Ngoài -> Chỉ lấy tour Nước Ngoài (ID khác 1)
                            else {
                                return tourQuocGiaId !== 1;
                            }
                        });

                        // 3. Giới hạn lấy 3 tour chuẩn nhất, xử lý hình ảnh và gán vào list_tour_khac
                        this.list_tour_khac = filteredTours.slice(0, 3).map(tour => {
                            if (typeof tour.hinh_anh === 'string') {
                                try { tour.hinh_anh = JSON.parse(tour.hinh_anh); }
                                catch (e) { tour.hinh_anh = [tour.hinh_anh]; }
                            }
                            return tour;
                        });

                        if (typeof this.chi_tiet_tour.hinh_anh === 'string') {
                            try {
                                this.chi_tiet_tour.hinh_anh = JSON.parse(this.chi_tiet_tour.hinh_anh);
                            } catch (e) {
                                this.chi_tiet_tour.hinh_anh = [this.chi_tiet_tour.hinh_anh];
                            }
                        }
                        if (!Array.isArray(this.chi_tiet_tour.hinh_anh)) {
                            this.chi_tiet_tour.hinh_anh = [];
                        }

                        let uniqueImages = [];
                        this.chi_tiet_tour.hinh_anh.forEach(img => {
                            let cleanImg = this.getImageUrl(img);
                            if (cleanImg && !uniqueImages.includes(cleanImg)) uniqueImages.push(cleanImg);
                        });

                        if (this.chi_tiet_tour.lich_trinh && Array.isArray(this.chi_tiet_tour.lich_trinh)) {
                            this.chi_tiet_tour.lich_trinh.forEach(item => {
                                let cleanImg = this.getImageUrl(this.getFirstImage(item.hinh_anh));
                                if (cleanImg && !uniqueImages.includes(cleanImg)) uniqueImages.push(cleanImg);
                            });
                        }

                        this.all_images = uniqueImages.length > 0 ? [...uniqueImages] : ['https://via.placeholder.com/800x400'];

                        let defaultImages = [
                            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
                            'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
                            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
                            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
                            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
                            'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=800&q=80'
                        ].sort(() => 0.5 - Math.random());

                        let finalImages = [];
                        let secondaryImages = uniqueImages.slice(1);

                        for (let i = 0; i < 4; i++) {
                            if (secondaryImages[i]) {
                                finalImages.push({ url: secondaryImages[i], is_more: false });
                            } else {
                                finalImages.push({ url: defaultImages[i], is_more: false });
                                this.all_images.push(defaultImages[i]);
                            }
                        }

                        if (secondaryImages.length > 4) {
                            finalImages[3].is_more = true;
                        }

                        this.list_hinh_anh = finalImages;
                    }
                });
        },

        // =========================================================================
        // CHỨC NĂNG: GỬI YÊU CẦU ĐẶT TOUR
        // =========================================================================

        /**
         * Xử lý luồng thao tác thanh toán / đặt tour của khách.
         * Cách thức: 
         * 1. Chặn bấm click liên tục nếu hệ thống đang tải (is_loading = true).
         * 2. Kiểm tra token, nếu không có đẩy qua trang đăng nhập.
         * 3. Xác thực số lượng so với số chỗ trống, xác thực ghi chú danh sách người đi nếu đi >= 2 người.
         * 4. Gửi request axios tới endpoint thanh toán. Xử lý logic điều hướng đến URL thanh toán tương ứng dựa theo maHoaDon (nếu trả về).
         * 5. Xử lý bắt lỗi hết hạn token (401) hoặc lỗi hệ thống chung.
         */
        thucHienDatTour() {
            if (this.is_loading) return;

            const token = localStorage.getItem('key_client');
            if (!token) {
                this.$toast.error("Vui lòng đăng nhập để thực hiện đặt tour.");
                this.$router.push('/client/dang-nhap');
                return;
            }

            if (this.dat_tour.so_luong_nguoi > this.chi_tiet_tour.so_nguoi_toi_da) {
                this.$toast.warning("Rất tiếc, tour này chỉ còn " + this.chi_tiet_tour.so_nguoi_toi_da + " chỗ trống!");
                return;
            }

            if (this.dat_tour.so_luong_nguoi >= 2 && this.dat_tour.ghi_chu_danh_sach_nguoi_di.trim() === '') {
                this.$toast.warning("Vui lòng điền thông tin người đi cùng khi đặt từ 2 vé trở lên!");
                return;
            }

            this.is_loading = true;

            var payload = {
                "id_tour": this.id,
                "so_luong_nguoi": this.dat_tour.so_luong_nguoi,
                "ghi_chu_danh_sach_nguoi_di": this.dat_tour.ghi_chu_danh_sach_nguoi_di,
                "phuong_thuc_thanh_toan": this.dat_tour.phuong_thuc_thanh_toan
            };

            axios.post(apiUrl("client/dat-tour/thanh-toan"), payload, {
                headers: { Authorization: "Bearer " + token }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.chi_tiet_tour.so_nguoi_toi_da -= this.dat_tour.so_luong_nguoi;
                        const maHoaDon = res.data.data.hoa_don.ma_hoa_don;

                        if (maHoaDon) {
                            this.$router.push('/client/thanh-toan/' + maHoaDon);
                        } else {
                            this.dat_tour.so_luong_nguoi = 1;
                            this.dat_tour.ghi_chu_danh_sach_nguoi_di = '';
                            setTimeout(() => { this.is_loading = false; }, 2000);
                        }
                    } else {
                        this.$toast.error(res.data.message);
                        setTimeout(() => { this.is_loading = false; }, 2000);
                    }
                })
                .catch((err) => {
                    if (err.response && err.response.status === 401) {
                        this.$toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
                        this.$router.push('/client/dang-nhap');
                    } else {
                        this.$toast.error("Hệ thống đang bận, vui lòng thử lại sau.");
                    }
                    setTimeout(() => { this.is_loading = false; }, 2000);
                });
        }
    }
}
</script>

<style scoped>

/* ===================== ĐÁNH GIÁ KHÁCH HÀNG - GIỐNG MẪU ===================== */
.review-section {
    color: #173b3f;
}

.review-main-title {
   
    font-weight: 800;
    margin-bottom: 20px;
    color: #102f35;
}

.review-summary-box {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 28px;
    align-items: center;
    padding: 22px 20px;
    margin-bottom: 24px;
    background: #eef8f6;
    border-radius: 18px;
}

.review-score-box {
    text-align: left;
}

.review-score-number {
    font-size: 3.8rem;
    line-height: 1;
    font-weight: 800;
    color: #07998f;
    letter-spacing: -1px;
}

.review-score-stars {
    display: flex;
    gap: 3px;
    margin-top: 6px;
    color: #ffbf00;
    font-size: 1.1rem;
}

.review-total-text {
    margin-top: 4px;
    color: #4e6a70;
    font-size: 0.95rem;
}

.review-rating-bars {
    width: 100%;
}

.review-bar-row {
    display: grid;
    grid-template-columns: 48px 1fr 44px;
    align-items: center;
    gap: 12px;
    margin: 7px 0;
    padding: 4px 6px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #4e6a70;
    cursor: pointer;
    transition: all 0.2s ease;
}

.review-bar-row:hover,
.review-bar-row.active {
    background: rgba(7, 153, 143, 0.12);
}

.review-bar-row.active .review-bar-label,
.review-bar-row.active .review-percent,
.review-bar-row.active .review-bar-label i {
    color: #07998f;
}

.review-bar-label {
    font-weight: 700;
    white-space: nowrap;
}

.review-bar-label i {
    font-size: 0.75rem;
    color: #4e6a70;
}

.review-progress {
    height: 8px;
    background: #d6eeeb;
    border-radius: 999px;
    overflow: hidden;
}

.review-progress-fill {
    height: 100%;
    background: #ffc107;
    border-radius: 999px;
    transition: width 0.35s ease;
}

.review-percent {
    text-align: right;
    font-size: 0.85rem;
    color: #4e6a70;
}

.review-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.review-card {
    display: flex;
    gap: 16px;
    padding: 22px 20px;
    border: 1px solid #d7eeee;
    border-radius: 18px;
    background: #fff;
    transition: all 0.25s ease;
}

.review-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
}

.review-avatar-wrap {
    flex: 0 0 40px;
}

.review-avatar-img,
.review-avatar-text {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.review-avatar-img {
    object-fit: cover;
}

.review-avatar-text {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #07998f;
    color: #fff;
    font-weight: 800;
    font-size: 0.85rem;
}

.review-content {
    flex: 1;
    min-width: 0;
}

.review-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 8px;
}

.review-name {
    margin: 0 0 4px;
    font-weight: 800;
    color: #102f35;
}

.review-stars-line {
    display: flex;
    align-items: center;
    gap: 2px;
    color: #ffbf00;
    font-size: 0.82rem;
}

.review-count-small {
    margin-left: 8px;
    color: #6a8588;
    font-size: 0.82rem;
}

.review-date {
    white-space: nowrap;
    color: #4e6a70;
    font-size: 0.9rem;
}

.review-title {
    margin: 0 0 7px;
    font-weight: 800;
    color: #102f35;
    font-size: 0.98rem;
}

.review-desc {
    margin: 0;
    color: #45646a;
    line-height: 1.7;
    font-size: 0.95rem;
}

.review-helpful-btn {
    border: 0;
    padding: 0;
    margin-top: 12px;
    background: transparent;
    color: #45646a;
    font-size: 0.85rem;
    box-shadow: none !important;
    transform: none !important;
    filter: none !important;
}

.review-helpful-btn:hover {
    color: #07998f;
}

.review-empty-box {
    text-align: center;
    padding: 50px 20px;
    border: 1px dashed #d7eeee;
    border-radius: 18px;
    background: #f8fbfb;
    color: #6a8588;
}

.review-empty-box i {
    font-size: 2.2rem;
    margin-bottom: 12px;
}

@media (max-width: 768px) {
    .review-summary-box {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .review-bar-row {
        grid-template-columns: 42px 1fr 38px;
        gap: 8px;
    }

    .review-card {
        padding: 18px 14px;
    }

    .review-head {
        flex-direction: column;
        gap: 4px;
    }
}

/* =========================================================================
   HIỆU ỨNG GIAO DIỆN CHUNG & TIỆN ÍCH (UTILITIES)
   ========================================================================= */

/**
 * Lớp phủ mờ (fade) cho phần mô tả khi bị thu gọn.
 * - Làm gì: Tạo cảm giác chữ đang mờ dần đi ở cuối đoạn text, báo hiệu cho người dùng biết còn nội dung bên dưới.
 * - Làm ra sao: Đặt ở vị trí tuyệt đối (absolute) dưới cùng, dùng linear-gradient chuyển từ trong suốt sang màu trắng. 
 * Đặc biệt dùng `pointer-events: none` để người dùng vẫn có thể click xuyên qua lớp mờ này.
 */
.fade-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 90%);
    pointer-events: none;
}

/**
 * Giữ thanh đặt tour dính (sticky) trên màn hình khi cuộn.
 * - Làm gì: Đảm bảo người dùng luôn thấy form đặt tour dù có cuộn trang xuống sâu.
 * - Làm ra sao: Cách đỉnh (top) 100px. Dùng !important để ghi đè các thuộc tính top khác nếu có.
 */
.sticky-card {
    top: 100px !important;
    transition: all 0.3s ease;
}

/**
 * Hiệu ứng khi di chuột (hover) vào tất cả các nút (button).
 * - Làm gì: Tạo cảm giác nút được bấm hoặc nổi lên.
 * - Làm ra sao: Giảm độ sáng (brightness 90%), đẩy phần tử lên trên 2px (translateY) và thêm đổ bóng (box-shadow).
 */
button:hover {
    filter: brightness(90%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/**
 * Hiệu ứng hover cho thẻ hiển thị "Tour khác".
 * - Làm gì: Phóng to nhẹ và đổ bóng đậm hơn khi người dùng lia chuột vào tour.
 * - Làm ra sao: Đẩy thẻ lên 5px và tăng kích thước bóng đổ (dùng !important để đảm bảo tính ưu tiên).
 */
.tour-card:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

/**
 * Hiệu ứng trượt ngang cho thẻ "Đánh giá".
 * - Làm gì: Trượt nhẹ thẻ đánh giá sang phải khi lia chuột vào.
 * - Làm ra sao: Dùng translateX(5px) đẩy sang ngang thay vì đẩy lên dọc, kết hợp đổ bóng.
 */
.list-danh-gia .card {
    transition: all 0.3s ease;
}

.list-danh-gia .card:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}

/* Các class tiện ích cơ bản */
.border-dashed {
    border: 2px dashed #dee2e6 !important;
}

.fa-solid.text-warning {
    color: #ffc107 !important;
    /* Màu vàng cho ngôi sao đánh giá */
}


/* =========================================================================
   GIAO DIỆN LIGHTBOX (TRÌNH XEM ẢNH FULL MÀN HÌNH - PHẦN 1)
   ========================================================================= */

/**
 * 1. Khung nền chính của Modal xem ảnh.
 * - Làm gì: Phủ mờ toàn bộ màn hình, khóa cuộn trang, tạo nền tối sang trọng và xuất hiện mượt mà.
 * - Làm ra sao: Dùng fixed và inset 0, overflow: hidden cấm mọi thứ tràn ra. Dùng backdrop-filter: blur(8px) tạo hiệu ứng kính mờ (Glassmorphism) và gán animation fadeIn.
 */
.modal-lightbox {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/**
 * 2. Bố cục chứa phần Ảnh chính và Nút điều hướng.
 * - Làm gì: Căn giữa nội dung, đảm bảo không gian này tự động co bóp nhường chỗ cho vùng Thumbnail phía dưới.
 * - Làm ra sao: Gán flex: 1 để chiếm hết vùng trống, nhưng bắt buộc đi kèm min-height: 0 để kích hoạt "dynamic shrink" - cho phép khung tự thu nhỏ lại khi bị chật.
 */
.lightbox-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    position: relative;
    flex: 1;
    min-height: 0;
    padding: 20px;
}

.lightbox-frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    min-height: 0;
}

/**
 * 3. Ảnh hiển thị chính.
 * - Làm gì: Hiển thị ảnh trọn vẹn, không vỡ nét, đặc biệt tự động thu nhỏ nếu là ảnh dọc (portrait) để không đè lên chữ.
 * - Làm ra sao: Tiếp tục dùng flex: 1 và min-height: 0 để ép bản thân bức ảnh co lại theo không gian thực tế. Dùng object-fit: contain để giữ đúng tỷ lệ gốc.
 */
.lightbox-img {
    flex: 1;
    min-height: 0;
    max-width: 100%;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/**
 * 4. Định dạng chung cho các nút (Đóng, Trái, Phải).
 * - Làm gì: Tạo nút bấm (chứa SVG) thanh mảnh, tinh tế, có nền kính mờ và phát sáng nhẹ khi người dùng lia chuột.
 * - Làm ra sao: Nền trong suốt (rgba), viền siêu mỏng, backdrop-filter. Khi hover, tăng độ sáng của màu nền/viền, đổ bóng (box-shadow) và phóng to (scale).
 */
.lightbox-close,
.lightbox-prev,
.lightbox-next {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
    z-index: 10000;
}

.lightbox-close:hover,
.lightbox-prev:hover,
.lightbox-next:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: scale(1.1);
}

/* Vị trí Nút Đóng */
.lightbox-close {
    position: absolute;
    top: 25px;
    right: 35px;
    width: 45px;
    height: 45px;
    font-size: 1.4rem;
}

/* Vị trí Nút Trái / Phải */
.lightbox-prev,
.lightbox-next {
    position: absolute;
    top: 50%;
    width: 55px;
    height: 55px;
    font-size: 1.5rem;
}

.lightbox-prev {
    left: 40px;
    transform: translateY(-50%);
}

.lightbox-prev:hover {
    transform: translateY(-50%) scale(1.1);
}

.lightbox-next {
    right: 40px;
    transform: translateY(-50%);
}

.lightbox-next:hover {
    transform: translateY(-50%) scale(1.1);
}

/**
 * 5. Tiêu đề và số thứ tự ảnh.
 * - Làm gì: Hiển thị mô tả ảnh rõ ràng trên nền tối, tuyệt đối không bị bóp méo khi màn hình nhỏ lại.
 * - Làm ra sao: Gán flex-shrink: 0 để khóa cứng không gian của khối chữ. Thêm text-shadow để chữ nổi bật kể cả khi ảnh bên dưới có màu sáng.
 */



.lightbox-counter {
    flex-shrink: 0;
}

.lightbox-counter {
    margin-top: 5px;
    font-size: 0.95rem;
    opacity: 0.7;
}

/**
 * 6. Danh sách ảnh thu nhỏ (Thumbnails).
 * - Làm gì: Cụm chọn ảnh nằm dưới cùng, có thể cuộn ngang, làm nổi bật ảnh đang được xem. Khối này được bảo vệ không bị bức ảnh dọc chèn ép.
 * - Làm ra sao: Dùng flex-shrink: 0 để giữ vững kích thước. Ẩn thanh cuộn bằng ::-webkit-scrollbar. 
 * Ảnh mặc định bị làm mờ (opacity: 0.4), ảnh active sẽ sáng hẳn lên, đẩy nhẹ lên trên và có viền màu chủ đạo.
 */
.lightbox-thumbnails {
    display: flex;
    gap: 12px;
    padding: 20px;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 30px;
    flex-shrink: 0;
}

.lightbox-thumbnails::-webkit-scrollbar {
    display: none;
}

.thumb {
    flex-shrink: 0;
    cursor: pointer;
}

.thumb-img {
    width: 100px;
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
    opacity: 0.4;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.thumb-img:hover {
    opacity: 0.8;
}

.thumb-img.active {
    opacity: 1;
    border-color: #8fdfb5;
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
}

/* 7. Tương thích thiết bị di động (Responsive) */
@media (max-width: 768px) {

    .lightbox-prev,
    .lightbox-next {
        width: 45px;
        height: 45px;
        font-size: 1.2rem;
    }

    .lightbox-prev {
        left: 15px;
    }

    .lightbox-next {
        right: 15px;
    }

    .lightbox-close {
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
    }

    .thumb-img {
        width: 80px;
        height: 56px;
    }
}

/* =========================================================================
   HIỆU ỨNG PHÓNG TO ẢNH (ZOOM TRONG CARD) VÀ LỚP PHỦ
   ========================================================================= */
.hover-zoom {
    transition: transform 0.4s ease;
}

.col-lg-6.position-relative:hover .hover-zoom {
    transform: scale(1.05);
    /* Phóng to ảnh thêm 5% khi lia chuột */
}

.col-lg-6.position-relative {
    overflow: hidden;
    /* Giấu phần ảnh bị phình ra khi zoom */
    border-radius: 5px;
}

.hover-overlay:hover {
    background: rgba(0, 0, 0, 0.7) !important;
    /* Làm tối nền khi hover vào ảnh "Khám phá thêm" */
}

/* =========================================================================
   XỬ LÝ DỮ LIỆU HTML ĐỘNG (V-HTML)
   ========================================================================= */
/**
 * Chỉnh sửa CSS cho nội dung được render bằng v-html.
 * - Làm gì: Sửa lỗi hiển thị danh sách (ul) bị thụt lề sai trong trình soạn thảo văn bản (WYSIWYG).
 * - Làm ra sao: Dùng `:deep()` để Vue áp dụng CSS này cho phần tử con sinh ra động, thêm padding trái 20px.
 */
:deep(.mo-ta-html ul) {
    padding-left: 20px;
    margin-bottom: 15px;
}

/* =========================================================================
   KHỐI SỐ LƯỢNG KHÁCH (NÚT + / -)
   ========================================================================= */
/**
 * Box bọc ngoài nút cộng trừ.
 * - Làm gì: Tạo hình dáng bo góc, viền và căn chỉnh cho nhóm tăng/giảm số lượng.
 */
.custom-qty-group {
    width: 150px;
    height: 45px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
}

/**
 * Nút bấm cộng (+) và trừ (-).
 * - Làm gì: Định dạng nút bấm, bỏ nền, chỉnh màu xanh lá và thêm hiệu ứng chuyển màu khi hover.
 */
.btn-qty {
    background: transparent;
    border: none;
    color: #125633;
    font-size: 1rem;
    width: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.btn-qty:hover {
    background: #8fdfb5;
    color: white;
}

/* Hiệu ứng khi nút đang được bấm (click giữ) -> Hơi co lại */
.btn-qty:active {
    background: #6dca96;
    transform: scale(0.95);
}

/**
 * Ô nhập số lượng ở giữa.
 * - Làm gì: Ẩn đi thanh viền của thẻ input mặc định, định dạng chữ to, in đậm.
 */
.input-qty {
    border: none !important;
    background: transparent !important;
    padding: 0;
    font-size: 1.2rem;
    color: #212529;
}

.input-qty:focus {
    box-shadow: none !important;
    /* Bỏ viền xanh (outline) khi focus vào ô nhập */
}

/**
 * Ẩn hai nút tăng/giảm lên xuống (spinner) mặc định của HTML input type="number".
 * - Làm gì: Giúp thẻ input sạch sẽ để ta dùng 2 nút bấm tùy chỉnh bên trên thay thế.
 * - Làm ra sao: Dùng `-webkit-appearance: none` (cho Chrome, Safari) và `-moz-appearance: textfield` (cho Firefox).
 */
.input-qty::-webkit-outer-spin-button,
.input-qty::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.input-qty[type=number] {
    -moz-appearance: textfield;
}

/* =========================================================================
   GHI ĐÈ CSS CHO MODAL LIGHTBOX (CẬP NHẬT KIỂU DÁNG MỚI & RESPONSIVE)
   ========================================================================= */

/**
 * Chú ý: Dưới đây là phần code ghi đè lại các định dạng ở trên (do khai báo sau).
 * Nó cập nhật thêm hiệu ứng làm mờ nền (backdrop-filter: blur) và thay đổi mức độ tối của nền (0.9).
 */
.modal-lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    /* Làm tối nền mạnh như hình của bạn */
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
    /* Thêm độ nhòe (blur) cho khung cảnh phía sau */
}

.lightbox-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 90%;
    max-height: 90vh;
}

.lightbox-img {
    max-width: 100%;
    max-height: 85vh;
    /* Giới hạn chiều cao để không bị tràn màn hình */
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
}

/* Tái định dạng Nút tắt - Bố trí lên góc, đổi size chữ */
.lightbox-close {
    position: absolute;
    top: 25px;
    right: 35px;
    background: none;
    border: none;
    color: #fff;
    font-size: 2.5rem;
    cursor: pointer;
    z-index: 10000;
    transition: 0.2s;
    opacity: 0.7;
}

.lightbox-close:hover {
    opacity: 1;
    transform: scale(1.1);
}

/* Tái định dạng nút qua trái / phải (Định nghĩa lần 1) */
.lightbox-prev,
.lightbox-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 2.5rem;
    padding: 15px 20px;
    cursor: pointer;
    z-index: 10000;
    border-radius: 50%;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-prev:hover,
.lightbox-next:hover {
    background: rgba(255, 255, 255, 0.3);
}

.lightbox-prev {
    left: 40px;
}

.lightbox-next {
    right: 40px;
}

/* Tái định dạng nút qua trái / phải (Định nghĩa lần 2 - Fix position) */
.lightbox-prev,
.lightbox-next {
    position: fixed;
    /* Đổi từ absolute sang fixed để khóa cứng vị trí trên màn hình */
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 2.5rem;
    padding: 15px 20px;
    cursor: pointer;
    z-index: 10000;
    border-radius: 50%;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

/**
 * Tương thích thiết bị di động (Responsive).
 * - Làm gì: Thu nhỏ kích thước và căn chỉnh lại lề của các nút bấm trên màn hình điện thoại (<768px).
 * - Làm ra sao: Dùng @media queries. Giảm size nút, kéo nút sát ra hai viền màn hình để không che khuất hình ảnh.
 */
@media (max-width: 768px) {
    .lightbox-prev {
        left: 10px;
        padding: 10px;
        font-size: 1.5rem;
    }

    .lightbox-next {
        right: 10px;
        padding: 10px;
        font-size: 1.5rem;
    }

    .lightbox-close {
        top: 15px;
        right: 15px;
        font-size: 2rem;
    }
}

/* =========================================================================
   CARD TOUR KHÁC - GIAO DIỆN POSTER THEO MẪU TOUR
   ========================================================================= */
.related-tour-section {
    margin-top: 64px !important;
}

.related-tour-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 22px;
}

.related-tour-subtitle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #125633;
    background: rgba(143, 223, 181, 0.22);
    border: 1px solid rgba(143, 223, 181, 0.45);
    border-radius: 999px;
    padding: 7px 14px;
    margin-bottom: 10px;
}

.related-tour-heading {
    font-size: clamp(1.65rem, 3vw, 2.35rem);
    font-weight: 800;
    color: #0c1a2e;
    line-height: 1.2;
    margin: 0;
}

.no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.track-container {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    padding: 4px 4px 22px;
    scroll-snap-type: x mandatory;
}

/* Riêng phần tour khác: chia đều 3 card cho đủ chiều ngang */
.related-tour-track {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 28px;
    width: 100%;
    overflow-x: visible !important;
    padding: 4px 0 30px;
    margin-left: 0;
    margin-right: 0;
    scroll-snap-type: none;
}

.hover-scale-img img {
    transition: transform 0.6s ease;
}

.hover-scale-img:hover img {
    transform: scale(1.07);
}

.tour-poster {
    position: relative;
    flex: 0 0 320px;
    width: 320px;
    height: 420px;
    border-radius: 28px;
    overflow: hidden;
    cursor: pointer;
    scroll-snap-align: start;
    background: #0c1a2e;
    box-shadow: 0 18px 38px rgba(12, 26, 46, 0.16);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Khi nằm trong related-tour-track thì bỏ width cố định 320px để card tự giãn */
.related-tour-track .tour-poster {
    width: 100% !important;
    flex: unset !important;
    flex-basis: unset !important;
    min-width: 0;
    height: 440px;
}


.tour-poster:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 52px rgba(12, 26, 46, 0.24);
}

.tour-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tour-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(12, 26, 46, 0.96) 0%, rgba(12, 26, 46, 0.36) 52%, rgba(12, 26, 46, 0.04) 100%);
}

.tour-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 2;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 6px 14px;
    border-radius: 9999px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
}

.badge-primary {
    background: #8fdfb5;
    color: #125633;
}

.tour-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 24px;
}

.tour-pickup {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tour-title {
    font-size: 1.4rem;
    font-weight: 800;
    color: white;
    line-height: 1.3;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.tour-meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
}

.tour-rating-line {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
}

.tour-stars {
    color: #fbbf24;
    font-size: 0.85rem;
    letter-spacing: 1px;
    line-height: 1;
}

.tour-rating-text {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.82);
    margin-left: 4px;
    font-weight: 600;
}

.tour-price {
    font-size: 1.3rem;
    font-weight: 800;
    color: white;
}

.tour-duration {
    flex-shrink: 0;
    padding: 6px 12px;
    border-radius: 9999px;
    font-size: 0.75rem;
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-reveal {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease;
}

.tour-poster:hover .cta-reveal {
    max-height: 54px;
    opacity: 1;
    margin-top: 16px;
}

.view-details-btn {
    width: 100%;
    padding: 12px;
    border-radius: 16px;
    background: #8fdfb5;
    color: #125633;
    border: none;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
}

@media (max-width: 992px) {
    .related-tour-track {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .related-tour-section {
        margin-top: 44px !important;
    }

    .related-tour-track {
        grid-template-columns: 1fr;
    }

    .related-tour-track .tour-poster {
        height: 390px;
        border-radius: 24px;
    }

    .tour-info {
        padding: 20px;
    }

    .tour-title {
        font-size: 1.22rem;
    }

    .tour-price {
        font-size: 1.08rem;
    }
}

</style>