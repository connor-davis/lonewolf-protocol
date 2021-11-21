import Gun from 'gun/gun';
import "gun/sea";

let gun = new Gun({ peers: [], axe: false });

let user = gun.user().recall({ sessionStorage: true });

export { gun, user };