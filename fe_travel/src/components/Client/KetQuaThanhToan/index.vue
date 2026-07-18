<template>
    <main
        class="payment-result-page"
        :class="{
            'status-success': isSuccess,
            'status-pending': isPending,
            'status-error': !isLoading && !isSuccess && !isPending
        }"
    >
        <div class="background-grid" aria-hidden="true"></div>
        <div class="ambient-shape shape-left" aria-hidden="true"></div>
        <div class="ambient-shape shape-right" aria-hidden="true"></div>

        <div class="result-shell">
            <button type="button" class="brand" aria-label="Về trang chủ IxtalTour" @click="goHome">
                <span class="brand-mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 15.5 12 4l8 11.5-8 4.5-8-4.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                        <path d="m8.5 13.8 3.5-5 3.5 5L12 16l-3.5-2.2Z" fill="currentColor"/>
                    </svg>
                </span>
                <span>IXTAL<span>TOUR</span></span>
            </button>

            <section class="result-card" aria-live="polite" :aria-busy="isLoading">
                <div class="card-accent" aria-hidden="true"></div>

                <div v-if="isLoading" class="state-content loading-state" role="status">
                    <div class="status-visual loading-visual" aria-hidden="true">
                        <span class="loading-ring"></span>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 3 5 6v5c0 4.7 3 8.5 7 10 4-1.5 7-5.3 7-10V6l-7-3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                            <path d="m9.5 12 1.7 1.7 3.6-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <span class="status-kicker">Giao dịch an toàn</span>
                    <h1 class="result-title">Đang xác thực thanh toán</h1>
                    <p class="result-description">
                        Hệ thống đang kết nối với cổng thanh toán. Vui lòng giữ nguyên trang trong giây lát.
                    </p>
                    <div class="loading-progress" aria-hidden="true"><span></span></div>
                    <div class="secure-note">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" stroke-width="1.8"/>
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8"/>
                        </svg>
                        Dữ liệu giao dịch đang được mã hóa và bảo vệ
                    </div>
                </div>

                <div v-else class="state-content">
                    <div class="status-visual" :class="statusVisualClass" aria-hidden="true">
                        <svg v-if="isSuccess" viewBox="0 0 24 24" fill="none">
                            <path d="m7.2 12.3 3.1 3.1 6.8-7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg v-else-if="isPending" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 7.8v4.7l3 1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="none">
                            <path d="m8.2 8.2 7.6 7.6m0-7.6-7.6 7.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                        </svg>
                    </div>

                    <span class="status-kicker">{{ statusKicker }}</span>
                    <h1 class="result-title">{{ statusTitle }}</h1>
                    <p class="result-description">{{ statusDescription }}</p>

                    <div v-if="isSuccess || isPending" class="payment-progress" aria-label="Tiến trình thanh toán">
                        <div class="progress-step is-complete">
                            <span class="step-dot"><i class="fa-solid fa-check"></i></span>
                            <span>Khởi tạo</span>
                        </div>
                        <span class="step-line is-complete" aria-hidden="true"></span>
                        <div class="progress-step" :class="isSuccess ? 'is-complete' : 'is-active'">
                            <span class="step-dot">
                                <i :class="isSuccess ? 'fa-solid fa-check' : 'fa-solid fa-ellipsis'"></i>
                            </span>
                            <span>Xác thực</span>
                        </div>
                        <span class="step-line" :class="{ 'is-complete': isSuccess }" aria-hidden="true"></span>
                        <div class="progress-step" :class="{ 'is-complete': isSuccess }">
                            <span class="step-dot"><i v-if="isSuccess" class="fa-solid fa-check"></i></span>
                            <span>Hoàn tất</span>
                        </div>
                    </div>

                    <div v-if="isSuccess || isPending" class="transaction-panel">
                        <div class="panel-heading">
                            <span class="panel-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M7 3h10a2 2 0 0 1 2 2v16l-3-2-4 2-4-2-3 2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                                    <path d="M8.5 8h7M8.5 12h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                                </svg>
                            </span>
                            <div>
                                <strong>Chi tiết giao dịch</strong>
                                <small>Thông tin thanh toán của bạn</small>
                            </div>
                        </div>

                        <div class="transaction-row">
                            <span>{{ isSuccess ? 'Số tiền đã thanh toán' : 'Số tiền cần thanh toán' }}</span>
                            <strong class="amount-value">{{ formatVND(orderInfo.amount) }}</strong>
                        </div>
                        <div class="transaction-row">
                            <span>Mã giao dịch</span>
                            <strong class="code-value">{{ displayValue(orderInfo.transactionId) }}</strong>
                        </div>
                        <div class="transaction-row">
                            <span>Phương thức</span>
                            <strong>{{ displayValue(orderInfo.bank) }}</strong>
                        </div>
                    </div>

                    <div v-else class="error-message">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 8v4.5m0 3.5h.01M10.3 4.9 3.2 17.2A2 2 0 0 0 4.9 20h14.2a2 2 0 0 0 1.7-2.8L13.7 4.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ errorMessage }}</span>
                    </div>

                    <div v-if="isPending" class="automatic-check">
                        <span class="check-pulse" aria-hidden="true"></span>
                        Hệ thống đang tự động kiểm tra trạng thái mỗi 5 giây
                    </div>
                    <div v-else-if="isSuccess" class="success-note">
                        <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
                        Thanh toán đã được xác nhận an toàn
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="action-btn secondary-btn" @click="goHome">
                            <i class="fa-solid fa-house" aria-hidden="true"></i>
                            Về trang chủ
                        </button>
                        <button type="button" class="action-btn primary-btn" @click="goProfile">
                            <i :class="isSuccess ? 'fa-solid fa-ticket' : 'fa-solid fa-clock-rotate-left'" aria-hidden="true"></i>
                            {{ isSuccess ? 'Xem vé của tôi' : 'Lịch sử đơn hàng' }}
                        </button>
                    </div>
                </div>
            </section>

            <p class="support-text">
                Cần hỗ trợ?
                <button type="button" @click="goContact">Liên hệ IxtalTour</button>
            </p>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import confetti from 'canvas-confetti';
