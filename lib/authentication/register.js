import { gun, user } from "../..";

/**
 * This function will check to see if the email is already in use.
 *
 * @param {string} email
 * @returns Promise<boolean>
 */
let checkEmailInUse = async (email) => {
  let user = await gun.get(`~@${email}`);

  return user !== undefined;
};

/**
 * This function will create a user.
 *
 * @param {Object} credentials The users authentication credentials that they want to use when logging in.
 * @param credentials.email
 * @param credentials.password
 *
 * @param {Function} callback The callback function returns error messages or a success message.
 */
let registerUser = async (credentials = {}, callback = () => {}) => {
  if (checkEmailInUse(credentials.email))
    return callback({
      errMessage: "Email address in use.",
      errCode: "email-address-inuse",
    });
  else {
    user.create(credentials.email, credentials.password, ({ err, pub }) => {
      if (err) return callback({ errMessage: err, errCode: "gun-auth-error" });
      else
        return callback({
          errMessage: undefined,
          errCode: undefined,
          pub,
          message: "Successfully created user.",
        });
    });
  }
};

export default registerUser;
