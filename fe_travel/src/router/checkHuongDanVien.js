import axios from "axios";
import apiUrl from "../utils/api";
import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster({ position: "top-right" });
export default function (to, from, next) {
    var token = localStorage.getItem("key_hdv");
    axios
        .get(apiUrl("huong-dan-vien/check-token"), {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
        .then((res) => {
            if (res.data.status) {
                localStorage.setItem("ho_va_ten", res.data.ho_ten);
                localStorage.setItem("email_hdv", res.data.email);
                localStorage.setItem("check_hdv", res.data.status);
                next();
            } else {
                toaster.error(res.data.message);
                next("/huong-dan-vien/dang-nhap");
            }
        });
}