import * as request from 'request-promise-native';
import * as WebSocket from 'ws';
import * as url from 'url';

const defaultLocal = 'http://localhost:8080/client';
const defaultLive = 'https://api.micro.mu/client';

export interface Options {
  token?: string;
  // Address of the micro platform.
  // By default it connects to live. Change it or use the local flag
  // to connect to your local installation.
  address?: string;
  // Helper flag to help users connect to the default local address
  local?: boolean;
}

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
    return new Promise<void>(async (resolve, reject) => {
      this.conn.send(marshalRequest(this.service, this.endpoint, msg));
    });
  }

  // this probably should use observables or something more modern
  recv(cb: (msg: any) => void) {
    this.conn.on('message', (m: string) => {
      cb(unmarshalResponse(m));
    });
  }
}

export class Client {
  public options: Options = {
    address: defaultLive,
  };

  constructor(options?: Options) {
    this.options = {
      address: defaultLive,
    };
    if (options && options.token) {
      this.options.token = options.token;
    }
    if (options && options.local) {
      this.options.address = defaultLocal;
      this.options.local = true;
    }
  }

  // Call enables you to access any endpoint of any service on Micro
  call<R>(service: string, endpoint: string, req?: any): Promise<R> {
    return new Promise<R>(async (resolve, reject) => {
      try {
        // example curl: curl -XPOST -d '{"service": "go.micro.srv.greeter", "endpoint": "Say.Hello"}'
        //  -H 'Content-Type: application/json' http://localhost:8080/client {"body":"eyJtc2ciOiJIZWxsbyAifQ=="}
        if (!req) {
          req = {};
        }
        var options: request.RequestPromiseOptions = {
          method: 'POST',
          json: true,
          headers: {
            authorization: 'Bearer ' + this.options.token,
          },
          body: JSON.stringify(req),
        };
        (options as any).uri =
          this.options.address + '/v1/' + service + '/' + endpoint;

        const response: R = await request.post(
          this.options.address as string,
          options
        );
        resolve(response);
      } catch (e) {
        reject(e);
      }
    });
  }

  stream(service: string, endpoint: string, msg?: any): Promise<Stream> {
    return new Promise<Stream>((resolve, reject) => {
      try {
        const uri = url.parse(this.options.address as string);

        // TODO: make optional
        uri.path = '/client/stream';
        uri.pathname = '/client/stream';

        uri.protocol = (uri.protocol as string).replace('http', 'ws');

        const conn = new WebSocket(url.format(uri), {
          //perMessageDeflate: false
        });

        const data = marshalRequest(service, endpoint, msg);
        conn.on('open', function open() {
          conn.send(data);
          const stream = new Stream(conn, service, endpoint);
          resolve(stream);
          conn.on;
        });
        conn.on('close', function close(e, reason) {});
        conn.on('error', function err(e) {});
      } catch (e) {
        reject(e);
      }
    });
  }
}

function marshalRequest(service: string, endpoint: string, v: any): string {
  const jsonBody = JSON.stringify(v);
  return JSON.stringify({
    service: service,
    endpoint: endpoint,
    body: Buffer.from(jsonBody).toString('base64'),
  });
}

function unmarshalResponse(msg: string): any {
  const rsp: ClientResponse = JSON.parse(msg);
  return Buffer.from(rsp.body, 'base64').toString();
}
