import { gun, user } from "../..";

let acceptFriendRequest = ({ key, publicKey }, callback = () => {}) => {
  gun
    .user()
    .get("friendRequests")
    .get(key)
    .put(null, async ({ err }) => {
      if (err)
        return callback({
          errMessage: err,
          errCode: "accept-friend-request-failed",
          success: undefined,
        });
      else {
        let addFriendCertificate = await gun
          .user(publicKey)
          .get("certificates")
          .get(user.is.pub)
          .get("addFriend");

        gun
          .user(publicKey)
          .get("friends")
          .set(
            user.is.pub,
            ({ err }) => {
              if (err)
                return callback({
                  errMessage: err,
                  errCode: "add-friend-failed",
                  success: undefined,
                });
              else
                gun
                  .user()
                  .get("friends")
                  .set(publicKey, ({ err }) => {
                    if (err)
                      return callback({
                        errMessage: err,
                        errCode: "add-friend-failed",
                        success: undefined,
                      });
                    else
                      return callback({
                        errMessage: undefined,
                        errCode: undefined,
                        success: "Added friend successfully.",
                      });
                  });
            },
            {
              opt: { cert: addFriendCertificate },
            }
          );
      }
    });
};

export default acceptFriendRequest;
