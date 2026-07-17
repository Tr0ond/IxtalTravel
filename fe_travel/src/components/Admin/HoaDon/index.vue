<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">Quản lý Hóa đơn và Thanh toán</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý và theo dõi tất cả hóa đơn và giao dịch thanh toán.</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 250px 150px; gap: 15px; align-items: flex-end;">
                <div style="position: relative;">
                    <input v-model="searchQuery" 
                        type="text" 
                        placeholder="Tìm kiếm mã hóa đơn hoặc khách hàng..."
                        @input="filterData"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                </div>

                <select v-model="statusFilter" 
                    @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Trạng thái</option>
                    <option value="0">Đã Hủy</option>
                    <option value="1">Chờ Thanh toán</option>
                    <option value="2">Đã Thanh toán</option>
                </select>

                <button @click="exportReport" class="btn-export">
                    <i class="fa-solid fa-download me-2"></i>Xuất báo cáo
                </button>
            </div>
        </div>

        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Mã Hóa đơn</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Tên Khách hàng</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Ngày Giao dịch</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Tổng tiền</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Phương thức</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Trạng thái</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredInvoices.length === 0">
                            <td colspan="7" style="padding: 30px; text-align: center; color: #999;">
                                <i class="fa-solid fa-inbox me-2" style="font-size: 1.5rem;"></i>
                                <p style="margin: 10px 0 0 0;">Không có hóa đơn nào</p>
                            </td>
                        </tr>
                        <tr v-for="invoice in paginatedInvoices" :key="invoice.id" class="invoice-row">
                            <td style="padding: 15px; color: #333; font-weight: 600;">{{ invoice.ma_hoa_don }}</td>
                            <td style="padding: 15px; color: #333;">{{ invoice.ten_khach_hang }}</td>
                            <td style="padding: 15px; color: #666;">{{ formatDate(invoice.ngay_tao) }}</td>
                            <td style="padding: 15px; color: #667eea; font-weight: 600;">{{ formatVND(invoice.tong_tien) }}</td>
                            <td style="padding: 15px;">
                                <span :style="{
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: getPaymentMethodBg(invoice.phuong_thuc_thanh_toan),
                                    color: getPaymentMethodColor(invoice.phuong_thuc_thanh_toan)
                                }">
                                    {{ formatPaymentMethod(invoice.phuong_thuc_thanh_toan) }}
                                </span>
                            </td>
                            <td style="padding: 15px;">
                                <span :style="{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: getStatusBg(invoice.trang_thai),
                                    color: getStatusColor(invoice.trang_thai)
                                }">
                                    {{ getStatusText(invoice.trang_thai) }}
                                </span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button @click="viewInvoice(invoice)" class="action-btn btn-view" title="Xem chi tiết">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button @click="editInvoice(invoice)" class="action-btn btn-edit" title="Chỉnh sửa">
                                        <i class="fa-solid fa-pen-nib"></i>
                                    </button>
                                    <button @click="deleteInvoice(invoice)" class="action-btn btn-delete" title="Xóa">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                    <button @click="printInvoice(invoice)" class="action-btn btn-print" title="In">
                                        <i class="fa-solid fa-print"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="padding: 20px 0; display: flex; justify-content: center; align-items: center; gap: 5px; border-top: 1px solid #e2e8f0;">
                <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>

                <span class="page-info">Trang {{ currentPage }} / {{ totalPages || 1 }}</span>

                <button @click="currentPage++" :disabled="currentPage >= totalPages" class="page-btn">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <div v-if="showViewModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Chi Tiết Hóa Đơn</h2>
                    <button @click="showViewModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="selectedInvoice" style="color: #333;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Mã Hóa Đơn</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedInvoice.ma_hoa_don }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Khách Hàng</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedInvoice.ten_khach_hang }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Ngày Tạo</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ formatDate(selectedInvoice.ngay_tao) }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Tổng Tiền</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem; color: #667eea;">{{ formatVND(selectedInvoice.tong_tien) }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Số Lượng Người</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedInvoice.so_luong_nguoi }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Phương Thức</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ formatPaymentMethod(selectedInvoice.phuong_thuc_thanh_toan) }}</p>
                        </div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Ghi Chú</p>
                        <p style="margin: 0; color: #555; line-height: 1.5;">{{ selectedInvoice.ghi_chu_danh_sach_nguoi_di }}</p>
                    </div>
                    <button @click="showViewModal = false" style="width: 100%; padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Đóng</button>
                </div>
            </div>
        </div>

        <div v-if="showEditModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Cập Nhật Trạng Thái</h2>
                    <button @click="showEditModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="selectedInvoice" style="color: #333;">
                    <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0; font-weight: 600;">Hóa Đơn: {{ selectedInvoice.ma_hoa_don }}</p>
                    <p style="margin: 0 0 20px 0; font-size: 0.9rem;">{{ selectedInvoice.ten_khach_hang }}</p>
                    
                    <label style="display: block; font-weight: 600; color: #333; margin-bottom: 10px; font-size: 0.9rem;">
                        <i class="fa-solid fa-info-circle me-2" style="color: #667eea;"></i>Trạng Thái Thanh Toán
                    </label>
                    <select v-model="editingStatus"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; margin-bottom: 20px; background: white; cursor: pointer;">
                        <option value="0">Đã Hủy</option>
                        <option value="1">Chờ Thanh toán</option>
                        <option value="2">Đã Thanh toán</option>
                    </select>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showEditModal = false"
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="updateInvoiceStatus"
                            style="padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Lưu</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; color: #f56565; margin-bottom: 15px;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h2 style="margin: 0 0 10px 0; color: #333;">Xóa Hóa Đơn?</h2>
                    <p v-if="selectedInvoice" style="color: #666; margin: 0 0 20px 0;">
                        Bạn chắc chắn muốn xóa hóa đơn <strong>{{ selectedInvoice.ma_hoa_don }}</strong> của <strong>{{ selectedInvoice.ten_khach_hang }}</strong>?<br><span style="font-size: 0.85rem; color: #999;">Hành động này không thể hoàn tác!</span>
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showDeleteModal = false"
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="confirmDelete"
                            style="padding: 12px; background: #f56565; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Xóa</button>
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
            currentPage: 1, // Khai báo biến trang hiện tại
            pageSize: 10,   // Số lượng hóa đơn trên 1 trang
            invoices: [],
            filteredInvoices: [],
            searchQuery: '',
            statusFilter: '',
            showViewModal: false,
            showEditModal: false,
            showDeleteModal: false,
            selectedInvoice: null,
            editingStatus: '1',
            isLoading: false,
        }
    },
    mounted() {
        this.loadInvoices();
    },
    // THÊM COMPUTED ĐỂ TÍNH TOÁN PHÂN TRANG
    computed: {
        totalPages() {
            return Math.ceil(this.filteredInvoices.length / this.pageSize);
        },
        paginatedInvoices() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredInvoices.slice(start, start + this.pageSize);
        }
    },
    methods: {
        loadInvoices() {
            this.isLoading = true;
            axios.get(apiUrl('admin/hoa-don/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.invoices = res.data.data;
                    this.filterData();
                    this.$toast.success('Tải dữ liệu thành công!');
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi tải dữ liệu hóa đơn');
            })
            .finally(() => {
                this.isLoading = false;
            });
        },
        filterData() {
            this.filteredInvoices = this.invoices.filter(invoice => {
                const matchSearch = !this.searchQuery || 
                    (invoice.ma_hoa_don && invoice.ma_hoa_don.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
                    (invoice.ten_khach_hang && invoice.ten_khach_hang.toLowerCase().includes(this.searchQuery.toLowerCase()));
                
                const matchStatus = !this.statusFilter || invoice.trang_thai.toString() === this.statusFilter;
                
                return matchSearch && matchStatus;
            });
            // Reset về trang 1 mỗi khi lọc dữ liệu (Tìm kiếm, Filter trạng thái)
            this.currentPage = 1;
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        formatVND(number) {
            return new Intl.NumberFormat("vi-VN", { 
                style: "currency", 
                currency: "VND" 
            }).format(number || 0);
        },
        formatPaymentMethod(method) {
            const methods = {
                'vnpay': 'VNPay',
                'cash': 'Tiền Mặt',
                'chuyen_khoan': 'Chuyển Khoản',  
            };
            return methods[method] || method;
        },
        getPaymentMethodBg(method) {
            const bgMap = {
                'vnpay': '#e0f2fe',
                'cash': '#dbeafe',
                'chuyen_khoan': '#ede9fe',
            };
            return bgMap[method] || '#f3f4f6';
        },
        getPaymentMethodColor(method) {
            const colorMap = {
                'vnpay': '#0369a1',
                'cash': '#0284c7',
                'chuyen_khoan': '#6d28d9',
            };
            return colorMap[method] || '#666';
        },
        getStatusText(status) {
            const statuses = {
                '0': 'Đã Hủy',
                '1': 'Chờ Thanh toán',
                '2': 'Đã Thanh toán',
            };
            return statuses[status?.toString()] || 'Không xác định';
        },
        getStatusBg(status) {
            const bgMap = {
                '0': '#fee2e2',
                '1': '#fef3c7',
                '2': '#dcfce7',
            };
            return bgMap[status?.toString()] || '#f3f4f6';
        },
        getStatusColor(status) {
            const colorMap = {
                '0': '#dc2626',
                '1': '#d97706',
                '2': '#16a34a',
            };
            return colorMap[status?.toString()] || '#666';
        },
        viewInvoice(invoice) {
            this.selectedInvoice = invoice;
            this.showViewModal = true;
        },
        editInvoice(invoice) {
            this.selectedInvoice = invoice;
            this.editingStatus = invoice.trang_thai.toString();
            this.showEditModal = true;
        },
        deleteInvoice(invoice) {
            this.selectedInvoice = invoice;
            this.showDeleteModal = true;
        },
        confirmDelete() {
            if (!this.selectedInvoice) return;
            
            axios.post(apiUrl('admin/hoa-don/delete'), { id: this.selectedInvoice.id }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showDeleteModal = false;
                    this.loadInvoices();
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi xóa hóa đơn');
            });
        },
        updateInvoiceStatus() {
            if (!this.selectedInvoice) return;
            
            axios.post(apiUrl('admin/hoa-don/update'), { 
                id: this.selectedInvoice.id,
                trang_thai: this.editingStatus
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showEditModal = false;
                    this.loadInvoices();
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi cập nhật trạng thái');
            });
        },
        printInvoice(invoice) {
            this.$router.push(`/admin/in-ve/${invoice.ma_hoa_don}`);
        },
        exportReport() {
            this.$toast.info('Chức năng xuất báo cáo sẽ được cập nhật sớm!');
        }
    }
}
</script>

