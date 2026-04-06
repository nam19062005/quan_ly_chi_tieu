// 1. Lấy các phần tử từ HTML thông qua ID bạn đã đặt
const sodu = document.getElementById("sodu");
const nhantien = document.getElementById("nhantien");
const tieutien = document.getElementById("tieutien");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const type = document.getElementById("type");
const sotien = document.getElementById("sotien");

//2. tạo id cho các giao dịch
function taoID() {
  return Math.floor(Math.random() * 10000000);
}

//3. Khởi tạo giao dịch
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
//localStorage là bộ nhớ tạm của trình duyệt, dòng này lấy dữ liệu đã lưu tên transactions
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];
  // kiểm tra bộ nhớ có dữ liệu không nếu có lấy dữ liệu đó nếu không tạo mảng trống

//4. Hàm thêm giao dịch vào giao diện
function addgiaodich(transaction) {
  // xac dinh + -
  const sign = transaction.type === "thu" ? "+" : "-";
  //them vao danh sach
  const item = document.createElement("li");
  //them class plus minus
  item.classList.add(transaction.type === "thu" ? "plus" : "minus");

  // gắn html cho thẻ li mới
  item.innerHTML = `
        ${transaction.text} <span>${sign}${transaction.amount.toLocaleString("vi-VN")} đ</span>
        <button class="delete-btn" onclick="xoagiaodich(${transaction.id})">x</button>
    `;

  //đẩy thẻ li vào danh sách ul
  list.appendChild(item);
}

//5. tính toán và tổng hợp số dư
function tinhtien() {
  const thu = transactions
    .filter((item) => item.type === "thu")
    .reduce((acc, item) => (acc += item.amount), 0);
  const chi = transactions
    .filter((item) => item.type === "chi")
    .reduce((acc, item) => (acc += item.amount), 0);
  const total = thu - chi;
  // cập nhật lên giao diện
sodu.innerText = `${total.toLocaleString("vi-VN")} đ`;
  nhantien.innerText = `+${thu.toLocaleString("vi-VN")} đ`;
  tieutien.innerText = `-${chi.toLocaleString("vi-VN")} đ`;
}
//6.xu li khi bấm nút
function nutgiaodich(e) {
  e.preventDefault(); // Ngăn trang web tự động tải lại khi submit form

  if (text.value.trim() === "" || sotien.value.trim() === "") {
    alert("Vui lòng nhập đầy đủ tên giao dịch và số tiền!");
    return;
  }

  // Tạo một object giao dịch mới
  const transaction = {
    id: taoID(),
    text: text.value,
    amount: parseInt(sotien.value), // Ép kiểu chuỗi sang số nguyên
    type: type.value,
  };

  // Đẩy vào mảng
  transactions.push(transaction);

  // Cập nhật giao diện và bộ nhớ
  addgiaodich(transaction);
  tinhtien();
  updateLocalStorage();

  // Làm trống form để nhập lần sau
  text.value = "";
  sotien.value = "";
}
//7. xóa giao dịch
function xoagiaodich(id) {
  transactions = transactions.filter((transaction) => transaction.id != id);
  updateLocalStorage();
  init(); // Chạy lại hàm khởi tạo để vẽ lại giao diện
}
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
function init() {
  list.innerHTML = ""; // làm sạch danh sách
  transactions.forEach(addgiaodich);
  tinhtien();
}

init();
form.addEventListener("submit", nutgiaodich);
