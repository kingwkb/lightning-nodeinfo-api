require('dotenv').config()
const lnService = require('ln-service');
const {getNode} = require('ln-service');
const {addPeer} = require('ln-service');
const fastify = require('fastify')({
    logger: true
  })

const {lnd} = lnService.authenticatedLndGrpc({
  cert: process.env.LND_CERT,
  macaroon: process.env.LND_MACAROON,
  socket: process.env.LND_SOCKET,
});


fastify.get('/nodeinfo', async function (request, reply) {
    try {
        const info = getNodeInfo(request.query['uri'])
    } catch (err) {
        return err;
    }
    return info;
})


const start = async () => {
    try {
        await fastify.listen(process.env.HTTP_PORT, process.env.HTTP_ADDR)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()

async function getNodeInfo(uri) {
	const uriArr = uri.split('@');
    if (uriArr.length == 2) {
        await addPeer({lnd, public_key: uriArr[0], socket: uriArr[1]});
    }
    
    return getNode({lnd, public_key: uriArr[0]})
}