const { createServer } = require("@remix-run/server");
const { Server } = require("http");

const port = process.env.PORT || 3000;

createServer({
  appDirectory: __dirname,
  port,
}).then((server) => {
  console.log(`Server listening on port ${port}`);
  server.listen(port);
});
