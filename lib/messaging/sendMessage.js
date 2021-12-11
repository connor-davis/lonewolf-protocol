import { SEA } from "gun";
import { v4 } from "uuid";
import { gun } from "../..";

let sendMessage = (roomId, publicKey, message, callback = () => {}) => {
  (async (callback = () => {}) => {
    let userPub = await gun.user().pair().pub;
    let userPair = await gun.user()._.sea;
    let friend = await gun.user(publicKey);

    if (!userPub)
      return callback({
        errMessage: "Could not find pub.",
        errCode: "failed-to-find-pub",
        success: undefined,
      });

    let createMessagesCertificate = await gun
      .user(publicKey)
      .get("certificates")
      .get(userPub)
      .get("messages");

    if (!createMessagesCertificate)
      return callback({
        errMessage: "Could not find friend certificate to create message",
        errCode: "failed-to-find-friend-messages-certificate",
        success: undefined,
      });

    let messageId = v4();
    let timeSent = Date.now();

    let secret = await SEA.secret(friend.epub, userPair);
    let encryptedMessage = await SEA.encrypt(
      JSON.stringify({
        id: messageId,
        content: message,
        timeSent,
        sender: userPub,
      }),
      secret
    );

    gun
      .user()
      .get("messages")
      .get(roomId)
      .set(encryptedMessage, ({ err }) => {
        if (err)
          return callback({
            errMessage: err,
            errCode: "message-creation-error",
            success: undefined,
          });
        else
          gun
            .user(publicKey)
            .get("messages")
            .get(roomId)
            .set(
              encryptedMessage,
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
              },
              { opt: { cert: createMessagesCertificate } }
            );
      });
  })(callback);
};

export default sendMessage;
