<template>
  <div class="ixtal-theme">
    <main>
      <section class="hero-section is-visible">
        <div class="hero-bg-wrapper" :style="{ transform: `translateY(${scrollY * 0.3}px)` }">
          <div class="hero-bg-image"></div>
        </div>
        <div class="hero-overlay"></div>

        <div class="hero-content fade-in-up"
          :style="{ transform: `translateY(${scrollY * 0.1}px)`, opacity: 1 - scrollY / 420 }">
          <p class="hero-subtitle">✦ Thành Lập 2012 · Kiến Tạo Hành Trình Thế Giới</p>
          <h1 class="hero-title">
            {{ typedText }}<span class="blink-cursor"></span>
          </h1>
          <p class="hero-description fade-in-up delay-2">
            Chúng tôi tuyển chọn những trải nghiệm du lịch phi thường trên khắp sáu châu lục — kết hợp sự chân thực,
            tính phiêu lưu và sự sang trọng vào những hành trình mang tính bước ngoặt.
          </p>
          <div class="hero-actions fade-in-up delay-3">
            <a href="#contact" class="btn-secondary">Bắt Đầu Khám Phá</a>
            <a href="#about" class="btn-secondary">Câu Chuyện Của Chúng Tôi</a>
          </div>
        </div>
      </section>

      <section id="about" class="section-padding container observe-me">
        <div class="about-grid">
          <div class="about-text slide-in-left">
            <div class="watermark-year">2012</div>
            <div class="relative-z10">
              <p class="section-subtitle">Nền Tảng</p>
              <h2 class="section-title">Bắt nguồn từ tình yêu<br />khám phá đích thực</h2>
              <div class="gradient-divider"></div>
              <p class="paragraph-text">IxtalTour được thành lập tại Bali vào năm 2012 bởi một đội ngũ những nhà thám
                hiểm dày dạn kinh nghiệm, những người tin rằng du lịch là để cảm nhận, không chỉ để ngắm nhìn. Hơn một
                thập kỷ qua, chúng tôi đã đưa hơn 50.000 du khách đến những chân trời mà họ chưa từng tưởng tượng.</p>
              <p class="paragraph-text">Mỗi lịch trình chúng tôi thiết kế đều là sự cân bằng hoàn hảo giữa những biểu
                tượng nổi tiếng và những viên ngọc ẩn mình — được tỉ mỉ chuẩn bị bởi các chuyên gia bản địa.</p>
            </div>
          </div>
          <div class="about-image-wrapper slide-in-right delay-2">
            <div class="about-image-card">
              <img src="https://images.unsplash.com/photo-1769407684800-c627363d053d?w=800&h=1000&fit=crop&auto=format"
                alt="Misty mountains" />
              <div class="image-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-padding section-alt observe-me stats-container">
        <div class="container-sm relative-z10">
          <div class="text-center mb-4 fade-in-up">
            <p class="section-subtitle teal-text">Những Con Số Biết Nói</p>
            <h2 class="section-title text-center">Một thập kỷ của những hành trình phi thường</h2>
          </div>
          <div class="stats-flexbox">
            <div v-for="(s, i) in displayStats" :key="s.label" class="stat-card fade-in-up"
              :style="{ transitionDelay: `${i * 0.1}s` }">
              <div class="stat-value">
                {{ s.currentValue.toLocaleString() }}{{ s.suffix }}
              </div>
              <div class="stat-label">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" class="section-padding container observe-me">
        <div class="team-header fade-in-up">
          <p class="section-subtitle">Những Người Dẫn Đường</p>
          <div class="team-header-flex">
            <h2 class="section-title">Chuyên gia sống trọn<br /><em>với đam mê</em></h2>
            <p class="paragraph-text max-w-sm">Mỗi thành viên trong đội ngũ của chúng tôi trước hết đều là những người
              say mê xê dịch, sau đó mới là chuyên gia. Hãy lướt qua để tìm hiểu câu chuyện của họ.</p>
          </div>
        </div>

        <div class="team-grid">
          <div v-for="(m, i) in TEAM_MEMBERS" :key="m.name" class="flip-card fade-in-up"
            :style="{ transitionDelay: `${i * 0.12}s` }">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <img :src="m.img" :alt="m.name" />
                <div class="card-overlay"></div>
                <div class="card-info">
                  <p class="member-name">{{ m.name }}</p>
                  <p class="member-role">{{ m.role }}</p>
                </div>
                <div class="member-years">{{ m.years }}</div>
              </div>
              <div class="flip-card-back">
                <div class="divider"></div>
                <p class="member-name text-mint">{{ m.name }}</p>
                <p class="member-role-back">{{ m.role }}</p>
                <p class="member-bio">{{ m.bio }}</p>
                <div class="expertise-list">
                  <div v-for="e in m.expertise" :key="e" class="expertise-item">
                    <div class="dot"></div>
                    <span>{{ e }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="section-padding section-alt observe-me">
        <div class="container-sm">
          <div class="text-center mb-4 fade-in-up">
            <p class="section-subtitle">✦ Liên Hệ</p>
            <h2 class="section-title text-center">Cùng lên kế hoạch cho<br /><em>chuyến phiêu lưu tiếp theo</em></h2>
          </div>

          <div class="contact-grid fade-in-up delay-2">
            <div class="contact-form-card">
              <h3 class="form-title">Hành trình hoàn hảo <em>của bạn</em></h3>
              <p class="form-desc">Chuyên viên thiết kế tour của chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>

              <form @submit.prevent="handleSubmit" novalidate>
                <div class="form-row">
                  <div class="input-group">
                    <input type="text" v-model="fields.ho_ten" class="custom-input" required placeholder=" " :readonly="isLoggedIn" />
                    <label class="custom-label">Họ và Tên</label>
                    <p v-if="errors.ho_ten" class="error-text">{{ errors.ho_ten }}</p>
                  </div>
                  <div class="input-group">
                    <input type="email" v-model="fields.email" class="custom-input" required placeholder=" " :readonly="isLoggedIn" />
                    <label class="custom-label">Địa chỉ Email</label>
                    <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
                  </div>
                </div>

                <div class="input-group mb-4">
                  <input type="text" v-model="fields.so_dien_thoai" class="custom-input" placeholder=" " />
                  <label class="custom-label">Số điện thoại (Tuỳ chọn)</label>
                </div>

                <div class="input-group mb-4">
                  <textarea v-model="fields.noi_dung" class="custom-input textarea-input" required
                    placeholder=" "></textarea>
                  <label class="custom-label">Hãy kể cho chúng tôi về chuyến đi mơ ước của bạn…</label>
                  <p v-if="errors.noi_dung" class="error-text">{{ errors.noi_dung }}</p>
                </div>
                <button type="submit" :disabled="submitState !== 'idle'" class="submit-btn"
                  :class="{ 'success-btn': submitState === 'success' }">
                  <span v-if="submitState === 'idle'">Gửi Tin Nhắn</span>
                  <span v-else-if="submitState === 'loading'">Đang gửi...</span>
                  <span v-else-if="submitState === 'success'">Đã Gửi Thành Công!</span>
                </button>
              </form>
            </div>

            <div class="info-cards">
              <div v-for="info in INFO" :key="info.label" class="info-card glowing-card">
                <h4 class="info-title">{{ info.label }}</h4>
                <p v-for="l in info.lines" :key="l" class="info-line">{{ l }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import apiUrl from '../../../utils/api'; // Đường dẫn cấu hình API của bạn
import confetti from 'canvas-confetti';

// Lấy instance để dùng Toast trong Script setup
const { proxy } = getCurrentInstance();

// --- DATA ---
const STATS = [
  { value: 50000, suffix: "+", label: "Khách Hàng" },
  { value: 120, suffix: "+", label: "Điểm Đến" },
  { value: 15, suffix: "", label: "Quốc Gia" },
  { value: 98, suffix: "%", label: "Hài Lòng" },
];

const TEAM_MEMBERS = [
  {
    name: "Trần Xuân Vinh",
    role: "Nhà Sáng Lập & CEO",
    img: "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/245305464_587145555761222_1968242494685415962_n.jpg?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=AuuXhCufSHcQ7kNvwEUPouT&_nc_oc=AdoOz_f-v7xVTRSeScAGVixycFwflkg6HJzvMNcfQJdsXRdOBdw6aj_o0YRWtsNlLcs&_nc_zt=23&_nc_ht=scontent.fdad3-6.fna&_nc_gid=uWUHn5CNpfQ_9fNfTbiQBA&_nc_ss=7b2a8&oh=00_Af-pef1EuEJ_d-uetBNpwEJtoXS02_Rau0RrSkW_YT74Kg&oe=6A2C71C9",
    bio: "Cựu nhiếp ảnh gia National Geographic. Aria đã đặt chân đến 94 quốc gia và dẫn đầu các chuyến thám hiểm trên khắp lục địa.",
    expertise: ["Lên Kế Hoạch Thám Hiểm", "Văn Hóa"],
    years: "14 Năm"
  },
  {
    name: "Mateo Strand",
    role: "Trưởng Phòng Trải Nghiệm",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&auto=format&facepad=3",
    bio: "Chuyên gia dạn dày kinh nghiệm trong ngành khách sạn cao cấp tại Đông Nam Á. Mateo đích thân kiểm định từng đối tác.",
    expertise: ["Khách Sạn Cao Cấp", "Villa Biệt Lập", "Tour Ẩm Thực"],
    years: "12 Năm"
  },
  {
    name: "Sola Okafor",
    role: "Giám Đốc — Châu Phi",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=700&fit=crop&auto=format&facepad=3",
    bio: "Sinh ra tại Lagos, học tập tại London. Sola dẫn dắt các danh mục tour Châu Phi với kiến thức bản địa vô cùng phong phú.",
    expertise: ["Khám Phá & Bảo Tồn", "Du Lịch Sinh Thái", "Băng Qua Sa Mạc"],
    years: "9 Năm"
  },
  {
    name: "Linnea Park",
    role: "Chuyên Viên Thiết Kế Tour",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=700&fit=crop&auto=format&facepad=3",
    bio: "Linnea tiên phong trong triết lý 'du lịch chậm' của chúng tôi — ít điểm dừng hơn, kết nối sâu sắc hơn với mỗi vùng đất.",
    expertise: ["Du Lịch Chậm", "Khám Phá Bắc Âu", "Lộ Trình Bền Vững"],
    years: "7 Năm"
  },
];

const INFO = [
  { label: "Văn Phòng",  lines: ["254 Nguyễn Văn Linh", "Thanh Khê, Đà Nẵng"] },
  { label: "Điện Thoại", lines: ["+84 (236) 365 0403", "Thứ 2–Thứ 6 7am–5pm"] },
  { label: "Gửi Email",  lines: ["admission@duytan.edu.vn", "info@duytan.edu.vn"] },
];

// --- STATE ---
const displayStats = ref(STATS.map(s => ({ ...s, currentValue: 0 })));
let animationFrameId = null;
const scrollY = ref(0);
const typedText = ref("");
const fullText = "Nơi Mỗi Hành Trình\nTrở Thành Một Câu Chuyện.";

// API State
const isLoggedIn = ref(false);
const fields = ref({ id_khach_hang: null, ho_ten: "", email: "", so_dien_thoai: "", noi_dung: "" });
const errors = ref({});
const submitState = ref("idle");

// --- LOGIC RÀNG BUỘC SỐ ĐIỆN THOẠI (CHỈ NHẬP SỐ, MAX 10 KÝ TỰ) ---
const limitPhone = (e) => {
  let val = e.target.value.replace(/[^0-9]/g, ''); // Loại bỏ mọi ký tự không phải là số
  if (val.length > 10) val = val.slice(0, 10);      // Giới hạn max 10 ký tự
  fields.value.so_dien_thoai = val;
};

// Lấy thông tin khách hàng nếu đã đăng nhập
const checkUserLogin = async () => {
  const token = localStorage.getItem('key_khach_hang');
  if (token) {
    try {
      const res = await axios.get(apiUrl('client/profile/get-data'), {
        headers: { Authorization: "Bearer " + token }
      });
      if (res.data.status && res.data.data) {
        isLoggedIn.value = true;
        fields.value.id_khach_hang = res.data.data.id;
        fields.value.ho_ten = res.data.data.ho_va_ten || '';
        fields.value.email = res.data.data.email || '';
        fields.value.so_dien_thoai = res.data.data.so_dien_thoai || '';
      }
    } catch (err) {
      console.error("Không thể lấy dữ liệu khách hàng", err);
    }
  }
};

const startCounting = () => {
  displayStats.value.forEach((stat, index) => {
    const finalValue = STATS[index].value;
    let start = null;
    const duration = 2000; 

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4);
      stat.currentValue = Math.floor(easeOut * finalValue);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        stat.currentValue = finalValue;
      }
    };
    window.requestAnimationFrame(step);
  });
};

