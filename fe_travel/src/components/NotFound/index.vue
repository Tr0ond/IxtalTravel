<template>
    <div class="error-page-wrapper d-flex align-items-center justify-content-center">
        <div class="text-center p-5 bg-white shadow-lg rounded-4 error-card">
            <!-- Hình ảnh minh họa lỗi 404 -->
            <img src="https://cdn-icons-png.flaticon.com/512/755/755014.png" alt="404 Not Found" class="img-fluid mb-4 error-img" />
            
            <h1 class="fw-bold text-dark display-4">404</h1>
            <h3 class="fw-bold text-secondary mb-3">Ôi không! Không tìm thấy trang.</h3>
            <p class="text-muted mb-4 fs-6 w-75 mx-auto">
                Đường dẫn bạn đang cố truy cập không tồn tại, đã bị thay đổi hoặc bạn không có quyền truy cập vào khu vực này.
            </p>
            
            <!-- Nút quay lại trang chủ -->
            <router-link to="/" class="btn btn-gradient-primary rounded-pill px-5 py-3 fw-bold shadow">
                <i class="fa-solid fa-house me-2"></i> QUAY LẠI TRANG CHỦ
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "NotFoundPage"
}
</script>

<style scoped>
.error-page-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    padding: 20px;
}

.error-card {
    max-width: 600px;
    width: 100%;
    animation: fadeIn 0.5s ease-in-out;
}

.error-img {
    max-width: 200px;
    animation: float 3s ease-in-out infinite;
}

.btn-gradient-primary {
    background: linear-gradient(135deg, #1b7d6b 0%, #229983 100%);
    border: none;
    color: #fff;
    transition: all 0.3s ease;
}

.btn-gradient-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(27, 125, 107, 0.3) !important;
    color: #fff;
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
</style>