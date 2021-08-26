require('dotenv').config();

import * as express from 'express';
import * as http from 'http';

const app = express();
const server = http.createServer(app);

const user = User();

app.use(express.json());

// User routes
app.post(
  '/user/login',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const response = await user.login(req.body);
      res.send(response);
    } catch (e) {
      res.statusCode = e.Code;
      res.send(e);
    }
  },
);

server.listen(3001, () => {
  console.log('running...');
});
