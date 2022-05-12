const express = require('express')
const productRoute = require('./routes/productos')
const cartRoute = require('./routes/carrito')
const fs = require('fs')
const http = require('http')

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 8080

const {Server} =require('socket.io')
const io = new Server(server)

const moment = require('moment')

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(express.static(__dirname+'/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/productos', productRoute)
app.use('/api/carrito', cartRoute)

io.on('connection', (socket) => {
    fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la consulta'})
        }else{
            socket.emit('productos', JSON.parse(data))
            socket.on('dataMsn', (x) => {
                fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
                    if (err) {
                        return({message: 'Error en la lectura'})
                    }else{
                        let arr = JSON.parse(data)
                        let ind = arr[arr.length - 1]['id'] + 1
                        const {nombre, desc, img, precio, stock} = x
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
                })
                io.sockets.emit('productos', JSON.parse(data)) // Para que varias instancias de la pagina escuchen la respuesta/actualizacion
            })
        }
    })    
    fs.readFile(`./mensajes.json`, 'utf-8', (err, data) => {
        if (err) {
            return({message: 'Error en la consulta'})
        }else{
            socket.emit('mensajes', JSON.parse(data))
            socket.on('Msn', (x) => {
                fs.readFile(`./mensajes.json`, 'utf-8', (err, data) => {
                    if (err) {
                        return({message: 'Error en la lectura'})
                    }else{
                        let arr = JSON.parse(data)
                        const {user, ms} = x
                        let productoNuevo = {
                            user: user,
                            time: moment().format('DD/MM/YYYY hh:mm:ss'),
                            ms: ms,
                        }
                        arr.push(productoNuevo)
                        fs.writeFile('./mensajes.json', JSON.stringify(arr), 'utf-8', (err) => {
                            if(err){
                                return 'Error al escribir'
                            } else {
                               console.log('Cargado')
                            }
                        } )
                            }
                })
                io.sockets.emit('mensajes', JSON.parse(data)) // Para que varias instancias de la pagina escuchen la respuesta/actualizacion
            })
        }
    })
})

app.get('/', (req, res) => {
        fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
            if (err) {
                return({message: 'Error en la consulta'})
            }else{
                res.render('index', {data: JSON.parse(data)})
            }
        })
})

server.listen(PORT, () => {
    console.log('Server online')
})