import apiUrl from '../../../utils/api';

export default {
    name: 'KetQuaThanhToan',
    data() {
        return {
            isLoading: true,
            isSuccess: false,
            isPending: false,
            pendingMessage: '',
            pendingGateway: null,
            errorMessage: '',
            orderInfo: {
                amount: 0,
                transactionId: '',
                bank: ''
            },
            hoaDonId: null,
            pollingInterval: null,
            fireworkInterval: null,
            fireworkTimeout: null
        };
    },
    computed: {
        statusVisualClass() {
            if (this.isSuccess) return 'success-visual';
            if (this.isPending) return 'pending-visual';
            return 'error-visual';
        },
        statusKicker() {
            if (this.isSuccess) return 'Giao dịch hoàn tất';
            if (this.isPending) return 'Đang chờ xác nhận';
            return 'Thanh toán chưa hoàn tất';
        },
        statusTitle() {
            if (this.isSuccess) return 'Thanh toán thành công!';
            if (this.isPending) return 'Giao dịch đang được xử lý';
            return 'Giao dịch không thành công';
        },
        statusDescription() {
            if (this.isSuccess) {
                return 'Cảm ơn bạn đã đồng hành cùng IxtalTour. Đơn hàng đã được xác nhận và vé đã sẵn sàng.';
            }
            if (this.isPending) return this.pendingMessage;
            return 'Đừng lo, tài khoản của bạn sẽ không bị trừ tiền nếu giao dịch chưa được xác nhận.';
        }
    },
    watch: {
        isSuccess(value, previousValue) {
            if (value && !previousValue) {
                this.$nextTick(() => this.launchFireworks());
            }
        }
    },
    mounted() {
        this.verifyPayment();
    },
    beforeUnmount() {
        this.stopPolling();
        this.stopFireworks();
    },
    methods: {
        verifyPayment() {
            const queryParams = this.$route.query;

            if (queryParams.gateway === 'payos' || queryParams.orderCode) {
                this.verifyPayOSPayment(queryParams);
                return;
            }

            if (queryParams.method === 'bank_transfer') {
                this.isLoading = false;
                this.isPending = true;
                this.pendingMessage = 'Bạn đã chọn chuyển khoản thủ công. Vui lòng chờ quản trị viên kiểm tra tài khoản ngân hàng và xác nhận đơn hàng.';
                this.pendingGateway = 'manual';
                this.orderInfo.amount = queryParams.amount || 0;
                this.orderInfo.transactionId = queryParams.txnRef || '';
                this.orderInfo.bank = 'MB Bank · Chuyển khoản QR';

                if (this.orderInfo.transactionId) {
                    this.hoaDonId = this.orderInfo.transactionId.replace('HDTOUR', '');
                    this.startPolling();
                }
                return;
            }

            if (queryParams.vnp_ResponseCode !== '00') {
                this.isLoading = false;
                this.isSuccess = false;
                this.errorMessage = 'Giao dịch đã bị hủy hoặc gặp lỗi trong quá trình thực hiện tại VNPAY.';
                return;
            }

            axios.get(apiUrl('client/vnpay/check-thanh-toan'), {
                params: queryParams,
                headers: { Authorization: 'Bearer ' + localStorage.getItem('key_client') }
            })
                .then((res) => {
                    this.isLoading = false;
                    if (res.data.status) {
                        this.isSuccess = true;
                        this.orderInfo.amount = queryParams.vnp_Amount / 100;
                        this.orderInfo.transactionId = queryParams.vnp_TransactionNo;
                        this.orderInfo.bank = queryParams.vnp_BankCode || 'VNPAY';
                    } else {
                        this.isSuccess = false;
                        this.errorMessage = res.data.message || 'Xác thực chữ ký thanh toán thất bại.';
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.isSuccess = false;
                    this.errorMessage = 'Không thể kết nối với máy chủ để xác thực giao dịch.';
                    console.error(error);
                });
        },

        verifyPayOSPayment(queryParams) {
            const orderCode = queryParams.orderCode;

            if (!orderCode) {
                this.isLoading = false;
                this.errorMessage = 'Không tìm thấy mã giao dịch payOS.';
                return;
            }

            axios.get(apiUrl('client/payos/check-thanh-toan'), {
                params: { order_code: orderCode },
                headers: { Authorization: 'Bearer ' + localStorage.getItem('key_client') }
            })
                .then((res) => {
                    this.isLoading = false;

                    if (!res.data.status) {
                        this.errorMessage = res.data.message || 'Không thể xác thực giao dịch payOS.';
                        return;
                    }

                    const payment = res.data.data;
                    this.orderInfo.amount = payment.amount || 0;
                    this.orderInfo.transactionId = payment.reference || payment.payment_link_id || payment.order_code;
                    this.orderInfo.bank = 'payOS · Chuyển khoản ngân hàng';
                    this.hoaDonId = payment.hoa_don_id;

                    if (payment.status === 'PAID') {
                        this.isSuccess = true;
                        this.isPending = false;
                    } else if (payment.status === 'CANCELLED' || queryParams.cancel === 'true') {
                        this.isSuccess = false;
                        this.isPending = false;
                        this.errorMessage = 'Bạn đã hủy giao dịch payOS.';
                    } else {
                        this.isPending = true;
                        this.pendingMessage = 'payOS đang chờ ngân hàng xác nhận giao dịch. Trạng thái sẽ được cập nhật tự động ngay khi hoàn tất.';
                        this.pendingGateway = 'payos';
                        this.startPolling();
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.isSuccess = false;
                    this.errorMessage = error.response?.data?.message || 'Không thể kết nối máy chủ để xác thực payOS.';
                });
        },

        startPolling() {
            this.stopPolling();
            this.pollingInterval = window.setInterval(() => {
                this.checkStatusBackend();
            }, 5000);
        },

        stopPolling() {
            if (this.pollingInterval) {
                window.clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }
        },

        checkStatusBackend() {
            if (!this.hoaDonId) return;

            axios.get(apiUrl('client/hoa-don/check-trang-thai/' + this.hoaDonId), {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('key_client') }
            })
                .then((res) => {
                    if (!res.data.status) return;

                    if (res.data.trang_thai == 2) {
                        this.stopPolling();
                        this.isPending = false;
                        this.isSuccess = true;
                        this.$toast.success(this.pendingGateway === 'payos'
                            ? 'payOS đã xác nhận thanh toán thành công!'
                            : 'Admin đã xác nhận thanh toán thành công!');
                    } else if (res.data.trang_thai == 0) {
                        this.stopPolling();
                        this.isPending = false;
                        this.isSuccess = false;
                        this.errorMessage = 'Hóa đơn của bạn đã bị hủy bởi Quản trị viên.';
                        this.$toast.error('Hóa đơn đã bị hủy.');
                    }
                })
                .catch((error) => console.error('Lỗi kiểm tra trạng thái giao dịch:', error));
        },

        launchFireworks() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            this.stopFireworks();
            const colors = ['#16a074', '#22c55e', '#fbbf24', '#38bdf8', '#8b5cf6', '#fb7185'];
            const defaults = {
                colors,
                disableForReducedMotion: true,
                zIndex: 9999
            };

            confetti({
                ...defaults,
                particleCount: 90,
                angle: 60,
                spread: 65,
                startVelocity: 52,
                origin: { x: 0, y: 0.72 }
            });
            confetti({
                ...defaults,
                particleCount: 90,
                angle: 120,
                spread: 65,
                startVelocity: 52,
                origin: { x: 1, y: 0.72 }
            });

            const shootFirework = () => {
                confetti({
                    ...defaults,
                    particleCount: 42,
                    spread: 360,
                    ticks: 75,
                    gravity: 0.85,
                    decay: 0.92,
                    startVelocity: 30,
                    scalar: 0.9,
                    origin: {
                        x: 0.15 + Math.random() * 0.7,
                        y: 0.15 + Math.random() * 0.35
                    }
                });
            };

            shootFirework();
            this.fireworkInterval = window.setInterval(shootFirework, 320);
            this.fireworkTimeout = window.setTimeout(() => this.stopFireworks(false), 3200);
        },

        stopFireworks(resetCanvas = true) {
            if (this.fireworkInterval) {
                window.clearInterval(this.fireworkInterval);
                this.fireworkInterval = null;
            }
            if (this.fireworkTimeout) {
                window.clearTimeout(this.fireworkTimeout);
                this.fireworkTimeout = null;
            }
            if (resetCanvas) confetti.reset();
        },

        goHome() {
            this.$router.push('/');
        },
        goProfile() {
            this.$router.push('/client/lich-su-dat-tour');
        },
        goContact() {
            this.$router.push('/client/lien-he');
        },
        displayValue(value) {
            return value || 'Đang cập nhật';
        },
        formatVND(value) {
            const amount = Number(value) || 0;
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        }
    }
};
</script>

