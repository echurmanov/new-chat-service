

const ChatUserCache = {};
const ClientUserCache = {};


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
   * Поиск пользователя в базе по ID в системе клиента
   *
   * @param clientId
   * @param clientUserId
   * @returns {Promise}
   */
  findByClientUserId(clientId, clientUserId) {
    return new Promise((success, reject) => {
      if (typeof ClientUserCache[clientId] !== 'undefined' && typeof ClientUserCache[clientId][clientUserId] !== 'undefined'
        && typeof ChatUserCache[ClientUserCache[clientId][clientUserId]] !== 'undefined'
      ) {
        console.log("Get user object from cache");
        success(ChatUserCache[ClientUserCache[clientId][clientUserId]]);
        return;
      }
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

              if (typeof ClientUserCache[searchedClient.serviceClientId] === 'undefined') {
                ClientUserCache[searchedClient.serviceClientId] = {};
              }
              ClientUserCache[searchedClient.serviceClientId][searchedClient.serviceClientUserId] = row.chatUserId;
              if (typeof ChatUserCache[searchedClient.chatUserId] === 'undefined') {
                ChatUserCache[searchedClient.chatUserId] = searchedClient;
              }
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
   * Поиск пользователя в базе по ChatUserID
   *
   * @param clientId
   * @param clientUserId
   * @returns {Promise}
   */
  findByChatUserId(chatUserId) {
    return new Promise((success, reject) => {
      if (typeof ChatUserCache[chatUserId] !== 'undefined') {
        console.log("Get user object from cache");
        success(ChatUserCache[chatUserId]);
        return
      }
      this.dbPool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        const sql = connection.format(
          "SELECT * FROM ?? WHERE ?? = ? LIMIT 1",
          ['chat_users', 'chatUserId', chatUserId]
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

              if (typeof ClientUserCache[searchedClient.serviceClientId] === 'undefined') {
                ClientUserCache[searchedClient.serviceClientId] = {};
              }
              ClientUserCache[searchedClient.serviceClientId][searchedClient.serviceClientUserId] = row.chatUserId;
              if (typeof ChatUserCache[searchedClient.chatUserId] === 'undefined') {
                ChatUserCache[searchedClient.chatUserId] = searchedClient;
              }
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
   * Обновленена дата последнего визита пользователя
   *
   * @param newDate
   * @returns {Promise}
   */
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

  /**
   * Обновление данных пользователя в БД
   *
   * @returns {Promise}
   */
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
            if (typeof ClientUserCache[this.serviceClientId] === 'undefined') {
              ClientUserCache[this.serviceClientId] = {};
            }
            ClientUserCache[this.serviceClientId][this.serviceClientUserId] = this.chatUserId;
            if (typeof ChatUserCache[this.chatUserId] === 'undefined') {
              ChatUserCache[this.chatUserId] = this;
            }
            success();
          }
        );
      })
    });
  }
}

module.exports = ClientUser;