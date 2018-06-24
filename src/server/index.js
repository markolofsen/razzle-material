import express from 'express';
const server = express();
import { handleRender } from './universalRender';

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    handleRender(req, res);
  });

export default server;