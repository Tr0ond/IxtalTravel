<template>
    <div style="padding: 20px; background: #f5f7fa; min-height: 100vh;">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; color: #333; margin: 0;">📅 Quản Lý Lịch Trình Tour</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Quản lý hoạt động và lịch trình chi tiết cho từng tour du lịch.
            </p>
        </div>

        <div
            style="background: white; border-radius: 12px; overflow: hidden; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="display: flex; gap: 0; padding: 0;">
                <button @click="activeTab = 'lichtrinh'" :style="{
                    flex: 1, padding: '16px 20px', border: 'none', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1rem', position: 'relative', overflow: 'hidden',
                    background: activeTab === 'lichtrinh' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f8fafc',
                    color: activeTab === 'lichtrinh' ? 'white' : '#475569'
                }">
                    <i class="fa-solid fa-calendar-days me-3" style="font-size: 1.1rem;"></i>
                    <span>📅 Lịch Trình</span>
                    <div v-if="activeTab === 'lichtrinh'"
                        style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #667eea, #764ba2);">
                    </div>
                </button>
                <div style="width: 1px; background: #e2e8f0;"></div>
                <button @click="activeTab = 'diemden'" :style="{
                    flex: 1, padding: '16px 20px', border: 'none', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1rem', position: 'relative', overflow: 'hidden',
                    background: activeTab === 'diemden' ? 'linear-gradient(135deg, #10b981, #059669)' : '#f8fafc',
                    color: activeTab === 'diemden' ? 'white' : '#475569'
                }">
                    <i class="fa-solid fa-map-marker-alt me-3" style="font-size: 1.1rem;"></i>
                    <span>📍 Điểm Đến</span>
                    <div v-if="activeTab === 'diemden'"
                        style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #10b981, #059669);">
                    </div>
                </button>
            </div>
        </div>

        <div v-if="activeTab === 'lichtrinh'">
            <div
                style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 15px; align-items: flex-end;">
                    <div style="position: relative;">
                        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên tour..."
                            @input="filterData"
                            style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit;">
                        <i class="fa-solid fa-search"
                            style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #999;"></i>
                    </div>
                    <button @click="resetFilter" class="btn-primary-reset">
                        <i class="fa-solid fa-rotate-right me-2"></i>Làm Mới
                    </button>
                    <button @click="openAddModal" class="btn-primary-gradient">
                        <i class="fa-solid fa-plus me-2"></i>Thêm Hoạt Động
                    </button>
                </div>
            </div>

            <div v-if="loading"
                style="background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: #667eea;"></i>
                <p style="margin: 15px 0 0 0; color: #666;">Đang tải dữ liệu...</p>
            </div>

            <div v-else>
                <div v-if="filteredSchedules.length === 0"
                    style="background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <i class="fa-solid fa-inbox" style="font-size: 2rem; color: #ccc;"></i>
                    <p style="margin: 15px 0 0 0; color: #999;">Không có lịch trình nào</p>
                </div>

                <div v-for="tour in paginatedSchedules" :key="tour.id_tour"
                    style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <img v-if="tour.anh_tour" :src="getImageUrl(getFirstImage(tour.anh_tour))" alt="Tour"
                                style="width: 70px; height: 50px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div v-else
                                style="width: 70px; height: 50px; background: #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8;">
                                <i class="fa-solid fa-image"></i>
                            </div>
                            <div>
                                <h2 style="margin: 0; color: #333; font-size: 1.15rem; font-weight: 700;">{{
                                    tour.ten_tour }}</h2>
                                <p style="margin: 3px 0 0 0; color: #64748b; font-size: 0.85rem;">
                                    <span style="font-weight: 600; color: #667eea;">ID: {{ tour.id_tour }}</span>
                                    &nbsp;•&nbsp; {{ tour.danh_sach_lich_trinh.length }} hoạt động
                                </p>
                            </div>
                        </div>
                        <button @click="openAddModalForTour(tour.id_tour)" class="btn-primary-gradient"
                            style="padding: 8px 16px;">
                            <i class="fa-solid fa-plus me-1"></i>Thêm Hoạt Động
                        </button>
                    </div>

                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                                    <th
                                        style="padding: 12px 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem; width: 80px;">
                                        Ảnh</th>
                                    <th
                                        style="padding: 12px 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">
                                        Điểm Đến</th>
                                    <th
                                        style="padding: 12px 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">
                                        Phương Tiện</th>
                                    <th
                                        style="padding: 12px 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem;">
                                        Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="tour.danh_sach_lich_trinh.length === 0">
                                    <td colspan="5" style="padding: 20px; text-align: center; color: #999;">
                                        <i class="fa-solid fa-inbox me-2"></i>Chưa có hoạt động nào được thiết lập
                                    </td>
                                </tr>
                                <tr v-for="lich_trinh in tour.danh_sach_lich_trinh" :key="lich_trinh.id"
                                    style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;"
                                    @mouseenter="(e) => e.currentTarget.style.background = '#f9fafb'"
                                    @mouseleave="(e) => e.currentTarget.style.background = ''">
                                    <td style="padding: 12px 15px;">
                                        <img v-if="lich_trinh.anh_diem_den"
                                            :src="getImageUrl(getFirstImage(lich_trinh.anh_diem_den))" alt="Điểm đến"
                                            style="width: 60px; height: 45px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <div v-else
                                            style="width: 60px; height: 45px; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #cbd5e1;">
                                            <i class="fa-solid fa-map-location-dot"></i>
                                        </div>
                                    </td>
                                    <td style="padding: 12px 15px; color: #667eea; font-weight: 500;">{{
                                        lich_trinh.ten_diem_den || 'Không xác định' }}</td>
                                    <td style="padding: 12px 15px; color: #666;">
                                        <span v-if="lich_trinh.loai_phuong_tien"
                                            style="display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 6px; font-size: 0.85rem; font-weight: 500;">
                                            {{ lich_trinh.loai_phuong_tien }} {{ lich_trinh.so_hieu ? '(' +
                                            lich_trinh.so_hieu + ')' : '' }}
                                        </span>
                                        <span v-else style="color: #999; font-size: 0.9rem;">Tự do / Đi bộ</span>
                                    </td>
                                    <td style="padding: 12px 15px; text-align: center;">
                                        <div style="display: flex; gap: 8px; justify-content: center;">
                                            <button @click="editSchedule(lich_trinh, tour.id_tour)"
                                                class="action-btn btn-edit" title="Chỉnh sửa"><i
                                                    class="fa-solid fa-pen-nib"></i></button>
                                            <button @click="deleteSchedule(lich_trinh.id)" class="action-btn btn-delete"
                                                title="Xóa"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="filteredSchedules.length > 0" class="pagination-container">
                    <button @click="schedulePage = 1" :disabled="schedulePage === 1" class="page-btn"><i
                            class="fa-solid fa-angles-left"></i></button>
                    <button @click="schedulePage--" :disabled="schedulePage === 1" class="page-btn"><i
                            class="fa-solid fa-angle-left"></i></button>
                    <span class="page-info">Trang {{ schedulePage }} / {{ totalSchedulePages }}</span>
                    <button @click="schedulePage++" :disabled="schedulePage === totalSchedulePages" class="page-btn"><i
                            class="fa-solid fa-angle-right"></i></button>
                    <button @click="schedulePage = totalSchedulePages" :disabled="schedulePage === totalSchedulePages"
                        class="page-btn"><i class="fa-solid fa-angles-right"></i></button>
                </div>
            </div>
        </div>


        <div v-if="activeTab === 'diemden'">
            <div
                style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: flex; gap: 12px; align-items: flex-end;">
                    <div style="flex: 1; position: relative;">
                        <input type="text" v-model="searchDiemDen" placeholder="Nhập tên điểm đến để tìm kiếm..."
                            style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; font-size: 0.9rem;">
                        <i class="fa-solid fa-search"
                            style="position: absolute; right: 12px; bottom: 14px; color: #999; font-size: 0.9rem;"></i>
                    </div>
                    <button @click="openAddDiemDenModal" class="btn-add" style="height: 45px; white-space: nowrap;">
                        <i class="fa-solid fa-plus me-2"></i>Thêm Điểm Đến
                    </button>
                </div>
            </div>

            <div
                style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; width: 100%;">
                <div style="overflow-x: auto; width: 100%;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e2e8f0;">
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 80px;">
                                    ID</th>
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 120px;">
                                    Hình Ảnh</th>
                                <th
                                    style="padding: 15px; text-align: left; font-weight: 600; color: #333; font-size: 0.9rem;">
                                    Tên Điểm Đến</th>
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 150px;">
                                    Trạng Thái</th>
                                <th
                                    style="padding: 15px; text-align: center; font-weight: 600; color: #333; font-size: 0.9rem; width: 150px;">
                                    Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredDiemDens.length === 0" style="border-bottom: 1px solid #e2e8f0;">
                                <td colspan="5" style="padding: 50px 20px; text-align: center; color: #999;">
                                    <div style="font-size: 3rem; margin-bottom: 15px;">📍</div>
                                    <p style="margin: 0; font-size: 1rem;">Không có điểm đến nào</p>
                                </td>
                            </tr>

                            <tr v-for="diem in paginatedDiemDens" :key="diem.id"
                                style="border-bottom: 1px solid #e2e8f0; transition: background 0.2s;"
                                @mouseenter="(e) => e.currentTarget.style.background = '#f9fafb'"
                                @mouseleave="(e) => e.currentTarget.style.background = ''">
                                <td style="padding: 15px; text-align: center; color: #667eea; font-weight: 700;">#{{
                                    diem.id }}</td>
                                <td style="padding: 15px; text-align: center;">
                                    <img v-if="diem.hinh_anh" :src="getImageUrl(getFirstImage(diem.hinh_anh))"
                                        alt="Ảnh điểm đến"
                                        style="width: 80px; height: 50px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <span v-else
                                        style="color: #999; font-size: 0.8rem; background: #f1f5f9; padding: 15px; border-radius: 8px;">Trống</span>
                                </td>
                                <td style="padding: 15px; color: #333; font-weight: 600; font-size: 0.95rem;">{{
                                    diem.ten_diem_den }}</td>
                                <td style="padding: 15px; text-align: center;">
                                    <button @click="changeDiemDenStatus(diem.id, diem.tinh_trang == 1 ? 0 : 1)"
                                        :style="{ border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: diem.tinh_trang == 1 ? '#dcfce7' : '#fee2e2', color: diem.tinh_trang == 1 ? '#16a34a' : '#dc2626' }"
                                        :title="diem.tinh_trang == 1 ? 'Nhấp để ẩn' : 'Nhấp để hiển thị'">
                                        <i
                                            :class="diem.tinh_trang == 1 ? 'fa-solid fa-eye me-1' : 'fa-solid fa-eye-slash me-1'"></i>
                                        {{ diem.tinh_trang == 1 ? 'Hiển Thị' : 'Ẩn' }}
                                    </button>
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <div style="display: flex; gap: 8px; justify-content: center;">
                                        <button @click="openEditDiemDenModal(diem)" class="action-btn btn-edit"
                                            title="Chỉnh sửa"
                                            style="background: #e0f2fe; color: #0284c7; width: 36px; height: 36px;"><i
                                                class="fa-solid fa-edit"></i></button>
                                        <button @click="openDeleteDiemDenModal(diem)" class="action-btn btn-delete"
                                            title="Xóa"
                                            style="background: #fee2e2; color: #ef4444; width: 36px; height: 36px;"><i
                                                class="fa-solid fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="filteredDiemDens.length > 0" class="pagination-container"
                    style="padding: 15px; border-top: 1px solid #e2e8f0; margin-top: 0;">
                    <button @click="diemDenPage = 1" :disabled="diemDenPage === 1" class="page-btn"><i
                            class="fa-solid fa-angles-left"></i></button>
                    <button @click="diemDenPage--" :disabled="diemDenPage === 1" class="page-btn"><i
                            class="fa-solid fa-angle-left"></i></button>
                    <span class="page-info">Trang {{ diemDenPage }} / {{ totalDiemDenPages }}</span>
                    <button @click="diemDenPage++" :disabled="diemDenPage === totalDiemDenPages" class="page-btn"><i
                            class="fa-solid fa-angle-right"></i></button>
                    <button @click="diemDenPage = totalDiemDenPages" :disabled="diemDenPage === totalDiemDenPages"
                        class="page-btn"><i class="fa-solid fa-angles-right"></i></button>
                </div>
            </div>
        </div>

        <div v-if="showFormModal"
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">{{ isEditing ? 'Chỉnh Sửa Hoạt Động' : 'Thêm Hoạt Động Mới' }}</h2>
                    <button @click="closeFormModal"
                        style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer;">×</button>
                </div>
                <form @submit.prevent="saveSchedule" style="color: #333;">
                    <div style="margin-bottom: 20px;">
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 8px; display: block;">Tour
                            *</label>
                        <select v-model="formData.id_tour" :disabled="isEditing"
                            style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; background: white;"
                            required>
                            <option value="">-- Chọn Tour --</option>
                            <option v-for="tour in tours" :key="tour.id" :value="tour.id">{{ tour.ten_tour }}</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 8px; display: block;">Điểm
                            Đến</label>
                        <div style="display: flex; gap: 12px; align-items: flex-end;">
                            <select v-model="formData.id_diem_den"
                                style="flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; background: white;">
                                <option value="">-- Chọn điểm đến --</option>
                                <option v-for="diem in diemDens" :key="diem.id" :value="diem.id">{{ diem.ten_diem_den }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 8px; display: block;">Phương
                            Tiện</label>
                        <select v-model="formData.id_phuong_tien"
                            style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; background: white;">
                            <option value="">-- Không chọn / Đi bộ --</option>
                            <option v-for="phuong_tien in phuongTiens" :key="phuong_tien.id" :value="phuong_tien.id">
                                {{ phuong_tien.loai_phuong_tien }} {{ phuong_tien.so_hieu ? '(' + phuong_tien.so_hieu +
                                ')' : '' }}
                            </option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" class="btn-primary-gradient" style="flex: 1;"><i
                                class="fa-solid fa-save me-2"></i>Lưu Lại</button>
                        <button type="button" @click="closeFormModal" class="btn-primary-reset" style="flex: 1;"><i
                                class="fa-solid fa-times me-2"></i>Hủy</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showDiemDenModal"
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; width: 90%; max-width: 500px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                <div
                    style="background: linear-gradient(135deg, #10b981, #059669); padding: 25px 20px; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fa-solid fa-map-marker-alt" style="font-size: 1.3rem;"></i>
                        <h2 style="margin: 0; font-size: 1.2rem;">{{ isEditingDiemDen ? '✏️ Chỉnh Sửa Điểm Đến' : '➕ Thêm Điểm Đến Mới' }}</h2>
                    </div>
                    <button @click="closeDiemDenModal"
                        style="background: rgba(255,255,255,0.2); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer;"><i
                            class="fa-solid fa-times" style="color: white;"></i></button>
                </div>

                <form @submit.prevent="saveDiemDen" style="padding: 25px 20px;">
                    <div style="margin-bottom: 20px;">
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 8px; display: block;">Tên
                            Điểm Đến *</label>
                        <input v-model="diemDenForm.ten_diem_den" type="text" placeholder="Nhập tên điểm đến..."
                            style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit;"
                            required>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 8px; display: block;">Nội
                            Dung Hoạt Động *</label>
                        <textarea v-model="diemDenForm.mo_ta" placeholder="Nhập mô tả hoạt động..." rows="4"
                            maxlength="500"
                            style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; resize: vertical;"
                            required></textarea>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label
                            style="font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 8px; display: block;">Hình
                            Ảnh Điểm Đến</label>
                        <div
                            style="display: flex; gap: 8px; margin-bottom: 12px; background: #f1f5f9; padding: 5px; border-radius: 8px;">
                            <button type="button" @click="setImageInputType('file')"
                                :style="{ flex: 1, padding: '8px 0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', background: imageInputType === 'file' ? 'white' : 'transparent', color: imageInputType === 'file' ? '#10b981' : '#64748b' }">
                                <i class="fa-solid fa-folder-open me-2"></i>Tải từ máy
                            </button>
                            <button type="button" @click="setImageInputType('url')"
                                :style="{ flex: 1, padding: '8px 0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', background: imageInputType === 'url' ? 'white' : 'transparent', color: imageInputType === 'url' ? '#10b981' : '#64748b' }">
                                <i class="fa-solid fa-link me-2"></i>Link URL
                            </button>
                        </div>
                        <div v-if="imageInputType === 'file'">
                            <input type="file" @change="handleDiemDenImageUpload" accept="image/*"
                                style="width: 100%; padding: 10px; border: 2px dashed #cbd5e1; border-radius: 8px; background: #f8fafc;">
                        </div>
                        <div v-if="imageInputType === 'url'">
                            <input v-model="diemDenForm.hinh_anh" type="text"
                                placeholder="Dán đường link hình ảnh (https://...)"
                                style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit;">
                        </div>
                        <div v-if="diemDenForm.hinh_anh"
                            style="margin-top: 15px; text-align: center; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px dashed #e2e8f0;">
                            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0 0 8px 0;">Ảnh xem trước</p>
                            <img :src="getImageUrl(getFirstImage(diemDenForm.hinh_anh))" alt="Preview"
                                style="max-width: 100%; max-height: 180px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 30px;">
                        <button type="submit" class="btn-add" style="flex: 1;"><i class="fa-solid fa-save me-2"></i>Lưu
                            Lại</button>
                        <button type="button" @click="closeDiemDenModal" class="btn-primary-reset" style="flex: 1;"><i
                                class="fa-solid fa-times me-2"></i>Hủy</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showDeleteDiemDenModal"
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div
                style="background: white; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden;">
                <div
                    style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 25px 20px; color: white; text-align: center;">
                    <div style="font-size: 3.5rem; margin-bottom: 15px;">⚠️</div>
                    <h3 style="margin: 0; color: white; font-size: 1.1rem; font-weight: 700;">Xác Nhận Xóa Điểm Đến</h3>
                </div>
                <div style="padding: 25px 20px;">
                    <p style="color: #666; margin: 0 0 25px 0; font-size: 0.95rem; text-align: center;">Bạn có chắc chắn
                        muốn xóa điểm đến <strong style="color: #ef4444;">{{ del_diem_den.ten_diem_den }}</strong>?</p>
                    <div style="display: flex; gap: 12px;">
                        <button @click="showDeleteDiemDenModal = false"
                            style="flex: 1; padding: 12px; background: #f1f5f9; border: none; border-radius: 8px; font-weight: 600; color: #475569; cursor: pointer;">Hủy</button>
                        <button @click="confirmDeleteDiemDen"
                            style="flex: 1; padding: 12px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;"><i
                                class="fa-solid fa-trash me-2"></i>Xóa Ngay</button>
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
    name: 'LichTrinh',
    data() {
        return {
            activeTab: 'lichtrinh',
            lichTrinhTabHovered: false,
            diemDenTabHovered: false,

            schedules: [],
            filteredSchedules: [],
            searchQuery: '',
            loading: false,

            // Biến phân trang cho Lịch Trình
            schedulePage: 1,
            schedulePerPage: 3, // Số lượng tour trên mỗi trang

            showFormModal: false,
            isEditing: false,

            tours: [],
            diemDens: [],
            phuongTiens: [],

            searchDiemDen: '',
            filteredDiemDens: [],

            // Biến phân trang cho Điểm Đến
            diemDenPage: 1,
            diemDenPerPage: 10, // Số điểm đến trên mỗi trang

            showDiemDenModal: false,
            isEditingDiemDen: false,
            diemDenForm: {
                id: '',
                ten_diem_den: '',
                mo_ta: '',
                hinh_anh: ''
            },
            imageInputType: 'file',
            showDeleteDiemDenModal: false,
            del_diem_den: {},

            formData: {
                id: '',
                id_tour: '',
                id_diem_den: '',
                id_phuong_tien: '',
            }
        }
    },
    computed: {
        // Cắt dữ liệu Lịch Trình theo trang hiện tại
        paginatedSchedules() {
            const start = (this.schedulePage - 1) * this.schedulePerPage;
            return this.filteredSchedules.slice(start, start + this.schedulePerPage);
        },
        // Tính tổng số trang Lịch Trình
        totalSchedulePages() {
            return Math.ceil(this.filteredSchedules.length / this.schedulePerPage) || 1;
        },
        // Cắt dữ liệu Điểm Đến theo trang hiện tại
        paginatedDiemDens() {
            const start = (this.diemDenPage - 1) * this.diemDenPerPage;
            return this.filteredDiemDens.slice(start, start + this.diemDenPerPage);
        },
        // Tính tổng số trang Điểm Đến
        totalDiemDenPages() {
            return Math.ceil(this.filteredDiemDens.length / this.diemDenPerPage) || 1;
        }
    },
    watch: {
        searchDiemDen() {
            this.filterDiemDens();
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
        loadSchedules() {
            this.loading = true;
            axios.get(apiUrl('admin/lich-trinh/get-data'), {
                headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
            }).then(res => {
                if (res.data && res.data.status) {
                    const rawData = res.data.data;
                    const grouped = {};
                    rawData.forEach(item => {
                        if (!grouped[item.id_tour]) {
                            grouped[item.id_tour] = {
                                id_tour: item.id_tour,
                                ten_tour: item.ten_tour,
                                anh_tour: item.anh_tour,
                                danh_sach_lich_trinh: []
                            };
                        }
                        grouped[item.id_tour].danh_sach_lich_trinh.push(item);
                    });
                    this.schedules = Object.values(grouped);
                    this.filterData();
                } else {
                    this.$toast.error(res.data?.message || 'Lỗi lấy dữ liệu');
                }
            }).finally(() => { this.loading = false; });
        },

        loadDropdownData() {
            const config = { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } };
            axios.get(apiUrl('admin/tour/get-data'), config).then(res => { if (res.data.status) this.tours = res.data.data; });
            axios.get(apiUrl('admin/phuong-tien/get-data'), config).then(res => { if (res.data.status) this.phuongTiens = res.data.data; });
            axios.get(apiUrl('admin/diem-den/get-data'), config).then(res => { if (res.data.status) this.diemDens = res.data.data; }).catch(() => { });
        },

        filterData() {
            this.filteredSchedules = this.schedules.filter(tour => tour.ten_tour && tour.ten_tour.toLowerCase().includes(this.searchQuery.toLowerCase()));
            this.schedulePage = 1; // Reset về trang 1 khi tìm kiếm
        },
        resetFilter() {
            this.searchQuery = '';
            this.filterData();
            this.loadSchedules();
        },

        openAddModal() {
            this.formData = { id: '', id_tour: '', id_diem_den: '', id_phuong_tien: '', tieu_de_hoat_dong: '' };
            this.isEditing = false;
            this.showFormModal = true;
        },
        openAddModalForTour(id_tour) {
            this.openAddModal();
            this.formData.id_tour = id_tour;
        },
        editSchedule(lich_trinh, id_tour) {
            this.formData = {
                id: lich_trinh.id,
                id_tour: id_tour,
                id_diem_den: lich_trinh.id_diem_den || '',
                id_phuong_tien: lich_trinh.id_phuong_tien || '',
            };
            this.isEditing = true;
            this.showFormModal = true;
        },
        closeFormModal() { this.showFormModal = false; },

        saveSchedule() {
            const url = this.isEditing ? 'admin/lich-trinh/update' : 'admin/lich-trinh/add-data';
            axios.post(apiUrl(url), this.formData, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data && res.data.status) {
                        this.$toast.success(res.data.message);
                        this.closeFormModal();
                        this.loadSchedules();
                    } else { this.$toast.error(res.data?.message || 'Lỗi thao tác'); }
                });
        },

        deleteSchedule(id) {
            if (confirm('Bạn chắc chắn muốn xóa hoạt động này?')) {
                axios.post(apiUrl('admin/lich-trinh/delete'), { id: id }, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                    .then(res => {
                        if (res.data && res.data.status) {
                            this.$toast.success(res.data.message);
                            this.loadSchedules();
                        } else { this.$toast.error('Lỗi khi xóa'); }
                    });
            }
        },

        setImageInputType(type) {
            if (this.imageInputType !== type) {
                this.imageInputType = type;
                this.diemDenForm.hinh_anh = '';
            }
        },

        loadDiemDens() {
            axios.get(apiUrl('admin/diem-den/get-data'), { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data && res.data.status) {
                        this.diemDens = res.data.data;
                        this.filterDiemDens();
                    }
                });
        },

        filterDiemDens() {
            this.filteredDiemDens = this.diemDens.filter(diem => diem.ten_diem_den && diem.ten_diem_den.toLowerCase().includes(this.searchDiemDen.toLowerCase()));
            this.diemDenPage = 1; // Reset về trang 1 khi tìm kiếm điểm đến
        },

        openAddDiemDenModal() {
            this.diemDenForm = {
                id: '',
                ten_diem_den: '',
                mo_ta: '',
                hinh_anh: ''
            };
            this.imageInputType = 'file';
            this.isEditingDiemDen = false;
            this.showDiemDenModal = true;
        },

        openEditDiemDenModal(diem) {
            this.diemDenForm = { id: diem.id, ten_diem_den: diem.ten_diem_den, hinh_anh: diem.hinh_anh , mo_ta: diem.mo_ta || '', };
            this.imageInputType = (diem.hinh_anh && diem.hinh_anh.startsWith('http')) ? 'url' : 'file';
            this.isEditingDiemDen = true;
            this.showDiemDenModal = true;
        },

        closeDiemDenModal() { this.showDiemDenModal = false; },

        handleDiemDenImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => { this.diemDenForm.hinh_anh = e.target.result; };
                reader.readAsDataURL(file);
            }
        },

        saveDiemDen() {
            const url = this.isEditingDiemDen ? 'admin/diem-den/update' : 'admin/diem-den/add-data';
            axios.post(apiUrl(url), this.diemDenForm, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data && res.data.status) {
                        this.$toast.success(res.data.message);
                        this.loadDiemDens();
                        this.loadDropdownData();
                        this.closeDiemDenModal();
                    } else { this.$toast.error(res.data?.message || 'Lỗi khi lưu điểm đến'); }
                });
        },

        changeDiemDenStatus(id, newStatus) {
            axios.post(apiUrl('admin/diem-den/change-status'), { id, tinh_trang: newStatus }, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data && res.data.status) {
                        this.$toast.success(res.data.message);
                        this.loadDiemDens();
                        this.loadDropdownData();
                    }
                });
        },

        openDeleteDiemDenModal(diem) {
            this.del_diem_den = diem;
            this.showDeleteDiemDenModal = true;
        },

        confirmDeleteDiemDen() {
            axios.post(apiUrl('admin/diem-den/delete'), { id: this.del_diem_den.id }, { headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') } })
                .then(res => {
                    if (res.data && res.data.status) {
                        this.$toast.success(res.data.message);
                        this.loadDiemDens();
                        this.loadDropdownData();
                        this.showDeleteDiemDenModal = false;
                    }
                });
        }
    },
    mounted() {
        this.loadSchedules();
        this.loadDropdownData();
        this.loadDiemDens();
    },
}
</script>

<style scoped>
.btn-primary-gradient {
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: inherit;
    font-size: 0.9rem;
}

.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary-reset {
    padding: 12px 20px;
    background: #e2e8f0;
    color: #333;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    font-family: inherit;
    font-size: 0.9rem;
}

.btn-primary-reset:hover {
    background: #cbd5e1;
}

.btn-add {
    padding: 12px 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: inherit;
    font-size: 0.9rem;
}

.btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.action-btn {
    transition: all 0.2s;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
}

.action-btn:hover {
    transform: scale(1.1);
}

.btn-edit {
    background: #e0f2fe;
    color: #0284c7;
}

.btn-delete {
    background: #fee2e2;
    color: #dc2626;
}

.me-2 {
    margin-right: 8px;
}

.me-1 {
    margin-right: 4px;
}

/* CSS Mới bổ sung cho thanh phân trang */
.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 25px;
}

.page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #475569;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
    background: #f1f5f9;
    color: #333;
    border-color: #cbd5e1;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-info {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
    margin: 0 10px;
}
</style>