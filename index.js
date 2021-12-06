const server = require('./server');
const port = process.env.port || 3000;

server.listen(port, () => console.log(`Express just departed from http://localhost:${port}!`));