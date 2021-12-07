import { Observable } from "rxjs";
import { gun } from "../..";

let friendsList = new Observable((subscriber) => {
  gun
    .user()
    .get("chats")
    .map((chatDetails, key) => {
      if (chatDetails) {
        try {
          let details = JSON.parse(chatDetails);

          gun.user(details.pub).once((_user) => {
            if (_user && _user.info && _user.pub && _user.alias) {
              gun.get(_user.info["#"]).on((data) => {
                subscriber.next({
                  key,
                  roomId: details.roomId,
                  pub: _user.pub,
                  alias: _user.alias,
                  displayName: data.displayName,
                  latestMessage: details.latestMessage,
                });
              });
            } else if (_user && _user.pub && _user.alias) {
              subscriber.next({
                key,
                roomId: details.roomId,
                pub: _user.pub,
                alias: _user.alias,
                latestMessage: details.latestMessage,
              });
            }
          });
        } catch (err) {
          subscriber.next(undefined);
        }
      } else {
        subscriber.next(undefined);
      }
    });
});

export default friendsList;
