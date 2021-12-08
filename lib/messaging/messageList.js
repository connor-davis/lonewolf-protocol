import { Observable } from "rxjs";
import { gun } from "../..";

let messageList = (roomId, pub) =>
  new Observable(async (subscriber) => {
    let userPair = await gun.user()._.sea;
    let friend = await gun.user(pub);

    gun
      .user()
      .get("messages")
      .get(roomId)
      .once((messages) => {
        (async () => {
          let initial = [];

          for (let key in messages) {
            let message = messages[key].toString();

            let decryptSecretFriend = await SEA.secret(friend.epub, userPair);
            let decryptedMessageFriend = await SEA.decrypt(
              message,
              decryptSecretFriend
            );

            if (decryptedMessageFriend) {
              let individual = {
                ...decryptedMessageFriend,
                encrypted: true,
              };

              let exists =
                initial.filter((current) => current.id === individual.id)[0] !==
                undefined;

              console.log(exists);

              if (!exists) initial.push(individual);
            }
          }

          subscriber.next({ initial, individual: undefined });

          gun
            .user()
            .get("messages")
            .get(roomId)
            .map()
            .once(async (message) => {
              if (message.toString().startsWith("SEA")) {
                let decryptSecretFriend = await SEA.secret(
                  friend.epub,
                  userPair
                );
                let decryptedMessageFriend = await SEA.decrypt(
                  message,
                  decryptSecretFriend
                );

                if (decryptedMessageFriend) {
                  let individual = {
                    ...decryptedMessageFriend,
                    encrypted: true,
                  };

                  let exists =
                    initial.filter(
                      (current) => current.id === individual.id
                    )[0] !== undefined;

                  if (!exists)
                    return subscriber.next({
                      initial: undefined,
                      individual,
                    });
                }
              }
            });
        })();
      });
  });

export default messageList;
