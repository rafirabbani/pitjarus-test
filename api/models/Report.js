const DB = require('../services/DBManagement');

const getAllReport = (productId) => {
    const query = 'SELECT * FROM report_product WHERE product_id = ?';
    const params = [productId];
    return DB.sqlPromise(query, params);
};

const getStoreList = (areaId) => {
    const query = 'SELECT * FROM store_area AS A LEFT JOIN store AS S ON A.area_id = S.area_id WHERE A.area_id IN ?';
    const params = [areaId];
    return DB.sqlPromise(query, params);
};

const getStoreReportByStoreId = (payload) => {
    const { storeId, startDate, endDate } = payload;
    const params = [storeId];
    let query = 'SELECT *, COUNT(CASE WHEN R.compliance = 1 THEN 1 END) AS total_sales, COUNT(R.product_id) AS total_product FROM report_product AS R LEFT JOIN product AS P ON R.product_id = P.product_id LEFT JOIN product_brand AS B ON P.brand_id = B.brand_id WHERE store_id = ?';
    if (startDate) {
        query += ' AND tanggal >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND tanggal <= ?';
        params.push(endDate);
    }

    query += ' GROUP BY brand_name'
    
    return DB.sqlPromise(query, params);
}

module.exports = {
    getAllReport,
    getStoreList,
    getStoreReportByStoreId
};