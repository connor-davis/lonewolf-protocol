import Gun from 'gun/gun';
import "gun/sea";

let gun = new Gun({ peers: ['https://lonewolf-relay.herokuapp.com/gun'], axe: false, localStorage: true });

let user = gun.user().recall({ sessionStorage: true });

export { gun, user };