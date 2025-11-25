// Hàm chuyển đổi giữa form Đăng nhập và Đăng ký
function showForm(formType) {
    const loginContainer = document.getElementById('login-form-container');
    const registerContainer = document.getElementById('register-form-container');
    const tabButtons = document.querySelectorAll('.tab-button');

    // Ẩn/Hiện form
    if (formType === 'login') {
        loginContainer.classList.remove('hidden');
        registerContainer.classList.add('hidden');
        tabButtons[0].classList.add('active');
        tabButtons[1].classList.remove('active');
    } else {
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
        tabButtons[0].classList.remove('active');
        tabButtons[1].classList.add('active');
    }
    // Xóa thông báo cũ khi chuyển form
    showMessage('');
}

// Hàm hiển thị thông báo
function showMessage(message, isSuccess = false) {
    const msgArea = document.getElementById('message-area');
    msgArea.textContent = message;
    msgArea.className = 'message-area'; // Reset class

    if (message) {
        msgArea.classList.add(isSuccess ? 'message-success' : 'message-error');
    }
}

// ------------------------------------------
// XỬ LÝ SỰ KIỆN FORM SUBMIT
// ------------------------------------------

// 1. Xử lý Đăng ký
document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn form submit truyền thống
    showMessage(''); // Xóa thông báo cũ

    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
        showMessage('Mật khẩu và Xác nhận Mật khẩu không khớp.', false);
        return;
    }

    const registrationData = { username, email, password };
    
    // Phần này là nơi bạn gọi API Back-end
    await sendDataToServer('/api/register', registrationData, 'Đăng ký');
});

// 2. Xử lý Đăng nhập
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    showMessage('');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const loginData = { email, password };

    // Phần này là nơi bạn gọi API Back-end
    await sendDataToServer('/api/login', loginData, 'Đăng nhập');
});

// Hàm mô phỏng gửi dữ liệu đến Back-end (SỬ DỤNG FETCH API)
async function sendDataToServer(endpoint, data, actionName) {
    try {
        // Thay 'http://localhost:3000' bằng địa chỉ Back-end của bạn
        const response = await fetch(`http://localhost:3000${endpoint}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) { // Mã trạng thái 200-299
            showMessage(`${actionName} thành công!`, true);
            console.log(`${actionName} thành công:`, result);
            // TODO: Nếu là đăng nhập, lưu trữ Token (vd: localStorage.setItem('token', result.token))
        } else {
            // Xử lý lỗi trả về từ BE (vd: email đã tồn tại, mật khẩu sai)
            const errorMessage = result.message || `Lỗi ${actionName} không xác định.`;
            showMessage(errorMessage, false);
        }
    } catch (error) {
        console.error(`Lỗi kết nối ${actionName}:`, error);
        showMessage(`Không thể kết nối đến máy chủ Back-end.`, false);
    }
}

// Khởi tạo hiển thị form Đăng nhập khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    showForm('login');
});