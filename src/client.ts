import WebSocket from 'ws';
import * as axios from 'axios';
import * as url from 'url';
import {Stream} from './stream';

const defaultPrefix = 'v1/';
const defaultLocal = 'http://localhost:8080/';
const defaultLive = 'https://api.m3o.com/';

export interface Options {
  token?: string;
  // Address of the micro platform.
  // By default it connects to live. Change it or use the local flag
  // to connect to your local installation.
  address?: string;
  // Helper flag to set the url prefix of the server
  prefix?: string;
  // Helper flag to help users connect to the default local address
  local?: boolean;
}

/**
 *
 */
export interface ClientOptions {
  token?: string;
  address: string;
  prefix: string;
  local: boolean;
}

export class Client {
  public options: ClientOptions = {
    address: defaultLive,
    prefix: defaultPrefix,
    local: false,
  };

  constructor(options?: Options) {
    if (options) {
      if (options.token) {
        this.options.token = options.token;
      }
      if (options.local) {
        this.options.local = true;
        this.options.address = defaultLocal;
      }
      if (options.address) {
        this.options.address = options.address;
      }
      if (typeof options.prefix == 'string') {
        this.options.prefix = options.prefix;
      }
    }
  }

  // Call enables you to access any endpoint of any service on Micro
  call<Request, Response>(
    service: string,
    endpoint: string,
    req?: Request,
  ): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      try {
        // example curl: curl -XPOST -d '{"service": "go.micro.srv.greeter", "endpoint": "Say.Hello"}'
        //  -H 'Content-Type: application/json' http://localhost:8080/client {"body":"eyJtc2ciOiJIZWxsbyAifQ=="}
        if (req === undefined || req === null) {
          req = {} as Request;
        }

        const headers: any = {};

        if (this.options.token) {
          headers['authorization'] = 'Bearer ' + this.options.token;
        }

        const options: axios.AxiosRequestConfig = {
          method: 'post',
          //json: true,
          responseType: 'json',
          headers: headers,
          data: req,
          url:
            this.options.address +
            this.options.prefix +
            service +
            '/' +
            endpoint,
        };

        return axios
          .default(options)
          .then(res => {
            resolve(res.data);
          })
          .catch(error => {
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

  stream<Request, Response>(
    service: string,
    endpoint: string,
    msg?: Request,
  ): Promise<Stream<Request, Response>> {
    return new Promise<Stream<Request, Response>>((resolve, reject) => {
      try {
        const uri = url.parse(this.options.address as string);

        // TODO: make optional
        uri.path = '/' + this.options.prefix + service + '/' + endpoint;
        uri.pathname = '/' + this.options.prefix + service + '/' + endpoint;

        uri.protocol = (uri.protocol as string).replace('http', 'ws');

        const conn = new WebSocket(url.format(uri), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.options.token,
          },
        });

        conn.on('open', function open() {
          conn.send(JSON.stringify(msg));
          const stream = new Stream<Request, Response>(conn, service, endpoint);
          resolve(stream);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
