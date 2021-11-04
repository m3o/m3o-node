import WebSocket from 'ws';

export class Stream<Request, Response> {
  conn: WebSocket;
  service: string;
  endpoint: string;

  constructor(conn: WebSocket, service: string, endpoint: string) {
    this.conn = conn;
    this.service = service;
    this.endpoint = endpoint;
  }

  send(msg: Request): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.conn.send(msg, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  // DEPRECATED!
  // Receive messages. same as onError and only here for backwards compatibility
  recv(cb: (msg: Response) => void): void {
    this.onMessage(cb);
  }

  // Register a callback to receive messages
  onMessage(cb: (msg: Response) => void): void {
    this.conn.on('message', (m: string) => {
      cb(JSON.parse(m));
    });
  }

  // Register a callback for errors
  onError(errCb: (err: Error) => void): void {
    this.conn.on('error', function err(e) {
      errCb(e);
    });
  }

  // Register a callback for when the stream is closed
  onClose(closeCb: (err: Error) => void): void {
    this.conn.on('close', function close(e, reason) {
      closeCb(new Error('closed with error ' + reason));
    });
  }
}

// function marshalRequest(service: string, endpoint: string, v: any): string {
//   const jsonBody = JSON.stringify(v);
//   return JSON.stringify({
//     service: service,
//     endpoint: endpoint,
//     body: Buffer.from(jsonBody).toString('base64'),
//   });
// }

// function unmarshalResponse(msg: string): any {
//   const rsp: ClientResponse = JSON.parse(msg);
//   return Buffer.from(rsp.body, 'base64').toString();
// }
