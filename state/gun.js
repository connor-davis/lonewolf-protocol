import Gun from "gun/gun";
import "gun/sea";

let DEV_MODE = import.meta.env.DEV;

let gun = new Gun({
  peers: [
    DEV_MODE
      ? "http://localhost:8765/gun"
      : "https://lonewolf-relay.herokuapp.com/gun",
  ],
  axe: false,
});

let user = gun.user().recall({ sessionStorage: true });

export { gun, user };