const resetCounting = () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  displayStats.value.forEach(stat => {
    stat.currentValue = 0; 
  });
};

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

const setupTypewriter = () => {
  let i = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      typedText.value = fullText.slice(0, ++i);
      if (i >= fullText.length) clearInterval(iv);
    }, 52);
  }, 500);
};

const setupObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('stats-container')) {
          startCounting();
        }
      } else {
        entry.target.classList.remove('is-visible');
        if (entry.target.classList.contains('stats-container')) {
          resetCounting();
        }
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.observe-me').forEach(el => observer.observe(el));
};

// Gọi API Gửi Form kèm Validation + Toast Notifications
const handleSubmit = async () => {
  const errs = {};
  
  if (!fields.value.ho_ten.trim()) {
    errs.ho_ten = "Vui lòng nhập họ tên của bạn";
  }
  
  if (!fields.value.email.trim()) {
    errs.email = "Vui lòng cung cấp địa chỉ email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.value.email)) {
    errs.email = "Bạn nhập sai email, vui lòng nhập lại";
  }
  
  // Ràng buộc số điện thoại nếu có nhập phải đủ 10 số
  if (fields.value.so_dien_thoai && fields.value.so_dien_thoai.length < 10) {
    errs.so_dien_thoai = "Bạn nhập sai định dạng điện thoại, vui lòng nhập lại đt (Yêu cầu 10 số)";
  }

  if (!fields.value.noi_dung.trim()) {
    errs.noi_dung = "Vui lòng mô tả về chuyến đi bạn mong muốn";
  }

  // NẾU CÓ LỖI: Hiện Toast báo lỗi đầu tiên mắc phải
  if (Object.keys(errs).length) {
    errors.value = errs;
    const firstErrorMessage = Object.values(errs)[0];
    if (proxy && proxy.$toast) {
      proxy.$toast.error(firstErrorMessage);
    }
    return;
  }

  errors.value = {};
  submitState.value = "loading";

  try {
    const response = await axios.post(apiUrl('client/lien-he'), fields.value);
    
    if (response.data.status) {
      submitState.value = "success";
      if (proxy && proxy.$toast) {
        proxy.$toast.success(response.data.message || "Đã gửi liên hệ thành công!");
      }
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.7 }, colors: ["#8fdfb5", "#2db88a", "#ffffff"], ticks: 200 });
      setTimeout(() => {
        submitState.value = "idle";
        fields.value.noi_dung = ""; // Xóa nội dung điền, giữ lại thông tin người dùng
      }, 4000);
    } else {
      if (proxy && proxy.$toast) {
        proxy.$toast.error(response.data.message);
      }
      submitState.value = "idle";
    }
  } catch (error) {
    console.error("Lỗi khi gửi liên hệ:", error);
    if (proxy && proxy.$toast) {
      proxy.$toast.error("Có lỗi xảy ra khi kết nối máy chủ, vui lòng thử lại sau!");
    }
    submitState.value = "idle";
  }
};

