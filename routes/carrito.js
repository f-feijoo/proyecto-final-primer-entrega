const express = require('express')
const fs = require('fs')

const { Router } = express

const router = new Router

router.get('/:id/productos', (req, res) => {
    fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la consulta'})
        }else{
            let obj = JSON.parse(data)
            let ide = req.params.id
            let resp = obj.find(x => x.id == ide)
            if(resp) {
                res.render('carrito', {data: resp, idC: ide})
            } else {
                res.send({ error : 'carrito no encontrado' })
            }  
        }
    })
})

router.post('/:id/productos', (req, res) => {
    fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            res.send({message: 'Error en la consulta'})
        }else{
            let obj = JSON.parse(data)
            let ide = req.params.id
            let resp = obj.find(x => x.id == ide)
            if(resp) {
                fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
                    if (err) {
                        return({message: 'Error en la consulta'})
                    }else{
                        let carr = JSON.parse(data)
                        carr[carr.length-1]['productos'].push(resp)
                        fs.writeFile('./carrito.json', JSON.stringify(carr), 'utf-8', (err) => {
                            if(err){
                                return 'Error al escribir'
                            } else {
                               res.send({message: `Producto agregado, id: ${resp.id}`})
                            }
                        } )
                    }
                })
            } else {
                res.send({ error : 'producto no encontrado' })
            }  
        }
    })    
})

router.post('/', (req, res) => {
    fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la consulta'})
        }else{
            let carr = JSON.parse(data)
            let ind = carr[carr.length - 1]['id'] + 1
            let obj = {
                id: ind,
                timestamp: Date.now(),
                productos: []
            }
            carr.push(obj)
            fs.writeFile('./carrito.json', JSON.stringify(carr), 'utf-8', (err) => {
                if(err){
                    return 'Error al escribir'
                } else {
                  res.send({message: `Carrito creado, id: ${obj.id}`})
                }
            } )
        }
    })
})

router.delete('/:id', (req, res) => {
    fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la lectura'})
        }else{
            let id = Number.parseInt(req.params.id)
            let carr = JSON.parse(data)
            let index = carr.findIndex(element => element['id'] === id)
            if(index == -1) {
                res.send({ error : 'carrito no encontrado' })
            } else {
                carr.splice(index, 1)
                fs.writeFile('./carrito.json', JSON.stringify(carr), 'utf-8', (err) => {
                    if(err){
                        return 'Error al escribir'
                    } else {
                        res.send({delete: 'ok', id: id})
                    }
                } )
                }}
            
    })
})

router.delete('/:id/productos/:id_prod', (req, res) => {
    fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la lectura'})
        }else{
            let id = Number.parseInt(req.params.id)
            let carr = JSON.parse(data)
            let index = carr.findIndex(element => element['id'] === id)
            if(index == -1) {
                res.send({ error : 'carrito no encontrado' })
            } else {
                let idP = Number.parseInt(req.params.id_prod)
                let indexProd = carr[index]['productos'].findIndex(element => element['id'] === idP)
                if(indexProd == -1) {
                    res.send({ error : 'producto no encontrado' })
                } else {
                    carr[index]['productos'].splice(indexProd, 1)
                    fs.writeFile('./carrito.json', JSON.stringify(carr), 'utf-8', (err) => {
                        if(err){
                            return 'Error al escribir'
                        } else {
                            res.send({message: `Producto con ID ${idP} eliminado.` })
                        }
                    } )
                    }
                }}
            
    })
})

module.exports = router


