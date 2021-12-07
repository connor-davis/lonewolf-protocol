import { v4 } from "uuid";
import { gun, user } from "../..";

let sendMessage = (roomId, publicKey, message, callback = () => {}) => {
  (async (callback = () => {}) => {
    let createMessagesCertificate = await gun
      .user(publicKey)
      .get("certificates")
      .get(user.is.pub)
      .get("messages");

    console.log(createMessagesCertificate);

    if (!createMessagesCertificate)
      return callback({
        errMessage: "Could not find friend certificate to create message",
        errCode: "failed-to-find-friend-messages-certificate",
        success: undefined,
      });

    let messageId = v4();
    let timeSent = new Date().toUTCString();

    gun
      .user(publicKey)
      .get("messages")
      .get(roomId)
      .set(
        JSON.stringify({
          id: messageId,
          content: message,
          timeSent,
          sender: user.is.pub,
        }),
        ({ err }) => {
          if (err)
            return callback({
              errMessage: err,
              errCode: "message-creation-error",
              success: undefined,
            });
          else
            gun
              .user()
              .get("messages")
              .get(roomId)
              .set(
                JSON.stringify({
                  id: messageId,
                  content: message,
                  timeSent,
                  sender: user.pub,
                }),
                ({ err }) => {
                  if (err)
                    return callback({
                      errMessage: err,
                      errCode: "message-creation-error",
                      success: undefined,
                    });
                  else
                    return callback({
                      errMessage: undefined,
                      errCode: undefined,
                      success: "Created a message with friend.",
                    });
                }
              );
        },
        { opt: { cert: createMessagesCertificate } }
      );
  })(callback);
};

export default sendMessage;
