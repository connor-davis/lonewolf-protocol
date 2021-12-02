import { gun } from "../..";

let rejectFriendRequest = (key, callback = () => {}) => {
  gun
    .user()
    .get("friendRequests")
    .get(key)
    .put(null, async ({ err }) => {
      if (err)
        return callback({
          errMessage: err,
          errCode: "reject-friend-request-failed",
          success: undefined,
        });
      else
        return callback({
          errMessage: undefined,
          errCode: undefined,
          success: "Friend request removed successfully.",
        });
    });
};

export default rejectFriendRequest;
