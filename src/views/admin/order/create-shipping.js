import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";
import {getProductList,getSupplierList,getTaxesList,getShipmentList,createOrder,saveShipment,
    deleteShipment,getCustomer} from '../../_redux_/ordersSlice'
import Autocomplete from "@material-ui/lab/Autocomplete";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
export function CreateShipping() {
    const dispatch = useDispatch();
    const history = useHistory();
    const dateNow = new Date(); // Creating a new date object with the current date and time
    const year = dateNow.getFullYear(); // Getting current year from the created Date object
    const monthWithOffset = dateNow.getUTCMonth() + 1; // January is 0 by default in JS. Offsetting +1 to fix date for calendar.
    const month = // Setting current Month number from current Date object
        monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 to adjust for date input.
            ? `0${monthWithOffset}`
            : monthWithOffset;
    var date =
        dateNow.getUTCDate().toString().length < 2 // Checking if date is < 10 and pre-prending 0 if not to adjust for date input.
            ? `0${dateNow.getUTCDate()}`
            : dateNow.getUTCDate();
    const dateDataNow = `${year}-${month}-${date}`;
    const [expected_delivery, setExpectedDelivery]= useState(dateDataNow);
    const [payment_due_date, setPaymentDueDate] = useState(dateDataNow);

    const [checkFormTracking, setCheckFormTracking] = useState(false);
    const [trackList, setTrackList] = useState([]);
    const [code, setCode] = useState('');
    const [customerList, setCustomerList] = useState([]);
    const [customerID,setCustomerID] = useState('');
    const [shipmentList,setShipmentList] = useState([]);
    const [shipMentObiect, setShipMentObject] = useState({
        consignee: '',
        address: '',
        tel: '',
        id: ''
    })
    const [note, setNote] = useState('');
    const [methodShip, setMethod] = useState('sea');
    const AddTracking= ()=>{
        if(code===''){
            swal("Nhập mã tracking!", {
                icon: "warning",
            });
            return;
        }
        if(expected_delivery===''){
            swal("Chọn ngày giao dự kiến!", {
                icon: "warning",
            });
            return;
        }
        if(trackList.filter(val=>val.code ===code).length>0){
            swal("Nhập tracking khác!", {
                icon: "warning",
            });
            return;
        }
        setTrackList([...trackList,{
            code: code,
            expected_delivery: expected_delivery,
            payment_due_date: payment_due_date
        }]);
        setCode('');
    }

    useEffect(()=>{


        dispatch(getShipmentList()).then(res=>{
            setShipmentList(res.data.data);
            console.log(res.data.data)
        })

        dispatch(getCustomer()).then(res=>{
            setCustomerList(res.data.data);
        })
    }, [dispatch])
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
    const save = ()=>{


        if (shipMentObiect.id===''){
            swal("Chọn thôn tin nhận hàng  !", {
                icon: "warning",
            });
            return;
        }
        if (trackList.length===0){
            swal("Nhập tracking  !", {
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

        const data = {
            shipment_method_id: methodShip,
            shipment_infor_id: shipMentObiect.id,
            type: 'shipment',
            trackings: JSON.stringify(trackList)
        }

        console.log(data)

        dispatch(createOrder(data)).then(res=>{
            console.log(res.data.id)
            history.push('/admin/orders/'+res.data.id);
        })
    }
    return (
        <React.Fragment>

            <Card>
                <CardHeader title="Tạo đơn vận chuyển hộ">
            
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
                  

                  <div className="form-group row">
                                <label className="col-9 col-form-label"><h1 className=" text-dark font-weight-bold mb-10">
                  Danh sách Tracking
                  </h1></label>
                                <div className="col-3 text-right pt-5">
                                    <i className="ki ki-plus icon-lg mr-5" style={{cursor: 'pointer'}} onClick={()=> setCheckFormTracking(true)}></i>
                                </div>
                            </div>
                  <div className="row">
                      <div className="col-12">
                      <div className="table-responsive">
                                <table className="table">

                                    <thead className="font-weight-boldest">
                                    <tr className="f ont-weight-boldest">
                                        <th className="border-top border-left">Mã Tracking</th>
                                        <th className="border-top">Ngày giao hàng</th>
                                        <th className="border-top">Hạn thanh toán</th>
                                        <th className="border-top border-right" width="10%">#</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {
                                        checkFormTracking?
                                            <tr className="font-weight-boldest">
                                                <td className="pt-2 border-left" width="40%">
                                                    <input className="form-control" value={code} onChange={(e)=>{
                                                        setCode(e.target.value)
                                                    }}/>
                                                </td>
                                                <td className="pt-2 ">
                                                    <TextField
                                                        style={{ width: 125 }}
                                                        type="date"
                                                        defaultValue={expected_delivery}
                                                        onInput={e=>setExpectedDelivery(e.target.value)}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                </td>
                                                <td className="pt-2">
                                                    <TextField
                                                        style={{ width: 125 }}
                                                        type="date"
                                                        defaultValue={payment_due_date}
                                                        onInput={e=>setPaymentDueDate(e.target.value)}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                </td>
                                                <td className="pt-3 border-right" width="30%">
                                                    <button type="button"
                                                            className="btn btn-success mr-2 btn-sm" onClick={AddTracking}>Lưu
                                                    </button>
                                                    <button type="button"
                                                            className="btn btn-danger btn-sm" onClick={()=> setCheckFormTracking(false)}>Huỷ
                                                    </button>
                                                </td>
                                            </tr>
                                            :<tr></tr>
                                    }

                                    {trackList.map((item, i)=>
                                        <tr key={i}>
                                            <td className="pt-5 border-left border-bottom">{item.code}</td>
                                            <td className="border-bottom pt-5">{item.expected_delivery}</td>
                                            <td className="border-bottom pt-5">{item.payment_due_date}</td>
                                            <td className="pt-5 border-right border-bottom"><button type="button"
                                                        className="btn btn-danger btn-sm" onClick={()=>setTrackList(trackList.filter(val=>val.code !==item.code))}>Xoá
                                            </button></td>
                                        </tr>
                                    )}



                                    </tbody>
                                </table>
                            </div>
                      </div>
                  </div>

            

<div class="separator separator-dashed my-10"></div>
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

                      <div class="separator separator-dashed my-10"></div>
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


