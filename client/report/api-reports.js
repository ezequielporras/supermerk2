const list = () => {
  return fetch('/api/reports', {
    method: 'GET',
  }).then(response => {
    return response.json()
  }).catch((err) => console.log(err))
}

export {
  list,
}