// --- LIFECYCLE ---
onMounted(() => {
  checkUserLogin(); // Gọi hàm kiểm tra đăng nhập khi vừa load trang
  window.addEventListener("scroll", handleScroll, { passive: true });
  setupTypewriter();
  setTimeout(setupObserver, 100);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* --- BẢNG MÀU CHÍNH --- */
:root {
  --bg-color: #f4fdf8;
  --bg-alt: #e6f7ee;
  --card-bg: #ffffff;
  --text-main: #1a3326;
  --text-sub: #3a6652;
  --text-muted: #6a9a80;
  --mint: #8fdfb5;
  --mint-dark: #5cc993;
  --teal: #2db88a;
  --border-color: rgba(143, 223, 181, 0.22);
}

/* --- CẤU TRÚC CHUNG --- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

.ixtal-theme {
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: 'Outfit', sans-serif;
  overflow-x: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.container-sm {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-padding {
  padding: 7rem 0;
}

.section-alt {
  background-color: var(--bg-alt);
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 2rem;
}

.relative-z10 {
  position: relative;
  z-index: 10;
}

/* --- KIỂU CHỮ (TYPOGRAPHY) --- */
.section-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--mint);
  margin-bottom: 1rem;
}

.section-subtitle.teal-text {
  color: var(--teal);
}

