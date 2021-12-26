import Gun from "gun/gun";
import "gun/lib/radisk";
import "gun/lib/radix";
import "gun/lib/rindexed";
import "gun/lib/store";
import "gun/sea";

let DEV_MODE = import.meta.env.DEV;

let gun = new Gun({
  peers: DEV_MODE
    ? ["http://localhost:8765/gun"]
    : ["https://lone-wolf.software/gun", "https://relay.polaris.industries/gun"],
  axe: false,
  localStorage: false,
  radisk: true,
});

let user = gun.user().recall({ sessionStorage: true });

export { gun, user };
