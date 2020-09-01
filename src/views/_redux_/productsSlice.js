
import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import fs from 'fs'

const token = localStorage.getItem("accessToken")
const initialProductsState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: null,
    perPage: 0

};
const initialSupplierState = {
    entities: null,

};
export const callTypes = {
    list: "list",
    action: "action"
};

export const productsSlice = createSlice({
    name: "products",
    initialState: initialProductsState,
    reducers: {
        // getProducts
        Productsuccess: (state, action) => {
            state.perPage = action.payload;
            state.totalCount = action.payload;
            state.entities = action.payload;
            state.entitiesOrigin = action.payload
        },

    }
});
export const supplierSlice = createSlice({
    name: "supplier",
    initialState: initialSupplierState,
    reducers: {
        // getProducts
        Suppliersuccess: (state, action) => {
            state.entities = action.payload;
        },

    }
});
const api = axios.create({
    'baseURL': 'http://139.180.207.4:84/api/',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
const apiImage = axios.create({
    'baseURL': 'http://139.180.207.4:84/storage/',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
const apiOrder = axios.create({
    'baseURL': 'http://139.180.207.4:83/api/',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
const apiUser = axios.create({
    'baseURL': 'http://139.180.207.4:81/api/',
    headers: {
        'Authorization': `${token}`
    }
})
const { Productsuccess } = productsSlice.actions
export const getProductsList = () => async dispatch => {
    try {
        await api.get('products?').then((res) => {
            var entities = res.data.data || [];
            var totalCount = res.data.total || 0;
            var perPage = res.data.per_page || 0;
            const data = {
                entities,
                totalCount,
                perPage
            }
            dispatch(Productsuccess(data));

        })

    } catch (e) {
        return console.error(e.message);
    }
}
const { Suppliersuccess } = supplierSlice.actions
export const getSupplier = (id,) => async dispatch => {
    try {
        await api.get('products/' + id + "?with=suppliers").then((res) => {
            var entities = res.data.suppliers || [];
            const data = {
                entities,
            }
            dispatch(Suppliersuccess(data));

        })

    } catch (e) {
        return console.error(e.message);
    }
}
export const getSuppliers = async (id) => {
    return await api.get('products/' + id + "?with=suppliers")
}
export const getProductIndex = () => {
    return api.get('products');
}
export const getProduct = (id) => {
    return api.get('products/' + id);
}
export const deleteProducts = (id) => async dispatch => {
    return api.delete('products/' + id);
}
export function updateProduct(id, name, ingredients, unit_id, price, tax_id, origin_id) {
    return api.put('products/' + id + `?name=${name}&ingredients=${ingredients}&unit_id=${unit_id}&price=${price}&tax_id=${tax_id}&origin_id=${origin_id}`)
}
export function createProducts(object) {
    return api.post('products', object)
}
export const getProductDetail = (id) => {
    return api.get('products' + id)
}
// export const createProducts = (name,price,origin_id,supplier_id, unit_id, id,ingredients,tax_id  ) => async dispatch => {
//     return api.post('products', `name=${name}&price=${price}&origin_id=${origin_id}&supplier_id=${supplier_id}&unit_id=${unit_id}&id=${id}&ingredients=${ingredients}&tax_id=${tax_id}`)
// }
export const getOrigins = () => {
    return api.get('origins')
}
export const getTaxes = () => {
    return api.get('taxes')
}
export const getUnits = () => {
    return api.get('units')
}
export const getUnitsList = () => async dispatch => {
    return api.get('units')
}
export const getSuppliersList = () => async dispatch => {
    return api.get('suppliers')
}
export const getOriginsList = () => async dispatch => {
    return api.get('origins')
}
export const getTaxesList = () => async dispatch => {
    return api.get('taxes')
}
export const getPackage = (id) => {
    return api.get('packages/' + id)
}
export const getProducts = (id, language) => {
    return api.get('products/' + id + `?with=origin;suppliers;unit;tax;package&locale=${language}`)
}
export const getProductsS = (id) => {
    return api.get('products/' + id + `?with=origin;suppliers;unit;tax;package&locale=vi`)
}
export const getSupplierDetail = () => {
    return api.get('suppliers')
}
export const updatePackage = (id, quantity, weight, height, length, width) => {
    return api.put('packages/' + id + "?" + `quantity=${quantity}&weight=${weight}&height=${height}&length=${length}&width=${width}`)
}
export const updateSuppliers = (id, object) => {
    return api.put('products/' + id + "?" + `action=attach&params=["suppliers",${object}]`)
}
export const getShipmentList = () => async dispatch => {
    return apiOrder.get('shipment-infors')
}
export const createOrder = (object) => async dispatch => {
    return apiOrder.post('orders', object);
}
export const getCustomer = () => async dispatch => {
    return apiUser.get('users')
}
export const getProductList = (object) => async dispatch => {
    if (object) {
        return api.get('products?search=id:' + object + '&locale=vi');
    }
    return api.get('products?locale=vi')
}
export const deleteSupplier = (id, object) => {
    return api.put('products/' + id + "?" + `params=["suppliers",${object}]&action=detach`)
}
export const updateImage = (id, images) => {

    let formData = new FormData();
    formData.append('image', images);

    var resquest = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${token}`
        },
        body: formData
    }
    return fetch(
        `http://139.180.207.4:84/api/products/${id}?_method=PUT`,
        resquest
      );
}
export const getImage = (object) =>{
    return apiImage.get(object)
}