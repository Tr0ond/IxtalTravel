<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <!-- Header Section -->
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #333; margin: 0;">📊 Thống Kê & Báo Cáo</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Phân tích dữ liệu kinh doanh Tr0ondCinema</p>
        </div>

        <!-- Filter Section -->
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 15px; align-items: flex-end;">
                <div>
                    <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                        <i class="fa-solid fa-calendar me-2" style="color: #667eea;"></i>Từ Ngày
                    </label>
                    <input v-model="filters.begin" type="date" 
                        style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                        <i class="fa-solid fa-calendar me-2" style="color: #667eea;"></i>Đến Ngày
                    </label>
                    <input v-model="filters.end" type="date" 
                        style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                </div>
                <div>
                    <button @click="loadAllStatistics" :disabled="isLoading"
                        style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);"
                        @mouseenter="(e) => { if (!isLoading) e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'; }"
                        @mouseleave="(e) => { e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'; }"
                        :style="{ opacity: isLoading ? 0.7 : 1 }">
                        <i :class="isLoading ? 'fa-solid fa-spinner fa-spin me-2' : 'fa-solid fa-refresh me-2'"></i>
                        {{ isLoading ? 'Đang Tải...' : 'Cập Nhật' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Overview Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <!-- Card 1: Total Revenue -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #667eea;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Tổng Doanh Thu</p>
                        <h3 style="color: #333; font-size: 1.8rem; margin: 0; font-weight: 700;">{{ formatVND(stats.totalRevenue) }}</h3>
                    </div>
                    <div style="font-size: 2.5rem; color: #667eea; opacity: 0.2;">
                        <i class="fa-solid fa-money-bill-wave"></i>
                    </div>
                </div>
            </div>

            <!-- Card 2: Total Tickets -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #764ba2;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Tổng Vé Bán Ra</p>
                        <h3 style="color: #333; font-size: 1.8rem; margin: 0; font-weight: 700;">{{ stats.totalTickets }}</h3>
                    </div>
                    <div style="font-size: 2.5rem; color: #764ba2; opacity: 0.2;">
                        <i class="fa-solid fa-ticket"></i>
                    </div>
                </div>
            </div>

            <!-- Card 3: New Customers -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #06b6d4;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Khách Hàng Mới</p>
                        <h3 style="color: #333; font-size: 1.8rem; margin: 0; font-weight: 700;">{{ stats.newCustomers }}</h3>
                    </div>
                    <div style="font-size: 2.5rem; color: #06b6d4; opacity: 0.2;">
                        <i class="fa-solid fa-users"></i>
                    </div>
                </div>
            </div>

            <!-- Card 4: Popular Tour -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #f59e0b;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Tour Bán Chạy Nhất</p>
                        <h3 style="color: #333; font-size: 1.3rem; margin: 0; font-weight: 700;">{{ stats.topTour }}</h3>
                    </div>
                    <div style="font-size: 2.5rem; color: #f59e0b; opacity: 0.2;">
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 20px;">
            
            <!-- Chart 1: New Customers -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h4 style="color: #333; margin: 0 0 15px 0; font-weight: 700;">Khách Hàng Mới</h4>
                <canvas id="chartKhachHangMoi" style="max-height: 300px;"></canvas>
            </div>

            <!-- Chart 2: Revenue -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h4 style="color: #333; margin: 0 0 15px 0; font-weight: 700;">Doanh Thu Theo Ngày</h4>
                <canvas id="chartDoanhThu" style="max-height: 300px;"></canvas>
            </div>

            <!-- Chart 3: Tickets Sold -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h4 style="color: #333; margin: 0 0 15px 0; font-weight: 700;">Vé Bán Ra & Thanh Toán</h4>
                <canvas id="chartVeBanRa" style="max-height: 300px;"></canvas>
            </div>

            <!-- Chart 4: Customer Spending -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h4 style="color: #333; margin: 0 0 15px 0; font-weight: 700;">Chi Tiêu Khách Hàng</h4>
                <canvas id="chartChiTieu" style="max-height: 300px;"></canvas>
            </div>

            <!-- Chart 5: Tour Performance -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h4 style="color: #333; margin: 0 0 15px 0; font-weight: 700;">Hiệu Suất Tour</h4>
                <canvas id="chartTour" style="max-height: 300px;"></canvas>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; padding: 30px; border-radius: 12px; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 10px;">
                    <i class="fa-solid fa-spinner fa-spin" style="color: #667eea;"></i>
                </div>
                <p style="color: #666; margin: 0;">Đang tải dữ liệu...</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../utils/api';
import Chart from 'chart.js/auto';

export default {
    data() {
        return {
            filters: {
                begin: this.getDateRange().begin,
                end: this.getDateRange().end,
            },
            isLoading: false,
            stats: {
                totalRevenue: 0,
                totalTickets: 0,
                newCustomers: 0,
                topTour: 'Chưa có dữ liệu',
            },
            charts: {
                khachHangMoi: null,
                doanhThu: null,
                veBanRa: null,
                chiTieu: null,
                tour: null,
            }
        }
    },
    mounted() {
        this.loadAllStatistics();
    },
    methods: {
        getDateRange() {
            const end = new Date();
            const begin = new Date();
            begin.setDate(begin.getDate() - 30); // Last 30 days
            return {
                begin: this.formatDate(begin),
                end: this.formatDate(end),
            };
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        formatVND(number) {
            return new Intl.NumberFormat("vi-VN", { 
                style: "currency", 
                currency: "VND" 
            }).format(number || 0);
        },
        async loadAllStatistics() {
            this.isLoading = true;
            try {
                const headers = {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                };

                const [resKH, resRevenue, resTickets, resSpending, resTour] = await Promise.all([
                    axios.post(apiUrl('admin/thong-ke/khach-hang-moi'), this.filters, { headers }),
                    axios.post(apiUrl('admin/thong-ke/doanh-thu'), this.filters, { headers }),
                    axios.post(apiUrl('admin/thong-ke/ve-ban-ra'), this.filters, { headers }),
                    axios.post(apiUrl('admin/thong-ke/chi-tieu-khach-hang'), this.filters, { headers }),
                    axios.post(apiUrl('admin/thong-ke/tour'), this.filters, { headers }),
                ]);

                // Update stats cards
                if (resRevenue.data.status && resRevenue.data.data.length > 0) {
                    this.stats.totalRevenue = resRevenue.data.data.reduce((sum, item) => sum + (Number(item.tong_tien) || 0), 0);
                }

                if (resTickets.data.status && resTickets.data.data.length > 0) {
                    this.stats.totalTickets = resTickets.data.data.reduce((sum, item) => sum + (Number(item.tong_so_ve) || 0), 0);
                }

                if (resKH.data.status && resKH.data.data.length > 0) {
                    this.stats.newCustomers = resKH.data.data.reduce((sum, item) => sum + (Number(item.so_khach_hang_moi) || 0), 0);
                }

                if (resTour.data.status && resTour.data.data.length > 0) {
                    this.stats.topTour = resTour.data.data[0].ten_tour || 'Chưa có dữ liệu';
                }

                // Render charts
                this.renderChart('chartKhachHangMoi', resKH.data, 'bar');
                this.renderChart('chartDoanhThu', resRevenue.data, 'line');
                this.renderChart('chartVeBanRa', resTickets.data, 'bar');
                this.renderChart('chartChiTieu', resSpending.data, 'doughnut');
                this.renderChart('chartTour', resTour.data, 'bar');

                this.$toast.success('Cập nhật dữ liệu thành công!');
            } catch (error) {
                console.error('Error loading statistics:', error);
                this.$toast.error('Lỗi khi tải dữ liệu thống kê');
            } finally {
                this.isLoading = false;
            }
        },
        renderChart(canvasId, data, type) {
            const ctx = document.getElementById(canvasId);
            if (!ctx) return;

            // Destroy existing chart
            if (this.charts[this.getChartKey(canvasId)] && this.charts[this.getChartKey(canvasId)].destroy) {
                this.charts[this.getChartKey(canvasId)].destroy();
            }

            const chartKey = this.getChartKey(canvasId);
            const config = {
                type: type,
                data: {
                    labels: data.labels || [],
                    datasets: data.datasets || []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            display: type !== 'doughnut' && type !== 'pie'
                        },
                        x: {
                            display: type !== 'doughnut' && type !== 'pie'
                        }
                    }
                }
            };

            this.charts[chartKey] = new Chart(ctx, config);
        },
        getChartKey(canvasId) {
            const map = {
                'chartKhachHangMoi': 'khachHangMoi',
                'chartDoanhThu': 'doanhThu',
                'chartVeBanRa': 'veBanRa',
                'chartChiTieu': 'chiTieu',
                'chartTour': 'tour',
            };
            return map[canvasId] || canvasId;
        }
    }
}
</script>