.section-title {
  font-family: 'Fraunces', serif;
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 700;
  color: var(--mint);
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.paragraph-text {
  color: var(--text-sub);
  line-height: 1.85;
  margin-bottom: 1.25rem;
  font-size: 1rem;
}

.max-w-sm {
  max-width: 400px;
}

.text-mint {
  color: var(--mint);
}

/* --- HERO SECTION --- */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: transform 0.7s ease-out;
}

.hero-bg-image {
  position: absolute;
  top: -20%;
  left: -20%;
  right: -20%;
  bottom: -20%;
  background-image: url('https://images.unsplash.com/photo-1777883673017-96082bbcf087?w=1800&h=1200&fit=crop&auto=format');
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(10, 30, 20, .55) 0%, rgba(10, 30, 20, .22) 40%, rgba(244, 253, 248, .6) 85%, #f4fdf8 100%);
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 24px;
  max-width: 1200px;
  width: 100%;
}

.hero-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-family: 'Fraunces', serif;
  font-size: clamp(2rem, 4vw, 8rem);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.05;
  letter-spacing: -0.02em;
  min-height: 2.2em;
  white-space: pre-line;
  margin-bottom: 2rem;
}

.hero-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 300;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 1rem 2.25rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}

.btn-primary {
  background: var(--mint);
  color: var(--text-main);
  box-shadow: 0 8px 32px rgba(143, 223, 181, .5);
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: scale(1.05);
}

