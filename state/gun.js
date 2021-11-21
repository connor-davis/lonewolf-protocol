import Gun from 'gun/gun';
import "gun/sea";

let gun = new Gun({ peers: ['http://localhost:8765/gun'], axe: false, localStorage: true });

let user = gun.user().recall({ sessionStorage: true });

export { gun, user };