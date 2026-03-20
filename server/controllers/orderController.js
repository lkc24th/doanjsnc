const jwt = require('jsonwebtoken');
const {Order, ProductOrder, sequelize} = require("../models");

exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction(); //trấnction đảm bảo toàn vẹ dữ liệu, bên này thì cộng bên kia vào, lỗi thì rollback(quay lại ban đầu)
    try {
        const {id_user, total_amount, items} = req.body;
        //tạo đơn hàng mới//bboor sung tạo ko thành công thì trả lỗi
        const order = await Order.create({id_user, total_amount}, {transaction: t});

        //thêm các sản phẩm vào đơn hàng qua bảng trung gian 
        const orderItems = items.map(item => ({
            id_order: order.id_order,
            id_product: item.id_product,
            product_quantity: item.quantity,
            product_price: item.price
        }));
        
        //bulkCreate → chỉ 1 query INSERT INTO ... VALUES (...), (...), (...) → nhanh gấp nhiều lần so với insert
        await ProductOrder.bulkCreate(orderItems, {transaction: t});//sử dụng trânsaction

        await t.commit();
        res.status(201).json({message: "Đặt hàng thành công!", orderId: order.id_order })
    }catch (error){
        await t.rollback();
        res.status(500).json({message: error.message});
    }
};
 //Nhân viên xác nhận hoặc huỷ đơn 
 exports.updateStatus = async (req, res)=>{
    try {
    const { id } = req.params;
    const { status } = req.body; // 'Confirmed' hoặc 'Cancelled'
    await Order.update({ status }, { where: { id_order: id } });
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
 };

 // Quản lý xem doanh thu (Mới)
exports.getRevenue = async (req, res) => {
  try {
    const total = await Order.sum('total_amount', { where: { status: 'Completed' } });
    res.json({ total_revenue: total || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách đơn hàng của user
exports.getUserOrders = async (req, res) => {
  try {
    let id_user = req.user?.id_user;

    // If route is public, accept id_user from query for quick testing.
    if (!id_user) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        id_user = decoded.id_user;
      }
    }

    if (!id_user && req.query.id_user) {
      id_user = Number(req.query.id_user);
    }

    if (!id_user || Number.isNaN(id_user)) {
      return res.status(400).json({ message: 'Thiếu id_user. Truyền query ?id_user=... hoặc Bearer token.' });
    }

    const orders = await Order.findAll({
      where: { id_user },
      include: [{
        model: require('../models/Product'),
        through: { attributes: ['product_quantity', 'product_price'] }
      }],
      order: [['order_date', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng (cho Admin/Employee)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: require('../models/User'), attributes: ['username', 'phone', 'address'] },
        { model: require('../models/Product'), through: { attributes: ['product_quantity', 'product_price'] } }
      ],
      order: [['order_date', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
