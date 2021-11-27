import { gun } from "../..";
import { checkAuth, isAuthenticated } from "./isAuthenticated";
import loginUser from "./login";
import registerUser from "./register";

let logout = () => {
  gun.user().leave();

  isAuthenticated.next(false);
};

export { checkAuth, isAuthenticated, loginUser, registerUser, logout };

