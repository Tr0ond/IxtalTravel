<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">Quản lý Tour Du Lịch</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý, theo dõi danh sách và thông tin chi tiết các tour du
                lịch.</p>
        </div>

        <div
            style="background: white; border-radius: 12px; overflow: hidden; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 0; padding: 0;">
                <button @click="activeTab = 'tour'" :style="{
                    flex: 1,
                    padding: '16px 20px',
                    background: activeTab === 'tour' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f8fafc',
                    color: activeTab === 'tour' ? 'white' : '#475569',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '1rem',
                    position: 'relative',
                    overflow: 'hidden'
                }" @mouseenter="tourTabHovered = true" @mouseleave="tourTabHovered = false">
                    <i class="fa-solid fa-map me-3" style="font-size: 1.1rem;"></i>
                    <span style="font-size: 0.95rem;">📍 Danh Sách Tour</span>
                    <div v-if="activeTab === 'tour'"
                        style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #667eea, #764ba2);">
                    </div>
                </button>
                <div style="width: 1px; background: #e2e8f0;"></div>
                <button @click="activeTab = 'quocgia'" :style="{
                    flex: 1,
                    padding: '16px 20px',
                    background: activeTab === 'quocgia' ? 'linear-gradient(135deg, #10b981, #059669)' : '#f8fafc',
                    color: activeTab === 'quocgia' ? 'white' : '#475569',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '1rem',
                    position: 'relative',
                    overflow: 'hidden'
                }" @mouseenter="quocGiaTabHovered = true" @mouseleave="quocGiaTabHovered = false">
                    <i class="fa-solid fa-earth-americas me-3" style="font-size: 1.1rem;"></i>
                    <span style="font-size: 0.95rem;">🌍 Quốc Gia</span>
                    <div v-if="activeTab === 'quocgia'"
                        style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #10b981, #059669);">
                    </div>
                </button>
            </div>
        </div>

        <div v-if="activeTab === 'tour'">
            <div
                style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div
                    style="display: grid; grid-template-columns: 1fr 1fr 2fr 120px 150px; gap: 15px; align-items: flex-end;">
                    <div>
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 5px; display: block;">Từ
                            ngày</label>
                        <input type="date" v-model="filter.tu_ngay" @change="applyFilters"
                            style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit;">
                    </div>
                    <div>
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 5px; display: block;">Đến
                            ngày</label>
                        <input type="date" v-model="filter.den_ngay" @change="applyFilters"
                            style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit;">
                    </div>
                    <div style="position: relative;">
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 5px; display: block;">Tìm
                            kiếm theo tên</label>
                        <input type="text" v-model="filter.keyword" placeholder="Nhập tên tour..." @input="applyFilters"
                            style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit;">
                        <i class="fa-solid fa-search"
                            style="position: absolute; right: 12px; bottom: 15px; color: #999;"></i>
                    </div>
                    <button @click="resetFilter" class="btn-reset">
                        <i class="fa-solid fa-rotate-right me-1"></i> Đặt Lại
                    </button>
                    <button @click="openAddModal" class="btn-add">
                        <i class="fa-solid fa-plus me-2"></i>Thêm Mới
                    </button>
                </div>
            </div>

            <div
                style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 60px;">
                                    ID</th>
                                <th
                                    style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; width: 80px;">
                                    Ảnh</th>
                                <th
                                    style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; width: 25%;">
                                    Tên Tour</th>
                                <th
                                    style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">
                                    Lộ Trình</th>
                                <th
                                    style="padding: 15px; text-align: right; font-weight: 600; color: #333; font-size: 0.9rem;">
                                    Giá Vé</th>
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">
                                    Lịch Trình</th>
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">
                                    Trạng Thái</th>
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">
                                    Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredTours.length === 0">
                                <td colspan="8" style="padding: 40px; text-align: center; color: #999;">
                                    <i class="fa-solid fa-box-open me-2"
                                        style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                                    Không tìm thấy dữ liệu tour nào
                                </td>
                            </tr>
                            <tr v-for="value in paginatedTours" :key="value.id" class="data-row">
                                <td style="padding: 15px; text-align: center; color: #333; font-weight: 600;">{{
                                    value.id }}
                                </td>
                                <td style="padding: 15px;">
                                    <img v-if="value.hinh_anh" :src="getImageUrl(getFirstImage(value.hinh_anh))"  alt="Tour"
                                        style="width: 60px; height: 45px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <div v-else
                                        style="width: 60px; height: 45px; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #cbd5e1;">
                                        <i class="fa-solid fa-image"></i>
                                    </div>
                                </td>
                                <td style="padding: 15px; color: #333; font-weight: 600;">{{ value.ten_tour }}</td>
                                <td style="padding: 15px; color: #555; font-size: 0.85rem; line-height: 1.6;">
                                    <div style="color: #64748b;"><i class="fa-solid fa-location-dot me-1"
                                            style="color: #10b981;"></i> {{ value.diem_don }}</div>
                                    <div style="color: #64748b; margin-top: 4px;"><i
                                            class="fa-solid fa-flag-checkered me-1" style="color: #ef4444;"></i> {{
                                                value.diem_tra }}</div>
                                </td>
                                <td style="padding: 15px; text-align: right; color: #667eea; font-weight: 700;">{{
                                    formatVND(value.gia) }}</td>
                                <td style="padding: 15px; text-align: center; font-size: 0.85rem; color: #666;">
                                    <div>{{ formatDate(value.ngay_bat_dau) }}</div>
                                    <i class="fa-solid fa-arrow-down"
                                        style="font-size: 0.7rem; color: #cbd5e1; margin: 2px 0;"></i>
                                    <div>{{ formatDate(value.ngay_ket_thuc) }}</div>
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <button @click="changeStatus(value.id, value.tinh_trang == 1 ? 0 : 1)" :style="{
                                        border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                                        background: value.tinh_trang == 1 ? '#dcfce7' : '#fee2e2',
                                        color: value.tinh_trang == 1 ? '#16a34a' : '#dc2626'
                                    }">
                                        {{ value.tinh_trang == 1 ? 'Hiển Thị' : 'Tạm Tắt' }}
                                    </button>
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <div style="display: flex; gap: 8px; justify-content: center;">
                                        <button @click="openViewModal(value)" class="action-btn btn-view"
                                            title="Xem chi tiết">
                                            <i class="fa-solid fa-eye"></i>
                                        </button>
                                        <button @click="openEditModal(value)" class="action-btn btn-edit"
                                            title="Cập nhật">
                                            <i class="fa-solid fa-pen-nib"></i>
                                        </button>
                                        <button @click="openDeleteModal(value)" class="action-btn btn-delete"
                                            title="Xóa tour">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div
                        style="padding: 20px 0; display: flex; justify-content: center; align-items: center; gap: 5px;">
                        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>

                        <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>

                        <button @click="currentPage++" :disabled="currentPage >= totalPages" class="page-btn">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'quocgia'">
            <div
                style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: flex; gap: 12px; align-items: flex-end; margin-bottom: 0;">
                    <div style="flex: 1; position: relative;">
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 6px; display: block;">🔍
                            Tìm kiếm Quốc Gia</label>
                        <input type="text" v-model="searchQuocGia" placeholder="Nhập tên quốc gia để tìm kiếm..."
                            style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 0.9rem;">
                        <i class="fa-solid fa-search"
                            style="position: absolute; right: 12px; bottom: 14px; color: #999; font-size: 0.9rem;"></i>
                    </div>
                    <button @click="openAddQuocGiaModal" class="btn-add" style="height: 45px;">
                        <i class="fa-solid fa-plus me-2"></i>Thêm Quốc Gia
                    </button>
                </div>
            </div>

            <div
                style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 70px;">
                                    <i class="fa-solid fa-hashtag me-1" style="color: #667eea;"></i>ID
                                </th>
                                <th
                                    style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; flex: 1;">
                                    <i class="fa-solid fa-earth-americas me-2" style="color: #667eea;"></i>Tên Quốc Gia
                                </th>
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 140px;">
                                    <i class="fa-solid fa-toggle-on me-1" style="color: #667eea;"></i>Trạng Thái
                                </th>
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 160px;">
                                    <i class="fa-solid fa-sliders me-1" style="color: #667eea;"></i>Hành Động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredQuocGia.length === 0" style="border-bottom: 1px solid #e2e8f0;">
                                <td colspan="4" style="padding: 50px 20px; text-align: center; color: #999;">
                                    <div style="font-size: 3rem; margin-bottom: 15px;">🌍</div>
                                    <p style="margin: 0; font-size: 1rem;">Không tìm thấy quốc gia nào</p>
                                    <p style="margin: 8px 0 0 0; font-size: 0.85rem; color: #bbb;">Hãy nhấp nút "Thêm
                                        Quốc Gia" để bắt đầu</p>
                                </td>
                            </tr>
                            <tr v-for="qg in paginatedQuocGia" :key="qg.id" class="data-row"
                                style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;">
                                <td
                                    style="padding: 15px; text-align: center; color: #667eea; font-weight: 700; font-size: 0.95rem;">
                                    #{{ qg.id }}
                                </td>
                                <td style="padding: 15px; color: #333; font-weight: 600; font-size: 0.95rem;">
                                    {{ qg.ten_quoc_gia }}
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <button @click="changeQuocGiaStatus(qg.id, qg.tinh_trang == 1 ? 0 : 1)" :style="{
                                        border: 'none',
                                        padding: '6px 14px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: qg.tinh_trang == 1 ? '#dcfce7' : '#fee2e2',
                                        color: qg.tinh_trang == 1 ? '#16a34a' : '#dc2626'
                                    }" :title="qg.tinh_trang == 1 ? 'Nhấp để tạm tắt' : 'Nhấp để kích hoạt'">
                                        <i
                                            :class="qg.tinh_trang == 1 ? 'fa-solid fa-check me-1' : 'fa-solid fa-lock me-1'"></i>
                                        {{ qg.tinh_trang == 1 ? 'Hoạt Động' : 'Tạm Tắt' }}
                                    </button>
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                                        <button @click="openEditQuocGiaModal(qg)" class="action-btn btn-edit"
                                            title="Chỉnh sửa thông tin"
                                            style="background: #f0f4f8; color: #764ba2; border: none; width: 36px; height: 36px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                            <i class="fa-solid fa-pen-nib"></i>
                                        </button>
                                        <button @click="openDeleteQuocGiaModal(qg)" class="action-btn btn-delete"
                                            title="Xóa quốc gia"
                                            style="background: #fee2e2; color: #ef4444; border: none; width: 36px; height: 36px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div
                        style="padding: 20px 0; display: flex; justify-content: center; align-items: center; gap: 5px;">
                        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>

                        <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>

                        <button @click="currentPage++" :disabled="currentPage >= totalPages" class="page-btn">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div
                style="margin-top: 20px; padding: 15px 20px; background: #f0f4f8; border-radius: 8px; font-size: 0.9rem; color: #475569;">
                <i class="fa-solid fa-info-circle me-2" style="color: #667eea;"></i>
                Tổng cộng: <strong>{{ list_quoc_gia.length }}</strong> quốc gia | Đang hiển thị: <strong>{{
                    filteredQuocGia.length }}</strong> quốc gia
            </div>
        </div>

        <div v-if="showFormModal"
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div
                    :style="{ background: isEdit ? '#10b981' : 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px', color: 'white', position: 'sticky', top: '0', zIndex: '10', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
                    <h2 style="margin: 0; font-size: 1.3rem;">{{ isEdit ? 'Cập Nhật Tour' : 'Thêm Tour Mới' }}</h2>
                    <button @click="showFormModal = false"
                        style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>

                <div style="padding: 20px; color: #333;">
                    <div style="margin-bottom: 15px;">
                        <label class="form-label">Tên Tour <span style="color: red;">*</span></label>
                        <input type="text" class="custom-input" v-model="form.ten_tour" placeholder="Nhập tên tour...">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label class="form-label">Mô Tả</label>
                        <textarea class="custom-input" rows="3" v-model="form.mo_ta"
                            placeholder="Mô tả ngắn gọn về tour..."></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label class="form-label">Điểm Đón</label>
                            <input type="text" class="custom-input" v-model="form.diem_don">
                        </div>
                        <div>
                            <label class="form-label">Điểm Trả</label>
                            <input type="text" class="custom-input" v-model="form.diem_tra">
                        </div>
                        <div>
                            <label class="form-label">Quốc Gia <span style="color: red;">*</span></label>
                            <select class="custom-input" v-model="form.id_quoc_gia">
                                <option value="" disabled>--- Chọn Quốc Gia ---</option>
                                <option v-for="qg in list_quoc_gia" :key="qg.id" :value="qg.id">
                                    {{ qg.ten_quoc_gia }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label class="form-label">Giá Vé (VNĐ) <span style="color: red;">*</span></label>
                            <input type="number" class="custom-input" v-model.number="form.gia" min="0">
                        </div>
                        <div>
                            <label class="form-label">Ngày Khởi Hành</label>
                            <input type="date" class="custom-input" v-model="form.ngay_bat_dau">
                        </div>
                        <div>
                            <label class="form-label">Ngày Kết Thúc</label>
                            <input type="date" class="custom-input" v-model="form.ngay_ket_thuc">
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label class="form-label">Số Khách Tối Đa</label>
                            <input type="number" class="custom-input" v-model.number="form.so_nguoi_toi_da" min="1">
                        </div>
                        <div>
                            <label class="form-label">Trạng Thái</label>
                            <select class="custom-input" v-model.number="form.tinh_trang">
                                <option value="1">Hiển thị</option>
                                <option value="0">Tạm tắt</option>
                            </select>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <label class="form-label">Đường dẫn Hình Ảnh (URL)</label>
                        <input type="text" class="custom-input" v-model="form.hinh_anh" placeholder="https://...">
                    </div>

                    <div
                        style="display: flex; gap: 15px; justify-content: flex-end; padding-top: 20px; border-top: 1px solid #eee;">
                        <button @click="showFormModal = false"
                            style="padding: 12px 20px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Hủy
                            Bỏ</button>
                        <button @click="saveTour"
                            :style="{ background: isEdit ? '#10b981' : 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }">
                            {{ isEdit ? 'Lưu Cập Nhật' : 'Thêm Mới Dữ Liệu' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showViewModal"
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; width: 90%; max-width: 900px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div
                    style="background: #0ea5e9; padding: 20px; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; font-size: 1.3rem;">Chi Tiết Tour</h2>
                    <button @click="showViewModal = false"
                        style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>

                <div style="padding: 30px; display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                    <div>
                        <img v-if="view_tour.hinh_anh" :src="getImageUrl(getFirstImage(view_tour.hinh_anh))" alt="Tour"
                            style="width: 100%; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div v-else
                            style="width: 100%; height: 200px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #cbd5e1;">
                            <i class="fa-solid fa-image"></i>
                        </div>
                    </div>
                    <div>
                        <h3 style="color: #0ea5e9; margin: 0 0 20px 0;">{{ view_tour.ten_tour }}</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            <div>
                                <span style="color: #64748b; font-size: 0.85rem; display: block;">Điểm Đón</span>
                                <strong style="color: #333;">{{ view_tour.diem_don }}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b; font-size: 0.85rem; display: block;">Điểm Trả</span>
                                <strong style="color: #333;">{{ view_tour.diem_tra }}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b; font-size: 0.85rem; display: block;">Khởi Hành</span>
                                <strong style="color: #333;">{{ formatDate(view_tour.ngay_bat_dau) }}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b; font-size: 0.85rem; display: block;">Kết Thúc</span>
                                <strong style="color: #333;">{{ formatDate(view_tour.ngay_ket_thuc) }}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b; font-size: 0.85rem; display: block;">Giá Vé</span>
                                <strong style="color: #ef4444; font-size: 1.1rem;">{{ formatVND(view_tour.gia)
                                    }}</strong>
                            </div>
                            <div>
                                <span style="color: #64748b; font-size: 0.85rem; display: block;">Khách Tối Đa</span>
                                <strong style="color: #333;">{{ view_tour.so_nguoi_toi_da }} Người</strong>
                            </div>
                        </div>

                        <div v-if="view_tour.mo_ta" style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                            <h5 style="margin: 0 0 10px 0; color: #333; font-size: 0.95rem;">Mô Tả Chi Tiết:</h5>
                            <p
                                style="margin: 0; color: #555; white-space: pre-line; font-size: 0.9rem; line-height: 1.6;">
                                {{ view_tour.mo_ta }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal"
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; width: 90%; max-width: 400px; padding: 30px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="font-size: 3.5rem; color: #ef4444; margin-bottom: 15px;">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 style="margin: 0 0 10px 0; color: #333;">Xác Nhận Xóa</h3>
                <p style="color: #666; margin: 0 0 25px 0;">
                    Bạn có chắc chắn muốn xóa tour <br><strong>{{ del_tour.ten_tour }}</strong>? <br>
                    <span style="font-size: 0.85rem; color: #999;">Hành động này không thể hoàn tác!</span>
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <button @click="showDeleteModal = false"
                        style="padding: 12px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; color: #333; cursor: pointer;">Hủy
                        Bỏ</button>
                    <button @click="confirmDelete"
                        style="padding: 12px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Xóa
                        Ngay</button>
                </div>
            </div>
        </div>

        <div v-if="showQuocGiaModal"
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden;">
                <div :style="{
                    background: isEditQuocGia ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    padding: '25px 20px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '4px solid rgba(255,255,255,0.1)'
                }">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i :class="isEditQuocGia ? 'fa-solid fa-pen-fancy' : 'fa-solid fa-earth-americas'"
                            style="font-size: 1.3rem;"></i>
                        <h2 style="margin: 0; font-size: 1.2rem;">
                            {{ isEditQuocGia ? '✏️ Chỉnh Sửa Quốc Gia' : '🌍Thêm Quốc Gia Mới' }}</h2>
                    </div>
                    <button @click="showQuocGiaModal = false"
                        style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">×</button>
                </div>

                <div style="padding: 25px; color: #333;">
                    <div style="margin-bottom: 20px;">
                        <label class="form-label" style="font-weight: 700; color: #333; font-size: 0.95rem;">
                            <i class="fa-solid fa-marker me-2" style="color: #667eea;"></i>Tên Quốc Gia <span
                                style="color: #ef4444;">*</span>
                        </label>
                        <input type="text" class="custom-input" v-model="quocGiaForm.ten_quoc_gia"
                            placeholder="VD: Việt Nam, Thái Lan, Nhật Bản..." style="font-size: 0.95rem;">
                    </div>

                    <div style="margin-bottom: 25px;">
                        <label class="form-label" style="font-weight: 700; color: #333; font-size: 0.95rem;">
                            <i class="fa-solid fa-toggle-on me-2" style="color: #667eea;"></i>Trạng Thái
                        </label>
                        <select class="custom-input" v-model.number="quocGiaForm.tinh_trang"
                            style="font-size: 0.95rem;">
                            <option :value="1">✅ Hoạt động (Hiển thị cho khách)</option>
                            <option :value="0">🔒 Tạm tắt (Ẩn khỏi khách)</option>
                        </select>
                    </div>

                    <div
                        style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 20px; border-top: 2px solid #e2e8f0;">
                        <button @click="showQuocGiaModal = false"
                            style="padding: 11px 20px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; font-size: 0.9rem;">
                            <i class="fa-solid fa-times me-2"></i>Hủy Bỏ
                        </button>
                        <button @click="saveQuocGia" :style="{
                            background: isEditQuocGia ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            padding: '11px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem',
                            boxShadow: isEditQuocGia ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }">
                            <i :class="isEditQuocGia ? 'fa-solid fa-check me-2' : 'fa-solid fa-plus me-2'"></i>{{
                                isEditQuocGia ? 'Lưu Cập Nhật' : 'Thêm Mới' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDeleteQuocGiaModal"
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; width: 90%; max-width: 420px; padding: 30px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="font-size: 3.5rem; margin-bottom: 15px; animation: shake 0.5s;">
                    ⚠️
                </div>
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.1rem; font-weight: 700;">Xác Nhận Xóa Quốc Gia
                </h3>
                <p style="color: #666; margin: 15px 0; font-size: 0.95rem; line-height: 1.6;">
                    Bạn có chắc chắn muốn xóa <br><strong style="color: #ef4444; font-size: 1rem;">{{
                        del_quoc_gia.ten_quoc_gia }}</strong>? <br>
                    <span style="font-size: 0.85rem; color: #999; display: inline-block; margin-top: 8px;">⚠️ Hành động
                        này không thể hoàn tác!</span>
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 25px;">
                    <button @click="showDeleteQuocGiaModal = false"
                        style="padding: 12px; background: #f1f5f9; border: 2px solid #e2e8f0; border-radius: 8px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; font-size: 0.9rem;">
                        <i class="fa-solid fa-arrow-left me-2"></i>Hủy Bỏ
                    </button>
                    <button @click="confirmDeleteQuocGia"
                        style="padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                        <i class="fa-solid fa-trash me-2"></i>Xóa Ngay
                    </button>
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
            activeTab: 'tour',

            // Phân trang chung cho table hiện tại
            currentPage: 1,
            pageSize: 5, // Mỗi trang hiển thị 5 dòng, bạn có thể chỉnh lại thành 10 tùy ý.

            // Tour Data
            list_tour: [],
            list_quoc_gia: [],
            filteredTours: [],
            filter: {
                tu_ngay: '',
                den_ngay: '',
                keyword: ''
            },

            showFormModal: false,
            showViewModal: false,
            showDeleteModal: false,
            isEdit: false,

            form: {
                id: null, ten_tour: '', mo_ta: '', gia: 0, ngay_bat_dau: '', ngay_ket_thuc: '', so_nguoi_toi_da: 1, diem_don: '', diem_tra: '', tinh_trang: 1, hinh_anh: '', id_quoc_gia: 1
            },
            view_tour: {},
            del_tour: {},

            // Quốc Gia Data
            filteredQuocGia: [],
            searchQuocGia: '',
            showQuocGiaModal: false,
            showDeleteQuocGiaModal: false,
            isEditQuocGia: false,
            quocGiaForm: {
                id: null,
                ten_quoc_gia: '',
                tinh_trang: 1
            },
            del_quoc_gia: {},
            tourTabHovered: false,
            quocGiaTabHovered: false
        }
    },
    computed: {
        // Tính tổng số trang dựa trên tab đang kích hoạt
        totalPages() {
            if (this.activeTab === 'tour') {
                return Math.ceil(this.filteredTours.length / this.pageSize) || 1;
            } else {
                return Math.ceil(this.filteredQuocGia.length / this.pageSize) || 1;
            }
        },
        // Cắt mảng Tour hiển thị trên trang hiện tại
        paginatedTours() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredTours.slice(start, start + this.pageSize);
        },
        // Cắt mảng Quốc Gia hiển thị trên trang hiện tại
        paginatedQuocGia() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredQuocGia.slice(start, start + this.pageSize);
        }
    },
    mounted() {
        this.getTour();
        this.getQuocGia();
    },
    watch: {
        searchQuocGia() {
            this.filterQuocGia();
        },
        // Reset về trang 1 khi chuyển đổi qua lại giữa các tab
        activeTab() {
            this.currentPage = 1;
        }
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
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        formatVND(number) {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(number || 0);
        },
        getQuocGia() {
            axios.get(apiUrl('admin/quoc-gia/get-data'), { 
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.list_quoc_gia = res.data.data;
                        this.filterQuocGia();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((error) => {
                    console.error('Lỗi lấy danh mục quốc gia:', error);
                });
        },
        getTour() {
            axios.get(apiUrl('admin/tour/get-data'), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.list_tour = res.data.data;
                        this.applyFilters();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((error) => {
                    console.error('Lỗi lấy dữ liệu:', error);
                    this.$toast.error('Lỗi khi tải dữ liệu');
                });
        },

        applyFilters() {
            let result = this.list_tour.filter((tour) => {
                const matchKeyword = !this.filter.keyword || tour.ten_tour.toLowerCase().includes(this.filter.keyword.toLowerCase());
                const matchTuNgay = !this.filter.tu_ngay || new Date(tour.ngay_bat_dau) >= new Date(this.filter.tu_ngay);
                const matchDenNgay = !this.filter.den_ngay || new Date(tour.ngay_bat_dau) <= new Date(this.filter.den_ngay);
                return matchKeyword && matchTuNgay && matchDenNgay;
            });

            this.filteredTours = result.sort((a, b) => a.id - b.id);
            this.currentPage = 1;
        },

        resetFilter() {
            this.filter = { tu_ngay: '', den_ngay: '', keyword: '' };
            this.applyFilters();
        },

        openAddModal() {
            this.isEdit = false;
            this.form = { id: null, ten_tour: '', mo_ta: '', gia: 0, ngay_bat_dau: '', ngay_ket_thuc: '', so_nguoi_toi_da: 1, diem_don: '', diem_tra: '', tinh_trang: 1, hinh_anh: '', id_quoc_gia: 1 };
            this.showFormModal = true;
        },

        openEditModal(item) {
            this.isEdit = true;
            this.form = { ...item };
            this.showFormModal = true;
        },

        openViewModal(item) {
            this.view_tour = { ...item };
            this.showViewModal = true;
        },

        openDeleteModal(item) {
            this.del_tour = { ...item };
            this.showDeleteModal = true;
        },

        saveTour() {
    const url = this.isEdit ? 'admin/tour/update' : 'admin/tour/add-data';

    // 1. Tạo một bản sao của form để xử lý dữ liệu, tránh làm ảnh hưởng giao diện hiện tại
    let payload = { ...this.form };

    // 2. Chuyển đổi chuỗi hình ảnh thành mảng (Array)
    if (typeof payload.hinh_anh === 'string' && payload.hinh_anh.trim() !== '') {
        // Cắt chuỗi bằng dấu phẩy và xóa các khoảng trắng thừa ở mỗi link
        payload.hinh_anh = payload.hinh_anh.split(',').map(link => link.trim());
    } else if (payload.hinh_anh === '') {
        // Nếu người dùng không nhập gì, gửi lên mảng rỗng thay vì chuỗi rỗng
        payload.hinh_anh = [];
    }

    // 3. Gửi 'payload' đi thay vì 'this.form'
    axios.post(apiUrl(url), payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
    })
        .then((res) => {
            if (res.data.status) {
                this.$toast.success(res.data.message);
                this.showFormModal = false;
                this.getTour();
            } else {
                this.$toast.error(res.data.message);
            }
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.errors) {
                const list = Object.values(error.response.data.errors);
                list.forEach((v) => { this.$toast.error(v[0]); });
            } else {
                this.$toast.error('Lỗi hệ thống');
            }
        });
},

        confirmDelete() {
            axios.post(apiUrl('admin/tour/destroy'), { id: this.del_tour.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.showDeleteModal = false;
                        this.getTour();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(() => this.$toast.error('Lỗi khi xóa tour'));
        },

        changeStatus(id, newStatus) {
            axios.post(apiUrl('admin/tour/change-status'), { id: id, tinh_trang: newStatus }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.getTour();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(() => this.$toast.error('Lỗi khi đổi trạng thái'));
        },

        // ==================== QUỐC GIA METHODS ====================

        filterQuocGia() {
            this.filteredQuocGia = this.list_quoc_gia.filter(qg => {
                const matchSearch = !this.searchQuocGia ||
                    qg.ten_quoc_gia.toLowerCase().includes(this.searchQuocGia.toLowerCase());
                return matchSearch;
            });
            this.currentPage = 1;
        },

        openAddQuocGiaModal() {
            this.isEditQuocGia = false;
            this.quocGiaForm = {
                id: null,
                ten_quoc_gia: '',
                tinh_trang: 1
            };
            this.showQuocGiaModal = true;
        },

        openEditQuocGiaModal(qg) {
            this.isEditQuocGia = true;
            this.quocGiaForm = { ...qg };
            this.showQuocGiaModal = true;
        },

        openDeleteQuocGiaModal(qg) {
            this.del_quoc_gia = { ...qg };
            this.showDeleteQuocGiaModal = true;
        },

        saveQuocGia() {
            if (!this.quocGiaForm.ten_quoc_gia.trim()) {
                this.$toast.warning('Vui lòng nhập tên quốc gia!');
                return;
            }

            const url = this.isEditQuocGia ? 'admin/quoc-gia/update' : 'admin/quoc-gia/add-data';
            const payload = {
                ten_quoc_gia: this.quocGiaForm.ten_quoc_gia,
                tinh_trang: this.quocGiaForm.tinh_trang
            };

            if (this.isEditQuocGia) {
                payload.id = this.quocGiaForm.id;
            }

            axios.post(apiUrl(url), payload, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message || (this.isEditQuocGia ? 'Cập nhật quốc gia thành công!' : 'Thêm quốc gia thành công!'));
                        this.showQuocGiaModal = false;
                        this.getQuocGia();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    this.$toast.error('Lỗi khi lưu quốc gia');
                });
        },

        confirmDeleteQuocGia() {
            axios.post(apiUrl('admin/quoc-gia/destroy'), { id: this.del_quoc_gia.id }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message || 'Xóa quốc gia thành công!');
                        this.showDeleteQuocGiaModal = false;
                        this.getQuocGia();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(() => this.$toast.error('Lỗi khi xóa quốc gia'));
        },

        changeQuocGiaStatus(id, newStatus) {
            axios.post(apiUrl('admin/quoc-gia/change-status'), { id: id, tinh_trang: newStatus }, {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            })
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.getQuocGia();
                    } else {
                        this.$toast.error(res.data.message);
                    }
                })
                .catch(() => this.$toast.error('Lỗi khi đổi trạng thái'));
        }
    }
}
</script>

<style scoped>
.btn-reset {
    padding: 12px 15px;
    background: #f1f5f9;
    color: #64748b;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-reset:hover {
    background: #e2e8f0;
    color: #333;
}

.btn-add {
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

.btn-add:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.data-row {
    border-bottom: 1px solid #e2e8f0;
    transition: background 0.2s;
}

.data-row:hover {
    background: #f8fafc !important;
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

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.btn-view {
    background: #e0f2fe;
    color: #0ea5e9;
}

.btn-view:hover {
    background: #0ea5e9;
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
    background: #fee2e2;
    color: #ef4444;
}

.btn-delete:hover {
    background: #ef4444;
    color: white;
}

.form-label {
    display: block;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    font-size: 0.9rem;
}

.custom-input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s;
    background: #fff;
}

.custom-input:focus {
    outline: none;
    border-color: #667eea;
}

@keyframes shake {

    0%,
    100% {
        transform: scale(1);
    }

    25% {
        transform: scale(1.1) rotate(-2deg);
    }

    50% {
        transform: scale(1.1) rotate(2deg);
    }

    75% {
        transform: scale(1.1) rotate(-2deg);
    }
}

/* CSS cho thanh phân trang */
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