// npm init
// npm install --save express
// npm install --save mongoose
// npm install --save multer
// npm install bcrypt --save
// npm install jsonwebtoken --save
// npm install request --save
// npm install express-session --save
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
