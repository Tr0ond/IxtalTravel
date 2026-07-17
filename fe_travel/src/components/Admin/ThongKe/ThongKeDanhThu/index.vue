<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <!-- Header Section -->
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #333; margin: 0;">💰 Thống Kê Doanh Thu</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Phân tích doanh thu theo ngày</p>
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
                    <button @click="loadStatistics" :disabled="isLoading"
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

        <!-- Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <!-- Total Revenue -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #667eea;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Tổng Doanh Thu</p>
                        <h3 style="color: #333; font-size: 1.8rem; margin: 0; font-weight: 700;">{{ formatVND(summary.totalRevenue) }}</h3>
                    </div>
                    <div style="font-size: 2.5rem; color: #667eea; opacity: 0.2;">
                        <i class="fa-solid fa-money-bill-wave"></i>
                    </div>
                </div>
            </div>

            <!-- Total Orders -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #764ba2;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Tổng Đơn Hàng</p>
                        <h3 style="color: #333; font-size: 1.8rem; margin: 0; font-weight: 700;">{{ summary.totalOrders }}</h3>
                    </div>
                    <div style="font-size: 2.5rem; color: #764ba2; opacity: 0.2;">
                        <i class="fa-solid fa-shopping-cart"></i>
                    </div>
                </div>
            </div>

            <!-- Average Order Value -->
            <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #06b6d4;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Giá Trị Trung Bình</p>
                        <h3 style="color: #333; font-size: 1.8rem; margin: 0; font-weight: 700;">{{ formatVND(summary.averageOrder) }}</h3>
                    </div>
                    <div style="font-size: 2.5rem; color: #06b6d4; opacity: 0.2;">
                        <i class="fa-solid fa-chart-line"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chart Section -->
        <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 30px;">
            <h4 style="color: #333; margin: 0 0 15px 0; font-weight: 700;">Doanh Thu Theo Ngày</h4>
            <canvas id="chartDoanhThu" style="max-height: 400px;"></canvas>
        </div>

        <!-- Data Table -->
        <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <h4 style="color: #333; margin: 0 0 15px 0; font-weight: 700;">Chi Tiết Doanh Thu</h4>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 12px; text-align: left; color: #666; font-weight: 600;">Ngày</th>
                            <th style="padding: 12px; text-align: right; color: #666; font-weight: 600;">Số Đơn Hàng</th>
                            <th style="padding: 12px; text-align: right; color: #666; font-weight: 600;">Doanh Thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableData" :key="index" style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;"
                            @mouseenter="(e) => e.target.parentElement.style.background = '#f8f9fa'"
                            @mouseleave="(e) => e.target.parentElement.style.background = ''">
                            <td style="padding: 12px; color: #333;">{{ formatDate(item.ngay) }}</td>
                            <td style="padding: 12px; text-align: right; color: #666;">{{ item.tong_don_hang }}</td>
                            <td style="padding: 12px; text-align: right; color: #667eea; font-weight: 600;">{{ formatVND(item.tong_tien) }}</td>
                        </tr>
                        <tr v-if="tableData.length === 0" style="border-bottom: 1px solid #e2e8f0;">
                            <td colspan="3" style="padding: 20px; text-align: center; color: #999;">Không có dữ liệu</td>
                        </tr>
                    </tbody>
                </table>
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
import apiUrl from '../../../../utils/api';
import Chart from 'chart.js/auto';

export default {
    data() {
        return {
            filters: {
                begin: this.getDateRange().begin,
                end: this.getDateRange().end,
            },
            isLoading: false,
            tableData: [],
            summary: {
                totalRevenue: 0,
                totalOrders: 0,
                averageOrder: 0,
            },
            chart: null,
        }
    },
    mounted() {
        this.loadStatistics();
    },
    methods: {
        getDateRange() {
            const end = new Date();
            const begin = new Date();
            begin.setDate(begin.getDate() - 30);
            return {
                begin: this.formatDate(begin),
                end: this.formatDate(end),
            };
        },
        formatDate(date) {
            if (typeof date === 'string') {
                return new Date(date).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
            }
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
        async loadStatistics() {
            this.isLoading = true;
            try {
                const headers = {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                };

                const response = await axios.post(apiUrl('admin/thong-ke/doanh-thu'), {
                    begin: this.filters.begin,
                    end: this.filters.end
                }, { headers });
                
                if (response.data.status) {
                    this.tableData = response.data.data || [];
                    
                    // Calculate summary
                    this.summary.totalRevenue = this.tableData.reduce((sum, item) => sum + (Number(item.tong_tien) || 0), 0);
                    this.summary.totalOrders = this.tableData.reduce((sum, item) => sum + (Number(item.tong_don_hang) || 0), 0);
                    this.summary.averageOrder = this.summary.totalOrders > 0 ? this.summary.totalRevenue / this.summary.totalOrders : 0;
                    
                    // Render chart
                    this.renderChart(response.data);
                    
                    this.$toast.success('Cập nhật dữ liệu thành công!');
                } else {
                    this.$toast.error('Lỗi: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                this.$toast.error('Lỗi khi tải dữ liệu');
            } finally {
                this.isLoading = false;
            }
        },
        renderChart(data) {
            const ctx = document.getElementById('chartDoanhThu');
            if (!ctx) return;

            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = new Chart(ctx, {
                type: 'line',
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
                        }
                    }
                }
            });
        }
    }
}
</script>
