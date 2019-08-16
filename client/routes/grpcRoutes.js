// requirements
const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')

// grpc client
const productProtoPath = path.join(__dirname, '..', '..', 'protos', 'product.proto');
const productProtoDefinition = protoLoader.loadSync(productProtoPath)
const productPackageDefinition = grpc.loadPackageDefinition(productProtoDefinition).product
const client = new productPackageDefinition.ProductService('localhost:50051', grpc.credentials.createInsecure())

// handlers

// curl http://127.0.0.1:3000/api/products
const listProducts = (req, res) => {
    client.listProducts({}, (err, result) => {
        res.json(result)
    })
}
// curl http://127.0.0.1:3000/api/products/{int}
const readProduct = (req, res) => {
    const payload = { id: parseInt(req.params.id) }

    client.readProduct(payload, (err, result) => {
        if (err) {
            res.json('That product does not exist')
        } else {
            res.json(result)
        }
    })
}
// curl -X POST -d '{"name":"lamp","price":8000}' \-H "Content-Type: application/json" http://127.0.0.1:3000/api/products
const createProduct = (req, res) => {
    const payload = { name: req.body.name, price: req.body.price }

    client.createProduct(payload, (err, result) => {
        res.json(result)
    })
}
// curl -X PUT -d '{"name":"penci", "price":"1000"}' -H "Content-Type: application/json" http://127.0.0.1:3000/api/products/1
const updateProduct = (req, res) => {
    const payload = { id: parseInt(req.params.id), name: req.body.name, price: req.body.price };
  
    client.updateProduct(payload, (err, result) => {
        if (err) {
        res.json('That product does not exist.');
        } else {
        res.json(result);
        }
    });
}
// curl -X DELETE http://127.0.0.1:3000/api/products/2
const deleteProduct = (req, res) => {
    const payload = { id: parseInt(req.params.id) }

    client.deleteProduct(payload, (err, result) => {
        if(err) {
            console.log(err)
            res.json('That product does not exist')
        } else {
            res.json(result)
        }
    })
}

module.exports = {
    listProducts,
    readProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
