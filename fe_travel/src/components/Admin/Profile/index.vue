<template>
  <div class="profile-container">
    <div class="page-header mb-4">
      <h2 class="fw-bold m-0"><i class="fa-solid fa-user-shield me-2 text-primary"></i> Thông tin tài khoản</h2>
      <p class="text-muted mt-1 mb-0">Quản lý hồ sơ cá nhân và bảo mật hệ thống</p>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>

    <div v-else class="row g-4 justify-content-center">
      <div class="col-12 col-md-5 col-xl-3">
        <div class="card profile-card rounded-4 mb-4 overflow-hidden">
          <div class="profile-cover" style="height: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
          
          <div class="card-body text-center position-relative pt-0 pb-4">
            <div class="avatar-wrapper mx-auto" style="width: 120px; height: 120px; margin-top: -60px; border: 4px solid #fff; border-radius: 50%; position: relative; background: #f8f9fa;">
              <img :src="profileData.avatar || 'https://www.shutterstock.com/image-vector/admin-icon-strategy-collection-thin-600nw-2307398667.jpg'" 
                   class="w-100 h-100 rounded-circle" style="object-fit: cover;" alt="Admin Avatar">
              <button class="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 shadow-sm" 
                      style="width: 33px; height: 33px; padding: 0; display: flex; align-items: center; justify-content: center;"
                      @click="triggerAvatarUpload">
                <i class="fa-solid fa-camera m-0"></i>
              </button>
            </div>
            
            <h4 class="fw-bold mt-3 mb-1">{{ profileData.ho_va_ten || 'Đang cập nhật...' }}</h4>
            <span class="badge bg-primary bg-opacity-10 text-white px-3 py-2 rounded-pill fw-semibold mb-3">
              Quản Trị Viên (Admin)
            </span>
            <div class="d-flex justify-content-center">
              <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2">
                <i class="fa-solid fa-circle me-1" style="font-size: 8px;"></i> Đang hoạt động
              </span>
            </div>
          </div>
        </div>

        <div class="card profile-card rounded-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4" style="color: #4a5568;">
              <i class="fa-solid fa-circle-info text-primary me-2"></i> Thông tin vắn tắt
            </h5>
            
            <ul class="list-unstyled mb-0">
              <li class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <span class="text-muted"><i class="fa-solid fa-envelope me-2"></i> Email</span>
                <span class="fw-semibold text-dark text-break ps-3 text-end">{{ profileData.email }}</span>
              </li>
              <li class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <span class="text-muted"><i class="fa-solid fa-phone me-2"></i> Số ĐT</span>
                <span class="fw-semibold text-dark">{{ profileData.so_dien_thoai || 'Trống' }}</span>
              </li>
              <li class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <span class="text-muted"><i class="fa-solid fa-calendar-day me-2"></i> Ngày sinh</span>
                <span class="fw-semibold text-dark">{{ formatDate(profileData.ngay_sinh) || 'Trống' }}</span>
              </li>
              <li class="d-flex justify-content-between align-items-center">
                <span class="text-muted"><i class="fa-solid fa-map-location-dot me-2"></i> Trụ sở</span>
                <span class="fw-semibold text-dark text-end ps-3">Đà Nẵng, VN</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-7 col-xl-6">
        
        <div class="card profile-card rounded-4 mb-4">
          <div class="card-body p-4 p-md-5">
            <h4 class="fw-bold mb-4" style="color: #2d3748;">
              <i class="fa-solid fa-pen-to-square text-primary me-2"></i> Chỉnh sửa hồ sơ
            </h4>

            <form @submit.prevent="handleUpdateProfile">
              <div class="mb-4">
                 <label class="form-label fw-semibold text-secondary small text-uppercase">Đường dẫn Avatar (URL)</label>
                 <input type="text" class="form-control custom-input" v-model="profileData.avatar" placeholder="https://...">
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold text-secondary small text-uppercase">Họ và tên</label>
                <input type="text" class="form-control custom-input" v-model="profileData.ho_va_ten" required>
              </div>

              <div class="row mb-4">
                <div class="col-md-6 mb-4 mb-md-0">
                  <label class="form-label fw-semibold text-secondary small text-uppercase">Email đăng nhập</label>
                  <input type="email" class="form-control custom-input bg-light" :value="profileData.email" readonly disabled>
                  <small class="text-muted mt-1 d-block"><i class="fa-solid fa-lock me-1"></i> Email không thể thay đổi</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-secondary small text-uppercase">Số điện thoại</label>
                  <input type="tel" class="form-control custom-input" v-model="profileData.so_dien_thoai" maxlength="11">
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-md-6 mb-4 mb-md-0">
                  <label class="form-label fw-semibold text-secondary small text-uppercase">Ngày sinh</label>
                  <input type="date" class="form-control custom-input" v-model="profileData.ngay_sinh">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-secondary small text-uppercase">Địa chỉ liên hệ</label>
                  <input type="text" class="form-control custom-input" v-model="profileData.dia_chi" placeholder="Nhập địa chỉ của bạn...">
                </div>
              </div>

              <div class="d-flex justify-content-end gap-3 pt-3 border-top mt-4">
                <button type="button" class="btn btn-light px-4 py-2 fw-semibold rounded-3 text-secondary" @click="loadProfileData">Hủy</button>
                <button type="submit" class="btn btn-primary px-4 py-2 fw-semibold rounded-3 shadow-sm d-flex align-items-center" :disabled="isSavingProfile">
                  <i class="fa-solid fa-floppy-disk me-2"></i> {{ isSavingProfile ? 'Đang lưu...' : 'Lưu thay đổi' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="card profile-card rounded-4">
          <div class="card-body p-4 p-md-5">
            <h4 class="fw-bold mb-4" style="color: #2d3748;">
              <i class="fa-solid fa-shield-halved text-success me-2"></i> Bảo mật & Mật khẩu
            </h4>

            <form @submit.prevent="handleChangePassword">
              <div class="mb-4">
                <label class="form-label fw-semibold text-secondary small text-uppercase">Mật khẩu hiện tại</label>
                <div class="input-group">
                  <input :type="showOldPass ? 'text' : 'password'" class="form-control custom-input border-end-0" v-model="passwordData.old_password" placeholder="••••••••" required>
                  <span class="input-group-text bg-white border-start-0 custom-input-group" @click="showOldPass = !showOldPass" style="cursor: pointer;">
                    <i :class="showOldPass ? 'fa-regular fa-eye-slash text-muted' : 'fa-regular fa-eye text-muted'"></i>
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold text-secondary small text-uppercase">Mật khẩu mới</label>
                <div class="input-group">
                  <input :type="showNewPass ? 'text' : 'password'" class="form-control custom-input border-end-0" v-model="passwordData.new_password" placeholder="••••••••" required>
                  <span class="input-group-text bg-white border-start-0 custom-input-group" @click="showNewPass = !showNewPass" style="cursor: pointer;">
                    <i :class="showNewPass ? 'fa-regular fa-eye-slash text-muted' : 'fa-regular fa-eye text-muted'"></i>
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold text-secondary small text-uppercase">Xác nhận mật khẩu mới</label>
                <div class="input-group">
                  <input :type="showConfirmPass ? 'text' : 'password'" class="form-control custom-input border-end-0" v-model="passwordData.confirm_password" placeholder="••••••••" required>
                  <span class="input-group-text bg-white border-start-0 custom-input-group" @click="showConfirmPass = !showConfirmPass" style="cursor: pointer;">
                    <i :class="showConfirmPass ? 'fa-regular fa-eye-slash text-muted' : 'fa-regular fa-eye text-muted'"></i>
                  </span>
                </div>
              </div>

              <div class="pt-3 border-top mt-4">
                <button type="submit" class="btn btn-secondary px-4 py-2 fw-semibold rounded-3 shadow-sm d-flex align-items-center" :disabled="isChangingPassword">
                  <i class="fa-solid fa-key me-2"></i> {{ isChangingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import apiUrl from '../../../utils/api'; // Hãy trỏ đúng đường dẫn utils/api.js của bạn

const { proxy } = getCurrentInstance();

// State
const isLoading = ref(true);
const isSavingProfile = ref(false);
const isChangingPassword = ref(false);

const showOldPass = ref(false);
const showNewPass = ref(false);
const showConfirmPass = ref(false);

// Dữ liệu
const profileData = ref({
  ho_va_ten: '',
  email: '',
  so_dien_thoai: '',
  dia_chi: '',
  ngay_sinh: '',
  avatar: ''
});

const passwordData = ref({
  old_password: '',
  new_password: '',
  confirm_password: ''
});

// Hàm Format Ngày Sinh hiển thị dạng DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// Hàm mở hộp thoại nhập URL avatar tạm
const triggerAvatarUpload = () => {
  const url = prompt("Nhập đường dẫn hình ảnh Avatar mới:", profileData.value.avatar);
  if (url !== null && url.trim() !== '') {
    profileData.value.avatar = url;
  }
};

// Gọi API lấy dữ liệu Profile
const loadProfileData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(apiUrl('admin/profile/get-data'), {
      headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
    });

    if (response.data.status) {
      profileData.value = {
        ho_va_ten: response.data.data.ho_va_ten || '',
        email: response.data.data.email || '',
        so_dien_thoai: response.data.data.so_dien_thoai || '',
        dia_chi: response.data.data.dia_chi || '',
        ngay_sinh: response.data.data.ngay_sinh || '',
        avatar: response.data.data.avatar || ''
      };
    } else {
      proxy.$toast.error(response.data.message || 'Không thể lấy thông tin!');
    }
  } catch (error) {
    proxy.$toast.error('Lỗi kết nối máy chủ!');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Gọi API cập nhật Profile
const handleUpdateProfile = async () => {
  if (!profileData.value.ho_va_ten) {
    proxy.$toast.error('Họ tên không được để trống!');
    return;
  }

  isSavingProfile.value = true;
  try {
    const response = await axios.post(apiUrl('admin/profile/update'), profileData.value, {
      headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
    });

    if (response.data.status) {
      proxy.$toast.success(response.data.message || 'Đã cập nhật hồ sơ thành công!');
      localStorage.setItem('ho_va_ten', profileData.value.ho_va_ten);
    } else {
      proxy.$toast.error(response.data.message || 'Cập nhật thất bại!');
    }
  } catch (error) {
    proxy.$toast.error('Lỗi khi lưu dữ liệu!');
    console.error(error);
  } finally {
    isSavingProfile.value = false;
  }
};

// Gọi API đổi mật khẩu
const handleChangePassword = async () => {
  if (passwordData.value.new_password.length < 6) {
    proxy.$toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
    return;
  }

  if (passwordData.value.new_password !== passwordData.value.confirm_password) {
    proxy.$toast.error('Mật khẩu xác nhận không khớp!');
    return;
  }

  isChangingPassword.value = true;
  try {
    const payload = {
      new_password: passwordData.value.new_password,
      confirm_password: passwordData.value.confirm_password
    };

    const response = await axios.post(apiUrl('admin/doi-mat-khau'), payload, {
      headers: { Authorization: "Bearer " + localStorage.getItem('key_admin') }
    });

    if (response.data.status) {
      proxy.$toast.success(response.data.message || 'Đổi mật khẩu thành công!');
      passwordData.value = { old_password: '', new_password: '', confirm_password: '' };
    } else {
      proxy.$toast.error(response.data.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
    }
  } catch (error) {
    proxy.$toast.error('Lỗi kết nối máy chủ!');
    console.error(error);
  } finally {
    isChangingPassword.value = false;
  }
};

// Chạy khi component được load
onMounted(() => {
  loadProfileData();
});

</script>

<style scoped>
.profile-container {
  padding: 10px;
  max-width: 1400px;
  margin: 0 auto; /* căn giữa */
}

/* THÊM CLASS NÀY ĐỂ CARD NỔI BẬT KHỎI NỀN TRẮNG */
.profile-card {
  border: 1px solid #cbd5e1 !important; /* Viền xám đậm hơn chút cho nổi */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08) !important; /* Bóng đổ to và rõ hơn */
  background-color: #ffffff;
}

/* Tùy chỉnh input form */
.custom-input {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: none;
}

.custom-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  outline: none;
}

/* Fix CSS cho Input Group chứa con mắt bật/tắt pass */
.input-group > .custom-input:focus {
  z-index: 1;
}

.custom-input-group {
  border: 1px solid #e2e8f0;
  border-radius: 0 8px 8px 0;
}

.custom-input:focus + .custom-input-group {
  border-color: #667eea;
  border-left-color: transparent;
}

/* Tùy chỉnh Badge màu sắc */
.bg-success-subtle {
  background-color: #d1fae5;
}
.border-success-subtle {
  border-color: #a7f3d0 !important;
}

/* Nút bấm (Button) */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s;
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4) !important;
}

.btn-secondary {
  background: #cbd5e1;
  color: #334155;
  border: none;
  transition: all 0.3s;
}
.btn-secondary:hover:not(:disabled) {
  background: #94a3b8;
  color: #fff;
  transform: translateY(-2px);
}

.btn-light {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}
.btn-light:hover {
  background: #e2e8f0;
}
</style>