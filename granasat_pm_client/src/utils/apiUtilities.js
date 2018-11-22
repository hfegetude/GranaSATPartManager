
import axios from 'axios'
// import FormData from 'form-data'
// const FormData = require('form-data');


export const getPart = (search) => {
    return axios.get('/api/part', {
        params: {
          name: search
        }
      })
}

export const searchPart = (search) => {
    return axios.get('/api/part', {
        params: {
            search: search
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

export const modifyStockStorage = (stock, storageplace) => {
    return axios.put('/api/stock', 
          {stock: stock,
            storageplace: storageplace})
}

export const getStorage = () => {
    return axios.get('/api/storageplaces')
}

export const createStorage = (name,description, photo) => {
    const form = new FormData()
    form.append('name', name);
    form.append('description', description);
    if (photo && photo.length) {
        form.append('photo', photo[0]);
    }
    return axios.post('/api/storageplaces', form)
}

export const getTransactions = (stock) => {
    return axios.get('/api/transactions', {
        params: {
            stock: stock.id,
        }
    })
} 

export const getFiles = async (idpart) => {
    return axios.get('/api/files', {
        params: {
            idpart: idpart,
        }
    })} 

export const postFiles = async (idpart,files) => {
    const form = new FormData()
    console.log(files)
    form.append('idpart', idpart);
    for (let i = 0; i < files.length; i++) {
        await form.append('file'+i, files[i]);
    }
    return axios.post('/api/files',form)
} 


export const getProjects = async () => {
    return axios.get('/api/projects')
} 

export const getProjectParts = async (project) => {
    return axios.get('/api/projects', {
        params: {
            project: project.id,
        }
})}  


export const addPartProject = async (project,part,quantity) => {
    return axios.put('/api/projects', {
        project: project,
        part: part,
        quantity: quantity
      })
} 