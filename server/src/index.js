import { Server } from "hapi";
import { green } from "chalk";
import routes from "./routes";
import inert from "inert";

const server = new Server();
server.connection({
  port: 3000,
  routes: {
    cors: true
  }
});

server
  .register(inert)
  .then(() => {
    server.route(routes);
    return server.start();
  })
  .then(() => {
    console.log(green(`Server running at: ${server.info.uri}`));
  })
  .catch(err => {
    console.error(err.stack);
  });
