import { Subject } from "rxjs";
import { gun, user } from "../../state/gun";

/**
 * This contains a subscribable function that will return a boolean of whether or not the user is authenticated or not.
 */
let isAuthenticated = new Subject();

/**
 * This function will check and see whether the user is authenticated or not.
 */
let checkAuth = () => {
  if (user.is) return isAuthenticated.next(true);
  else return isAuthenticated.next(false);
};

gun.on("auth", () => isAuthenticated.next(true));

export { isAuthenticated, checkAuth };

