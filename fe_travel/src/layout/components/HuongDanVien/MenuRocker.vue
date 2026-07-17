<template>
  <a-layout-sider v-model:collapsed="trangThaiThuGonMenu" width="260px" class="custom-sidebar">
    
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: trangThaiThuGonMenu ? 'center' : 'space-between', padding: '16px', flexShrink: 0 }">
      <img 
        v-if="!trangThaiThuGonMenu" 
        src="../../../assets/images/Logo1.png" 
        alt="Logo IxtalTour" 
        style="height: 50px; width: auto; object-fit: contain; justify-content: center; margin-left: 10px;" 
      />
      <MenuOutlined style="font-size: 20px; cursor: pointer; color: black;" @click="thayDoiTrangThaiMenu" />
    </div>

    <div class="menu-scroll-area">
      <a-menu
        v-model:selectedKeys="danhSachDuongDanDuocChon"
        theme="dark"
        mode="inline"
        @click="xuLyChuyenTrang"
      >
        <a-menu-item key="/huong-dan-vien/lich-trinh">
          <template #icon><i class="bx bx-calendar menu-icon"></i></template>
          Lịch Trình Công Việc
        </a-menu-item>

        <a-menu-item key="/huong-dan-vien/quan-ly-tour">
          <template #icon><i class="bx bx-map-alt menu-icon"></i></template>
          Quản Lý Tour Dẫn
        </a-menu-item>

        <a-menu-item key="/huong-dan-vien/quan-ly-khach-hang">
          <template #icon><i class="bx bx-group menu-icon"></i></template>
          Quản Lý Khách Hàng
        </a-menu-item>

        <a-divider style="border-color: rgba(0, 0, 0, 0.06); margin: 15px 0;" />

        <a-menu-item key="/">
          <template #icon><i class="fa-solid fa-home menu-icon"></i></template>
          Quay lại trang chủ
        </a-menu-item>

      </a-menu>
    </div>
  </a-layout-sider>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MenuOutlined } from '@ant-design/icons-vue';

const trangThaiThuGonMenu = ref(false);
const danhSachDuongDanDuocChon = ref([]);
const route = useRoute();
const router = useRouter();

// Xử lý thu phóng menu
const thayDoiTrangThaiMenu = () => {
  trangThaiThuGonMenu.value = !trangThaiThuGonMenu.value;
};

// Theo dõi đường dẫn (route) để in đậm thẻ menu đang đứng
watch(
  () => route.path,
  (duongDanMoi) => {
    danhSachDuongDanDuocChon.value = [duongDanMoi];
  },
  { immediate: true }
);

// Xử lý chuyển trang
const xuLyChuyenTrang = (menuInfo) => {
  const khoaCuaMenu = menuInfo.key;
  if (typeof khoaCuaMenu === 'string' && khoaCuaMenu.startsWith('/')) {
    router.push(khoaCuaMenu);
  }
};
</script>

<style scoped>
/* =========================================================
   KHÓA CHIỀU CAO SIDEBAR & ÉP NẰM TRÊN TOPBAR + FOOTER
   ========================================================= */
.custom-sidebar {
  height: 100vh !important;
  position: sticky !important;
  top: 0 !important;
  left: 0 !important;
  background-color: #f4fdf8 !important;
  border-right: 1px solid #e2e8f0;
  
  /* Bóng đổ nhẹ bên phải và z-index cực cao để đè mọi thứ, kể cả Footer */
  box-shadow: 2px 0 10px rgba(0,0,0,0.05) !important;
  z-index: 1000 !important; 
}

/* CẤU TRÚC CUỘN ĐỘC LẬP BÊN TRONG */
:deep(.ant-layout-sider-children) {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

.menu-scroll-area {
  flex: 1 !important;
  overflow-y: auto !important; 
  overflow-x: hidden !important;
  padding-bottom: 80px !important;
}

/* =========================================================
   MÀU SẮC MENU TỔNG THỂ
   ========================================================= */
:deep(.ant-menu),
:deep(.ant-menu-root),
:deep(.ant-menu-sub),
:deep(.ant-menu-submenu-title),
:deep(.ant-menu-item) {
  background-color: #f4fdf8 !important;
}

:deep(.ant-menu-item),
:deep(.ant-menu-submenu-title) {
  color: #333 !important; 
  transition: all 0.3s ease;
}

/* MÀU XANH KHI DI CHUỘT (Hover) */
:deep(.ant-menu-item:hover),
:deep(.ant-menu-submenu-title:hover) {
  background-color: #e6f9ef !important; 
  color: #1b6b43 !important;           
}

/* MÀU XANH KHI ĐƯỢC CHỌN (Selected) */
:deep(.ant-menu-item-selected) {
  background-color: #1b6b43 !important; 
  color: #ffffff !important;           
  font-weight: bold;
}

/* ĐẢM BẢO ICON CÙNG MÀU XANH VỚI THEME */
.menu-icon {
  font-size: 1.2rem;
  color: #1b6b43; 
  margin-right: 10px;
}

/* Khi item được chọn, icon tự động đổi sang màu trắng */
:deep(.ant-menu-item-selected .menu-icon) {
  color: #ffffff !important;
}

/* Đường phân cách (Divider) */
:deep(.ant-divider) {
  border-color: #f0f0f0 !important;
}

/* TÙY CHỈNH THANH CUỘN (SCROLLBAR) */
.menu-scroll-area::-webkit-scrollbar {
  width: 5px;
}
.menu-scroll-area::-webkit-scrollbar-thumb {
  background-color: #c4d6ce;
  border-radius: 5px;
}
</style>