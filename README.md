# Automerge with client-side encryption
This repo is a proof of concept for using Automerge with client-side encryption.  

The application is a basic notes app with a React client application and node server.  
All data is encrypted client-side in the React app and the server acts as a dumb change
store and exposes a simple REST API for fetching and pushing changes as well as a websocket
connection which can be used to sync changes in real time.  
