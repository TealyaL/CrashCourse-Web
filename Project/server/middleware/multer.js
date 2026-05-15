const multer = require("multer");
const os = require("os");
const path = require("path");

// Cấu hình nơi lưu trữ file khi upload
const storage = multer.diskStorage({
  // Thiết lập thư mục lưu file
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Lưu tạm vào thư mục temp theo OS
  },
    // Thiết lập tên file khi lưu vào máy chủ
  filename: (req, file, cb) => {
   // Tạo một chuỗi định danh duy nhất: thời gian hiện tại + số ngẫu nhiên
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname) || "";
    // Đặt tên file: <tên-trường>-<suffix>
    cb(null, file.fieldname + "-" + uniqueSuffix + extension); // Tạo tên file duy nhất
  },
});

const upload = multer({ storage: storage });

module.exports = upload;