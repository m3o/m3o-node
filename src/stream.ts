import WebSocket from 'ws';

export class Stream {
  conn: WebSocket;
  service: string;
  endpoint: string;

  constructor(conn: WebSocket, service: string, endpoint: string) {
    this.conn = conn;
    this.service = service;
    this.endpoint = endpoint;
  }

  send(msg: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.conn.send(msg);
    });
  }

  // this probably should use observables or something more modern
  recv(cb: (msg: any) => void) {
    this.conn.on('message', (m: string) => {
      cb(JSON.parse(m));
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
