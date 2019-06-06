const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const bookRouter = require('./routes/bookRouter');
const mapRouter = require('./routes/mapRouter');
const pageRouter = require('./routes/pageRouter');
const permissionRouter = require('./routes/permissionRouter');
const reviewRouter = require('./routes/reviewRouter');
const sectionRouter = require('./routes/sectionRouter');
const userRouter = require('./routes/userRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(bodyParser.json());

app.use('/books', bookRouter);
app.use('/maps', mapRouter);
app.use('/pages', pageRouter);
app.use('/permissions', permissionRouter);
app.use('/reviews', reviewRouter);
app.use('/sections', sectionRouter);
app.use('/users', userRouter);

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>Welcome to The Writers Net API</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});