import express from 'express';
import {Express, Request, Response} from "express";
import {Server} from "socket.io";
import * as http from "http";

const port = process.env.PORT || 3000;

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server);

interface Change {
  id: string,
  change: string
}
const changes: Change[] = [];

/**
 * / [GET]
 * Just a home route.
 */
app.get('/', (req: Request, res: Response) => {
  res.send("Welcome to the Automerge encryption poc server")
})

/**
 * /changes [GET]
 * This endpoint can be used to fetch changes.
 * It returns all changes by default, passing the ids query param list lets you fetch only certain changes.
 */
app.get('/changes', (req: Request, res: Response) => {
  const changeIds = req.params.ids;

  if (Array.isArray(changeIds) && changeIds.length > 0) {
    const changesToSend = changes.filter(change => changeIds.includes(change.id));
    console.log(`[server]: request - sending changes to client: [${changesToSend.join(",")}]`);
    res.send(changesToSend);
  }
  else {
    console.log("[server]: request - sending all changes to client");
    res.send(changes);
  }
});

/**
 * /changes [POST]
 * This endpoint can be used to add new changes.
 * This is useful when reconnecting and syncing multiple changes quickly
 * rather than emitting them all separately via the websocket.
 */
app.post('/changes', (req: Request, res: Response) => {
  console.log("[server]: request - adding change from client");
  changes.push(req.body);
  res.send();
});

/**
 * /changes/ids [GET]
 * This endpoint can be used to fetch all change ids.
 */
app.get('/changes/ids', (req: Request, res: Response) => {
  console.log("[server]: request - sending all ids to client");
  res.send(changes.map(change => change.id));
});


io.on('connection', (socket) => {
  console.log('[server]: socket - client connected to socket');

  /**
   * 'change' event
   * This endpoint can be used to fetch all change ids.
   */
  socket.on("change", (change) => {
    if (!changes.includes(change.id)) {
      console.log(`[server]: socket - received new change from client: ${change.id}`);

      // Emit change to any other clients connected
      socket.emit("change", change);

      // Save changes to the server
      changes.push(change);
    }
    else {
      console.log(`[server]: socket - received existing change from client: ${change.id}`);
    }
  })

  socket.on("disconnect", () => {
    console.log("[server]: socket - client disconnected");
  })
});

server.listen(port, () => {
  console.log(`[server] server started on http://localhost:${port}`);
});
