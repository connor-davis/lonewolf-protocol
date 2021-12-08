import { SEA } from "gun";
import { gun } from "../..";

let createChatsCertificate = async (publicKey, callback = () => {}) => {
  let certificateExists = await gun
    .user()
    .get("certificates")
    .get(publicKey)
    .get("chats")
    .once();

  if (certificateExists) return;

  let certificate = await SEA.certify(
    [publicKey],
    [{ "*": "chats" }],
    await gun.user().pair(),
    null
  );

  gun
    .user()
    .get("certificates")
    .get(publicKey)
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

let createMessagesCertificate = async (publicKey, callback = () => {}) => {
  let certificateExists = await gun
    .user()
    .get("certificates")
    .get(publicKey)
    .get("messages")
    .once();

  if (certificateExists) return;

  let certificate = await SEA.certify(
    [publicKey],
    [{ "*": "messages" }],
    await gun.user().pair(),
    null
  );

  gun
    .user()
    .get("certificates")
    .get(publicKey)
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