.btn-secondary {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

/* --- ABOUT SECTION --- */
.about-grid {
  display: grid;
  gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: center;
}

.about-text {
  position: relative;
}

.watermark-year {
  position: absolute;
  top: -2rem;
  left: -1rem;
  font-family: 'Fraunces', serif;
  font-size: clamp(5rem, 12vw, 10rem);
  font-weight: 800;
  color: rgba(143, 223, 181, 0.1);
  line-height: 1;
  letter-spacing: -0.04em;
  pointer-events: none;
  user-select: none;
}

.gradient-divider {
  width: 3rem;
  height: 2px;
  background: linear-gradient(to right, var(--mint), var(--teal));
  border-radius: 2px;
  margin-bottom: 1.75rem;
}

.about-image-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: 4/5;
  max-height: 520px;
  box-shadow: 0 20px 60px rgba(143, 223, 181, .18);
}

.about-image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(26, 51, 38, .4) 0%, transparent 60%);
}

/* --- STATS SECTION --- */
.stats-flexbox {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  text-align: center;
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 24px rgba(143, 223, 181, .1);
}

.stat-value {
  font-family: 'Fraunces', serif;
  font-size: clamp(2.5rem, 5vw, 3.25rem);
  font-weight: 700;
  color: var(--mint);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* --- TEAM FLIP CARDS --- */
.team-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.team-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.flip-card {
  perspective: 1200px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 1rem;
}

.flip-card-front {
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(143, 223, 181, .14);
}

.flip-card-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(13, 31, 22, .88) 0%, rgba(13, 31, 22, .1) 55%, transparent 100%);
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
}

.member-name {
  font-family: 'Fraunces', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
}

