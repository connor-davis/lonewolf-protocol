import { SEA } from "gun";
import { gun } from "../..";

let generateFriendRequestsCertificate = async (callback = () => {}) => {
  let certificate = await SEA.certify(
    ["*"],
    [{ "*": "friendRequests" }],
    await gun.user().pair(),
    null
  );

  gun
    .user()
    .get("certificates")
    .get("friendRequests")
    .put(certificate, ({ err }) => {
      if (err) return callback({ errMessage: err, errCode: "gun-put-error" });
      else
        return callback({
          errMessage: undefined,
          errCode: undefined,
          certificate,
          success: "Generated new friend requests certificate.",
        });
    });
};

let generateAddFriendCertificate = async (publicKey, callback = () => {}) => {
  let certificate = await SEA.certify(
    [publicKey],
    [{ "*": "friends" }],
    await gun.user().pair(),
    null,
  );

  gun
    .user()
    .get("certificates")
    .get("addFriend")
    .get(publicKey)
    .put(certificate, ({ err }) => {
      if (err) return callback({ errMessage: err, errCode: "gun-put-error" });
      else
        return callback({
          errMessage: undefined,
          errCode: undefined,
          certificate,
          success:
            "Generated certificate for requested friend to add user back.",
        });
    });
};

export { generateFriendRequestsCertificate, generateAddFriendCertificate };

