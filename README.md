Micro Node Client
===

This package can be used to call any service on Micro.

Please also check the typesafe autogenerated APIs for your Micro services, you might find them more pleasant to use.

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

You can also connect to your local micro installation:

```js
new Client({local: true})
```

If you want to change the address, assuming you run the [client api](https://github.com/micro/services/tree/master/client):


```js
new Client({address: "https://api.mydomain.com/client"})
```

@TODO streaming is broken right now

## Streaming

```js
const client = require("@microhq/node-client")

new client.Client().stream("go.micro.srv.asim", "Asim.Stream", {"count": 10}).then(stream => {
	stream.recv(msg => {
		console.log("message received: ", msg)
	})
}).catch(e => {
	console.log(e)
})

setInterval(() => {}, 5000);

```

Above example will output:

```shell
message received:  {}
message received:  {"count":"1"}
message received:  {"count":"2"}
message received:  {"count":"3"}
message received:  {"count":"4"}
message received:  {"count":"5"}
message received:  {"count":"6"}
message received:  {"count":"7"}
message received:  {"count":"8"}
message received:  {"count":"9"}
```
