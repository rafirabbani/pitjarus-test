const DB = require('../services/DBManagement');

const getAllReport = (productId) => {
    const query = 'SELECT * FROM report_product WHERE product_id = ?';
    const params = [productId];
    return DB.sqlPromise(query, params);
};

const getCityList = () => {
    const query = 'SELECT * FROM store_area';
    return DB.sqlPromise(query);
};

const getStoreList = (areaId) => {
    const query = 'SELECT * FROM store_area AS A LEFT JOIN store AS S ON A.area_id = S.area_id WHERE A.area_id IN ?';
    const params = [areaId];
    return DB.sqlPromise(query, params);
};

const getStoreReportByStoreId = (payload) => {
    const { storeId, startDate, endDate } = payload;
    const params = [];
    let query = `SELECT area_id, SUM(bro.total_sales) AS total_sales, SUM(bro.total_product) as total_product, bro.brand_name FROM (SELECT S.area_id, bla.brand_name, bla.total_sales, bla.total_product FROM store AS S LEFT JOIN (SELECT R.store_id, brand_name, COUNT(CASE WHEN R.compliance = 1 THEN 1 END) AS total_sales, COUNT(R.product_id) AS total_product FROM report_product AS R LEFT JOIN product AS P ON R.product_id = P.product_id LEFT JOIN product_brand AS B ON P.brand_id = B.brand_id WHERE R.store_id IN (${storeId.map(r => `'${r}'`).join(',')}) GROUP BY B.brand_name, R.store_id) AS bla ON S.store_id = bla.store_id WHERE S.store_id IN (${storeId.map(r => `'${r}'`).join(',')})) as bro GROUP BY bro.brand_name`;
    // if (startDate) {
    //     query += ' AND tanggal >= ?';
    //     params.push(startDate);
    // }
    // if (endDate) {
    //     query += ' AND tanggal <= ?';
    //     params.push(endDate);
    // }
    
    return DB.sqlPromise(query);
}

module.exports = {
    getAllReport,
    getStoreList,
    getStoreReportByStoreId,
    getCityList
};