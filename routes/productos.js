const express = require('express')
const fs = require('fs')

const {Router} = express

let router = new Router()


router.get('/:id?', (req, res) => {
    let carrito
    fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
        if (err) {
            res.send({message: 'Error en la consulta'})
        }else{
            carro= JSON.parse(data)
            carrito = carro[carro.length - 1]['id']
}})
    if(req.params.id){
        fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
            if (err) {
                res.send({message: 'Error en la consulta'})
            }else{
                let obj = JSON.parse(data)
                let ide = req.params.id
                let resp = obj.find(x => x.id == ide)
                if(resp) {
                    res.render('uploaded', {data: resp})
                } else {
                    res.send({ error : 'producto no encontrado' })
                }  
            }
        })
    } else {
        if(req.query.admin){
        fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
            if (err) {
                return({message: 'Error en la consulta'})
            }else{
                res.render('productosAdmin', {data: JSON.parse(data)})
            }
        })} else{
            fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
                if (err) {
                    return({message: 'Error en la consulta'})
                }else{
                    res.render('productos', {data: JSON.parse(data), nroC: 'carrito/'+carrito+'/productos'})
                }
            })
        }
    }
})

router.post('/', (req, res) => {
    if(req.query.admin) {
        fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la lectura'})
        }else{
            let arr = JSON.parse(data)
            let ind = arr[arr.length - 1]['id'] + 1
            const {nombre, desc, img, precio, stock} = req.body
            let productoNuevo = {
                id: ind,
                timestamp: Date.now(),   
                nombre: nombre,
                desc: desc,
                codigo:(nombre+ind).toLowerCase().replace(/\s/,'-') ,
                img: img,
                precio: precio,
                stock: stock  
            }
            arr.push(productoNuevo)
            fs.writeFile('./productos.json', JSON.stringify(arr), 'utf-8', (err) => {
                if(err){
                    return 'Error al escribir'
                } else {
                   console.log('Cargado')
                }
            } )
                }
    })} else {
        res.send({error : -1, descripcion: "ruta '/api/productos' método 'POST' no autorizada"})
    }
})

router.put('/:id', (req, res) => {
    if(req.query.admin){
    fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la lectura'})
        }else{
            let id = Number.parseInt(req.params.id)
            let prod = JSON.parse(data)
            let index = prod.findIndex(element => element['id'] === id)
            let newProd = { id: id,
                            timestamp: Date.now(),
                            nombre: req.body.nombre,
                            desc: req.body.desc,
                            codigo:(req.body.nombre+id).toLowerCase().replace(/\s/,'-') ,
                            img: req.body.img,
                            precio: req.body.precio,
                            stock: req.body.stock
                            }
            if(index == (-1)){
                res.send({ error : 'producto no encontrado' })
            } else {
            prod.splice(index, 1, newProd)
            fs.writeFile('./productos.json', JSON.stringify(prod), 'utf-8', (err) => {
                if(err){
                    return 'Error al escribir'
                } else {
                    res.render('uploaded', {data: newProd})
                }
            } )
                }}
            
    })} else{
        res.send({error : -1, descripcion: "ruta '/api/productos' método 'PUT' no autorizada"})
    }
})

router.delete('/:id', (req, res) => {
    if(req.query.admin) {
        fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la lectura'})
        }else{
            let id = Number.parseInt(req.params.id)
            let prod = JSON.parse(data)
            let index = prod.findIndex(element => element['id'] === id)
            if(index == -1) {
                res.send({ error : 'producto no encontrado' })
            } else {
                prod.splice(index, 1)
                fs.writeFile('./productos.json', JSON.stringify(prod), 'utf-8', (err) => {
                    if(err){
                        return 'Error al escribir'
                    } else {
                        res.send({delete: 'ok', id: id})
                    }
                } )
                }}
            
    })} else{
        res.send({error : -1, descripcion: "ruta '/api/productos' método 'DELETE' no autorizada"})
    }
})

module.exports = router