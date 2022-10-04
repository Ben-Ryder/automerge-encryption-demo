import express from 'express';
import {Express, Request, Response} from "express";
import {Server} from "socket.io";
import * as http from "http";
import cors from "cors";

const port = process.env.PORT || 3000;

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());

/**
 * Changes consist of two things:
 * - a unique ID used to identify changes across devices and the server for syncing
 * - a data string contains the Automerge change encrypted client side
 *
 * In this proof on concept changes are stored in memory and are only persisted while the server runs.
 * In a real implementation you could persist this to some kind of database, the file system etc.
 */
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
  return res.send("Welcome to the Automerge encryption poc server")
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
    return res.send(changesToSend);
  }
  else {
    console.log("[server]: request - sending all changes to client");
    return res.send(changes);
  }
});

/**
 * /changes/ids [GET]
 * This endpoint can be used to fetch all change ids.
 */
app.get('/changes/ids', (req: Request, res: Response) => {
  console.log("[server]: request - sending all ids to client");
  return res.send(changes.map(change => change.id));
});

app.use((req, res, next) =>{
  return res.status(404).send("Route not found")
});

io.on('connection', (socket) => {
  console.log('[server]: socket - client connection to socket');

  /**
   * 'change' event
   * This event can be used to broadcast/receive a single change event
   */
  socket.on("change", (change) => {
    const changeIds = changes.map(c => c.id);
    if (!changeIds.includes(change.id)) {
      console.log(`[server]: socket - received new change from client: ${change.id}. saving to server and broadcasting out`);

      // Emit change to any other clients connected
      socket.broadcast.emit("change", change);

      // Save changes to the server
      changes.push(change);
    }
    else {
      console.log(`[server]: socket - received existing change from client: ${change.id}`);
    }
  })

  /**
   * 'changes' event
   * This event can be used to broadcast/receive multiple change events
   */
  socket.on("changes", (receivedChanges: Change[]) => {
    console.log(`[server]: socket - received changes from client: [${receivedChanges.map(c => c.id).join(",")}]`);

    for (const change of receivedChanges) {
      const changeIds = changes.map(c => c.id);
      if (!changeIds.includes(change.id)) {
        console.log(`[server]: socket - received new change from client: ${change.id}`);

        // Emit change to any other clients connected
        socket.broadcast.emit("change", change);

        // Save changes to the server
        changes.push(change);
      }
      else {
        console.log(`[server]: socket - received existing change from client: ${change.id}`);
      }
    }
  })

  socket.on("disconnect", () => {
    console.log("[server]: socket - client disconnected");
  })
});

server.listen(port, () => {
  console.log(`[server] server started on http://localhost:${port}`);
});
