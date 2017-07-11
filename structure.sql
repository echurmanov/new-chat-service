CREATE TABLE `chat_messages` (
  `messageId` varchar(36),
  `chatUserId` varchar(36) DEFAULT NULL,
  `chatRoomId` varchar(36) DEFAULT NULL,
  `messageTime` timestamp,
  `messageType` varchar(36) DEFAULT NULL,
  `messageText` text,
  PRIMARY KEY (`messageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


 CREATE TABLE `chat_rooms` (
  `chatRoomId` varchar(36) NOT NULL,
  `serviceClientId` varchar(36) DEFAULT NULL,
  `chatRoomTitle` varchar(255) DEFAULT NULL,
  `chatRoomType` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`chatRoomId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `chat_user_private_rooms_access` (
  `chatUserId` varchar(36) NOT NULL DEFAULT '',
  `chatRoomId` varchar(36) NOT NULL DEFAULT '',
  PRIMARY KEY (`chatUserId`,`chatRoomId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE `chat_users` (
  `chatUserId` varchar(36) NOT NULL,
  `serviceClientId` varchar(36) DEFAULT NULL,
  `serviceClientUserId` varchar(128) DEFAULT NULL,
  `userName` varchar(512) DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `lastVisit` datetime DEFAULT NULL,
  `clietServiceUserLink` text,
  PRIMARY KEY (`chatUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `service_client` (
  `serviceClientId` varchar(36) NOT NULL DEFAULT '',
  `serviceClientName` varchar(255) DEFAULT NULL,
  `serviceClientSecret` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`serviceClientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;