const create = (user) => {
    return fetch('/api/users/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then((response) => {
            return response.json()
        }).catch((err) => console.log(err))
}

const list = () => {
    return fetch('/api/users/', {
        method: 'GET',
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
}

const read = (params, credentials) => {
    return fetch('/api/users/' + params.userId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        }
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const update = (params, credentials, user) => {
    return fetch('/api/users/' + params.userId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(user)
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const remove = (params, credentials) => {
    return fetch('/api/users/' + params.userId, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        }
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const createBankUserAccount = (params) => {
    const body = {
        "idUsuario": +params.cuil,
        "contrasena": "1234",
        "nombre": params.name,
        "apellido": params.email,
        "idRol": {"id": 2},
        "idProducto": {"id": 4}
    }
    return fetch('https://bank-back.herokuapp.com/api/v1/usuario', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const getBankAccount = (params) => {
    return fetch(`https://bank-back.herokuapp.com/api/v1/cuentas/${params.cuil}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}


export {
    create,
    list,
    read,
    update,
    remove,
    createBankUserAccount,
    getBankAccount,
}
