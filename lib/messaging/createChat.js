import { gun } from "../..";

let createChat = (publicKey, callback = () => {}) => {
  (async (callback = () => {}) => {
    let friend = await gun.user(publicKey).once();

    if (!friend)
      return callback({
        errMessage: "Could not find friend.",
        errCode: "failed-to-find-friend",
        success: undefined,
      });

    let createChatsCertificate = await gun
      .user(publicKey)
      .get("certificates")
      .get("chats");

    if (!createChatsCertificate)
      return callback({
        errMessage: "Could not find friend certificate to create chat",
        errCode: "failed-to-find-friend-chats-certificate",
        success: undefined,
      });

    let user = await gun.user().once();

    gun
      .user(publicKey)
      .get("chats")
      .get(user.pub)
      .put(
        JSON.stringify({
          pub: user.pub,
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
                      success: "Created a chat with friend.",
                    });
                }
              );
        },
        { opt: { cert: createChatsCertificate } }
      );
  })(callback);
};

export default createChat;
