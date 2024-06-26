const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// Obtener todas las órdenes
router.get('/order', async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders) {
            return res.status(404).json({ message: 'Ordenes no encontrada' });
        }
        const reversedOrders = orders.reverse();
        res.json(reversedOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Obtener una orden específica por su ID
router.get('/order/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva orden
router.post('/order', async (req, res) => {
    try {
        const { rest, items, totalPrice, status, createdAt } = req.body;

        const orderCount = await Order.find();
        const orderNumber = orderCount.length + 1;
        const order = new Order({
            orderNumber,
            userId: rest,
            items,
            totalPrice,
            status,
            createdAt
        });

        const newOrder = await order.save();
        res.status(201).json({ msg: "Orden realizada", newOrder });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Actualizar una orden existente
router.put('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paid } = req.body;

        let paidAlternado = !paid;

        const updatedOrder = await Order.findByIdAndUpdate(id, { status, paid: paidAlternado }, { new: true });
        if (updatedOrder) {
            res.status(200).json({ message: 'Estado de pedido actualizada', updatedOrder });
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});
router.get('/order/filter/:filtro', async (req, res) => { // Cambiado ":id" a ":filtro" para reflejar el parámetro esperado
    try {
        const { filtro } = req.params;

        let order;

        switch (filtro) {
            case "PAGADO":
                order = await Order.find({ paid: true }); // Usar llaves {} para especificar el objeto de consulta
                break;
            case "NO_PAGADO":
                order = await Order.find({ paid: false }); // Usar llaves {} para especificar el objeto de consulta
                break;
            default:
                order = await Order.find({ status: filtro }); // Usar llaves {} para especificar el objeto de consulta
                break;
        }

        if (!order) { // Verificar si se encontraron órdenes
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        order = order.reverse();

        res.status(200).json({ msg: "lista de pedidos filtrada", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/orders/update-orders', async (req, res) => {
    try {
        const { newUserId } = req.body; // El nuevo userId que quieres asignar a todas las órdenes

        // Actualiza todos los documentos en la colección de órdenes con el nuevo userId
        const result = await Order.updateMany({}, { $set: { userId: newUserId } });

        res.status(200).json({ msg: "Órdenes actualizadas exitosamente", result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/orders/search/:query', async (req, res) => {
    try {
        let query = req.params.query;

        let orders;
        if (!isNaN(parseInt(query))) {
            query = parseInt(query);
            orders = await Order.find({ orderNumber: query });
        } else {

            orders = await Order.find({ 'userId.name': { $regex: query, $options: 'i' } });
        }

        if (orders.length === 0) {
            return res.status(400).json({ message: 'No se encontraron pedidos que coincidan con la búsqueda.', orders: {} });
        }
        return res.status(200).json({ message: 'Pedidos encontrados:', orders });
    } catch (error) {
        console.error('Error al buscar pedidos:', error.message);
        return res.status(500).json({ error: 'Hubo un error al buscar pedidos.' });
    }
});

router.get('/order/userOrderFilter/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await Order.find({ 'userId.id': id });

        // Invertir el orden de los resultados
        const ordersReversed = orders.reverse();

        if (!ordersReversed || ordersReversed.length === 0) {
            return res.status(400).json({ msg: "No se encontraron coincidencias" });
        }
        res.status(200).json({ orders: ordersReversed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;