<style scoped>
.payment-result-page {
    --status-color: #64748b;
    --status-soft: #f1f5f9;
    position: relative;
    display: grid;
    min-height: 100vh;
    place-items: center;
    overflow: hidden;
    padding: 32px 20px;
    color: #17212b;
    background:
        radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.98), transparent 42%),
        linear-gradient(145deg, #eef8f5 0%, #f7fafc 48%, #eef4fb 100%);
    font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
    isolation: isolate;
}

.payment-result-page.status-success {
    --status-color: #12936b;
    --status-strong: #087a57;
    --status-soft: #e9f8f2;
}

.payment-result-page.status-pending {
    --status-color: #d58a0a;
    --status-strong: #a96800;
    --status-soft: #fff7df;
}

.payment-result-page.status-error {
    --status-color: #dc4c64;
    --status-strong: #bb2945;
    --status-soft: #fff0f3;
}

.background-grid {
    position: absolute;
    inset: 0;
    z-index: -3;
    opacity: 0.35;
    background-image:
        linear-gradient(rgba(30, 91, 79, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30, 91, 79, 0.06) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
}

.ambient-shape {
    position: absolute;
    z-index: -2;
    width: 430px;
    height: 430px;
    border-radius: 50%;
    filter: blur(12px);
    opacity: 0.55;
    animation: drift 9s ease-in-out infinite alternate;
}

.shape-left {
    top: -190px;
    left: -150px;
    background: radial-gradient(circle, rgba(83, 206, 166, 0.26), transparent 68%);
}

.shape-right {
    right: -170px;
    bottom: -210px;
    background: radial-gradient(circle, rgba(81, 151, 231, 0.22), transparent 68%);
    animation-delay: -4s;
}

.result-shell {
    width: min(100%, 720px);
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 auto 18px;
    padding: 6px 10px;
    border: 0;
    color: #18362f;
    background: transparent;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.12em;
    cursor: pointer;
}

.brand > span:last-child > span {
    color: #12936b;
}

.brand-mark {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border-radius: 11px;
    color: #fff;
    background: linear-gradient(145deg, #19a97c, #087a5b);
    box-shadow: 0 8px 18px rgba(18, 147, 107, 0.25);
}

.brand-mark svg {
    width: 22px;
    height: 22px;
}

.result-card {
    position: relative;
    overflow: hidden;
    padding: 46px 54px 42px;
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.94);
    box-shadow:
        0 30px 80px rgba(29, 59, 74, 0.13),
        0 3px 12px rgba(29, 59, 74, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
}

.card-accent {
    position: absolute;
    top: 0;
    left: 18%;
    width: 64%;
    height: 4px;
    border-radius: 0 0 10px 10px;
    background: linear-gradient(90deg, transparent, var(--status-color), transparent);
}

.state-content {
    text-align: center;
}

.status-visual {
    position: relative;
    display: grid;
    width: 90px;
    height: 90px;
    place-items: center;
    margin: 0 auto 22px;
    border-radius: 29px;
    color: #fff;
    background: linear-gradient(145deg, var(--status-color), var(--status-strong));
    box-shadow: 0 18px 35px color-mix(in srgb, var(--status-color) 30%, transparent);
    transform: rotate(-3deg);
    animation: icon-arrive 0.65s cubic-bezier(0.2, 0.8, 0.2, 1.2) both;
}

.status-visual::before,
.status-visual::after {
    position: absolute;
    content: "";
    border: 1px solid color-mix(in srgb, var(--status-color) 30%, transparent);
    border-radius: 35px;
    inset: -9px;
    animation: status-pulse 2.2s ease-out infinite;
}

.status-visual::after {
    inset: -17px;
    animation-delay: 0.7s;
}

.status-visual svg {
    width: 48px;
    height: 48px;
}

.pending-visual {
    transform: rotate(0deg);
}

.error-visual {
    transform: rotate(3deg);
}

.loading-visual {
    --status-color: #18896a;
    --status-strong: #0b6b53;
    transform: none;
}

.loading-visual::before,
.loading-visual::after {
    display: none;
}

.loading-visual svg {
    width: 39px;
    height: 39px;
}

.loading-ring {
    position: absolute;
    inset: -8px;
    border: 3px solid rgba(24, 137, 106, 0.12);
    border-top-color: #2ab487;
    border-radius: 33px;
    animation: spin 1s linear infinite;
}

.status-kicker {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    margin-bottom: 12px;
    padding: 5px 12px;
    border: 1px solid color-mix(in srgb, var(--status-color) 17%, transparent);
    border-radius: 999px;
    color: var(--status-strong, #496071);
    background: var(--status-soft);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
}

.result-title {
    margin: 0 0 12px;
    color: #12221f;
    font-size: clamp(29px, 5vw, 39px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.035em;
}

.result-description {
    max-width: 540px;
    margin: 0 auto;
    color: #65736f;
    font-size: 15px;
    line-height: 1.7;
}

.loading-state {
    padding: 28px 0 18px;
}

.loading-progress {
    position: relative;
    height: 6px;
    max-width: 360px;
    overflow: hidden;
    margin: 32px auto 20px;
    border-radius: 999px;
    background: #e8efed;
}

.loading-progress span {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, transparent, #21aa81, #7bd5b8, transparent);
    transform: translateX(-100%);
    animation: loading-slide 1.4s ease-in-out infinite;
}

.secure-note,
.success-note,
.automatic-check {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #74827e;
    font-size: 13px;
}

.secure-note svg {
    width: 17px;
    height: 17px;
    color: #329478;
}

.payment-progress {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr auto;
    align-items: start;
    margin: 30px auto;
    padding: 0 12px;
}

.progress-step {
    display: grid;
    justify-items: center;
    gap: 8px;
    min-width: 72px;
    color: #9aa6a2;
    font-size: 11px;
    font-weight: 700;
}

.step-dot {
    display: grid;
    width: 27px;
    height: 27px;
    place-items: center;
    border: 2px solid #dfe7e4;
    border-radius: 50%;
    color: #fff;
    background: #fff;
    font-size: 10px;
}

.progress-step.is-complete,
.progress-step.is-active {
    color: var(--status-strong);
}

.progress-step.is-complete .step-dot {
    border-color: var(--status-color);
    background: var(--status-color);
}

.progress-step.is-active .step-dot {
    border-color: var(--status-color);
    color: var(--status-color);
    background: var(--status-soft);
    animation: dot-pulse 1.6s ease-in-out infinite;
}

.step-line {
    height: 2px;
    margin-top: 13px;
    border-radius: 999px;
    background: #e3eae8;
}

.step-line.is-complete {
    background: var(--status-color);
}

.transaction-panel {
    overflow: hidden;
    margin-top: 10px;
    border: 1px solid #e6ecea;
    border-radius: 19px;
    background: #fbfdfc;
    text-align: left;
}

.panel-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-bottom: 1px solid #e9eeec;
    background: #f6faf8;
}

.panel-heading > div {
    display: grid;
    gap: 2px;
}

.panel-heading strong {
    color: #25332f;
    font-size: 14px;
}

.panel-heading small {
    color: #8a9793;
    font-size: 11px;
}

.panel-icon {
    display: grid;
    width: 36px;
    height: 36px;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 11px;
    color: var(--status-color);
    background: var(--status-soft);
}

.panel-icon svg {
    width: 20px;
    height: 20px;
}

.transaction-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 49px;
    margin: 0 18px;
    border-bottom: 1px dashed #e5ebe9;
    color: #75817e;
    font-size: 13px;
}

.transaction-row:last-child {
    border-bottom: 0;
}

.transaction-row strong {
    max-width: 58%;
    overflow-wrap: anywhere;
    color: #263530;
    font-size: 13px;
    text-align: right;
}

.transaction-row .amount-value {
    color: var(--status-strong);
    font-size: 17px;
}

.code-value {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    letter-spacing: 0.02em;
}

.automatic-check,
.success-note {
    margin-top: 17px;
    color: var(--status-strong);
}

.success-note i {
    font-size: 15px;
}

.check-pulse {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--status-color);
}

.check-pulse::after {
    position: absolute;
    content: "";
    border: 1px solid var(--status-color);
    border-radius: 50%;
    inset: -4px;
    animation: status-pulse 1.6s ease-out infinite;
}

.error-message {
    display: flex;
    align-items: flex-start;
    gap: 11px;
    margin-top: 28px;
    padding: 15px 17px;
    border: 1px solid #ffd9e0;
    border-radius: 15px;
    color: #8d3445;
    background: #fff6f7;
    font-size: 13px;
    line-height: 1.55;
    text-align: left;
}

.error-message svg {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    margin-top: 1px;
}

.action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 28px;
}

