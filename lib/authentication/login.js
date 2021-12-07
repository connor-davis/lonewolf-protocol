import { user } from "../..";

/**
 * This function will authenticate a user who has registered.
 *
 * @param {Object} credentials The users authentication credentials that they used when registering.
 * @param credentials.username
 * @param credentials.password
 *
 * @param {Function} callback The callback function returns error messages or a success message.
 */
let loginUser = (credentials = {}, callback = () => {}) => {
  user.auth(credentials.username, credentials.password, ({ err, pub }) => {
    if (err) return callback({ errMessage: err, errCode: "gun-auth-error" });
    else
      return callback({
        errMessage: undefined,
        errCode: undefined,
        pub,
        message: "Successfully authenticated user.",
      });
  });
};

export default loginUser;
