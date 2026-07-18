import axios from 'axios';
import QRCode from 'qrcode';
import apiUrl from './api';

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('key_client') || ''}`,
  };
}

function responseError(error, fallback) {
  return new Error(error?.response?.data?.message || error?.message || fallback);
}

export async function createPayOSQr(invoiceId) {
  try {
    const response = await axios.post(
      apiUrl('client/payos/tao-thanh-toan'),
      { id_hoa_don: invoiceId },
      { headers: authHeaders() },
    );

    if (!response.data?.status || !response.data?.data?.qr_code) {
      throw new Error(response.data?.message || 'payOS không trả về mã QR hợp lệ.');
    }

    const payment = response.data.data;
    const qrImage = await QRCode.toDataURL(payment.qr_code, {
      errorCorrectionLevel: 'M',
      width: 280,
      margin: 1,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    });

    return { ...payment, qr_image: qrImage };
  } catch (error) {
    throw responseError(error, 'Không thể tạo mã QR payOS.');
  }
}

export async function checkPayOSPayment(orderCode) {
  try {
    const response = await axios.get(apiUrl('client/payos/check-thanh-toan'), {
      params: { order_code: orderCode },
      headers: authHeaders(),
    });

    if (!response.data?.status || !response.data?.data) {
      throw new Error(response.data?.message || 'Không thể kiểm tra giao dịch payOS.');
    }

    return response.data.data;
  } catch (error) {
    throw responseError(error, 'Không thể kiểm tra giao dịch payOS.');
  }
}