.member-role {
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  color: #fff;
}

.member-years {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: var(--mint);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}

.flip-card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #f4fdf8 0%, #e6f7ee 100%);
  border: 1px solid rgba(143, 223, 181, 0.5);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 12px 40px rgba(143, 223, 181, .2);
}

.divider {
  width: 2.5rem;
  height: 2px;
  border-radius: 2px;
  background: var(--mint);
  margin-bottom: 1.25rem;
}

.member-role-back {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}

.member-bio {
  font-size: 0.875rem;
  line-height: 1.75;
  color: var(--text-sub);
  margin-bottom: 1.5rem;
}

.expertise-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.expertise-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-sub);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mint);
  flex-shrink: 0;
}

/* --- CONTACT SECTION & FORM --- */
.contact-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: flex-start;
}

.contact-form-card {
  background: rgba(255, 255, 255, .78);
  backdrop-filter: blur(32px) saturate(160%);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 8px 40px rgba(143, 223, 181, .12);
}

.form-title {
  font-family: 'Fraunces', serif;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  color: var(--mint);
  margin-bottom: 0.75rem;
}

.form-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.input-group {
  position: relative;
  margin-bottom: 1.25rem;
}

.custom-input {
  width: 100%;
  background: rgba(143, 223, 181, .07);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.9375rem;
  padding: 1.5rem 1rem 0.5rem;
  outline: none;
  transition: border-color 0.2s;
}

.textarea-input {
  min-height: 130px;
  resize: vertical;
  padding-top: 1.75rem;
}

.custom-input:focus {
  border-color: var(--mint);
}

.custom-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9375rem;
  color: var(--text-muted);
  pointer-events: none;
  transition: all 0.2s ease;
}

.textarea-input~.custom-label {
  top: 1.5rem;
}

.custom-input:focus~.custom-label,
.custom-input:not(:placeholder-shown)~.custom-label {
  top: 0.5rem;
  transform: none;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--mint);
}

.error-text {
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, var(--mint), var(--mint-dark));
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.3s;
}

.success-btn {
  background: rgba(143, 223, 181, .15);
  color: var(--teal);
  border: 1px solid var(--mint);
}

.submit-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* HIỆU ỨNG GLOWING (PHÁT SÁNG XỊN XÒ) CHO KHỐI INFO CARD */
.glowing-card {
  background: var(--card-bg);
  border: 1px solid rgba(143, 223, 181, 0.5); 
  border-radius: 1rem;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(143, 223, 181, 0.15), 0 0 15px rgba(45, 184, 138, 0.1); 
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.glowing-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--mint), var(--teal));
  opacity: 0;
  transition: opacity 0.3s;
}

.glowing-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(143, 223, 181, 0.3), 0 0 25px rgba(45, 184, 138, 0.25);
  border-color: var(--mint);
}

.glowing-card:hover::before {
  opacity: 1;
}

.info-title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--teal);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-line {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-main);
  font-weight: 500;
}

/* --- ANIMATIONS --- */
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.blink-cursor {
  display: inline-block;
  width: 3px;
  height: 0.85em;
  background: var(--mint);
  vertical-align: middle;
  margin-left: 4px;
  animation: blink 1s step-end infinite;
}

.fade-in-up,
.slide-in-left,
.slide-in-right {
  opacity: 0;
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in-up {
  transform: translateY(40px);
}

.slide-in-left {
  transform: translateX(-60px);
}

.slide-in-right {
  transform: translateX(60px);
}

.is-visible .fade-in-up,
.is-visible.fade-in-up {
  opacity: 1;
  transform: translateY(0);
}

.is-visible .slide-in-left {
  opacity: 1;
  transform: translateX(0);
}

.is-visible .slide-in-right {
  opacity: 1;
  transform: translateX(0);
}

.delay-2 {
  transition-delay: 0.2s;
}

.delay-3 {
  transition-delay: 0.4s;
}

@media (max-width: 768px) {
  .section-padding {
    padding: 4rem 0;
  }

  .about-grid,
  .contact-grid {
    gap: 2rem;
  }

  .team-header-flex {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>