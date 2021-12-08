import * as authentication from "./lib/authentication";
import * as certificates from "./lib/certificates";
import * as friends from "./lib/friends";
import * as messaging from "./lib/messaging";
import { gun, user } from "./state/gun";

console.log.bind(console);

export { authentication, certificates, friends, messaging, gun, user };

