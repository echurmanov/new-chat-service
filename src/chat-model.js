const mysql = require('mysql');
const mysqlUtils = require('mysql-utilities');
const Client = require('./models/client.js');
const ClientUser = require('./models/client-user.js');
const uuidv4 = require('uuid/v4');







class ChatModel {
  constructor(dbOptions)
  {
    this.dbPool = mysql.createPool(dbOptions);
    this.dbPool.on('connection', function(connection) {
      mysqlUtils.upgrade(connection);
      mysqlUtils.introspection(connection);
    });
  }

  async checkClientExists(clientName) {
    const clientModel = new Client(this.dbPool);
    return await clientModel.findClientByName(clientName);
  }

  /**
   *
   * @param client
   * @param queryString
   *
   * @throw Error
   * @return ChatUser
   */
  async verifyChatUser(client, queryString) {
    const query = client.parseQuery(queryString);
    if (typeof query.userId == 'undefined') {
      const error = new Error("Missing required param \"userId\"");
      error.code = 2001;
      throw error;
    }
    if (typeof query.userName == 'undefined') {
      const error = new Error("Missing required param \"userName\"");
      error.code = 2001;
      throw error;
    }
    const ClientUserModel = new ClientUser(this.dbPool);
    let clientUser = await ClientUserModel.findByClientUserId(client.clientId, query.userId);
    if (!clientUser) {
      clientUser = new ClientUser(this.dbPool);
      clientUser.chatUserId = uuidv4();
      clientUser.serviceClientId = client.clientId;
      clientUser.serviceClientUserId = query.userId;
      clientUser.userName = query.userName;
      clientUser.createDate = new Date();
      clientUser.lastVisit = new Date();
      clientUser.clientUserData = (typeof query.userData !== 'undefined')?query.userData:null;
      await clientUser.updateDbRecord();
    } else {
      clientUser.userName = query.userName;
      clientUser.lastVisit = new Date();
      clientUser.clientUserData = (typeof query.userData !== 'undefined')?query.userData:null;
      clientUser.updateDbRecord();
    }

    return clientUser;
  }

}

module.exports = ChatModel;