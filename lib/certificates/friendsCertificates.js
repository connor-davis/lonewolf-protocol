import { SEA } from "gun";
import { gun } from "../..";

let generateFriendRequestsCertificate = async (callback = () => {}) => {
  let certificateExists = await gun
    .user()
    .get("certificates")
    .get("friendRequests")
    .once();

  if (certificateExists) return;

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
      if (err)
        return callback({
          errMessage: err,
          errCode: "gun-put-error",
          success: undefined,
        });
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
  let certificateExists = await gun
    .user()
    .get("certificates")
    .get(publicKey)
    .get("addFriend")
    .once();

  if (certificateExists) return;

  let certificate = await SEA.certify(
    [publicKey],
    [{ "*": "friends" }],
    await gun.user().pair(),
    null
  );

  gun
    .user()
    .get("certificates")
    .get(publicKey)
    .get("addFriend")
    .put(certificate, ({ err }) => {
      if (err)
        return callback({
          errMessage: err,
          errCode: "gun-put-error",
          success: undefined,
        });
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

