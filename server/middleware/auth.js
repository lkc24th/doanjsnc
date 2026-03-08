// Giả định bạn dùng JWT. Đây là hàm kiểm tra quyền Admin// json web token
exports.isAdmin = (req, res, next) => {
  // Trong thực tế, bạn sẽ lấy role từ token (req.user.role)
  const userRole = req.headers['role']; 
  if (userRole === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: "Quyền truy cập bị từ chối. Chỉ dành cho Admin!" });
  }
};