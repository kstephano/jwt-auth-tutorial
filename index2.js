const server = require('./authServer');
const port = process.env.port || 4000;

server.listen(port, () => console.log(`Express just departed from http://localhost:${port}!`));