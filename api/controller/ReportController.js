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
            const salesTotal = await ReportModel.getStoreReportByStoreId({storeId: storeList.map(r => r.store_id)})
            
            
            return response.status(200).send({status: 'success', data: salesTotal});
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

const getCityList = async (request, response) => {
    try {
        const cityList = await ReportModel.getCityList();
        return response.status(200).send({status: 'success', data: cityList});
    }
    catch (err) {
        console.error(['ReportController', 'get city list', 'error'], err);
        return response.status(500).send({status: 'error', error: err});
    }
}

module.exports = {
    getProductReport,
    getCityList
};