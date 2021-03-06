import * as request from 'request-promise-native';
import * as WebSocket from 'ws';
import * as axios from 'axios';
import * as url from 'url';

const defaultLocal = 'http://localhost:8080/';
const defaultLive = 'https://api.m3o.com/';

export interface ClientRequest {
  // eg. "go.micro.srv.greeter"
  service: string;
  // eg. "Say.Hello"
  endpoint: string;
  // json and then base64 encoded body
  body: string;
}

export interface ClientResponse {
  // json and base64 encoded response body
  body: string;
}

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
    return new Promise<R>((resolve, reject) => {
      try {
        // example curl: curl -XPOST -d '{"service": "go.micro.srv.greeter", "endpoint": "Say.Hello"}'
        //  -H 'Content-Type: application/json' http://localhost:8080/client {"body":"eyJtc2ciOiJIZWxsbyAifQ=="}
        if (req === undefined || req === null) {
          req = {};
        }
        let headers: any = {};

        if (this.options.token) {
          headers['authorization'] = 'Bearer ' + this.options.token;
        }
        var options: axios.AxiosRequestConfig = {
          method: 'post',
          //json: true,
          responseType: 'json',
          headers: headers,
          data: req,
          url: this.options.address + 'v1/' + service + '/' + endpoint,
        };
 
        return axios
          .default(options)
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            if (error.response) {
              reject(error.response.data);
              return;
            }
            reject(error);
          });
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
        uri.path = '/v1/' + service + '/' + endpoint;
        uri.pathname = '/v1/' + service + '/' + endpoint;

        uri.protocol = (uri.protocol as string).replace('http', 'ws');

        const conn = new WebSocket(url.format(uri), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.options.token,
            },
        });

        conn.on('open', function open() {
          conn.send(JSON.stringify(msg));
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
