<template>
    <div class="chat-widget-wrapper">
        <transition name="fade">
            <div v-if="!isOpen && showWelcome" class="welcome-tooltip shadow-lg" :style="tooltipStyle">
                👋 Chào mừng đến với Ixtal Tour! <br /> Bạn muốn tìm tour, đặt vé hay xem lịch sử?
                <button class="close-welcome" @click.stop="showWelcome = false">×</button>
            </div>
        </transition>

        <div class="chat-toggle shadow-lg" 
             @mousedown="startDragBot" 
             @click="toggleChat" 
             :class="{ 'is-open': isOpen }"
             :style="toggleStyle"
             ref="chatToggleBtn">
            <i v-if="!isOpen" class="fa-solid fa-headset"></i>
            <i v-else class="fa-solid fa-xmark"></i>
        </div>

        <transition name="fade-slide">
            <div v-show="isOpen" class="chat-box shadow-lg" :style="chatBoxStyle">

                <!-- Sửa phần Header -->
                <div class="chat-header text-white p-3 d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <!-- Logo -->
                        <img src="https://ixtaltravel.deloydz.io.vn/assets/Logo-3-KgfldS.png" 
                            style="width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; background: white; padding: 2px;">
                        <div>
                            <h6 class="mb-0 fw-bold text-white">Ixtal Travel AI</h6>
                            <small style="font-size: 10px; opacity: 0.9;">Luôn sẵn sàng hỗ trợ</small>
                        </div>
                    </div>
                    <button class="btn btn-sm text-white border-0" @click="clearChat"><i class="fa-solid fa-rotate"></i></button>
                    <button class="btn btn-sm text-white border-0" @click="toggleChat"><i class="fa-solid fa-chevron-down fs-5"></i></button>
                </div>

                <div class="chat-messages" ref="messagesContainer">
                    <div v-for="(msg, index) in messages" :key="index" class="msg-wrapper"
                        :class="msg.from === 'user' ? 'is-user' : 'is-bot'">

                        <div v-if="msg.from === 'bot'" class="bot-avatar me-2 shadow-sm">
                            <i class="fa-solid fa-plane"></i>
                        </div>

                        <div class="msg-content-wrapper" :style="{ maxWidth: msg.type === 'booking' ? '95%' : '85%' }">
                            
                            <div v-if="msg.type === 'text' || !msg.type">
                                <div class="msg-bubble shadow-sm" v-html="msg.text"></div>
                            </div>

                            <div v-if="msg.type === 'tours' && msg.tours && msg.tours.length > 0" class="tour-cards-container">
                                <div class="msg-bubble shadow-sm mb-2" v-html="msg.text"></div>
                                <div v-for="(tour, tIndex) in msg.tours" :key="tIndex" class="chat-tour-card shadow-sm" @click="viewTour(tour.id)">
                                    <img :src="getImageUrl(getFirstImage(tour.hinh_anh))" alt="Tour" class="tour-img">
                                    <div class="tour-info">
                                        <h6 class="tour-title">{{ tour.ten_tour }}</h6>
                                        <div class="tour-meta d-flex align-items-center gap-2">
                                            <span class="text-warning fw-bold" style="font-size: 12px;">
                                                <i class="fa-solid fa-star"></i> 
                                                {{ tour.avg_sao ? Number(tour.avg_sao).toFixed(1) : '0.0' }}
                                            </span>
                                            <span class="text-primary fw-medium" style="font-size: 11px;">
                                                <i class="fa-solid fa-users"></i> Còn {{ tour.so_nguoi_toi_da }} chỗ
                                            </span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center mt-2">
                                            <div class="tour-price">{{ formatVND(tour.gia) }}</div>
                                            <button class="btn btn-danger btn-book shadow-sm px-3 py-1 fw-bold" @click.stop="startBookingFlow(tour)">Đặt ngay</button>
                                        </div>
                                    </div>
                                </div>
                                <button v-if="msg.hasMore" @click="loadMoreTours(msg.keyword_used, index)" class="btn btn-outline-primary btn-sm w-100 mt-2 rounded-pill fw-bold">
                                    <i class="fa-solid fa-rotate-right me-1"></i> Xem thêm 5 tour nữa
                                </button>
                            </div>

                            <div v-if="msg.type === 'booking'" class="booking-form-bubble shadow-sm">
                                <h6 class="text-primary fw-bold mb-2 border-bottom pb-2 text-center" style="font-size: 13px;">
                                    <i class="fa-solid fa-cart-flatbed-suitcase me-1"></i> XÁC NHẬN ĐẶT TOUR
                                </h6>
                                <p class="tour-name-booking">{{ msg.tour.ten_tour }}</p>
                                
                                <div class="d-flex justify-content-between small mb-2 p-2 bg-light rounded">
                                    <span>Giá: <b class="text-danger">{{ formatVND(msg.tour.gia) }}</b></span>
                                    <span>Trống: <b class="text-primary">{{ msg.tour.so_nguoi_toi_da }}</b></span>
                                </div>

                                <div class="mb-3 d-flex align-items-center justify-content-between">
                                    <label class="small fw-bold text-dark mb-0">Số lượng khách:</label>
                                    <div class="input-group custom-qty-group shadow-sm">
                                        <button class="btn btn-qty" @click="giamSoLuong(msg)">-</button>
                                        <input type="number" class="form-control text-center input-qty fw-bold" 
                                            v-model.number="msg.bookingData.qty" 
                                            @blur="validateSoLuong(msg)" 
                                            @input="limitInputLength($event, msg)">
                                        <button class="btn btn-qty" @click="tangSoLuong(msg)">+</button>
                                    </div>
                                </div>

                                <div class="mb-2" v-if="msg.bookingData.qty >= 2">
                                    <label class="small fw-bold text-danger mb-1">Thông tin người đi cùng (*):</label>
                                    <textarea class="form-control form-control-sm custom-textarea" rows="2" v-model="msg.bookingData.ghi_chu" placeholder="Họ tên - SĐT - Ngày sinh..."></textarea>
                                </div>

                                <div class="mb-3">
                                    <label class="small fw-bold text-dark mb-1">Thanh toán qua:</label>
                                    <select class="form-select form-select-sm custom-select" v-model="msg.bookingData.phuong_thuc">
                                        <option value="VNPAY">💳 Ví VNPay</option>
                                        <option value="Chuyển khoản">🏦 Chuyển khoản ngân hàng</option>
                                        <option value="Tiền mặt">💵 Tiền mặt tại văn phòng</option>
                                    </select>
                                </div>

                                <div class="p-2 rounded text-center mb-3 total-price-box">
                                    <span class="small text-muted fw-bold">Tổng tiền thanh toán:</span><br>
                                    <span class="text-success fs-5 fw-bold">{{ formatVND(msg.tour.gia * msg.bookingData.qty) }}</span>
                                </div>

                                <div class="d-flex gap-2">
                                    <button class="btn btn-success btn-sm w-100 fw-bold shadow-sm rounded-pill py-2" @click="submitBooking(msg)" :disabled="isTyping">
                                        Xác nhận đặt
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm w-100 fw-bold shadow-sm rounded-pill py-2" @click="cancelBooking(index)">
                                        Hủy bỏ
                                    </button>
                                </div>
                            </div>

                            <div v-if="msg.type === 'invoice'" class="invoice-bubble shadow-sm text-center">
                                <div class="mb-2 text-success"><i class="fa-solid fa-circle-check fs-1"></i></div>
                                <h6 class="fw-bold">LƯU ĐƠN HÀNG THÀNH CÔNG</h6>
                                <p class="small text-muted mb-2">Mã Hóa Đơn: <b>{{ msg.invoice.ma_hoa_don }}</b></p>
                                
                                <div v-if="msg.invoice.phuong_thuc_thanh_toan === 'VNPAY'" class="alert alert-info p-2 small">
                                    Đang chuyển hướng sang cổng VNPay...
                                </div>
                                <div v-else-if="msg.invoice.phuong_thuc_thanh_toan === 'Chuyển khoản'" class="mt-2">
                                    <img :src="msg.invoice.qr_link" alt="QR Code" class="img-fluid rounded border mb-2" style="width: 150px;">
                                    <p class="small mb-0">Quét mã QR để thanh toán.</p>
                                </div>
                                <div v-else class="alert alert-warning p-2 small mt-2">
                                    Vui lòng thanh toán tại VP: 03 Quang Trung trong 24h tới.
                                </div>
                                
                                <button class="btn btn-outline-primary btn-sm mt-2 w-100" @click="viewHistory">Xem lịch sử đặt tour</button>
                            </div>

                            <div v-if="msg.buttons && msg.buttons.length > 0 && msg.type === 'text'" class="msg-buttons">
                                <button v-for="(btn, bIndex) in msg.buttons" :key="bIndex" @click="handleButton(btn)"
                                    class="bot-action-btn shadow-sm">
                                    {{ btn.text }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="isTyping" class="msg-wrapper is-bot mt-2">
                        <div class="bot-avatar me-2 shadow-sm"><i class="fa-solid fa-plane"></i></div>
                        <div class="typing-indicator msg-bubble shadow-sm">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>

                <div class="quick-actions-bar" ref="quickActionsBar" @mousedown="startDragQA" @mouseleave="stopDragQA"
                    @mouseup="stopDragQA" @mousemove="doDragQA">
                    
                    <button v-for="(action, index) in quickActions" :key="index"
                        @click="handleQuickAction(action.message)" :disabled="isTyping"
                        class="quick-action-btn shadow-sm">
                        {{ action.label }}
                    </button>
                </div>

                <div class="chat-input">
                    <input type="text" v-model="inputText" @keypress.enter="sendMessage"
                        placeholder="Gõ 'Đà Lạt', 'Giá rẻ'..." autocomplete="off" 
                        :disabled="isTyping"
                        ref="chatInput" />
                    <button class="send-btn shadow-sm" @click="sendMessage" :disabled="!inputText.trim() || isTyping">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import axios from "axios";
import apiUrl from "../../../utils/api";

export default {
    name: "ChatWidget",
    data() {
        return {
            isOpen: false,
            showWelcome: true,
            inputText: "",
            isTyping: false,
            messages: [],
            
            // --- THAY THẾ MẢNG NÀY ---
            quickActions: [
                { label: "🔥 Tour hot nhất", message: "tour hot" },
                { label: "👑 Đi Tour VIP 5 Sao", message: "tour vip 5 sao" },
                { label: "💑 Trăng mật lãng mạn", message: "tour lãng mạn cặp đôi" },
                { label: "🌸 Khám phá Đà Lạt", message: "đà lạt" },
                { label: "🏞️ Vi vu Miền Bắc", message: "miền bắc" },
                { label: "✈️ Đi Nước Ngoài", message: "tour nước ngoài" },
                { label: "💰 Rẻ dưới 2 triệu", message: "dưới 2 triệu" },
                { label: "📦 Lịch sử Hóa đơn", message: "lịch sử hóa đơn" },
                { label: "👨‍🏫 Xem Hướng dẫn viên", message: "thông tin hướng dẫn viên" },
                
            ],
            // ---------------------------
            
            // --- CẬP NHẬT BIẾN KÉO THẢ THANH GỢI Ý ---
            isDraggingQA: false,
            startXQA: 0,
            scrollLeftQA: 0,
            hasDraggedQA: false, // Biến mới để phân biệt là đang Click hay đang Kéo thanh trượt

            isDraggingBot: false,
            dragStartX: 0,
            dragStartY: 0,
            botPosition: { right: 30, bottom: 30 },
            hasMoved: false,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        };
    },
    // THÊM SỰ KIỆN REZISE
    mounted() {
        window.addEventListener('resize', this.updateWindowSize);
        setTimeout(() => { this.showWelcome = false; }, 10000);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateWindowSize);
    },
    computed: {
        toggleStyle() {
            return {
                right: this.botPosition.right + 'px',
                bottom: this.botPosition.bottom + 'px',
                transition: this.isDraggingBot ? 'none' : 'all 0.3s ease'
            };
        },
        chatBoxStyle() {
            // Giả định chiều rộng/cao của chatbox
            const chatWidth = this.windowWidth < 500 ? this.windowWidth * 0.95 : 390;
            const chatHeight = 600;
            let styles = {};

            // 1. XỬ LÝ HƯỚNG NGANG (Trái / Phải)
            let calculatedRight = Math.max(10, this.botPosition.right - 150);
            
            // Nếu nút bot bị kéo quá sang mép TRÁI -> Khung chat sẽ bị tràn mép trái
            if (calculatedRight + chatWidth > this.windowWidth) {
                styles.left = '10px';
                styles.right = 'auto'; // Hủy right, neo theo left
            } else {
                styles.right = calculatedRight + 'px';
                styles.left = 'auto';
            }

            // 2. XỬ LÝ HƯỚNG DỌC (Trên / Dưới)
            let calculatedBottom = this.botPosition.bottom + 85;

            // Nếu nút bot bị kéo quá lên TRẦN -> Khung chat sẽ bị tràn lên trên
            if (calculatedBottom + chatHeight > this.windowHeight) {
                // Nhảy xuống MỞ NGƯỢC XUỐNG DƯỚI
                styles.top = (this.windowHeight - this.botPosition.bottom + 10) + 'px';
                styles.bottom = 'auto';
                styles.transformOrigin = 'top right'; // Animation xuất hiện từ trên xuống
            } else {
                // Mở hướng lên trên như bình thường
                styles.bottom = calculatedBottom + 'px';
                styles.top = 'auto';
                styles.transformOrigin = 'bottom right'; // Animation xuất hiện từ dưới lên
            }

            return styles;
        },
        tooltipStyle() {
            let styles = {};
            let calculatedBottom = this.botPosition.bottom + 85;
            
            // Tương tự, tránh tooltip văng lên trần
            if (calculatedBottom + 100 > this.windowHeight) {
                styles.top = (this.windowHeight - this.botPosition.bottom + 10) + 'px';
                styles.bottom = 'auto';
            } else {
                styles.bottom = calculatedBottom + 'px';
                styles.top = 'auto';
            }

            // Tránh tooltip văng sang lề trái
            let calculatedRight = this.botPosition.right - 10;
            if (calculatedRight + 280 > this.windowWidth) {
                styles.left = '20px';
                styles.right = 'auto';
            } else {
                styles.right = calculatedRight + 'px';
                styles.left = 'auto';
            }
            return styles;
        }
    },
    /* Removed duplicate mounted() hook above. */
    watch: {
        isOpen(newVal) {
            if (newVal && this.messages.length === 0) {
                this.sendWelcomeMessage();
            }
        }
    },
    methods: {
        // --- KÉO THẢ THANH GỢI Ý ---
        startDragQA(e) {
            this.isDraggingQA = true;
            this.hasDraggedQA = false; // Reset trạng thái kéo
            this.startXQA = e.pageX - this.$refs.quickActionsBar.offsetLeft;
            this.scrollLeftQA = this.$refs.quickActionsBar.scrollLeft;
            this.$refs.quickActionsBar.style.cursor = 'grabbing';
        },
        stopDragQA() {
            this.isDraggingQA = false;
            if (this.$refs.quickActionsBar) this.$refs.quickActionsBar.style.cursor = 'grab';
        },
        doDragQA(e) {
            if (!this.isDraggingQA) return;
            e.preventDefault();
            const x = e.pageX - this.$refs.quickActionsBar.offsetLeft;
            const walk = (x - this.startXQA) * 1.5; 
            
            // Nếu người dùng kéo chuột đi một khoảng lớn hơn 3px -> Xác nhận đây là hành động KÉO, không phải CLICK
            if (Math.abs(walk) > 3) {
                this.hasDraggedQA = true;
            }
            
            this.$refs.quickActionsBar.scrollLeft = this.scrollLeftQA - walk;
        },

        // --- XỬ LÝ CLICK NÚT GỢI Ý ---
        handleQuickAction(msg) {
            // Chỉ gửi tin nhắn đi khi người dùng CLICK (Không gửi nếu đang kéo trượt thanh gợi ý)
            if (!this.hasDraggedQA) {
                this.sendMessageDirect(msg);
            }
        },
        // --- XỬ LÝ NÚT RESET CHAT ---
        clearChat() {
            this.messages = [];
            this.sendWelcomeMessage(); // Gọi lại lời chào ban đầu
        },
        // --- XỬ LÝ NHẬP SỐ LƯỢNG TRONG CHATBOT ---
        giamSoLuong(msg) {
            if (msg.bookingData.qty > 1) {
                msg.bookingData.qty--;
            }
        },
        tangSoLuong(msg) {
            if (msg.bookingData.qty < msg.tour.so_nguoi_toi_da) {
                msg.bookingData.qty++;
            } else {
                msg.bookingData.qty = msg.tour.so_nguoi_toi_da;
            }
        },
        limitInputLength(event, msg) {
            // Chặn gõ quá 3 chữ số
            let val = String(msg.bookingData.qty);
            if (val.length > 3) {
                msg.bookingData.qty = parseInt(val.slice(0, 3));
            }
            // Nếu vừa gõ mà lớn hơn số lượng tối đa thì ép về số tối đa luôn
            if (msg.bookingData.qty > msg.tour.so_nguoi_toi_da) {
                msg.bookingData.qty = msg.tour.so_nguoi_toi_da;
            }
        },
        validateSoLuong(msg) {
            // Ép kiểu về số nguyên khi click ra ngoài (blur)
            let val = parseInt(msg.bookingData.qty);
            
            // Nếu người dùng xóa trống hoặc gõ số âm, số 0 -> ép về 1
            if (isNaN(val) || val < 1) {
                msg.bookingData.qty = 1;
            } 
            // Nếu vượt quá số chỗ trống của tour -> ép về số chỗ còn trống
            else if (val > msg.tour.so_nguoi_toi_da) {
                msg.bookingData.qty = msg.tour.so_nguoi_toi_da;
            } 
            else {
                msg.bookingData.qty = val;
            }
        },
        // THÊM HÀM NÀY
        updateWindowSize() {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
        },
        // --- LOGIC KÉO THẢ NÚT BOT ---
        startDragBot(e) {
            this.isDraggingBot = true;
            this.hasMoved = false;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            
            window.addEventListener('mousemove', this.doDragBot);
            window.addEventListener('mouseup', this.stopDragBot);
        },
        doDragBot(e) {
            if (!this.isDraggingBot) return;
            
            const dx = e.clientX - this.dragStartX;
            const dy = e.clientY - this.dragStartY;
            
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.hasMoved = true;

            // Tính vị trí mới
            let newRight = this.botPosition.right - dx;
            let newBottom = this.botPosition.bottom - dy;

            // GIỚI HẠN VÙNG DI CHUYỂN
            // Tối thiểu là 10px cách lề, tối đa là chiều rộng/cao cửa sổ trừ đi kích thước nút
            const maxX = this.windowWidth - 75;
            const maxY = this.windowHeight - 75;

            this.botPosition.right = Math.min(Math.max(10, newRight), maxX);
            this.botPosition.bottom = Math.min(Math.max(10, newBottom), maxY);

            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
        },
        stopDragBot() {
            this.isDraggingBot = false;
            window.removeEventListener('mousemove', this.doDragBot);
            window.removeEventListener('mouseup', this.stopDragBot);
        },
        toggleChat() {
            if (this.hasMoved) return; // Nếu đang kéo thẻ thì ko tính là click
            this.isOpen = !this.isOpen;
            if (this.isOpen) this.showWelcome = false;
            this.scrollToBottom();
        },

        // --- XỬ LÝ ẢNH ---
        getFirstImage(hinh_anh) {
            if (!hinh_anh) return 'https://via.placeholder.com/400x300';
            if (Array.isArray(hinh_anh)) return hinh_anh.length > 0 ? hinh_anh[0] : 'https://via.placeholder.com/400x300';
            try {
                let parsed = JSON.parse(hinh_anh);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) { return hinh_anh; }
        },
        getImageUrl(url) {
            if (!url) return 'https://via.placeholder.com/400x300';
            return url.replace(/-\d+x\d+/g, '');
        },

        // --- KÉO THẢ THANH GỢI Ý ---
        startDragQA(e) {
            this.isDraggingQA = true;
            this.startXQA = e.pageX - this.$refs.quickActionsBar.offsetLeft;
            this.scrollLeftQA = this.$refs.quickActionsBar.scrollLeft;
            this.$refs.quickActionsBar.style.cursor = 'grabbing';
        },
        stopDragQA() {
            this.isDraggingQA = false;
            if (this.$refs.quickActionsBar) this.$refs.quickActionsBar.style.cursor = 'grab';
        },
        doDragQA(e) {
            if (!this.isDraggingQA) return;
            e.preventDefault();
            const x = e.pageX - this.$refs.quickActionsBar.offsetLeft;
            const walk = (x - this.startXQA) * 1.5; 
            this.$refs.quickActionsBar.scrollLeft = this.scrollLeftQA - walk;
        },

        // --- CHAT LOGIC ---
        formatVND(value) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value); },
        viewTour(id) { this.isOpen = false; this.$router.push(`/client/chi-tiet-tour/${id}`); },
        viewHistory() { this.isOpen = false; this.$router.push(`/client/lich-su-dat-tour`); },
        
        handleButton(btn) {
            if (btn.type === 'route') {
                this.isOpen = false;
                this.$router.push(btn.route);
            } else if (btn.type === 'message') {
                this.sendMessageDirect(btn.message);
            }
        },
        sendMessageDirect(msg) {
            if (!msg || this.isTyping) return;
            this.inputText = msg;
            this.sendMessage();
        },

        async sendWelcomeMessage() {
            let userName = '';
            let isLogged = false;
            const token = localStorage.getItem('key_client');

            if (token) {
                try {
                    const res = await axios.get(apiUrl("client/check-token"), { headers: { Authorization: "Bearer " + token }});
                    if (res.data && res.data.status) { userName = res.data.ho_ten; isLogged = true; }
                } catch (e) {}
            }

            const greeting = isLogged
                ? `👋 Chào <strong>${userName}</strong>!<br/>Mình là Trợ lý AI của Ixtal Tour! Cần tìm tour, đặt vé trực tiếp hay kiểm tra hóa đơn cứ nhắn mình nha! 🍯`
                : `👋 Xin chào! Mình là Trợ lý AI của Ixtal Tour ✈️<br/>Bạn muốn đi đâu? Hãy gõ từ khóa hoặc chọn gợi ý bên dưới nhé!`;

            this.messages.push({
                from: 'bot', type: 'text', text: greeting,
                buttons: isLogged ? [{ text: '📦 Lịch sử đặt tour', type: 'route', route: '/client/lich-su-dat-tour' }] 
                                  : [{ text: '🔐 Đăng nhập ngay', type: 'route', route: '/client/dang-nhap' }]
            });
            this.scrollToBottom();
        },

        async sendMessage() {
            const text = this.inputText.trim();
            if (!text || this.isTyping) return;

            this.messages.push({ from: "user", type: "text", text: text });
            this.inputText = "";
            this.isTyping = true;
            this.scrollToBottom();

            await this.callApiChat(text, 0); // Lần gọi đầu offset = 0
        },

        async loadMoreTours(keyword, msgIndex) {
            this.isTyping = true;
            // Xóa nút Load More ở tin nhắn cũ
            this.messages[msgIndex].hasMore = false; 
            const currentOffset = this.messages[msgIndex].tours.length; 
            
            await this.callApiChat(keyword, currentOffset);
        },

        async callApiChat(keyword, offset) {
            try {
                const history = this.messages
                    .slice(0, -1)
                    .filter(msg => (msg.type === 'text' || msg.type === 'tours') && msg.text)
                    .slice(-8)
                    .map(msg => ({
                        role: msg.from === 'user' ? 'user' : 'model',
                        text: String(msg.text).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
                    }));

                const response = await axios.post(apiUrl("client/chatbot/chat"), {
                    message: keyword,
                    offset: offset,
                    history: history
                }, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
                });

                if (response.data.status) {
                    const type = response.data.tours && response.data.tours.length > 0 ? 'tours' : 'text';
                    this.messages.push({
                        from: "bot",
                        type: type,
                        text: response.data.response,
                        tours: response.data.tours,
                        buttons: response.data.buttons,
                        hasMore: response.data.hasMore,
                        keyword_used: response.data.keyword_used,
                        ai_powered: response.data.ai_powered
                    });
                }
            } catch (error) {
                this.messages.push({ from: "bot", type: "text", text: "😅 Đứt cáp quang rồi! Hệ thống đang bận quá." });
            } finally {
                this.isTyping = false;
                this.scrollToBottom();
                this.$nextTick(() => { if (this.$refs.chatInput) this.$refs.chatInput.focus(); });
            }
        },

        // --- LUỒNG BOOKING BÊN TRONG CHAT ---
        startBookingFlow(tour) {
            const token = localStorage.getItem('key_client');
            if (!token) {
                this.messages.push({
                    from: 'bot', type: 'text', text: "Bạn cần đăng nhập để đặt tour nhé! 🔐",
                    buttons: [{ text: 'Đăng nhập ngay', type: 'route', route: '/client/dang-nhap' }]
                });
                this.scrollToBottom();
                return;
            }

            this.messages.push({
                from: 'bot',
                type: 'booking',
                tour: tour,
                bookingData: { qty: 1, ghi_chu: '', phuong_thuc: 'VNPAY' }
            });
            this.scrollToBottom();
        },

        cancelBooking(index) {
            this.messages[index].type = 'text'; // Chuyển form thành text rỗng hoặc thông báo hủy
            this.messages[index].text = "<i class='text-muted'>Đã hủy phiên đặt tour.</i>";
        },

        async submitBooking(msg) {
            const data = msg.bookingData;
            if (data.qty >= 2 && data.ghi_chu.trim() === '') {
                this.messages.push({ from: 'bot', type: 'text', text: '⚠️ Đặt từ 2 người trở lên, bạn phải ghi rõ Họ tên/SĐT người đi cùng vào ô ghi chú nha!'});
                this.scrollToBottom();
                return;
            }

            this.isTyping = true;
            this.scrollToBottom();

            // 1. Tạo Hóa Đơn
            try {
                const payload = {
                    id_tour: msg.tour.id,
                    so_luong_nguoi: data.qty,
                    ghi_chu_danh_sach_nguoi_di: data.ghi_chu,
                    phuong_thuc_thanh_toan: data.phuong_thuc
                };

                const resBooking = await axios.post(apiUrl("client/dat-tour/thanh-toan"), payload, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
                });

                if (resBooking.data.status) {
                    const hoadon = resBooking.data.data.hoa_don;
                    const qrLink = resBooking.data.data.link_qr_code;
                    
                    // Ẩn form đặt tour cũ
                    msg.type = 'text';
                    msg.text = `<i class='text-success'>Đã chốt đơn tour: ${msg.tour.ten_tour} (SL: ${data.qty})</i>`;

                    // Push kết quả hóa đơn
                    this.messages.push({
                        from: 'bot',
                        type: 'invoice',
                        invoice: {
                            ma_hoa_don: hoadon.ma_hoa_don,
                            tong_tien: hoadon.tong_tien,
                            phuong_thuc_thanh_toan: hoadon.phuong_thuc_thanh_toan,
                            qr_link: qrLink
                        }
                    });

                    // 2. Xử lý thanh toán VNPAY tự động
                    if (data.phuong_thuc === 'VNPAY') {
                        const resPay = await axios.post(apiUrl('client/vnpay/tao-thanh-toan'), { id_hoa_don: hoadon.id }, {
                            headers: { Authorization: "Bearer " + localStorage.getItem('key_client') }
                        });
                        if (resPay.data.status) {
                            setTimeout(() => { window.location.href = resPay.data.data; }, 1500);
                        }
                    }

                } else {
                    this.messages.push({ from: 'bot', type: 'text', text: "❌ Lỗi: " + resBooking.data.message });
                }
            } catch (err) {
                this.messages.push({ from: 'bot', type: 'text', text: "❌ Máy chủ đang bận, không thể đặt tour lúc này." });
            } finally {
                this.isTyping = false;
                this.scrollToBottom();
            }
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const el = this.$refs.messagesContainer;
                if (el) el.scrollTop = el.scrollHeight;
            });
        }
    }
};
</script>

