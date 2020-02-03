const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const path = require('path');
const cookieParser = require('cookie-parser');
const multipart = require('connect-multiparty');
const atob = require('atob')
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require('./webpack.config');
const uuid = require('uuid/v1');

const app = express();
const compiler = webpack(WebpackConfig);

require('./server2')

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler));

app.use(express.static(__dirname, {
  setHeaders(res) {
    res.cookie('XSRF-TOKEN-D', uuid())
  }
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser())

app.use(multipart({
  uploadDir: path.resolve(__dirname, 'upload-file')
}))

const router = express.Router();

router.get('/simple/get', function (req, res) {
  res.json({
    msg: 'Request Received!'
  })
})

router.get('/base/get', function (req, res) {
  return res.json(req.query);
})

router.post('/base/post', function (req, res) {
  res.json(req.body);
})

router.post('/base/buffer', function (req, res) {
  let msg = [];
  req.on('data', chunk => {
    if (chunk) {
      msg.push(chunk);
    }
  })

  req.on('end', () => {
    let buffer = Buffer.concat(msg);
    res.json(buffer.toJSON());
  })
})

router.get('/error/get', (req, res) => {
  if (Math.random() > 0.5) {
    res.json({
      msg: 'hello world'
    });
  } else {
    res.status(500);
    res.end();
  }
});

router.get('/error/timeout', (req, res) => {
  setTimeout(() => {
    res.json({
      msg: 'hello world'
    });
  }, 3000);
});

router.get('/extend/get', (req, res) => {
  res.json(req.body)
});
router.delete('/extend/delete', (req, res) => {
  res.json(req.body)
});
router.head('/extend/head', (req, res) => {
  res.json({})
});
router.options('/extend/options', (req, res) => {
  res.json(req.body)
});
router.post('/extend/post', (req, res) => {
  res.json(req.body);
});
router.put('/extend/put', (req, res) => {
  res.json(req.body);
});
router.patch('/extend/patch', (req, res) => {
  res.json(req.body);
});

router.get('/interceptor/get', (req, res) => {
  res.send('hello');
});

router.post('/config/post', (req, res) => {
  res.json(req.body);
})

router.get('/cancel/get', function (req, res) {
  setTimeout(() => {
    res.json('hello')
  }, 1000)
})

router.get('/cancel/post', function (req, res) {
  setTimeout(() => {
    res.json(req.body)
  }, 1000)
})

router.get('/more/get', function (req, res) {
  res.json(req.cookies);
})

router.post('/more/upload', function (req, res) {
  res.json({
    msg: 'Upload Success!'
  })
})

router.post('/more/post', function (req, res) {
  const auth = req.headers.authorization
  const [type, credentials] = auth.split(' ')
  const [username, password] = atob(credentials).split(':')
  console.log(type)
  console.log(username)
  console.log(password)
  if (type === 'Basic' && username === 'Jay' && password === '123456') {
    res.json(req.body)
  } else {
    res.status(401)
    res.json({
      msg: 'UnAuthorization'
    })
  }
})

router.get('/more/304', function(req, res) {
  res.status(304)
  res.json({msg : 'success'})
})

app.use(router);

const port = process.env.PORT || 8000;
module.export = app.listen(port, function () {
  console.log(`Server running on http:localhost:${port}`);
})
