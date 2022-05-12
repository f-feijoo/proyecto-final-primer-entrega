const socket = io()

socket.on('productos', (data) => {
    console.log(data)
    render(data)
})

socket.on('mensajes', (data) => {
    console.log(data)
    renderMs(data)
})


const render = (data) => {
    let html = data
    .map((x) => {
        return `
        <tr>
        <th scope="row">${x.id}</th>
        <td>${x.nombre}</td>
        <td>${x.desc}</td>
        <td>$${x.precio}</td>
        <td>${x.stock}</td>
        <td><img src=${x.img} width="40"
            height="40" alt="..."></td>
        </tr>
        `
    })
    .join(' ')

    document.querySelector('#caja').innerHTML = html
}

const addInfo = () => {
    let dataObj = {nombre: document.querySelector('#nombre').value, desc: document.querySelector('#desc').value, img: document.querySelector('#img').value, precio: document.querySelector('#precio').value, stock: document.querySelector('#stock').value};
    socket.emit('dataMsn', dataObj)
    return false
}

document.addEventListener('submit', (e)=>{
    e.preventDefault()
})

const addMessage = () => {
    let msObj = {user: document.querySelector('#email').value, ms: document.querySelector('#text').value};
    document.querySelector('#text').value=''
    socket.emit('Msn', msObj)
    return false
}

const renderMs = (data) => {
    let html = data
    .map((x) => {
        return `
        <div>
            <p style="color: brown;"><strong class="text-primary">${x.user}</strong> [${x.time}] <i class="text-success">${x.ms}</i></p>
        </div>
        `
    })
    .join(' ')

    document.querySelector('#c-mensajes').innerHTML = html
}