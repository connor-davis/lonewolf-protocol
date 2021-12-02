import { Observable } from "rxjs";
import { gun } from "../..";

let friendRequests = new Observable((subscriber) => {
  gun
    .user()
    .get("friendRequests")
    .map(
      (publicKey, key) => {
        if (publicKey) {
          gun.user(publicKey).once((_user) => {
            if (_user && _user.info && _user.pub && _user.alias) {
              gun.get(_user.info["#"]).on((data) => {
                subscriber.next({
                  key,
                  pub: _user.pub,
                  alias: _user.alias,
                  displayName: data.displayName,
                  about: data.about || undefined,
                });
              });
            } else if (_user && _user.pub && _user.alias) {
              subscriber.next({
                key,
                pub: _user.pub,
                alias: _user.alias,
              });
            }
          });
        } else {
          subscriber.next(undefined);
        }
      }
    );
});

export default friendRequests;
