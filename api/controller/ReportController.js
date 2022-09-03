const ReportModel = require('../models/Report');

const getProductReport = async (request, response) => {
    const { productId } = request.query;
    try {
        if (productId) {
            const reportData = await ReportModel.getAllReport(productId);
            return response.status(200).send(reportData);
        }
        else {
            response.status(400).send({status: 'error', message: 'Product Id is required'});
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