import axios from "axios";
import apiUrl from "../utils/api";
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ position: "top-right" });
export default async function (to, from, next) {
    const token = localStorage.getItem("key_client");
    if (!token) {
        localStorage.removeItem("check_kh");
        localStorage.removeItem("ho_va_ten");
        localStorage.removeItem("email_kh");
        toaster.error("Vui lòng đăng nhập để tiếp tục.");
        return next("/client/dang-nhap");
    }

    try {
        const res = await axios.get(apiUrl("client/check-token"), {
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (res.data.status) {
            localStorage.setItem("ho_va_ten", res.data.ho_ten || "");
            localStorage.setItem("email_kh", res.data.email || "");
            localStorage.setItem("check_kh", "true");
            return next();
        }

        throw new Error(res.data.message || "Vui lòng đăng nhập lại.");
    } catch (err) {
        console.error("checkClient error:", err?.response?.data || err.message || err);
        localStorage.removeItem("key_client");
        localStorage.removeItem("check_kh");
        localStorage.removeItem("ho_va_ten");
        localStorage.removeItem("email_kh");
        toaster.error(err?.response?.data?.message || "Phiên đăng nhập hết hạn hoặc kết nối thất bại.");
        return next("/client/dang-nhap");
    }
}