.action-btn {
    display: inline-flex;
    min-height: 50px;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 12px 18px;
    border: 1px solid transparent;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
}

.secondary-btn {
    border-color: #dce5e2;
    color: #34443f;
    background: #fff;
}

.secondary-btn:hover {
    border-color: #cbd8d4;
    background: #f7faf9;
    box-shadow: 0 8px 20px rgba(45, 72, 65, 0.08);
}

.primary-btn {
    color: #fff;
    background: linear-gradient(135deg, var(--status-color), var(--status-strong));
    box-shadow: 0 11px 24px color-mix(in srgb, var(--status-color) 25%, transparent);
}

.primary-btn:hover {
    box-shadow: 0 14px 30px color-mix(in srgb, var(--status-color) 34%, transparent);
}

.brand:focus-visible,
.action-btn:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--status-color) 30%, transparent);
    outline-offset: 3px;
}

.support-text {
    margin: 17px 0 0;
    color: #83908c;
    font-size: 12px;
    text-align: center;
}

.support-text button {
    padding: 0;
    border: 0;
    color: #357a68;
    background: transparent;
    font: inherit;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
}

.support-text button:hover {
    text-decoration: underline;
}

.support-text button:focus-visible {
    border-radius: 3px;
    outline: 2px solid #60ae96;
    outline-offset: 3px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes icon-arrive {
    from { opacity: 0; transform: scale(0.5) rotate(-12deg); }
    to { opacity: 1; transform: scale(1) rotate(-3deg); }
}

@keyframes status-pulse {
    0% { opacity: 0.75; transform: scale(0.88); }
    80%, 100% { opacity: 0; transform: scale(1.13); }
}

@keyframes dot-pulse {
    50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--status-color) 12%, transparent); }
}

