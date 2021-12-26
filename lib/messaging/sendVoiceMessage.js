import { gun } from "../..";

let sendVoiceMessage = (
  roomId,
  publicKey,
  voiceRecording,
  callback = () => {}
) => {
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

    let updateMetaCertificate = await gun
      .user(publicKey)
      .get("certificates")
      .get(userPub)
      .get("chats");

    if (!updateMetaCertificate)
      return callback({
        errMessage: "Could not find friend certificate to add meta to chat",
        errCode: "failed-to-find-friend-chats-certificate",
        success: undefined,
      });

    gun
      .user()
      .get("chats")
      .get(roomId)
      .get("latestMessage")
      .put(voiceRecording);

    gun
      .user(publicKey)
      .get("chats")
      .get(roomId)
      .get("latestMessage")
      .put(voiceRecording, null, { opt: { cert: updateMetaCertificate } });

    gun
      .user()
      .get("messages")
      .get(roomId)
      .set(voiceRecording, ({ err }) => {
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
              voiceRecording,
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
                    success: "Created a voice message with friend.",
                  });
              },
              { opt: { cert: createMessagesCertificate } }
            );
      });
  })(callback);
};

export default sendVoiceMessage;
