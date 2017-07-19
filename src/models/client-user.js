

class ClientUser {
  constructor(dbPool) {
    this.dbPool = dbPool;

    this.chatUserId = null;
    this.serviceClientId = null;
    this.serviceClientUserId = null;
    this.userName = null;
    this.createDate = null;
    this.lastVisit = null;
    this.clientUserData = null;
  }


  /**
   * Поиск пользователя в базе
   *
   * @param clientId
   * @param clientUserId
   * @returns {Promise}
   */
  findByClientUserId(clientId, clientUserId) {
    return new Promise((success, reject) => {
      this.dbPool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        const sql = connection.format(
          "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1",
          ['chat_users', 'serviceClientId', clientId, 'serviceClientUserId', clientUserId]
        );
        connection.queryRow(sql,
          (err, row) => {
            connection.release();
            if (err) {
              reject(err);
              return;
            }
            if (row) {
              const searchedClient = new ClientUser(this.dbPool);
              searchedClient.chatUserId = row.chatUserId;
              searchedClient.serviceClientId = row.serviceClientId;
              searchedClient.serviceClientUserId = row.serviceClientUserId;
              searchedClient.userName = row.userName;
              searchedClient.createDate = row.createDate;
              searchedClient.lastVisit = row.lastVisit;
              searchedClient.clientUserData = row.clientUserData;
              success(searchedClient)
            } else {
              success(null);
            }
          }
        );
      })
    });
  }

  updateVisitDate(newDate) {
    return new Promise((success, reject) => {
      this.dbPool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(this.chatUserId);
        connection.update(
          'chat_users',
          {lastVisit: newDate},
          {chatUserId: this.chatUserId},
          (err, row) => {
            console.log("Update result", row);
            connection.release();
            if (err) {
              reject(err);
              return;
            }
            success();
          }
        );
      })
    });
  }

  updateDbRecord() {
    return new Promise((success, reject) => {
      this.dbPool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        const sql = connection.format(
          "REPLACE INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            'chat_users',

            'chatUserId',
            'serviceClientId',
            'serviceClientUserId',
            'userName',
            'createDate',
            'lastVisit',
            'clientUserData',

            this.chatUserId,
            this.serviceClientId,
            this.serviceClientUserId,
            this.userName,
            this.createDate,
            this.lastVisit,
            this.clientUserData
          ]
        );
        connection.query(sql,
          (err, row) => {
            connection.release();
            if (err) {
              reject(err);
              return;
            }
            success();
          }
        );
      })
    });
  }
}

module.exports = ClientUser;