import { SEA } from "gun";
import { gun } from "../..";

let createChatsCertificate = async (publicKeys = [], callback = () => {}) => {
  let certificate = await SEA.certify(
    publicKeys,
    [{ "*": "chats" }],
    await gun.user().pair(),
    null
  );

  gun
    .user()
    .get("certificates")
    .get("chats")
    .put(certificate, ({ err }) => {
      if (err)
        return callback({
          errMessage: err,
          errCode: "chats-certificate-creation-error",
          success: undefined,
        });
      else
        return callback({
          errMessage: undefined,
          errCode: undefined,
          certificate,
          success: "Generated new chats certificate.",
        });
    });
};

let createMessagesCertificate = async (
  publicKeys = [],
  callback = () => {}
) => {
  let certificate = await SEA.certify(
    publicKeys,
    [{ "*": "messages" }],
    await gun.user().pair(),
    null
  );

  gun
    .user()
    .get("certificates")
    .get("messages")
    .put(certificate, ({ err }) => {
      if (err)
        return callback({
          errMessage: err,
          errCode: "messages-certificate-creation-error",
          success: undefined,
        });
      else
        return callback({
          errMessage: undefined,
          errCode: undefined,
          certificate,
          success: "Generated new messages certificate.",
        });
    });
};

export { createChatsCertificate, createMessagesCertificate };

