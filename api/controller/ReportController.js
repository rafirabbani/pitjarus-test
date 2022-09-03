const ReportModel = require('../models/Report');

const getProductReport = async (request, response) => {
    const { areaId, startDate, endDate } = request.query;
    try {
        if (areaId) {
            if (startDate && endDate) {
                const _startDate = new Date(startDate);
                const _endDate = new Date(endDate);
                if (_startDate > _endDate) {
                    return response.status(400).send({status: 'error', message:'Invalid Date Range'});
                }
            }
            const storeList = await ReportModel.getStoreList(areaId);
            if(storeList.length < 1) {
                return response.status(404).send({status: 'error', message: 'Store not Exist in Area'});
            }
            const sales = {};
            for (const store of storeList) {
                const storeSales = await ReportModel.getStoreReportByStoreId({storeId: store.store_id, startDate, endDate});
                if (storeSales.length < 1) {
                    return response.status(404).send({status: 'error', message: 'Data not found'});
                }
                storeSales.map(data => {
                    data['percentage'] = Math.round(data.total_sales / data.total_product * 100);
                })
                sales[store.area_name] = storeSales;
            }
            return response.status(200).send(sales);
        }
        else {
            response.status(400).send({status: 'error', message: 'Area Id is required'});
        }
    }
    catch (err) {
        console.log(['ReportController', 'err'], err);
        return response.status(500).send({status: 'error', error: err});
    } 
};

module.exports = {
    getProductReport
};