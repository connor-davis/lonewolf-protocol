import { Observable } from "rxjs";
import { gun } from "../..";

let messageList = (roomId, pub) =>
  new Observable((subscriber) => {
    gun
      .user()
      .get("messages")
      .get(roomId)
      .on(async (messages, _) => {
        let userPair = await gun.user()._.sea;
        let friend = await gun.user(pub);

        let messagesList = [];

        for (let key in messages) {
          let message = messages[key].toString();

          if (message.startsWith("SEA")) {
            let decryptSecretFriend = await SEA.secret(friend.epub, userPair);
            let decryptedMessageFriend = await SEA.decrypt(
              message,
              decryptSecretFriend
            );

            if (decryptedMessageFriend) {
              messagesList.push({...decryptedMessageFriend, encrypted: true });
            }
          } else {
            try {
              messagesList.push({...JSON.parse(message), encrypted: false });
            } catch (err) {}
          }
        }

        subscriber.next(
          messagesList.filter((message) => message !== undefined)
        );
      });
  });

export default messageList;
