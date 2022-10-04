# Automerge Encryption Demo
This project is a demo/proof of concept of using [Automerge](https://automerge.org) with client-side encryption.

It includes:
- Using Automerge on a client (React app) to make changes to a document.
- Using a [broadcast channel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) to sync those changes between windows & tabs on the same device.
- Using websockets ([socket.io](https://socket.io/)) to sync those changes to a server to be backed up and broadcast to other clients.
- Using client-side encryption so that the server has no knowledge of the data that clients are sharing.

It doesn't include:
- Any sort of server persistence, changes are just stored in memory right now
- Proper client side persistence. Right now it just saves to local storage, in reality you probably want to use IndexDB for a web app.
- Any sort of multi-user support or authentication system
- Any validation or proper error handling on the client or server 

More background info, installation & usage information, improvements etc to come...
