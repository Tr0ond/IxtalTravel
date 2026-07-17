<template>
  <div style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; background: #f8fafc;">
    <main style="flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 24px;" class="custom-scrollbar" @click="closeDatePicker">

      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1.6rem; color: #0f172a; margin: 0;">Lịch Trình Công Việc</h1>
          <p style="font-size: .9rem; color: #64748b; margin: 4px 0 0;">Quản lý thời gian và các tour bạn phụ trách</p>
        </div>
        
        <div style="display: flex; gap: 12px; align-items: center;">
          <button @click="goToToday" class="btn btn-today fw-bold rounded-pill shadow-sm custom-hover-btn">
            <i class="fa-solid fa-calendar-day me-1"></i> Hôm nay
          </button>

          <div class="position-relative" @click.stop>
            <button @click="toggleDatePicker" class="btn btn-white fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2 border custom-hover-btn">
              <i class="fa-solid fa-calendar-alt text-primary-custom"></i>
              <span>Tháng {{ currentMonth + 1 }}, {{ currentYear }}</span>
              <i class="fa-solid fa-chevron-down ms-1 text-muted" style="font-size: 0.8rem;"></i>
            </button>
            
            <transition name="fade-slide">
              <div v-if="showDatePicker" class="custom-picker-dropdown shadow-lg rounded-4 p-3 border">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <button @click="tempYear--" class="btn btn-sm btn-light rounded-circle"><i class="fa-solid fa-chevron-left"></i></button>
                  <span class="fw-bold fs-5 text-dark">{{ tempYear }}</span>
                  <button @click="tempYear++" class="btn btn-sm btn-light rounded-circle"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
                <div class="month-grid">
                  <button v-for="(m, i) in 12" :key="i" 
                          @click="selectMonthAndYear(i)"
                          :class="['month-btn', (currentMonth === i && currentYear === tempYear) ? 'active' : '']">
                    Th {{ i + 1 }}
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <div v-if="isLoading" style="text-align: center; padding: 40px; color: #64748b;">
        <div class="spinner-border text-primary-custom" role="status"></div>
        <p class="mt-3 fw-medium">Đang tải và đồng bộ lịch trình...</p>
      </div>

      <div v-else-if="listData.length === 0" class="custom-card empty-state shadow-sm border-0">
        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png" width="120" class="opacity-50 mb-4 mt-3" alt="Empty">
        <h4 style="font-family: 'Nunito', sans-serif; font-weight: 800; color: #0f172a;">Lịch trình trống!</h4>
        <p style="font-size: .95rem; color: #64748b; margin-top: 8px;">Bạn chưa nhận dẫn tour nào. Hãy tới Kho Tour để nhận việc.</p>
        <router-link to="/huong-dan-vien/quan-ly-tour" class="btn btn-gradient-primary rounded-pill px-5 py-2 mt-3 fw-bold shadow-sm custom-hover-btn">
           <i class="fa-solid fa-briefcase me-2"></i> Tới Kho Tour
        </router-link>
      </div>

      <div v-else style="display: grid; grid-template-columns: minmax(340px, 1fr) 2fr; gap: 24px; align-items: start;">
        
        <div class="custom-card calendar-card shadow-sm border-0" style="padding: 24px; background: #ffffff;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <span style="font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1.2rem; color: #0f172a; text-transform: capitalize;">{{ monthName }}</span>
            <div style="display: flex; gap: 8px;">
              <button @click="prevMonth" class="nav-btn shadow-sm"><i class="fa-solid fa-chevron-left"></i></button>
              <button @click="nextMonth" class="nav-btn shadow-sm"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px 0; margin-bottom: 8px;">
            <div v-for="dayName in dayNames" :key="dayName" style="font-size: .8rem; font-weight: 800; color: #94a3b8; text-align: center; padding: 4px 0;">
              {{ dayName }}
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px 0;">
            <div v-for="blank in blankDaysCount" :key="'blank-' + blank"></div>
            
            <div v-for="day in calendarDays" :key="day" 
                 class="day-wrapper"
                 :class="getDayRangeClass(day)"
                 @click="isDayInTour(day) ? toggleDaySelection(day) : null"
                 style="position: relative; padding: 4px 0; cursor: pointer;">
              <div class="day-inner shadow-sm"
                   :style="{
                      aspectRatio: '1/1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.9rem', margin: '0 auto', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      width: '38px', height: '38px', fontWeight: (isToday(day) || selectedDay === day) ? 800 : 600,
                      background: selectedDay === day ? '#0f172a' : (isToday(day) ? '#1b7d6b' : (isDayInTour(day) ? '#fff' : 'transparent')),
                      color: (selectedDay === day || isToday(day)) ? '#fff' : (isDayInTour(day) ? '#1b7d6b' : '#334155'),
                      border: isDayInTour(day) && selectedDay !== day && !isToday(day) ? '2px solid #1b7d6b' : 'none',
                      transform: selectedDay === day ? 'scale(1.15)' : 'none',
                      boxShadow: selectedDay === day ? '0 4px 10px rgba(0,0,0,0.2)' : 'none'
                   }">
                {{ day }}
              </div>
            </div>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #cbd5e1; display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;">
            <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: #1b7d6b;"></div><span style="font-size: .8rem; color: #64748b; font-weight: 600;">Hôm nay</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 24px; height: 12px; border-radius: 4px; background: #ccfbf1;"></div><span style="font-size: .8rem; color: #64748b; font-weight: 600;">Có Tour</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: #0f172a;"></div><span style="font-size: .8rem; color: #64748b; font-weight: 600;">Đang chọn</span></div>
          </div>
        </div>

        <div class="custom-card shadow-sm border-0" style="overflow: hidden; background: #ffffff;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <span style="font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1.1rem; color: #0f172a;">
              <i class="fa-solid fa-route text-primary-custom me-2"></i> Timeline — {{ selectedDay ? `Ngày ${selectedDay} ${monthName}` : monthName }}
            </span>
            <button v-if="selectedDay && filteredListData.length > 0" @click="selectedDay = null" class="btn btn-sm btn-light border fw-bold text-danger shadow-sm rounded-pill px-3 custom-hover-btn">
              <i class="fa-solid fa-filter-circle-xmark me-1"></i> Bỏ lọc
            </button>
            <span v-else class="badge bg-primary-custom rounded-pill px-3 py-2 shadow-sm fs-6">{{ filteredListData.length }} tour đã lên lịch</span>
          </div>
          
          <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px; max-height: 70vh; overflow-y: auto;" class="custom-scrollbar">
            <div v-if="filteredListData.length === 0" style="text-align: center; color: #64748b; font-size: .95rem; padding: 50px 0;">
              <i class="fa-regular fa-calendar-xmark mb-3 text-slate-300" style="font-size: 3rem;"></i><br>
              Không có tour nào diễn ra trong thời gian này.
            </div>

            <div v-for="(tour, index) in filteredListData" :key="tour.id_tour" style="display: flex; gap: 16px; animation: slideInRight 0.4s ease forwards;">
              
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="date-badge shadow-sm">{{ getDayFromDate(tour.ngay_bat_dau) }}</div>
                <div v-if="index < filteredListData.length - 1" style="width: 3px; flex: 1; background: #cbd5e1; margin-top: 8px; min-height: 40px; border-radius: 3px;"></div>
              </div>

              <div class="tour-card shadow-sm" @click="handleTourClick(tour)" style="flex: 1; border-radius: 16px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 8px; background: #fff;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span style="font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1.15rem; color: #0f172a;">{{ tour.ten_tour }}</span>
                      <span class="badge bg-slate-100 text-secondary border">Mã: #{{ tour.id_tour || tour.id }}</span>
                    </div>
                    <div style="font-size: .85rem; color: #475569; margin-top: 10px; background: #f1f5f9; display: inline-block; padding: 6px 14px; border-radius: 8px; font-weight: 600; border: 1px solid #e2e8f0;">
                      <i class="fa-regular fa-clock me-1 text-primary-custom"></i> {{ formatDate(tour.ngay_bat_dau) }} <i class="fa-solid fa-arrow-right mx-1 text-muted"></i> {{ formatDate(tour.ngay_ket_thuc) }}
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span class="badge bg-success bg-opacity-10 text-white border border-success px-3 py-2 rounded-pill"><i class="fa-solid fa-check-double me-1"></i> Đã chốt</span>
                    <div class="arrow-btn" :class="{ 'open': expandedTourIds.includes(tour.id_tour) }"><i class="fa-solid fa-chevron-down"></i></div>
                  </div>
                </div>
                
                <transition name="slide-fade">
                    <div v-if="expandedTourIds.includes(tour.id_tour) && tour.danh_sach_lich_trinh && tour.danh_sach_lich_trinh.length > 0" class="mt-4 pt-3 border-top" style="display: flex; flex-direction: column; gap: 16px;">
                      <div v-for="(diemDen, i) in tour.danh_sach_lich_trinh" :key="diemDen.id_lich_trinh" style="display: flex; gap: 16px; position: relative;">
                        <div style="display: flex; flex-direction: column; align-items: center; width: 24px; flex-shrink: 0; padding-top: 4px;">
                          <div class="step-dot shadow-sm">{{ i + 1 }}</div>
                          <div v-if="i < tour.danh_sach_lich_trinh.length - 1" style="width: 2px; height: 100%; background: #e2e8f0; margin-top: 4px;"></div>
                        </div>
                        <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; transition: all 0.2s;" class="hover-bg-white">
                          <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 8px;">
                            <img v-if="diemDen.anh_diem_den" :src="diemDen.anh_diem_den" style="width: 65px; height: 65px; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" alt="Location" />
                            <div v-else style="width: 65px; height: 65px; border-radius: 12px; background: #e2e8f0; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-image text-muted fs-3"></i></div>
                            <div>
                              <h5 style="margin: 0 0 6px 0; font-family: 'Nunito', sans-serif; font-size: 1.05rem; color: #0f172a; font-weight: 800;">{{ diemDen.ten_diem_den }}</h5>
                              <span v-if="diemDen.loai_phuong_tien" class="badge bg-white border text-secondary shadow-sm px-2 py-1">
                                <i class="fa-solid fa-van-shuttle me-1 text-primary-custom"></i> {{ diemDen.loai_phuong_tien }} <span v-if="diemDen.so_hieu">({{ diemDen.so_hieu }})</span>
                              </span>
                            </div>
                          </div>
                          <p style="margin: 0; font-size: .95rem; color: #475569; line-height: 1.6; border-left: 3px solid #1b7d6b; padding-left: 12px;" class="bg-white p-2 rounded shadow-sm border">{{ diemDen.tieu_de_hoat_dong }}</p>
                        </div>
                      </div>
                    </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            todayDate: new Date().getDate(),
            todayMonth: new Date().getMonth(),
            todayYear: new Date().getFullYear(),
            dayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            selectedDay: null,
            expandedTourIds: [],
            
            // Dữ liệu cho Custom Date Picker
            showDatePicker: false,
            tempYear: new Date().getFullYear()
        }
    },
    computed: {
        monthName() {
            return `Tháng ${this.currentMonth + 1}, ${this.currentYear}`;
        },
        blankDaysCount() {
            return new Date(this.currentYear, this.currentMonth, 1).getDay();
        },
        calendarDays() {
            const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            return Array.from({ length: daysInMonth }, (_, index) => index + 1);
        },
        toursInCurrentMonth() {
            return this.listData.filter(tour => {
                if (!tour.ngay_bat_dau || !tour.ngay_ket_thuc) return false;
                const start = new Date(tour.ngay_bat_dau); start.setHours(0,0,0,0);
                const end = new Date(tour.ngay_ket_thuc); end.setHours(0,0,0,0);
                const monthStart = new Date(this.currentYear, this.currentMonth, 1);
                const monthEnd = new Date(this.currentYear, this.currentMonth + 1, 0);
                return start <= monthEnd && end >= monthStart;
            });
        },
        filteredListData() {
            if (!this.selectedDay) return this.toursInCurrentMonth;
            const selectedDate = new Date(this.currentYear, this.currentMonth, this.selectedDay);
            selectedDate.setHours(0,0,0,0);
            return this.toursInCurrentMonth.filter(tour => {
                if (!tour.ngay_bat_dau || !tour.ngay_ket_thuc) return false;
                const start = new Date(tour.ngay_bat_dau); start.setHours(0,0,0,0);
                const end = new Date(tour.ngay_ket_thuc); end.setHours(0,0,0,0);
                return selectedDate.getTime() >= start.getTime() && selectedDate.getTime() <= end.getTime();
            });
        }
    },
    mounted() {
        this.tempYear = this.currentYear;
        this.loadData();
    },
    methods: {
        // --- CÁC HÀM XỬ LÝ CHUYỂN TRANG TỪ "TOUR CỦA TÔI" ---
        handleRouteParams() {
            const q = this.$route.query;
            if (q.targetDate) {
                const target = new Date(q.targetDate);
                this.currentYear = target.getFullYear();
                this.currentMonth = target.getMonth();
                this.selectedDay = target.getDate();
                
                // Mở sẵn accordion chi tiết tour đó nếu có expandId
                if (q.expandId) {
                    const idToExpand = parseInt(q.expandId);
                    if (!this.expandedTourIds.includes(idToExpand)) {
                        this.expandedTourIds.push(idToExpand);
                    }
                }
                
                // Xóa query trên URL để tránh dính param khi F5
                this.$router.replace({ query: {} });
            } else {
                this.initNearestTour();
            }
        },

        // --- CÁC HÀM UI CUSTOM DATE PICKER ---
        toggleDatePicker() {
            this.showDatePicker = !this.showDatePicker;
            if(this.showDatePicker) this.tempYear = this.currentYear;
        },
        closeDatePicker() {
            this.showDatePicker = false;
        },
        selectMonthAndYear(mIndex) {
            this.currentMonth = mIndex;
            this.currentYear = this.tempYear;
            this.selectedDay = null;
            this.expandedTourIds = [];
            this.showDatePicker = false;
        },
        goToToday() {
            this.currentMonth = this.todayMonth;
            this.currentYear = this.todayYear;
            this.selectedDay = this.todayDate;
            this.expandedTourIds = [];
        },

        getTourForDay(day) {
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            currentDate.setHours(0,0,0,0);
            for (let i = 0; i < this.listData.length; i++) {
                const tour = this.listData[i];
                if (!tour.ngay_bat_dau || !tour.ngay_ket_thuc) continue;
                const start = new Date(tour.ngay_bat_dau); start.setHours(0,0,0,0);
                const end = new Date(tour.ngay_ket_thuc); end.setHours(0,0,0,0);
                if (currentDate.getTime() >= start.getTime() && currentDate.getTime() <= end.getTime()) {
                    return { start, end };
                }
            }
            return null;
        },
        getDayRangeClass(day) {
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            currentDate.setHours(0,0,0,0);
            const tourRange = this.getTourForDay(day);
            if (!tourRange) return '';
            
            const isStart = currentDate.getTime() === tourRange.start.getTime();
            const isEnd = currentDate.getTime() === tourRange.end.getTime();
            const isStartOfWeek = currentDate.getDay() === 0; 
            const isEndOfWeek = currentDate.getDay() === 6; 
            const isFirstOfMonth = day === 1;
            const isLastOfMonth = day === this.calendarDays.length;

            let classes = [];
            if (isStart || isStartOfWeek || isFirstOfMonth) classes.push('range-start');
            if (isEnd || isEndOfWeek || isLastOfMonth) classes.push('range-end');
            
            if (classes.length === 0) return 'tour-between';
            if (classes.includes('range-start') && classes.includes('range-end')) return 'tour-single';
            return classes.join(' ');
        },
        isDayInTour(day) { return this.getTourForDay(day) !== null; },
        isToday(day) { return this.todayDate === day && this.todayMonth === this.currentMonth && this.todayYear === this.currentYear; },
        
        prevMonth() {
            if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; } 
            else { this.currentMonth--; }
            this.selectedDay = null; this.expandedTourIds = []; 
        },
        nextMonth() {
            if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; } 
            else { this.currentMonth++; }
            this.selectedDay = null; this.expandedTourIds = []; 
        },
        toggleDaySelection(day) {
            this.selectedDay = (this.selectedDay === day) ? null : day;
            this.expandedTourIds = []; 
        },
        handleTourClick(tour) {
            const tourId = tour.id_tour || tour.id;
            const index = this.expandedTourIds.indexOf(tourId);
            if (index > -1) this.expandedTourIds.splice(index, 1);
            else this.expandedTourIds.push(tourId);
        },
        getHeaders() { return { Authorization: "Bearer " + localStorage.getItem("key_hdv") }; },
        formatDate(dateString) {
            if (!dateString) return "...";
            return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString));
        },
        getDayFromDate(dateString) { return dateString ? new Date(dateString).getDate() : "?"; },
        
        initNearestTour() {
            if (!this.listData || this.listData.length === 0) return;
            const now = new Date(); now.setHours(0, 0, 0, 0); 
            let sortedTours = [...this.listData].sort((a, b) => new Date(a.ngay_bat_dau) - new Date(b.ngay_bat_dau));
            let targetTour = sortedTours.find(t => {
                const start = new Date(t.ngay_bat_dau); start.setHours(0,0,0,0);
                const end = new Date(t.ngay_ket_thuc); end.setHours(0,0,0,0);
                return now >= start && now <= end;
            }) || sortedTours.find(t => {
                const start = new Date(t.ngay_bat_dau); start.setHours(0,0,0,0);
                return start > now;
            });
            if (!targetTour) {
                let pastTours = [...sortedTours].sort((a, b) => new Date(b.ngay_bat_dau) - new Date(a.ngay_bat_dau));
                if (pastTours.length > 0) targetTour = pastTours[0];
            }
            if (targetTour) {
                const targetDate = new Date(targetTour.ngay_bat_dau);
                this.currentMonth = targetDate.getMonth();
                this.currentYear = targetDate.getFullYear();
                this.selectedDay = targetDate.getDate();
            }
        },
        loadData() {
            this.isLoading = true;
            axios.get(apiUrl('huong-dan-vien/lich-trinh/get-data'), { headers: this.getHeaders() })
                .then((res) => {
                    if (res.data.status) {
                        this.listData = res.data.data;
                        // Thay vì gọi luôn initNearestTour, gọi hàm xử lý Route trước
                        this.handleRouteParams();
                    }
                })
                .catch((err) => { console.error(err); })
                .finally(() => { this.isLoading = false; });
        }
    }
}
</script>

