const mysql = require('mysql');
const mysqlUtils = require('mysql-utilities');


class ChatModel {
  constructor(dbOptions)
  {
    this.dbPool = mysql.createPool(dbOptions);
    this.dbPool.on('connection', function(connection) {
      mysqlUtils.upgrade(connection);
      mysqlUtils.introspection(connection);
    });
  }

  checkClientExists(clientName) {
    return new Promise((success, reject) => {
      this.dbPool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        const sql = connection.format(
          "SELECT * FROM ?? WHERE ?? = ? LIMIT 1",
          ['service_client', 'serviceClientName', clientName]
        );
        console.log(clientName);
        connection.queryRow(
          "SELECT * FROM ?? WHERE ?? = ? LIMIT 1",
          ['service_client', 'serviceClientName', clientName],
          (err, row) => {
            console.log(row);
            connection.release();
            if (err) {
              reject(err);
              return;
            }
            if (row) {
              success(row)
            } else {
              success(false);
            }
          }
        );
      })
    });

  }

}

module.exports = ChatModel;