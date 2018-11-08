
import axios from 'axios'

export const createPart = (name,description,manufacturer) => {
    return axios.post('/api/part', {
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

export const createStock = (part,vendor,url,quantity,storageplace) => {
    return axios.post('/api/stock', 
          {vendor: vendor,
          part: part,
          url:url,
          quantity:quantity,
          storageplace:storageplace})
}



