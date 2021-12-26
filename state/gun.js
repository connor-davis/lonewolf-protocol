import Gun from "gun/gun";
import "gun/sea";
import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/store";
import "gun/lib/rindexed";

let DEV_MODE = import.meta.env.DEV;

let gun = new Gun({
  peers: [
    DEV_MODE ? ["http://localhost:8765/gun"] : "https://lone-wolf.software/gun",
  ],
  axe: false,
  localStorage: false,
  radisk: true,
});

gun.opt({ peers: ["https://relay.polaris.industries/gun"] });

let user = gun.user().recall({ sessionStorage: true });

export { gun, user };
