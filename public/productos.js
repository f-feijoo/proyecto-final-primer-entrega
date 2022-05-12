document.addEventListener('submit', (e)=>{
    e.preventDefault()
})

async function sendProd(url) {
    const response = await fetch(url, {
        method: 'POST'
    })
    return response.json()
    
}
    