<style scoped>
.chat-widget-wrapper {
    position: fixed;
    z-index: 999999;
}

/* Tooltip & Nút Chat */
.welcome-tooltip {
    position: fixed;
    background: #fff; color: #125633; padding: 12px 35px 12px 15px; border-radius: 12px;
    font-size: 14px; font-weight: 600; line-height: 1.5; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border: 2px solid #8fdfb5; width: max-content; animation: bounce 2s infinite; z-index: 999998;
}
.welcome-tooltip::after {
    content: ''; position: absolute; bottom: -8px; right: 20px;
    border-width: 8px 8px 0; border-style: solid; border-color: #8fdfb5 transparent transparent transparent;
}
.close-welcome { position: absolute; top: 5px; right: 8px; background: none; border: none; color: #888; font-size: 18px; cursor: pointer; }

@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

.chat-toggle {
    position: fixed; width: 65px; height: 65px; border-radius: 50%;
    background: linear-gradient(135deg, #125633 0%, #8fdfb5 100%); color: #fff;
    display: flex; justify-content: center; align-items: center; cursor: grab;
    font-size: 28px; border: 3px solid #fff; z-index: 999999; user-select: none;
}
.chat-toggle:active { cursor: grabbing; }
.chat-toggle:hover { transform: scale(1.05); }
.chat-toggle.is-open { background: #dc3545; border-color: #f8d7da; transform: scale(0.9); }

/* Khung Chat */
.chat-box {
    position: fixed; width: 390px; height: 600px; background: #ffffff; border-radius: 20px;
    display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
    z-index: 999999;
}
/* Nút đóng nổi */
.floating-close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #54d793;
    backdrop-filter: blur(5px);
    border: none;
    color: #555;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: 0.3s;
}

.floating-close-btn:hover {
    background: #ff4b2b;
    color: white;
}

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom right; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: scale(0.8) translateY(30px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Messages Area */
.chat-messages {
    flex: 1; padding: 20px; overflow-y: auto;
    background: #f4fdf8; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth;
}
.chat-messages::-webkit-scrollbar { width: 5px; }
.chat-messages::-webkit-scrollbar-thumb { background-color: #8fdfb5; border-radius: 10px; }

.msg-wrapper { display: flex; width: 100%; align-items: flex-end; }
.is-user { justify-content: flex-end; }
.is-bot { justify-content: flex-start; }

.bot-avatar {
    width: 32px; height: 32px; border-radius: 50%; background: #125633; color: white;
    display: flex; justify-content: center; align-items: center; font-size: 13px; margin-bottom: 5px; flex-shrink: 0;
}

.msg-bubble { border-radius: 18px; padding: 10px 14px; line-height: 1.5; font-size: 14px; word-wrap: break-word; }
.is-user .msg-bubble { background: #125633; color: white; border-bottom-right-radius: 4px; }
.is-bot .msg-bubble { background: white; border: 1px solid #8fdfb5; color: #333; border-bottom-left-radius: 4px; }

/* AI Baging & Typing */
.ai-badge { font-size: 11px; color: #888; font-weight: bold; margin-bottom: 4px; }
.typing-indicator span { display: inline-block; width: 6px; height: 6px; background-color: #125633; border-radius: 50%; margin: 0 2px; animation: typing 1.4s infinite ease-in-out both; }
.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

/* Khối Form trong Chat (Booking, Invoice, Tours) */
.booking-form-bubble, .invoice-bubble {
    background: white; border: 2px solid #8fdfb5; border-radius: 15px; padding: 15px; width: 100%;
}
.tour-cards-container { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.chat-tour-card {
    display: flex; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px; cursor: pointer; transition: 0.2s;
}
.chat-tour-card:hover { border-color: #125633; transform: translateY(-2px); }
.tour-img { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; margin-right: 12px; }
.tour-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
.tour-title { font-size: 13px; font-weight: bold; margin: 0 0 5px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #333; }
.tour-meta { font-size: 11px; color: #6c757d; font-weight: 500; }
.tour-price { font-size: 13px; color: #dc3545; font-weight: bold; }

/* Buttons */
.msg-buttons { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
.bot-action-btn { background: #fff; color: #125633; border: 1px solid #125633; border-radius: 12px; padding: 8px 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.bot-action-btn:hover { background: #125633; color: white; }

/* Quick Actions & Input */
.quick-actions-bar {
    display: flex; gap: 8px; padding: 10px 15px; overflow-x: auto; background: white; border-top: 1px solid #f1f1f1; scrollbar-width: none; cursor: grab;
}
.quick-actions-bar:active { cursor: grabbing; }
.quick-actions-bar::-webkit-scrollbar { display: none; }
.quick-action-btn { white-space: nowrap; padding: 6px 12px; border-radius: 20px; border: 1px solid #e0e0e0; background: #f8f9fa; color: #444; font-size: 12px; font-weight: 500; cursor: pointer; transition: 0.2s; }
.quick-action-btn:hover { background: #125633; color: white; border-color: #125633; }

.chat-input { display: flex; gap: 10px; padding: 15px; background: white; border-top: 1px solid #f1f1f1; }
.chat-input input { flex: 1; background: #f4fdf8; border: 1px solid transparent; border-radius: 20px; padding: 10px 15px; outline: none; font-size: 14px; transition: 0.3s; }
.chat-input input:focus { background: white; border-color: #8fdfb5; box-shadow: 0 0 0 3px rgba(143, 223, 181, 0.2); }
.send-btn { width: 42px; height: 42px; border: none; border-radius: 50%; background: #125633; color: white; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: 0.2s; }
.send-btn:hover:not(:disabled) { transform: scale(1.05); }
.send-btn:disabled { background: #ccc; cursor: not-allowed; }

@media (max-width: 500px) {
    .chat-box { width: 95vw; right: 2.5vw !important; bottom: 85px !important; }
}
/* Nút đặt ngay to và đẹp hơn */
.btn-book { 
    font-size: 12px; 
    border-radius: 12px; 
    transition: all 0.3s ease; 
    background: linear-gradient(135deg, #dc3545, #ff4d5a);
    border: none;
}
.btn-book:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4) !important;
}

/* Tên tour trong form booking */
.tour-name-booking {
    font-size: 13px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #125633;
}

/* Hộp tổng tiền */
.total-price-box {
    background: #f4fdf8;
    border: 1px dashed #8fdfb5;
}

/* ================= KHỐI SỐ LƯỢNG KHÁCH TRONG CHAT ================= */
.custom-qty-group {
    width: 100px;
    height: 35px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
}
.btn-qty {
    background: transparent; border: none; color: #125633; font-size: 14px;
    width: 30px; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
}
.btn-qty:hover { background: #8fdfb5; color: white; }
.btn-qty:active { background: #1b7d6b; transform: scale(0.95); }
.input-qty {
    border: none !important; background: transparent !important; padding: 0;
    font-size: 14px; color: #212529; height: 100%;
}
.input-qty:focus { box-shadow: none !important; }

/* Ẩn mũi tên mặc định của input number */
.input-qty::-webkit-outer-spin-button,
.input-qty::-webkit-inner-spin-button {
    -webkit-appearance: none; margin: 0;
}
.input-qty[type=number] {
    -moz-appearance: textfield;
}

/* Các trường nhập liệu khác gọn gàng hơn */
.custom-textarea, .custom-select {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 13px;
}
.custom-textarea:focus, .custom-select:focus {
    border-color: #8fdfb5;
    box-shadow: 0 0 0 0.2rem rgba(143, 223, 181, 0.25);
}
/* -------------------------------------------------------------------------------------------------*/
/* Màu nền Header */
.chat-header { 
    background: linear-gradient(135deg, #125633, #1b7d6b) !important; 
    border-radius: 20px 20px 0 0;
}

/* Khung Chat chính */
.chat-box {
    position: fixed; 
    width: 390px; 
    height: 600px; 
    background: #ffffff; 
    border-radius: 20px;
    display: flex; 
    flex-direction: column; /* Đảm bảo các con nằm theo chiều dọc */
    overflow: hidden; 
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
    z-index: 999999;
    max-height: 80vh;
}

/* Header: Đảm bảo không bị lệch và luôn nằm trên cùng */
.chat-header { 
    background: linear-gradient(135deg, #125633, #1b7d6b) !important; 
    padding: 15px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    flex-shrink: 0; /* QUAN TRỌNG: Ngăn header bị co lại bởi tin nhắn */
    width: 100%;
}

/* Tin nhắn: Đảm bảo nằm dưới header */
.chat-messages {
    flex: 1; /* Chiếm phần không gian còn lại */
    padding: 20px; 
    overflow-y: auto;
    background: #f4fdf8; 
    display: flex; 
    flex-direction: column; 
    gap: 16px; 
    scroll-behavior: smooth;
    min-height: 0; /* Sửa lỗi tràn chiều cao của flex */
}

/* Nút Bot */
.chat-toggle {
    position: fixed; width: 65px; height: 65px; border-radius: 50%;
    background: linear-gradient(135deg, #125633 0%, #8fdfb5 100%); color: #fff;
    display: flex; justify-content: center; align-items: center; cursor: grab;
    font-size: 28px; border: 3px solid #fff; z-index: 999999;
}

/* Đảm bảo nút bot không bị kéo ra ngoài màn hình */
@media (max-width: 500px) {
    .chat-box { width: 95vw; }
}

/* Nút close trong chatbox (đặt lại vị trí) */
.floating-close-btn {
    position: absolute; top: 15px; right: 15px; width: 30px; height: 30px;
    border-radius: 50%; background: #ffffff; border: none; color: #125633;
    z-index: 10; display: flex; justify-content: center; align-items: center; cursor: pointer;
}

/* Fixes for header layout and overlap issues */
.chat-header {
    position: relative; /* ensure it's in normal flow but with its own stacking */
    z-index: 12; 
    box-sizing: border-box;
}
.chat-header {
    /* phần quan trọng để nó hiện header đúng cách và không bị tràn ra ngoài khung chat */
    /* override global styles from app.css that may set absolute/left/height */
    position: relative !important;
    left: auto !important;
    top: auto !important;
    right: auto !important;
    height: auto !important;
    width: 100% !important;
    border-top-left-radius: 20px !important;
    border-top-right-radius: 20px !important;
}
.chat-header > .d-flex {
    flex: 1 1 auto; /* allow left block to shrink if needed */
    min-width: 0; /* important to allow text truncation inside flex */
}
.chat-header h6 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px;
}
.chat-header .btn {
    flex-shrink: 0; /* prevent buttons from growing or pushing layout */
    margin-left: 8px;
}

/* Ensure messages area always sits below header and doesn't overflow */
.chat-messages {
    box-sizing: border-box;
    min-height: 0; /* allow flex children to size correctly */
}
</style>
