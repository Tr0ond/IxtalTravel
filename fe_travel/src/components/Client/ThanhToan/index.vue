<template>
    <div v-if="hoa_don">
        <div class="container my-4">
            <div class="row">
                <div class="col-lg-7">
                    <div class="card shadow-sm border-0 mb-4" style="border-radius: 15px;">
                        <div class="card-header bg-white py-3">
                            <h3 class="fw-bold mb-0">Thông tin liên lạc</h3>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-lg-4">
                                    <p class="mb-1"><strong>Họ tên:</strong></p>
                                    <p class="text-secondary">{{ khach_hang.ho_va_ten }}</p>
                                </div>
                                <div class="col-lg-4">
                                    <p class="mb-1"><strong>Email:</strong></p>
                                    <p class="text-secondary">{{ khach_hang.email }}</p>
                                </div>
                                <div class="col-lg-4">
                                    <p class="mb-1"><strong>Số điện thoại:</strong></p>
                                    <p class="text-secondary">{{ khach_hang.so_dien_thoai }}</p>
                                </div>
                                <div class="col-lg-6">
                                    <p class="mb-1"><strong>CCCD:</strong></p>
                                    <p class="text-secondary">{{ khach_hang.cccd }}</p>
                                </div>
                                <div class="col-lg-6">
                                    <p class="mb-1"><strong>Ngày sinh:</strong></p>
                                    <p class="text-secondary">{{ khach_hang.ngay_sinh }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card shadow-sm border-0 mb-4" style="border-radius: 15px;">
                        <div class="card-body">
                            <h3 class="fw-bold mb-3">Chi tiết hoá đơn</h3>
                            <p><strong>Mã hóa đơn:</strong> <span class="text-primary fw-bold">{{ hoa_don.ma_hoa_don }}</span></p>
                            <p><strong>Ngày đặt:</strong> {{ hoa_don.ngay_dat }}</p>
                            <p><strong>Số lượng người đi:</strong> {{ hoa_don.so_luong_nguoi }}</p>
                            <p><strong>Tổng tiền:</strong> <span class="text-danger fw-bold fs-5">{{ formatVND(hoa_don.tong_tien) }}</span></p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <span v-if="hoa_don.trang_thai == 0" class="badge bg-danger ms-2 px-3 py-2">
                                    <i class="fa-solid fa-circle-xmark me-1"></i> Đã hủy
                                </span>
                                <span v-else-if="hoa_don.trang_thai == 1" class="badge bg-warning text-dark ms-2 px-3 py-2">
                                    <i class="fa-solid fa-clock me-1"></i> Chờ thanh toán
                                </span>
                                <span v-else-if="hoa_don.trang_thai == 2" class="badge bg-success ms-2 px-3 py-2">
                                    <i class="fa-solid fa-circle-check me-1"></i> Đã thanh toán
                                </span>
                                <span v-else class="badge bg-secondary ms-2 px-3 py-2">Không xác định</span>
                            </p>
                            <p><strong>Ghi chú:</strong> <span style="white-space: pre-line;">{{ hoa_don.ghi_chu || 'Không có ghi chú' }}</span></p>
                        </div>
                    </div>

                    <div class="card shadow-sm border-0" style="border-radius: 15px; overflow: hidden;">
                        <div class="card-header bg-white py-3">
                            <h3 class="fw-bold mb-0"><i class="fa-solid fa-ticket me-2 text-primary"></i>Danh sách vé</h3>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="bg-light">
                                        <tr class="text-secondary">
                                            <th class="ps-4 py-3">Mã vé</th>
                                            <th class="py-3">Giá vé</th>
                                            <th class="py-3 text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in ds_ve" :key="index">
                                            <td class="ps-4 py-3 fw-bold text-primary">{{ item.ma_ve }}</td>
                                            <td class="py-3">{{ formatVND(item.gia_ve) }}</td>
                                            <td class="py-3 text-center">
                                                <span v-if="item.tinh_trang == '1'" class="badge bg-info text-dark">Chờ thanh toán</span>
                                                <span v-else-if="item.tinh_trang == '2'" class="badge bg-success">Đã thanh toán</span>
                                                <span v-else class="badge bg-secondary">Hủy vé</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5">
                    <div class="card shadow-sm border-0" style="border-radius: 15px; overflow: hidden;">
                        <div class="card-header bg-white py-3 border-bottom-0">
                            <h3 class="fw-bold mb-0 text-primary text-uppercase" style="letter-spacing: 1px;">Phiếu xác nhận Booking</h3>
                        </div>
                        <div class="card-body">
                            <div class="d-flex mb-4">
                                <img :src="getImageUrl(getFirstImage(tour.hinh_anh))"  alt="Tour Image"
                                    style="width: 150px; height: 100px; object-fit: cover; border-radius: 10px;"
                                    class="me-3 shadow-sm border">
                                <div class="flex-grow-1">
                                    <h5 class="fw-bold text-dark mb-0" style="line-height: 1.4;">{{ tour.ten_tour }}</h5>
                                </div>
                            </div>

                            <div class="mb-4 bg-light p-3 rounded-3 border">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fa-solid fa-ticket me-2 text-secondary"></i>
                                    <span class="me-2">Số booking:</span>
                                    <span class="fw-bold text-danger">{{ hoa_don.ma_hoa_don }}</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="fa-solid fa-users me-2 text-secondary"></i>
                                    <span class="me-2">Số lượng người:</span>
                                    <span class="fw-bold text-dark">{{ hoa_don.so_luong_nguoi }}</span>
                                </div>
                            </div>

                            <hr class="text-secondary opacity-25">
                            
                            <div class="mt-4">
                                <h6 class="fw-bold mb-3"><i class="fa-solid fa-bus me-2 text-primary"></i>THÔNG TIN CHUYẾN ĐI</h6>
                                <div class="row g-0 bg-light p-3 rounded-3 border">
                                    <div class="col-6 border-end pe-3">
                                        <div class="small text-secondary mb-1">Ngày đi</div>
                                        <div class="fw-bold text-dark mb-1">{{ tour.ngay_bat_dau }}</div>
                                        <div class="small text-muted">{{ tour.diem_don }}</div>
                                    </div>
                                    <div class="col-6 ps-3">
                                        <div class="small text-secondary mb-1">Ngày về</div>
                                        <div class="fw-bold text-dark mb-1">{{ tour.ngay_ket_thuc }}</div>
                                        <div class="small text-muted">{{ tour.diem_tra }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-danger w-100 py-3 fw-bold mt-4 shadow-sm fs-5 d-flex align-items-center justify-content-center" 
                            @click="is_show_modal = true">
                        <i class="fa-solid fa-credit-card me-2"></i> THANH TOÁN NGAY
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="text-center py-5 mt-5">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Đang tải...</span>
        </div>
        <h5 class="mt-3 text-secondary">Đang tải thông tin hóa đơn...</h5>
    </div>

    <!-- BẢNG CHỌN PHƯƠNG THỨC THANH TOÁN -->
    <div v-if="is_show_modal" class="modal-payment-drawer" @click.self="is_show_modal = false">
        <div class="drawer-content animate__animated animate__slideInRight">
            <div class="drawer-header bg-white">
                <h5 class="fw-bold mb-0 text-dark">PHƯƠNG THỨC THANH TOÁN</h5>
                <button type="button" class="btn-close" @click="is_show_modal = false"></button>
            </div>

            <div class="drawer-body">
                <p class="text-muted small mb-4">Vui lòng chọn phương thức thanh toán phù hợp cho đơn hàng của bạn.</p>
                
                <!-- Phương thức 1: Ví điện tử -->
                <div class="payment-item" :class="{ 'active': method === 1 }" @click="method = 1">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <div class="icon-box me-3"><i class="fa-solid fa-wallet"></i></div>
                            <span class="fw-bold">Ví điện tử (VNPAY / MoMo)</span>
                        </div>
                        <i v-if="method === 1" class="fa-solid fa-circle-check text-primary fs-5"></i>
                    </div>
                    
                    <div v-if="method === 1" class="method-details mt-3 pt-3 border-top">
                        <div class="d-flex gap-4 ms-4">
                            <!-- VNPAY -->
                            <div class="form-check d-flex align-items-center p-0 m-0">
                                <input class="form-check-input mt-0 me-2" type="radio" name="walletRadio" id="radioVnpay" value="vnpay" v-model="selectedWallet" style="cursor: pointer;">
                                <label class="form-check-label bg-white border p-2 rounded-3 shadow-sm" for="radioVnpay" style="cursor: pointer;" :class="{'border-primary': selectedWallet === 'vnpay'}">
                                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" height="30" alt="VNPAY">
                                </label>
                            </div>
                            <!-- MOMO -->
                            <div class="form-check d-flex align-items-center p-0 m-0 ms-3">
                                <input class="form-check-input mt-0 me-2" type="radio" name="walletRadio" id="radioMomo" value="momo" v-model="selectedWallet" style="cursor: pointer;">
                                <label class="form-check-label bg-white border p-2 rounded-3 shadow-sm" for="radioMomo" style="cursor: pointer;" :class="{'border-primary': selectedWallet === 'momo'}">
                                    <img src="https://homepage.momocdn.net/img/logo-momo.png" height="30" alt="MoMo">
                                </label>
                            </div>
                        </div>
                        <div class="alert alert-info mt-3 mb-0 py-2 small">
                            <i class="fa-solid fa-circle-info me-1"></i> Bạn sẽ được chuyển hướng sang cổng thanh toán an toàn.
                        </div>
                    </div>
                </div>

                <!-- Phương thức 2: Chuyển khoản QR -->
                <div class="payment-item mt-3" :class="{ 'active': method === 2 }" @click="method = 2">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <div class="icon-box me-3"><i class="fa-solid fa-qrcode"></i></div>
                            <span class="fw-bold">Chuyển khoản Ngân hàng</span>
                        </div>
                        <i v-if="method === 2" class="fa-solid fa-circle-check text-primary fs-5"></i>
                    </div>
                    <div v-if="method === 2" class="method-details mt-3 pt-3 border-top text-center">
                        <p class="small text-muted mb-3">Mở ứng dụng ngân hàng và quét mã QR bên dưới để thanh toán nhanh.</p>
                        <img v-if="thanh_toan && thanh_toan.link_qr_code" :src="thanh_toan.link_qr_code" alt="QR Code"
                            style="width: 220px; height: 220px; object-fit: contain; border-radius: 10px;"
                            class="shadow-sm border p-2 bg-white">
                        <p v-else class="text-danger small mt-2">Mã QR đang được cập nhật...</p>
                    </div>
                </div>
            </div>

            <div class="drawer-footer">
                <div class="d-flex justify-content-between mb-3 align-items-end">
                    <span class="text-secondary fw-semibold">Tổng thanh toán:</span>
                    <span class="fw-bold text-danger fs-3">{{ formatVND(hoa_don?.tong_tien) }}</span>
                </div>
                
                <button class="btn btn-primary w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center fs-6" 
                        @click="thanhToanAction" 
                        :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN THANH TOÁN' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api';

export default {
    name: 'ThanhToan',
    props: ['ma_hoa_don'],
    data() {
        return {
            hoa_don: null,
            khach_hang: {},
            tour: {},
            ds_ve: [],
            thanh_toan: {},
            
            is_show_modal: false,
            method: 1, 
            selectedWallet: 'vnpay', 
            isLoading: false 
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        // Hàm lấy ảnh đầu tiên an toàn từ mảng hoặc chuỗi
        getFirstImage(hinh_anh) {
            if (!hinh_anh) return 'https://via.placeholder.com/400x300?text=No+Image';
            
            // Nếu là mảng
            if (Array.isArray(hinh_anh)) {
                return hinh_anh.length > 0 ? hinh_anh[0] : 'https://via.placeholder.com/400x300';
            }
            
            // Nếu là chuỗi JSON
            try {
                let parsed = JSON.parse(hinh_anh);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) {
                return hinh_anh; // Trả về nguyên bản nếu là chuỗi URL thường
            }
        },
        // Hàm lấy URL ảnh sắc nét
        getImageUrl(url) {
            if (!url) return 'https://via.placeholder.com/400x300';
            return url.replace(/-\d+x\d+/g, '');
        },
        loadData() {
            axios.get(apiUrl("client/hoa-don/chi-tiet-thanh-toan/" + this.ma_hoa_don), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_client')
                }
            })
            .then((res) => {
                if (res.data.status) {
                    const data = res.data.data;
                    this.hoa_don = data.hoa_don;
                    this.khach_hang = data.khach_hang;
                    this.tour = data.tour;
                    this.ds_ve = data.ve;
                    this.thanh_toan = data.thanh_toan;
                } else {
                    this.$toast.error(res.data.message);
                    this.$router.push('/');
                }
            })
            .catch((err) => {
                this.$toast.error("Không thể lấy thông tin hóa đơn.");
            });
        },
        formatVND(value) {
            if (!value) return "0 ₫";
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },

        thanhToanAction() {
            if (this.method === 1) {
                // Ví điện tử
                if(this.selectedWallet === 'momo') {
                    this.$toast.info("Tính năng thanh toán MoMo đang được bảo trì. Vui lòng chọn VNPay!");
                    return;
                }

                this.isLoading = true;
                const idGuiDi = this.hoa_don.id || this.hoa_don.id_hoa_don || this.ma_hoa_don;

                axios.post(apiUrl('client/vnpay/tao-thanh-toan'), {
                    id_hoa_don: idGuiDi
                }, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
                })
                .then(response => {
                    if (response.data.status) {
                        this.$toast.success("Đang kết nối cổng thanh toán VNPAY...");
                        window.location.href = response.data.data;
                    } else {
                        this.$toast.error(response.data.message || 'Có lỗi xảy ra khi tạo link thanh toán.');
                        this.isLoading = false;
                    }
                })
                .catch(error => {
                    this.$toast.error('Không thể kết nối cổng thanh toán. Vui lòng thử lại sau.');
                    this.isLoading = false;
                });
            } 
            else if (this.method === 2) {
                // Chuyển khoản QR: Đẩy qua màn kết quả trạng thái Pending
                this.isLoading = true;
                setTimeout(() => {
                    this.isLoading = false;
                    this.is_show_modal = false;
                    this.$router.push({
                        path: '/Ket-qua-thanh-toan',
                        query: {
                            method: 'bank_transfer',
                            amount: this.hoa_don.tong_tien,
                            txnRef: 'HDTOUR' + this.hoa_don.id 
                        }
                    });
                }, 800);
            }
        }
    }
}
</script>

<style scoped>
.modal-payment-drawer {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; justify-content: flex-end; 
}
.drawer-content {
    background: white; width: 450px; height: 100%; display: flex; flex-direction: column;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.2);
}
.drawer-header { padding: 20px 25px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
.drawer-body { padding: 25px; flex: 1; overflow-y: auto; background-color: #fdfdfd; }
.drawer-footer { padding: 20px 25px; border-top: 1px solid #f0f0f0; background: #ffffff; box-shadow: 0 -4px 15px rgba(0,0,0,0.03); }

.payment-item { border: 2px solid #eef0f2; border-radius: 12px; padding: 18px; cursor: pointer; background-color: #fff; transition: all 0.2s ease; }
.payment-item:hover { border-color: #d1d5db; }
.payment-item.active { border-color: #005baa; background-color: #f8fbff; box-shadow: 0 4px 15px rgba(0, 91, 186, 0.1); }

.icon-box {
    width: 45px; height: 45px; background: #f0f2f5; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 20px; color: #6c757d; transition: all 0.2s ease;
}
.payment-item.active .icon-box { background: #005baa; color: white; }
.form-check-input { width: 1.3em; height: 1.3em; }
.form-check-input:checked { background-color: #005baa; border-color: #005baa; }
</style>