@keyframes loading-slide {
    50%, 100% { transform: translateX(100%); }
}

@keyframes drift {
    to { transform: translate3d(28px, 20px, 0) scale(1.08); }
}

@media (max-width: 640px) {
    .payment-result-page {
        align-items: start;
        padding: 18px 14px 24px;
    }

    .brand {
        margin-bottom: 12px;
    }

    .result-card {
        padding: 34px 20px 25px;
        border-radius: 23px;
    }

    .status-visual {
        width: 78px;
        height: 78px;
        margin-bottom: 20px;
        border-radius: 25px;
    }

    .status-visual svg {
        width: 42px;
        height: 42px;
    }

    .result-title {
        font-size: 28px;
    }

    .result-description {
        font-size: 14px;
    }

    .payment-progress {
        margin: 26px -4px;
        padding: 0;
    }

    .progress-step {
        min-width: 60px;
        font-size: 10px;
    }

    .transaction-row {
        margin: 0 14px;
    }

    .transaction-row strong {
        max-width: 55%;
    }

    .action-buttons {
        grid-template-columns: 1fr;
    }

    .primary-btn {
        grid-row: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .ambient-shape,
    .status-visual,
    .status-visual::before,
    .status-visual::after,
    .loading-ring,
    .loading-progress span,
    .progress-step.is-active .step-dot,
    .check-pulse::after {
        animation: none !important;
    }

    .action-btn {
        transition: none;
    }
}
</style>
