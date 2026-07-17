<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">🎫 Quản Lý Vé</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý danh sách vé và thông tin đặt chỗ khách hàng.</p>
        </div>

        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 1fr 150px 150px; gap: 15px; align-items: flex-end;">
                <div style="position: relative;">
                    <input v-model="searchQuery" 
                        type="text" 
                        placeholder="Tìm kiếm theo mã vé hoặc khách hàng..."
                        @input="filterData"
                        style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    <i class="fa-solid fa-search" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                </div>

                <select v-model="tourFilter" 
                    @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Tour</option>
                    <option v-for="tour in tours" :key="tour.id" :value="tour.id">{{ tour.ten_tour }}</option>
                </select>

                <select v-model="statusFilter" 
                    @change="filterData"
                    style="padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white; cursor: pointer;">
                    <option value="">Tất cả Trạng Thái</option>
                    <option value="0">Đã Hủy</option>
                    <option value="1">Chưa Thanh Toán</option>
                    <option value="2">Đã Thanh Toán</option>
                </select>

                <button @click="openAddModal" class="btn-primary-gradient">
                    <i class="fa-solid fa-plus me-2"></i>Thêm Vé
                </button>
            </div>
        </div>

        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Mã Vé</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Khách Hàng</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">Tour</th>
                            <th style="padding: 15px; text-align: right; font-weight: 600; color: #333; font-size: 0.9rem;">Giá Vé</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Trạng Thái</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredTickets.length === 0">
                            <td colspan="6" style="padding: 30px; text-align: center; color: #999;">
                                <i class="fa-solid fa-inbox me-2" style="font-size: 1.5rem;"></i>
                                <p style="margin: 10px 0 0 0;">Không có vé nào</p>
                            </td>
                        </tr>
                        <tr v-for="ticket in paginatedTickets" :key="ticket.id" style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;"
                            @mouseenter="(e) => e.currentTarget.style.background = '#f9fafb'"
                            @mouseleave="(e) => e.currentTarget.style.background = ''">
                            <td style="padding: 15px; color: #333; font-weight: 600;">{{ ticket.ma_ve }}</td>
                            <td style="padding: 15px; color: #666;">{{ ticket.ho_va_ten }}</td>
                            <td style="padding: 15px; color: #666;">{{ ticket.ten_tour || 'Chưa xác định' }}</td>
                            <td style="padding: 15px; text-align: right; color: #667eea; font-weight: 600;">{{ formatVND(ticket.gia_ve) }}</td>
                            <td style="padding: 15px; text-align: center;">
                                <span :style="{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    background: getStatusBg(ticket.tinh_trang),
                                    color: getStatusColor(ticket.tinh_trang)
                                }">
                                    {{ getStatusText(ticket.tinh_trang) }}
                                </span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button @click="viewTicket(ticket)" class="action-btn btn-view" title="Xem chi tiết">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                    <button @click="editTicket(ticket)" class="action-btn btn-edit" title="Chỉnh sửa">
                                        <i class="fa-solid fa-pen-nib"></i>
                                    </button>
                                    <button @click="deleteTicket(ticket)" class="action-btn btn-delete" title="Xóa">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="filteredTickets.length > 0" class="pagination-container" style="padding: 15px; border-top: 1px solid #e2e8f0; margin-top: 0;">
                <button @click="currentPage = 1" :disabled="currentPage === 1" class="page-btn"><i class="fa-solid fa-angles-left"></i></button>
                <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn"><i class="fa-solid fa-angle-left"></i></button>
                <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
                <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn"><i class="fa-solid fa-angle-right"></i></button>
                <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="page-btn"><i class="fa-solid fa-angles-right"></i></button>
            </div>
        </div>

        <div v-if="showViewModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Chi Tiết Vé</h2>
                    <button @click="showViewModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="selectedTicket" style="color: #333;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Mã Vé</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedTicket.ma_ve }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Khách Hàng</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ selectedTicket.ho_va_ten }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Tour</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ getTourName(selectedTicket.id_tour) }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Giá Vé</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem; color: #667eea;">{{ formatVND(selectedTicket.gia_ve) }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Trạng Thái</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem; color: #667eea;">{{ getStatusText(selectedTicket.tinh_trang) }}</p>
                        </div>
                        <div>
                            <p style="color: #999; font-size: 0.85rem; margin: 0 0 5px 0;">Ngày Tạo</p>
                            <p style="margin: 0; font-weight: 600; font-size: 1rem;">{{ formatDate(selectedTicket.created_at) }}</p>
                        </div>
                    </div>
                    <button @click="showViewModal = false" style="width: 100%; padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Đóng</button>
                </div>
            </div>
        </div>

        <div v-if="showEditModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Cập Nhật Vé</h2>
                    <button @click="showEditModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div v-if="editingTicket" style="color: #333;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Mã Vé
                        </label>
                        <input v-model="editingTicket.ma_ve" type="text"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Khách Hàng
                        </label>
                        <select v-model="editingTicket.id_khach_hang"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="">Chọn khách hàng</option>
                            <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.ho_va_ten }}</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Tour
                        </label>
                        <select v-model="editingTicket.id_tour"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="">Chọn tour</option>
                            <option v-for="tour in tours" :key="tour.id" :value="tour.id">{{ tour.ten_tour }} - {{ formatVND(tour.gia) }}</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            💰 Giá Vé (Tự động cập nhật theo tour)
                        </label>
                        <input v-model="editingTicket.gia_ve" type="number" disabled
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: #f5f5f5; color: #667eea; font-weight: 600;">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Trạng Thái
                        </label>
                        <select v-model="editingTicket.tinh_trang"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="0">Đã Hủy</option>
                            <option value="1">Chưa Thanh Toán</option>
                            <option value="2">Đã Thanh Toán</option>
                        </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showEditModal = false"
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="saveTicket"
                            style="padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Lưu</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showAddModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Thêm Vé Mới</h2>
                    <button @click="showAddModal = false" style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <div style="color: #333;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Mã Vé
                        </label>
                        <input v-model="newTicket.ma_ve" type="text"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Khách Hàng
                        </label>
                        <select v-model="newTicket.id_khach_hang"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="">Chọn khách hàng</option>
                            <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.ho_va_ten }}</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Hóa Đơn
                        </label>
                        <select v-model="newTicket.id_hoa_don"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="">Chọn hóa đơn</option>
                            <option v-for="invoice in invoices" :key="invoice.id" :value="invoice.id">{{ invoice.ma_hoa_don }}</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Tour
                        </label>
                        <select v-model="newTicket.id_tour"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="">Chọn tour</option>
                            <option v-for="tour in tours" :key="tour.id" :value="tour.id">{{ tour.ten_tour }} - {{ formatVND(tour.gia) }}</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            💰 Giá Vé (Tự động cập nhật theo tour)
                        </label>
                        <input v-model="newTicket.gia_ve" type="number" disabled
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: #f5f5f5; color: #667eea; font-weight: 600;">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: 600; color: #333; margin-bottom: 8px; font-size: 0.9rem;">
                            Trạng Thái
                        </label>
                        <select v-model="newTicket.tinh_trang"
                            style="width: 100%; padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; background: white;">
                            <option value="0">Đã Hủy</option>
                            <option value="1">Chưa Thanh Toán</option>
                            <option value="2">Đã Thanh Toán</option>
                        </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button @click="showAddModal = false"
                            style="padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy</button>
                        <button @click="addTicket"
                            style="padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Thêm</button>
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
                    <h2 style="margin: 0 0 10px 0; color: #333;">Xóa Vé?</h2>
                    <p v-if="selectedTicket" style="color: #666; margin: 0 0 20px 0;">
                        Bạn chắc chắn muốn xóa vé <strong>{{ selectedTicket.ma_ve }}</strong>?<br><span style="font-size: 0.85rem; color: #999;">Hành động này không thể hoàn tác!</span>
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
            tickets: [],
            tours: [],
            customers: [],
            invoices: [],
            filteredTickets: [],
            searchQuery: '',
            tourFilter: '',
            statusFilter: '',
            showViewModal: false,
            showEditModal: false,
            showAddModal: false,
            showDeleteModal: false,
            selectedTicket: null,
            editingTicket: null,
            newTicket: { tinh_trang: 1 },
            isLoading: false,

            // Biến phân trang
            currentPage: 1,
            itemsPerPage: 10 // Số vé hiển thị trên mỗi trang
        }
    },
    computed: {
        // Cắt dữ liệu hiển thị theo trang hiện tại
        paginatedTickets() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredTickets.slice(start, start + this.itemsPerPage);
        },
        // Tính tổng số trang
        totalPages() {
            return Math.ceil(this.filteredTickets.length / this.itemsPerPage) || 1;
        }
    },
    mounted() {
        this.loadTours();
        this.loadCustomers();
        this.loadInvoices();
        this.loadTickets();
    },
    methods: {
        loadTours() {
            axios.get(apiUrl('admin/tour/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.tours = res.data.data;
                }
            })
            .catch(err => {
                console.error('Error loading tours:', err);
            });
        },
        loadCustomers() {
            axios.get(apiUrl('admin/khach-hang/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.customers = res.data.data;
                }
            })
            .catch(err => {
                console.error('Error loading customers:', err);
            });
        },
        loadInvoices() {
            axios.get(apiUrl('admin/hoa-don/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.invoices = res.data.data;
                }
            })
            .catch(err => {
                console.error('Error loading invoices:', err);
            });
        },
        loadTickets() {
            this.isLoading = true;
            axios.get(apiUrl('admin/ve/get-data'), {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.tickets = res.data.data;
                    this.filterData();
                    this.$toast.success('Tải dữ liệu thành công!');
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi tải dữ liệu vé');
            })
            .finally(() => {
                this.isLoading = false;
            });
        },
        filterData() {
            this.filteredTickets = this.tickets.filter(ticket => {
                const matchSearch = !this.searchQuery || 
                    (ticket.ma_ve && ticket.ma_ve.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
                    (ticket.ho_va_ten && ticket.ho_va_ten.toLowerCase().includes(this.searchQuery.toLowerCase()));
                
                const matchTour = !this.tourFilter || (ticket.id_tour && parseInt(ticket.id_tour) === parseInt(this.tourFilter));
                const matchStatus = !this.statusFilter || ticket.tinh_trang.toString() === this.statusFilter;
                
                return matchSearch && matchTour && matchStatus;
            });

            // Reset về trang 1 khi lọc dữ liệu
            this.currentPage = 1;
        },
        getTourName(id) {
            if (!id) return 'Chưa xác định';
            const tour = this.tours.find(t => parseInt(t.id) === parseInt(id));
            return tour ? tour.ten_tour : 'Chưa xác định';
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
        getStatusText(status) {
            const statuses = {
                '0': 'Đã Hủy',
                '1': 'Chưa Thanh Toán',
                '2': 'Đã Thanh Toán',
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
        viewTicket(ticket) {
            this.selectedTicket = ticket;
            this.showViewModal = true;
        },
        editTicket(ticket) {
            this.selectedTicket = ticket;
            this.editingTicket = JSON.parse(JSON.stringify(ticket));
            this.showEditModal = true;
        },
        openAddModal() {
            this.newTicket = { tinh_trang: 1 };
            this.showAddModal = true;
        },
        deleteTicket(ticket) {
            this.selectedTicket = ticket;
            this.showDeleteModal = true;
        },
        confirmDelete() {
            if (!this.selectedTicket) return;
            
            axios.post(apiUrl('admin/ve/destroy'), { id: this.selectedTicket.id }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showDeleteModal = false;
                    this.loadTickets();
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi xóa vé');
            });
        },
        saveTicket() {
            if (!this.editingTicket) return;
            
            const data = {
                id: this.editingTicket.id,
                ma_ve: this.editingTicket.ma_ve,
                gia_ve: this.editingTicket.gia_ve,
                id_khach_hang: this.editingTicket.id_khach_hang,
                tinh_trang: this.editingTicket.tinh_trang
            };
            
            axios.post(apiUrl('admin/ve/update'), data, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showEditModal = false;
                    this.loadTickets();
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi cập nhật vé');
            });
        },
        addTicket() {
            if (!this.newTicket.ma_ve || !this.newTicket.id_tour) {
                this.$toast.error('Vui lòng điền đầy đủ thông tin');
                return;
            }

            axios.post(apiUrl('admin/ve/store'), this.newTicket, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('key_admin')
                }
            })
            .then(res => {
                if (res.data.status) {
                    this.$toast.success(res.data.message);
                    this.showAddModal = false;
                    this.loadTickets();
                } else {
                    this.$toast.error(res.data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                this.$toast.error('Lỗi khi thêm vé');
            });
        }
    }
}
</script>

<style scoped>
.btn-primary-gradient {
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
.btn-primary-gradient:hover {
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

/* CSS Mới bổ sung cho thanh phân trang */
.pagination-container { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 15px; }
.page-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 1px solid #e2e8f0; background: white; color: #475569; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
.page-btn:hover:not(:disabled) { background: #f1f5f9; color: #333; border-color: #cbd5e1; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 0.9rem; color: #64748b; font-weight: 600; margin: 0 10px; }
</style>