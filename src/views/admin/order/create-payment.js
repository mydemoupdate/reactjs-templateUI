import React, { useEffect, useState } from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {getProductList,getSupplierList,getTaxesList,getShipmentList,createOrder,saveShipment,
    deleteShipment,getCustomer,getSupplier} from '../../_redux_/ordersSlice'
import {useDispatch} from "react-redux";
import Select from "react-select";
import swal from "sweetalert";
import {useHistory} from "react-router-dom";
import { useParams } from "react-router-dom";

export function CreatePayment() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [taxList,setTaxList] = useState([0]);
    const [selectedValue, setSelectedValue] = useState(0);
    const [customerList, setCustomerList] = useState([]);
    const [customerID,setCustomerID] = useState('');
    const [shipmentList,setShipmentList] = useState([]);
    const [shipMentObiect, setShipMentObject] = useState({
        consignee: '',
        address: '',
        tel: '',
        id: ''
    })
    const [productList,setPrdoctList] = useState([
        {
            id: '1234',
            name: 'null'
        }
    ]);
    const [productObject, setProductObject] = useState({
        id: '',
        name: '',
        price: 0,
        quantity: 0,

    });
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isBox, setIsBox] = useState(false);
    const [properties, setProperties] = useState('');
    const [note, setNote] = useState('');
    const [noteItem, setNoteItem] = useState('');
    const [methodShip, setMethod] = useState('sea');
    const [supplierList, setSupplierList] = useState([]);
    const [supplierObject, setSupplierObject] = useState({
        id: '',
        name: '',
        address: '',
        email: ''
    })
    const { id } = useParams();
    useEffect(()=>{
        dispatch(getProductList()).then(res=>{
            const _data = res.data.data || [];
            if(id){
                const object = _data.filter(function(object){return object.id==id})[0] || {};
                setProductObject(object);
                setPrice(object.price);
                setSelectedValue(object.tax_id);
              }
              setPrdoctList(_data);
        })

        dispatch(getTaxesList()).then(res=>{
            const _data = res.data || [];
            var result = [];
            for(var i = 0;i<_data.length;i++){
                result.push({
                    'value': _data[i].id,
                    'label': _data[i].name
                })
            }
            // if(!selectedValue){
            //   setSelectedValue(_data[0].id);
            // }
            setTaxList(result);
        })

        dispatch(getShipmentList()).then(res=>{
            setShipmentList(res.data.data);
            console.log(res.data.data)
        })

        dispatch(getCustomer()).then(res=>{
            setCustomerList(res.data.data);
        })
        dispatch(getSupplier()).then(res=>{
            setSupplierList(res.data.data);
        })
    }, [dispatch])
    const onProductChange = (event, values) => {
        if(values){
            setProductObject(values);
            setPrice(values.price);
            setSelectedValue(values.tax_id);
        }
    }
    const onShipmentChange= (event, values) => {
        if(values){
            setShipMentObject(values)
        }
    }
    const onCustomerChange= (event, values) => {
        if(values){
            console.log(values)
            setCustomerID(values.id)
        }
    }
    const onSupplierChange= (event, values) => {
        if(values){
            setSupplierObject(values)
        }
    }
    // handle onChange event of the dropdown
    const taxChange = (e) => {
        setSelectedValue(e.value);
        console.log(e.value)
    }
    const save = ()=>{
        if (productObject.id===''){
            swal("Chọn thôn tin sản phẩm  !", {
                icon: "warning",
            });
            return;
        }
        if (quantity <1 || quantity === undefined){
            swal("Nhập số lượng   !", {
                icon: "warning",
            });
            return;
        }
        if (shipMentObiect.id===''){
            swal("Chọn thôn tin nhận hàng  !", {
                icon: "warning",
            });
            return;
        }
        if (customerID===''){
            swal("Chọn khách hàng  !", {
                icon: "warning",
            });
            return;
        }
        if (supplierObject.id===''){
            swal(" Chọn nhà cung cấp !", {
                icon: "warning",
            });
            return;
        }
        const data = {
            shipment_method_id: methodShip,
            shipment_infor_id: shipMentObiect.id,
            type: 'payment'
        }
        data['item']= JSON.stringify({
            'product_id': productObject.id,
            'price': price,
            'quantity': quantity,
            'is_box': isBox?1:0,
            'tax_percent': selectedValue,
            'note': noteItem,
            'supplier_id': supplierObject.id,
        })
        console.log(data)

        dispatch(createOrder(data)).then(res=>{
            console.log(res.data.id)
            history.push('/admin/orders/'+res.data.id);
        })
    }
    return (
        <React.Fragment>

            <Card>
                <CardHeader title="Tạo đơn thanh toán hộ">
                <CardHeaderToolbar>
                <button
                  type="button"
                  className="btn btn-primary float-right"
                  onClick={save}
                >
                  Tạo đơn
                </button>
              </CardHeaderToolbar>
                </CardHeader>

                <CardBody>
              <div className="row">
                <div className="col-2"></div>
                <div className="col-8">
                  <h1 className=" text-dark font-weight-bold mb-10">
                    Thông tin sản phẩm:
                  </h1>
                  <div className="row">
                    <label className="col-4 col-form-label">
                      Chọn sản phẩm
                    </label>
                    <div className="col-8">
                      <Autocomplete
                        options={productList}
                        autoHighlight
                        onChange={onProductChange}
                        getOptionLabel={(option) =>option? option.id?option.id:'':''}
                        defaultValue={{id: id}}
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.name} ({option.id})
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" />
                        )}
                      />



                    </div>
                  </div>
                  {productObject.id !== "" ? (
                    <>
                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                          Mã sản phẩm
                        </label>
                        <div className="col-8 col-form-label">
                          {productObject.id}
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                          Tên sản phẩm
                        </label>
                        <div className="col-8 col-form-label">
                          {productObject.name}
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                          Giá sản phẩm
                        </label>
                        <div className="col-8">
                          <input
                            type="number"
                            className="form-control"
                            value={price}
                            onChange={(value) => {
                              setPrice(value.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">Số lượng</label>
                        <div className="col-8">
                          <input
                            type="number"
                            className="form-control"
                            value={quantity}
                            onChange={(value) => {
                              setQuantity(value.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                          Hình thức
                        </label>
                        <div className="col-8">
                          <select
                            onChange={(e) => {
                              setIsBox(e.target.value);
                            }}
                            className="form-control"
                          >
                            <option value="false">Cái</option>
                            <option value="true">Thùng</option>
                          </select>
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                          Thuộc tính
                        </label>
                        <div className="col-8">
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={properties}
                            onChange={(e) => {
                              setProperties(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">Thuế</label>
                        <div className="col-8">
                          <Select
                            value={taxList.filter(
                              (obj) => obj.value === selectedValue
                            )}
                            options={taxList}
                            onChange={taxChange}
                          />
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">Ghi chú</label>
                        <div className="col-8">
                          <input
                            className="form-control"
                            defaultValue={noteItem}
                            onChange={(e) => {
                              setNoteItem(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                 


        
<div className="separator separator-dashed my-10"></div>
                  <h1 className=" text-dark font-weight-bold mb-10">
                  Nhà cung cấp:
                  </h1>

                  <div className="row">
                    <label className="col-4 col-form-label">
                      Chọn thông tin
                    </label>
                    <div className="col-8">
                    <Autocomplete
                                                    options={supplierList}
                                                    autoHighlight
                                                    onChange={onSupplierChange}
                                                    getOptionLabel={option => option.name}
                                                    renderOption={option => (
                                                        <React.Fragment>
                                                            {option.name} -  ({option.email}) - {option.address}
                                                        </React.Fragment>
                                                    )}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                    </div>
                  </div>
                  {supplierObject.id? (
                    <>
                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                        Tên
                        </label>
                        <div className="col-8 col-form-label">
                        {supplierObject.name}
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">Email</label>
                        <div className="col-8 col-form-label">
                        {supplierObject.email}
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                        Địa chỉ
                        </label>
                        <div className="col-8"> {supplierObject.address}</div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}



                  <div className="separator separator-dashed my-10"></div>
                  <h1 className=" text-dark font-weight-bold mb-10">
                    Thông tin chung:
                  </h1>

                  <div className="row">
                   
                      <label className="col-4 col-form-label">Khách hàng</label>
                      <div className="col-8">
                        <Autocomplete
                          options={customerList}
                          autoHighlight
                          onChange={onCustomerChange}
                          getOptionLabel={(option) => option.email}
                          renderOption={(option) => (
                            <React.Fragment>
                              {option.email} - ({option.id})
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" />
                          )}
                        />
                      </div>
                  </div>


                  <div className="row mt-5">
                        <label className="col-4 col-form-label">
                        Hình thức vận chuyển
                        </label>
                        <div className="col-8">  <select
                          defaultValue="sea"
                          onChange={(e) => {
                            setMethod(e.target.value);
                          }}
                          className="form-control"
                        >
                          <option value="sea">Đường biển</option>
                          <option value="air">Đường bay</option>
                        </select></div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                        Ghi chú
                        </label>
                        <div className="col-8">  <textarea
                          className="form-control"
                          defaultValue={note}
                          onChange={(e) => {
                            setNote(e.target.value);
                          }}
                        ></textarea></div>
                      </div>

                      <div className="separator separator-dashed my-10"></div>
                  <h1 className=" text-dark font-weight-bold mb-10">
                    Thông tin nhận hàng:
                  </h1>

                  <div className="row">
                    <label className="col-4 col-form-label">
                      Chọn thông tin
                    </label>
                    <div className="col-8">
                      <Autocomplete
                        options={shipmentList}
                        autoHighlight
                        onChange={onShipmentChange}
                        getOptionLabel={(option) => option.address}
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.consignee} - {option.address} + {option.tel}
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" />
                        )}
                      />
                    </div>
                  </div>
                  {shipMentObiect.consignee ? (
                    <>
                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                          Người nhận
                        </label>
                        <div className="col-8 col-form-label">
                          {shipMentObiect.consignee}
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">Địa chỉ</label>
                        <div className="col-8 col-form-label">
                          {shipMentObiect.address}
                        </div>
                      </div>

                      <div className="row mt-5">
                        <label className="col-4 col-form-label">
                          Số điện thoại
                        </label>
                        <div className="col-8">{shipMentObiect.tel}</div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                </div>

                <div className="col-2"></div>
              </div>
            </CardBody>

            </Card>

        </React.Fragment>

    );
}


