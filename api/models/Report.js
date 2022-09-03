const DB = require('../services/DBManagement');

const getAllReport = (productId) => {
    const query = 'SELECT * FROM report_product WHERE product_id = ?';
    const params = [productId];
    return DB.sqlPromise(query, params);
};

module.exports = {
    getAllReport
};