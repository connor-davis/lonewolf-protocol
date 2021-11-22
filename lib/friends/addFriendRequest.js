import { gun } from "../..";

let addFriendRequest = async (publicKey, callback = () => {}) => {
  let addFriendRequestCertificate = await gun
    .user(publicKey)
    .get("certificates")
    .get("friendRequests");

  console.log(addFriendRequestCertificate);
};

export default addFriendRequest;
