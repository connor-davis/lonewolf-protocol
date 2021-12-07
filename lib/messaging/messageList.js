import { Observable } from "rxjs";
import { gun } from "../..";

let messageList = (roomId) =>
  new Observable((subscriber) => {
    gun
      .user()
      .get("messages")
      .get(roomId)
      .map((message, key) => {
        if (message) {
          try {
            let messageInfo = JSON.parse(message);

            subscriber.next(messageInfo);
          } catch (err) {
            subscriber.next(undefined);
          }
        } else {
          subscriber.next(undefined);
        }
      });
  });

export default messageList;
