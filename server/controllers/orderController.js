const {Order, ProductOrder, sequelize} = require("../models");

exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction(); //trấnction đảm bảo an toàn dữ liệu
    try {
        const {id_user, total_amount, items} = req.body;
        //tạo đơn hàng mới
        const order = await Order.create({id_user, total_amount}, {transaction: t});

        //thêm các sản phẩm vào đơn hàng qua bảng trung gian 
        const orderItems = items.map(item => ({
            id_order: order.id_order,
            id_product: item.id_product,
            product_quantity: item.quantity,
            product_price: item.price
        }));

        await ProductOrder.bulkCreate(orderItems, {transaction: t});

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
