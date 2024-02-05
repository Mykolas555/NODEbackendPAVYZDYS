const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');
const data = fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8')
const products = JSON.parse(data)

//server

const hostname = 'localhost';
const port = '8888';

//templates

const main = fs.readFileSync(`${__dirname}/templates/main.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    switch(pathname){

        case '/':
            const cardsHtml = products.map(el=>replaceTemplate(card, el)).join('')
            const output = main.replace('{%PRODUCT_CARDS%}', cardsHtml)
            res.writeHead(200,{'Content-Type' : 'text/html'})
            res.end(output)
            break

        case'/product':
            res.writeHead(200,{'Content-Type' : 'text/html'})
            const outputProduct = replaceTemplate(product, products[query.id]);
            res.end(outputProduct)

        default:
            res.writeHead(404,{
                'Content-Type' : 'text/html'
            })
            res.end('<h1>Something went wrong</h1>')
    }
})

server.listen(port, hostname, ()=>{
    console.log(`server listening port ${port}`)
})