<style scoped>
.text-primary-custom { color: #1b7d6b !important; }
.bg-primary-custom { background-color: #1b7d6b !important; color: white; }
.bg-slate-100 { background-color: #f1f5f9; }

.custom-card { border-radius: 20px; border: 1px solid #e2e8f0; }
.empty-state { text-align: center; padding: 60px 20px; background: #ffffff; }

/* Custom Date Picker Dropdown */
.custom-picker-dropdown { position: absolute; top: 110%; right: 0; background: white; z-index: 1000; width: 260px; }
.month-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.month-btn { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px; border-radius: 8px; font-weight: 600; color: #475569; transition: all 0.2s; }
.month-btn:hover { background: #e6f9ef; color: #1b7d6b; border-color: #1b7d6b; }
.month-btn.active { background: #1b7d6b; color: white; border-color: #1b7d6b; box-shadow: 0 4px 10px rgba(27,125,107,0.3); }

/* Nút Buttons */
.btn-today { background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%); color: white; border: none; padding: 8px 20px; }
.btn-white { background: white; color: #334155; padding: 8px 20px; }
.btn-gradient-primary { background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%); color: #fff; border: none; }
.custom-hover-btn { transition: all 0.3s ease; }
.custom-hover-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important; color: inherit; }
.btn-today:hover, .btn-gradient-primary:hover { color: white; box-shadow: 0 8px 20px rgba(27, 125, 107, 0.3) !important; }

/* Calendar Điều hướng */
.nav-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; color: #64748b; transition: all 0.2s; }
.nav-btn:hover { background: #1b7d6b; color: #fff; border-color: #1b7d6b; }

.date-badge { width: 50px; height: 50px; border-radius: 50%; border: 3px solid #1b7d6b; background: #ccfbf1; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: #1b7d6b; }
.step-dot { width: 28px; height: 28px; border-radius: 50%; background: #1b7d6b; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; border: 3px solid #ccfbf1; }

.tour-card { transition: all 0.2s ease; cursor: pointer; }
.tour-card:hover { transform: translateX(5px); border-color: #1b7d6b !important; box-shadow: 0 10px 25px rgba(27, 125, 107, 0.15) !important; }
.arrow-btn { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; transition: all 0.3s; color: #64748b; }
.arrow-btn.open { background: #1b7d6b; color: white; transform: rotate(180deg); }

.day-wrapper { transition: opacity 0.2s; }
.day-wrapper:hover { opacity: 0.9; }
.day-wrapper.tour-single { background: #ccfbf1; border-radius: 8px; }
.day-wrapper.range-start { background: #ccfbf1; border-radius: 8px 0 0 8px; }
.day-wrapper.range-end { background: #ccfbf1; border-radius: 0 8px 8px 0; }
.day-wrapper.tour-between { background: #ccfbf1; border-radius: 0; }
.day-wrapper.range-start.range-end { border-radius: 8px; }

.hover-bg-white:hover { background-color: #ffffff !important; box-shadow: 0 4px 15px rgba(0,0,0,0.06); transform: translateY(-2px); border-color: #1b7d6b !important; }

/* Custom Scrollbar for Timeline */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* Animations */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-10px); opacity: 0; }

.fade-slide-enter-active { transition: all 0.2s ease; }
.fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { transform: translateY(-10px); opacity: 0; }

@keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
</style>