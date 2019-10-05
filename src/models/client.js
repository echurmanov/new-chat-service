const QS = require('querystring');
const crypto = require('crypto');

class Client {
  constructor(dbPool) {
    this.clientId = null;
    this.clientName = null;
    this.clientSecret = null;

    this.dbPool = dbPool;

    this._init = false;
  }


  /**
   * Поиск клиента по имени в базе
   *
   * @param clientName
   * @returns {Promise}
   */
  findClientByName(clientName) {
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
            connection.release();
            if (err) {
              reject(err);
              return;
            }
            if (row) {
              const searchedClient = new Client(this.dbPool);
              searchedClient.clientId = row.serviceClientId;
              searchedClient.clientName = row.serviceClientName;
              searchedClient.clientSecret = row.serviceClientSecret;
              success(searchedClient)
            } else {
              success(null);
            }
          }
        );
      })
    });
  }

  /**
   * Разбирает клиенсткий запрос с проверкой подписи
   *
   * @param queryString
   * @returns {Object}
   */
  parseQuery(queryString) {
    const query = QS.parse(queryString);
    if (typeof query.sign === 'undefined') {
      const err  = new Error("Missing query sign");
      err.code = 1002;
      throw err;
    }
    const queryKeys = [];
    for (let key in query) {
      if (key != 'sign') {
        queryKeys.push(key);
      }
    }
    const sortedKeys = queryKeys.sort();
    const checkArray = sortedKeys.reduce((prev, curr, arr) => {prev.push(curr); prev.push(query[curr]); return prev}, []);
    checkArray.push(this.clientSecret);

    const checkString = checkArray.join('&');
    const hash = crypto.createHash('sha256');
    hash.update(checkString);
    const rightSign = hash.digest('hex');

    if (rightSign != query.sign) {
      const err  = new Error("Wrong sign");
      err.code = 1001;
      throw err;
    }
    return query;
  }


}

module.exports = Client;