import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save
import checkAdmin from "./checkAdmin";
import checkClient from "./checkClient";
import checkHuongDanVien from "./checkHuongDanVien";

const routes = [
    // ============================================
    // ================== Client ==================
    // ============================================
    {
        path: "/client",
        component: () => import("../components/Client/DangNhap/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/",
        component: () => import("../components/Client/TrangChu/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/",
        component: () => import("../components/Client/TrangChu/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/dang-nhap",
        component: () => import("../components/Client/DangNhap/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/client/dang-ky",
        component: () => import("../components/Client/DangKy/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/client/xac-nhan-dang-ky",
        component: () => import("../components/Client/XacNhanDangKy/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/client/quen-mat-khau",
        component: () => import("../components/Client/QuenMatKhau/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/client/lay-lai-mat-khau",
        component: () => import("../components/Client/LayLaiMatKhau/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/tim-kiem-tour",
        component: () => import("../components/Client/TimKiemTour/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/tour/tour-trong-nuoc",
        component: () => import("../components/Client/Tour/TourTrongNuoc/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/tour/tour-ngoai-nuoc",
        component: () => import("../components/Client/Tour/TourNgoaiNuoc/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/bai-viet",
        component: () => import("../components/Client/BaiViet/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/chi-tiet-bai-viet/:id_bai_viet",
        component: () => import("../components/Client/ChiTietBaiViet/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/huong-dan-vien",
        component: () => import("../components/Client/HuongDanVien/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/chi-tiet-huong-dan-vien/:id_huong_dan_vien",
        component: () => import("../components/Client/ChiTietHuongDanVien/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/chi-tiet-tour/:id_tour",
        component: () => import("../components/Client/ChiTietTour/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/lien-he",
        component: () => import("../components/Client/LienHe/index.vue"),
        meta: { layout: "client" },
    },
    {
        path: "/client/profile",
        component: () => import("../components/Client/Profile/index.vue"),
        meta: { layout: "client" },
        beforeEnter: checkClient,
    },
    {
        path: "/client/thanh-toan/:ma_hoa_don",
        component: () => import("../components/Client/ThanhToan/index.vue"),
        meta: { layout: "client" },
        beforeEnter: checkClient,
        props: true,
    },
    {
        path: "/client/lich-su-dat-tour",
        component: () => import("../components/Client/LichSuDonHang/index.vue"),
        meta: { layout: "client" },
        beforeEnter: checkClient,
        props: true, 
    },
    {
        path: "/Ket-qua-thanh-toan",
        component: () => import("../components/Client/KetQuaThanhToan/index.vue"),
        meta: { layout: "blank" },
    },

    // {
    //     path: "/client/chi-tiet-don-hang/:ma_don_hang",
    //     component: () => import("../components/Client/ChiTietDonHang/index.vue"),
    //     meta: { layout: "client" },
    //     beforeEnter: checkClient,
    //     props: true,
    // },
    // {
     
    // ===========================================
    // ================== Admin ==================
    // ===========================================
    {
        path: "/admin",
        component: () => import("../components/Admin/DangNhap/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/admin/",
        component: () => import("../components/Admin/Dashboard/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/",
        component: () => import("../components/Admin/Dashboard/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/quan-ly-phuong-tien",
        component: () => import("../components/Admin/QuanLyPhuongTien/index.vue"),
        beforeEnter: checkAdmin,
    },
     {
        path: "/admin/Dashboard",
        component: () => import("../components/Admin/Dashboard/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/quan-ly-tour",
        component: () => import("../components/Admin/QuanLyTour/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/dang-nhap",
        component: () => import("../components/Admin/DangNhap/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/admin/phan-quyen",
        component: () => import("../components/Admin/PhanQuyen/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/khach-hang",
        component: () => import("../components/Admin/KhachHang/index.vue"),
        beforeEnter: checkAdmin,
    },
     {
        path: "/admin/nhan-vien",
        component: () => import("../components/Admin/NhanVien/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/huong-dan-vien",
        component: () => import("../components/Admin/HuongDanVien/index.vue"),
        beforeEnter: checkAdmin,
    },
     {
        path: "/admin/ve",
        component: () => import("../components/Admin/Ve/new-index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/lich-trinh",
        component: () => import("../components/Admin/LichTrinh/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/hoa-don",
        component: () => import("../components/Admin/HoaDon/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/quet-ve",
        component: () => import("../components/Admin/QuetVe/index-quet-ve.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/in-ve/:ma_hoa_don",
        component: () => import("../components/Admin/InVe/index.vue"),
        meta: { layout: "blank" },
        beforeEnter: checkAdmin,
        props: true,
    },
     {
        path: "/admin/quan-ly-hdv-va-phan-cong",
        component: () => import("../components/Admin/QuanLyHDVvaPhanCong/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/bai-viet",
        component: () => import("../components/Admin/QuanLyBaiViet/index.vue"),
        beforeEnter: checkAdmin,
    },
    {
        path: "/admin/danh-gia",
        component: () => import("../components/Admin/QuanLyDanhGia/index.vue"),
        beforeEnter: checkAdmin,
    },
    
    {
        path: "/admin/thong-ke/doanh-thu",
        component: () => import("../components/Admin/ThongKe/ThongKeDanhThu/index.vue"),
        beforeEnter: checkAdmin,
        name: "thong-ke-doanh-thu",
    },
    {
        path: "/admin/thong-ke/khach-hang-moi",
        component: () => import("../components/Admin/ThongKe/ThongKeKhachHangMoi/index.vue"),
        beforeEnter: checkAdmin,
        name: "thong-ke-khach-hang-moi",
    },
    {
        path: "/admin/thong-ke/ve-ban-ra",
        component: () => import("../components/Admin/ThongKe/ThongKeVeBanRa/index.vue"),
        beforeEnter: checkAdmin,
        name: "thong-ke-ve-ban-ra",
    },
    {
        path: "/admin/thong-ke/chi-tieu-khach-hang",
        component: () => import("../components/Admin/ThongKe/ThongKeChiTieuKhachHang/index.vue"),
        beforeEnter: checkAdmin,
        name: "thong-ke-chi-tieu-khach-hang",
    },
    {
        path: "/admin/thong-ke/tour",
        component: () => import("../components/Admin/ThongKe/ThongKeTour/index.vue"),
        beforeEnter: checkAdmin,
        name: "thong-ke-tour",
    },
    {
        path: "/admin/lien-he",
        component: () => import("../components/Admin/LienHe/index.vue"),
        beforeEnter: checkAdmin,
        name: "lien-he",
    },
    {
        path: "/admin/slide",
        component: () => import("../components/Admin/QuanLySlide/index.vue"),
        beforeEnter: checkAdmin,
        name: "slide",
    },
    {
        path: "/admin/profile",
        component: () => import("../components/Admin/Profile/index.vue"),
        beforeEnter: checkAdmin,
        name: "profile",
    },


    // ===============================================
    // ============= Hướng Dẫn Viên ==================
    // ===============================================
    {
        path: "/huong-dan-vien/",
        component: () => import("../components/HuongDanVien/LichTrinh/index.vue"),
        beforeEnter: checkHuongDanVien,
        meta: { layout: "huong-dan-vien" }, 
    },
    {
        path: "/huong-dan-vien",
        component: () => import("../components/HuongDanVien/DangNhap/index.vue"),
        meta: { layout: "blank" },
    },
    {
         path: "/huong-dan-vien",
        component: () => import("../components/HuongDanVien/LichTrinh/index.vue"),
        meta: { layout: "huong-dan-vien" },
    },
    {
        path: "/huong-dan-vien/dang-nhap",
        component: () => import("../components/HuongDanVien/DangNhap/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/huong-dan-vien/dang-ky",
        component: () => import("../components/HuongDanVien/DangKy/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/huong-dan-vien/xac-nhan-dang-ky",
        component: () => import("../components/HuongDanVien/XacNhanDangKy/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/huong-dan-vien/quen-mat-khau",
        component: () => import("../components/HuongDanVien/QuenMatKhau/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/huong-dan-vien/lay-lai-mat-khau",
        component: () => import("../components/HuongDanVien/LayLaiMatKhau/index.vue"),
        meta: { layout: "blank" },
    },
    {
        path: "/huong-dan-vien/lich-trinh",
        component: () => import("../components/HuongDanVien/LichTrinh/index.vue"),
        beforeEnter: checkHuongDanVien,
        meta: { layout: "huong-dan-vien" }, 
    },
    {
        path: "/huong-dan-vien/profile",
        component: () => import("../components/HuongDanVien/Profile/index.vue"),
        beforeEnter: checkHuongDanVien,
        meta: { layout: "huong-dan-vien" }, 
    },
    {
        path: "/huong-dan-vien/quan-ly-tour",
        component: () => import("../components/HuongDanVien/QuanLyTour/index.vue"),
        beforeEnter: checkHuongDanVien,
        meta: { layout: "huong-dan-vien" }, 
    },
    {
        path: "/huong-dan-vien/quan-ly-khach-hang",
        component: () => import("../components/HuongDanVien/QuanLyKhachHang/index.vue"),
        beforeEnter: checkHuongDanVien,
        meta: { layout: "huong-dan-vien" }, 
    },

    // =========================================================
    // ==== ROUTE XỬ LÝ 404 NOT FOUND (BẮT BUỘC ĐỂ CUỐI CÙNG) ====
    // =========================================================
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../components/NotFound/index.vue"),
        meta: { layout: "blank" }, 
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,

    scrollBehavior(to, from, savedPosition) {
    // Nếu người dùng nhấn nút Back/Forward trên trình duyệt, 
    // trả về vị trí cuộn mà họ đã dừng lại trước đó
    if (savedPosition) {
      return savedPosition
    } 
    // Nếu chuyển sang một trang mới hoàn toàn, cuộn lên sát lề trên
    else {
      return { 
        top: 0,
        // Thêm thuộc tính này nếu bạn muốn hiệu ứng cuộn mượt mà
        behavior: 'smooth' 
      }
    }
  }
});



export default router;
