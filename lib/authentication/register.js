import { gun, user } from "../..";

/**
 * This function will check to see if the email is already in use.
 *
 * @param {string} username
 * @returns Promise<boolean>
 */
let checkUsernameInUse = async (username) => {
  let user = await gun.get(`~@${username}`);

  return user !== undefined;
};

/**
 * This function will create a user.
 *
 * @param {Object} credentials The users authentication credentials that they want to use when logging in.
 * @param credentials.username
 * @param credentials.password
 *
 * @param {Function} callback The callback function returns error messages or a success message.
 */
let registerUser = (credentials = {}, callback = () => {}) => {
  (async () => {
    if (await checkUsernameInUse(credentials.username))
      return callback({
        errMessage: "Username in use.",
        errCode: "username-inuse",
      });
    else {
      user.create(credentials.username, credentials.password, ({ err, pub }) => {
        if (err)
          return callback({ errMessage: err, errCode: "gun-auth-error" });
        else
          return callback({
            errMessage: undefined,
            errCode: undefined,
            pub,
            message: "Successfully created user.",
          });
      });
    }
  })();
};

function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export default registerUser;
