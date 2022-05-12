async function deleteProd(url) {
    const response = await fetch(url, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: null
    })
    return response.json()
    
}
