
import axios from 'axios'

export const getPart = (search) => {
    return axios.get('/api/part', {
        params: {
          name: search
        }
      })
}

export const createPart = (name,description,manufacturer,datasheet) => {
    return axios.post('/api/part', {
        name: name,
        description: description,
        manufacturer: manufacturer,
        datasheet:datasheet
      })
}

export const modifyPart = (id,name,description,manufacturer) => {
    return axios.put('/api/part', {
        id: id,
        name: name,
        description: description,
        manufacturer: manufacturer,
      })
}

export const createVendor = (name,url) => {
    return axios.post('/api/vendor', {
        name: name,
        url: url
      })
}

export const getStock = (part,vendor) => {
    return axios.get('/api/stock', {
        params: {
          vendor: vendor.id,
          part: part.id
        }
    })
}

export const searchStock = (search) => {
    return axios.get('/api/stock', {
        params: {
            search: search,
        }
    })
}

export const createStock = (part,vendor,vendorreference,url,quantity,storageplace,image) => {
    return axios.post('/api/stock', 
          {vendor: vendor,
          part: part,
          url:url,
          quantity:quantity,
          storageplace:storageplace,
          vendorreference:vendorreference,
          image: image
        })
}

export const modifyStock = (stock,quantity) => {
    return axios.put('/api/stock', 
          {stock: stock,
            quantity: quantity})
}



