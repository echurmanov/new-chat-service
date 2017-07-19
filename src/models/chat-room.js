
const TYPE_PUBLIC = 'public';
const TYPE_PRIVATE = 'private';

const TABLE_NAME_CHAT_ROOMS = 'chat_rooms';
const TABLE_NAME_CHAT_ROOM_USER_ACCESS = 'chat_user_private_rooms_access';

/**
 * Модель комнаты чата
 *
 */
class ChatRoom {
  constructor (dbPool) {
    this.dbPool = dbPool;

    this.chatRoomId = null;
    this.serviceClientId = null;
    this.chatRoomTitle = null;
    this.chatRoomType = null;
  }


  /**
   * Получаем спсиок публичных комнат клиента
   *
   * @param clientId
   * @returns {Promise}
   */
  getPublicClientRooms (clientId) {
    return new Promise((success, reject) => {
      this.dbPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
          return;
        }
        conn.select(TABLE_NAME_CHAT_ROOMS, '*', {serviceClientId: clientId, chatRoomType: TYPE_PUBLIC}, {chatRoomTitle: 'asc'}, (err, result) => {
          conn.release();
          if (err) {
            reject(err);
            return;
          }
          const chatRooms = [];
          for (let r = 0; r < result.length; r++) {
            const chatRoom = new ChatRoom(this.dbPool);
            chatRoom.chatRoomId = result[r].chatRoomId;
            chatRoom.serviceClientId = result[r].serviceClientId;
            chatRoom.chatRoomTitle = result[r].chatRoomTitle;
            chatRoom.chatRoomType = result[r].chatRoomType;
            chatRooms.push(chatRoom);
          }

          success(chatRooms);
        });
      });
    });
  }

  /**
   *
   * @param {ClientUser} client
   *
   * @return {Promise}
   */
  getRoomsForClient(client) {
    return new Promise((success, reject) => {
      this.dbPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
          return;
        }
        const sql = conn.format(
          [
            "SELECT c.* FROM ",
            TABLE_NAME_CHAT_ROOMS,
            " c LEFT JOIN ",
            TABLE_NAME_CHAT_ROOM_USER_ACCESS,
            " ca ON (c.chatRoomId = ca.chatRoomId AND ca.chatUserId = :chatUserId) ",
            " WHERE c.serviceClientId = :serviceClientId AND (c.chatRoomType = :typePublic OR ca.chatRoomId is NOT NULL)",
            " ORDER BY c.chatRoomTitle"
          ].join(""),
          {
            chatUserId: client.chatUserId,
            serviceClientId: client.serviceClientId,
            typePublic: TYPE_PUBLIC
          }
        );
        conn.query(sql, (err, result) => {
          conn.release();
          if (err) {
            reject(err);
            return;
          }
          const chatRooms = [];
          for (let r = 0; r < result.length; r++) {
            const chatRoom = new ChatRoom(this.dbPool);
            chatRoom.chatRoomId = result[r].chatRoomId;
            chatRoom.serviceClientId = result[r].serviceClientId;
            chatRoom.chatRoomTitle = result[r].chatRoomTitle;
            chatRoom.chatRoomType = result[r].chatRoomType;
            chatRooms.push(chatRoom);
          }

          success(chatRooms);
        });
      });
    });
  }
}

module.exports = ChatRoom;