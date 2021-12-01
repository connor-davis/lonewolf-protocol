import { Subject } from "rxjs";
import { gun } from "../..";

let friendRequests = new Subject();

let loadFriendRequests = () => {
  gun
    .user()
    .get("friendRequests")
    .map(async (publicKey) => {
      if (publicKey) {
        let _user = await gun.user(publicKey).once();

        if (_user && _user.info && _user.pub && _user.alias) {
          gun.get(_user.info["#"]).on((data) => {
            friendRequests.next({
              pub: _user.pub,
              alias: _user.alias,
              displayName: data.displayName,
              about: data.about || undefined,
            });
          });
        } else if (_user && _user.pub && _user.alias) {
          friendRequests.next({
            pub: _user.pub,
            alias: _user.alias,
          });
        }
      }
    });
};

export { friendRequests, loadFriendRequests };

