import { v4 } from "uuid";
import { gun } from "../..";

let createChat = async (publicKey, callback = () => {}) => {
  gun
    .user()
    .get("chats")
    .get(publicKey)
    .once(async (chatExists) => {
      if (chatExists) {
        return callback({
          errMessage: "The chat already exists. Opening it now.",
          errCode: "chat-already-exists",
          chat: JSON.parse(chatExists),
          success: undefined,
        });
      }

      let friend = await gun.user(publicKey).once();

      let userPub = await gun.user().pair().pub;

      if (!userPub)
        return callback({
          errMessage: "Could not find pub.",
          errCode: "failed-to-find-pub",
          success: undefined,
        });

      if (!friend)
        return callback({
          errMessage: "Could not find friend.",
          errCode: "failed-to-find-friend",
          success: undefined,
        });

      let createChatsCertificate = await gun
        .user(publicKey)
        .get("certificates")
        .get(userPub)
        .get("chats");

      if (!createChatsCertificate)
        return callback({
          errMessage: "Could not find friend certificate to create chat",
          errCode: "failed-to-find-friend-chats-certificate",
          success: undefined,
        });

      let roomId = v4();

      gun
        .user(publicKey)
        .get("chats")
        .get(userPub)
        .put(
          JSON.stringify({
            pub: userPub,
            roomId,
            latestMessage: {},
          }),
          ({ err }) => {
            if (err)
              return callback({
                errMessage: err,
                errCode: "chat-creation-error",
                success: undefined,
              });
            else
              gun
                .user()
                .get("chats")
                .get(publicKey)
                .put(
                  JSON.stringify({
                    pub: friend.pub,
                    roomId,
                    latestMessage: {},
                  }),
                  ({ err }) => {
                    if (err)
                      return callback({
                        errMessage: err,
                        errCode: "chat-creation-error",
                        success: undefined,
                      });
                    else
                      return callback({
                        errMessage: undefined,
                        errCode: undefined,
                        chat: {
                          pub: friend.pub,
                          roomId,
                        },
                        success: "Created a chat with friend.",
                      });
                  }
                );
          },
          { opt: { cert: createChatsCertificate } }
        );
    });
};

export default createChat;