<style scoped>
.invoice-row {
    border-bottom: 1px solid #e2e8f0;
    transition: background 0.2s;
}
.invoice-row:hover {
    background: #f9fafb !important;
}

.btn-export {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
.btn-export:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.action-btn {
    width: 35px;
    height: 35px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border: none;
}

.btn-view {
    background: #e3f2fd;
    color: #667eea;
}
.btn-view:hover {
    background: #667eea;
    color: white;
}

.btn-edit {
    background: #f0f4f8;
    color: #764ba2;
}
.btn-edit:hover {
    background: #764ba2;
    color: white;
}

.btn-delete {
    background: #fee;
    color: #f56565;
}
.btn-delete:hover {
    background: #f56565;
    color: white;
}

.btn-print {
    background: #f0f0f0;
    color: #666;
}
.btn-print:hover {
    background: #666;
    color: white;
}

/* THÊM CSS CHO CHỨC NĂNG CHUYỂN TRANG */
.page-btn {
    padding: 8px 16px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    color: #4a5568;
    display: flex;
    align-items: center;
}

.page-btn:hover:not(:disabled) {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.page-btn:disabled {
    background: #f7fafc;
    color: #cbd5e0;
    cursor: not-allowed;
}

.page-info {
    font-weight: 600;
    color: #4a5568;
    padding: 0 15px;
    font-size: 0.9rem;
}
</style>