var Mysql = require('mysql');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  port: process.env.DB_PORT || 3306,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 5
};

var DbPool = Mysql.createPool(dbConfig);

var destroyPool = function () {
  DbPool.end(function () {
    console.log(['debug', 'db-pool'], 'Exit');
  });
};

// Catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', function (e) {
  console.error(e);
  destroyPool();
  process.exit(99);
});

var command = function (sql, callback) {
  DbPool.getConnection(function (err, connection) {
    if (err) {
      console.log(['error', 'connection-pool'], err);
      return callback(err);
    }
    connection.query(sql, function (error, results) {
      connection.release();
      if (error) {
        console.error(['error', 'connection-query'], error);
        return callback(error);
      }

      callback(null, results);
    });
  });
};

var commandWithParams = function (sql, params, callback) {
  DbPool.getConnection(function (err, connection) {
    if (err) {
      console.error(['error', 'connection-pool'], err);
      return callback(err);
    }
    if(Array.isArray(params[0])) params = [params];

    connection.query(sql, params, function (error, results) {
      connection.release();
      if (error) {
        console.error(['error', 'connection-query'], error);
        return callback(error);
      }

      callback(null, results);
    });
  });
};

var commandWithTransaction = function (sql, params, connection, callback) {
  connection.query(sql, params, function (error, results) {
    if (error) {
      console.error(['error', 'connection-query'], error);
      return callback(error);
    }

    callback(null, results);
  });
};

module.exports = {
  command: command,
  commandWithParams: commandWithParams,
  commandWithTransaction: commandWithTransaction
};