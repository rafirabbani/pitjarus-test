var DB = require('./DBPool');

const sqlPromise = (sql, params = null) => {
    console.log(['DB Management', 'request'], {sql: sql, params: params});
    if (params) {
        return new Promise((resolve, reject) => {
            DB.commandWithParams(sql, params, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    }
    return new Promise((resolve, reject) => {
        DB.command(sql, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = {
    sqlPromise
};