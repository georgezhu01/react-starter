import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import express from 'express';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
// noinspection JSUnresolvedVariable
import { createIsomorphicWebpack } from 'isomorphic-webpack';
import ReactDOMServer from 'react-dom/server';
import jsforceProxy from 'jsforce-ajax-proxy';
import cookie from 'cookie';

import webpackConfig from '../webpack/config.babel';
import config from '../config';

const compiler = webpack(webpackConfig);

// Overrides Node.js module resolution system, all require() calls
// in webpack bundle will be handled by isomorphic-webpack
const {
  evalBundleCode,
} = createIsomorphicWebpack(webpackConfig, {
  nodeExternalsWhitelist: [
    /^react-router/,
    /^history/
  ]
});

// Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const https = require('https');

const privateKey = fs.readFileSync(`${config.sslDir}/server.key`, 'utf8');
const certificate = fs.readFileSync(`${config.sslDir}/server.crt`, 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use(compression());
app.use(hpp());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(process.cwd(), '/public/favicon.ico')));

// noinspection JSUnresolvedVariable
if (__DEV__) {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    serverSideRender: true,
    hot: true
  }));
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use(express.static('public'));
}

const assetPath = webpackConfig.output.publicPath;
const bundleStyleSheetLink = __DEV__ ? '' : `<link rel="stylesheet" href="${assetPath}styles/main.css"/>`;

const renderFullPage = (body, initialState) => {
  return `
  <!doctype html>
  <html>
    <head>
      ${bundleStyleSheetLink}
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"></link>
    </head>
    <body>
      <div id='app'>${body}</div>
      <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
      <script src='${assetPath}main.js'></script>
    </body>
  </html>
  `;
};

app.all('/proxy/?*', jsforceProxy());

app.get('*', (req, res) => {
  const initialState = {};
  const cookies = cookie.parse(req.headers.cookie || '');
  if (cookies && cookies.auth) {
    try {
      initialState.user = { auth: JSON.parse(cookies.auth) };
    } catch (e) {
      console.error(e);
    }
  }
  const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const myApp = ReactDOMServer.renderToString(evalBundleCode(requestUrl).default(initialState));
  res.status(200).send(renderFullPage(myApp, initialState));
});

https.createServer(credentials, app).listen(config.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    // noinspection JSUnresolvedVariable, JSUnresolvedFunction
    console.info(chalk.green.bold.underline(`\nExpress server listening on port ${config.port}...`));
  }
});

