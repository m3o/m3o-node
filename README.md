# M3O Node Client

The node client for the M3O Platform

## Usage

Installation:
```
npm install --save @m3o/m3o-node
```

## Request
Assuming you have the helloworld service running locally (do `micro run github.com/micro/examples/helloworld`):

```js
const m3o = require('@m3o/m3o-node');

new m3o.Client({ token: 'INSERT_YOUR_YOUR_M3O_TOKEN_HERE' })
  .call('helloworld', 'call', {"name": "John"})
  .then((response) => {
    console.log(response);
  });
```

The output will be:
```
{ msg: 'Hello John' }
```

## Streaming

```js
const client = require("@m3o/m3o-node")

new client.Client({ token: 'INSERT_YOUR_YOUR_M3O_TOKEN_HERE' })
  .stream("helloworld", "stream", {"name": "John", "messages": 10})
  .then(stream => {
	stream.recv(msg => {
		console.log("message received: ", msg)
	})
}).catch(e => {
	console.log(e)
})

setInterval(() => {}, 5000);

```

Above example will output:

```
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
message received:  { message: 'Hello John' }
```
