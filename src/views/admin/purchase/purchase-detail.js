import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import swal from "sweetalert";
import Moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {getSupplier,getPurchasesById,getProductList,getSupplierById,updatePurchases,createTracking,updateItemOrder} from '../../_redux_/ordersSlice'
import {useParams} from "react-router-dom";
import {FormControl,Button, Modal,Tab,Tabs,OverlayTrigger, Tooltip} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from 'react-bootstrap-table2-editor';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
export function OrderPurchaseDetail() {
    const dispatch = useDispatch()
    const [steps, setStep] = useState([]);
    const [statusObject, setStatusObject] = useState({
        id: "",
        name: "",
      });
    const [orderObject, setOrderObject] = useState({
        type: {
            id: 'Retail',
            name: ''
        },
        steps: [],
        id: '',
        status: {name: ''},
        note: '',
        created_at:'',
        updated_at: '',
        cost: {
            sub_total: 0,
            tax: 0,
            addtional: 0,
            discount_tax_percent: 0,
            balance: 0
        },
        order_items: [
            {
                trackings: []
            }
        ],
        shipment_infor: {
            consignee: '',
            address: '',
            tel: ''
        },
        shipment_method_id: 'air',
        shipmentMethodWarehouse: {fee: 0},
        buyer_id: ''

    });
    const [supplierList, setSupplierList] = useState([]);
    const [supplierObject, setSupplierObject] = useState({
        id: '',
        name: '',
        address: '',
        email: ''
    })
    const dateNow = new Date(); 
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
    const [code, setCode] = useState('');
    const [checkFormTracking, setCheckFormTracking] = useState('');

    const { id } = useParams()
    useEffect(() => {
        if(id){
          getOrderPurchasesById(id);
            dispatch(getSupplier()).then(res=>{
                const _data = res.data.data;
                setSupplierList(_data);
            })
        }
    }, [dispatch]);
    function getOrderPurchasesById(id) {
      dispatch(getPurchasesById(id)).then(res=>{
        const object = res.data || {};
        var productID = [];
        var objectItems = object.order_items || [];
        setStatusObject({
            id: object.status.id,
            name: object.status.name,
          });
        for(var i=0 ;i<objectItems.length;i++){
            productID.push(objectItems[i].product_id);
        }
        console.log(object)
        if(objectItems.length>0){
            dispatch(getProductList(productID.join(';'))).then(response=>{
                const _data = response.data.data || [];
                objectItems.forEach((value,i) => {
                    _data.forEach(product => {
                        if(value.product_id === product.id){
                            value['name']= product.name;
                        }

                    })
                    if(i===objectItems.length-1){
                        setOrderObject(object);
                    }
                })
            }).catch(()=>{
                setOrderObject(object);
            })
        }else {
            setOrderObject(object);
        }
        console.log(object)

        dispatch(getSupplierById(object.supplier_id)).then(res=>{
            setSupplierObject(res.data)
        })
    })
    }
    const onSupplierChange= (event, values) => {
        if(values){

            dispatch(updatePurchases({
                id: orderObject.id,
                supplier_id: values.id
            })).then(res=>{
                swal("Đã cập nhật nhà cung cấp!", {
                    icon: "success",
                });
                setSupplierObject(values);
            })
        }
    }
    const AddTracking= (IdItem)=>{
      console.log(IdItem);
        if(code===''){
            swal("Nhập mã tracking!", {
                icon: "warning",
            });
            return;
        }
        const data = {
            code: code,
            expected_delivery: expected_delivery,
            payment_due_date: payment_due_date
}
console.log(data);

dispatch(createTracking(data)).then((res)=>{
    const _data = res.data;
   dispatch(updateItemOrder({
       id: IdItem,
       params: JSON.stringify(['trackings',_data.id.toString()]),
       action: 'attach'
   })).then((res)=>{
    swal("Tạo tracking thành công!", {
      icon: "success",
  });
  getOrderPurchasesById(id);
   })
}).catch(()=>{
  swal("Mã tracking đã tồn tại!", {
    icon: "warning",
});
})

        setCode('');
    }

    const columns = [
      {
          dataField: "id",
          text: "STT",
          editable: false,
          formatter: STTFormatter,
      },
      {
          dataField: "name",
          text: "Sản phẩm",
          editable: false
      },
      {
          dataField: "price",
          text: "Giá",
      },
      {
          dataField: "quantity",
          text: "Số lượng"

      },
      {
          dataField: "tax",
          text: "Thuế",
          editable: false
      },
      {
          dataField: "updated_at",
          text: "Hình thức",
          editable: false,
          formatter: typeFormatter,
      }
  ]
  function STTFormatter(cell, row, i) {
    return (
      <>
        <span>{i + 1}</span>
      </>
    );
  }
  function typeFormatter(cell, row){
    return (
        <>
            {row.is_box?
                <span className="label label-lg label-light-info label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                Thùng
                </span>
                :
                    <span className="label label-lg label-light-primary label-inline" style={{marginLeft: '0', marginTop: '0'}}>
               Cái
                </span>
  
            }
        </>
    )
}

const expandRow = {
  renderer: row => (
    <div className="react-bootstrap-table table-responsive ml-15">

       <table className="table table table-head-custom table-vertical-center overflow-hidden">
<thead>
<tr><th className="border-top-0">Mã Tracking</th><th className="border-top-0">Ngày giao hàng</th><th className="border-top-0">Hạn thanh toán</th>
    <th className="border-top-0" width="40%"><i className="ki ki-plus" style={{cursor: 'pointer'}} onClick={()=> setCheckFormTracking(row.id)}></i></th></tr>
</thead>
<tbody>


 
    {
checkFormTracking==row.id?
<tr className="font-weight-boldest">
<td className="pt-2 border-left" width="40%">
<input className="form-control" value={code} onChange={(e)=>{
    setCode(e.target.value)
}}/>
</td>
<td className="pt-2 ">
<TextField
    // style={{ width: 125 }}
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
    // style={{ width: 125 }}
    type="date"
    defaultValue={payment_due_date}
    onInput={e=>setPaymentDueDate(e.target.value)}
    InputLabelProps={{
        shrink: true
    }}
/>
</td>
<td className="pt-3 border-right" width="40%">
<button type="button"
        className="btn btn-success mr-1 btn-sm" onClick={()=>AddTracking(row.id)}>Lưu
</button>
<button type="button"
        className="btn btn-danger btn-sm" onClick={()=> setCheckFormTracking(false)}>Huỷ
</button>
</td>
</tr>
:<tr></tr>



}
{
row?.trackings.map((val, i)=>
<tr key={i}>
<td className="border-left">{val.code}</td>
<td> {val.expected_delivery?Moment(val.expected_delivery).format('DD-MM-YYYY HH:MM'):'' }</td>
<td> {val.payment_due_date?Moment(val.payment_due_date).format('DD-MM-YYYY HH:MM'):'' }</td>
<td className="border-right">  <>
            <OverlayTrigger
                overlay={<Tooltip>Xoá Tracking</Tooltip>}
            >
                <a
                    className="btn btn-icon btn-light btn-hover-danger btn-sm"
                    onClick={() => {
                      dispatch(updateItemOrder({
                        id: row.id,
                        params: JSON.stringify(['trackings',val.id.toString()]),
                        action: 'detach'
                      })).then(()=>{
                        swal("Xoá tracking thành công!", {
                          icon: "success",
                      });
                      getOrderPurchasesById(id);
                      })
                    }}
                >
                    <span className="svg-icon svg-icon-md svg-icon-danger">
                        <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                    </span>
                </a>
            </OverlayTrigger>
        </></td>
</tr>

)
}


</tbody>


</table>
    </div>
  ),
  showExpandColumn: true,
  expandHeaderColumnRenderer: ({ isAnyExpands }) => {
    if (isAnyExpands) {
      return <b></b>;
    }
    return <b></b>;
  },
  expandColumnRenderer: ({ expanded }) => {
    if (expanded) {
      return (
        <a class="datatable-toggle-detail"><i class="fa fa-caret-down" style={{color: '#3699FF'}}></i></a>
      );
    }
    return (
     <>
      <a className="datatable-toggle-detail" ><i className="fa fa-caret-right" style={{color: '#3699FF'}}></i></a>
      </>
    );
  }
};

    return (
        <>
 <div className="row">
        <div className="col">
          <Card>
            <CardHeader title="Chi tiết đơn mua hàng">
            
            </CardHeader>
          </Card>
        </div>
        {steps.length > 0 ? (
          <div className="col">
            <Card>
              <CardHeader title={"Thay đổi trạng thái đơn "}>
                <CardHeaderToolbar>
                  {steps.map((item) => (
                    <div key={item}>
          
                      <button
                        type="button"
                        className="btn btn-primary mr-1"
                        onClick={()=>{
                            dispatch(updatePurchases(
                                {
                                    id: orderObject.id,
                                    status: item
                                }
                            )).then(res=>{
                                swal("Đã cập nhật trạng thái!", {
                                    icon: "success",
                                });
                            })
                        }}
                      >
                        {item}
                      </button>
                    </div>
                  ))}
                </CardHeaderToolbar>
              </CardHeader>
            </Card>
          </div>
        ) : (
          ""
        )}
      </div>


      <div className="row">
          <div className="col-6">
          <Card style={{ height: "340px" }}>
                <CardHeader title={"Thông tin đơn hàng"}></CardHeader>
                <CardBody>
                  <div className="form-group row my-2">
                    <label className="col-5 col-form-label">Mã đơn:</label>
                    <div className="col-7">
                      <span className="form-control-plaintext font-weight-bolder">
                        #{orderObject.id}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-5 col-form-label">Người mua:</label>
                    <div className="col-7">
                      <span className="form-control-plaintext font-weight-bolder">
                        #{orderObject.buyer_id}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-5 col-form-label">Trạng thái:</label>
                    <div className="col-7 pl-0 pr-0">
                      <span className="form-control-plaintext font-weight-bolder">
                        {statusObject.id === "Approved" ? (
                          <span
                            className="label label-lg label-light-info label-inline"
                            style={{ marginLeft: "0", marginTop: "0" }}
                          >
                            {statusObject.name}
                          </span>
                        ) : statusObject.id === "Pending" ? (
                          <span
                            className="label label-lg label-light-primary label-inline"
                            style={{ marginLeft: "0", marginTop: "0" }}
                          >
                            {statusObject.name}
                          </span>
                        ) : statusObject.id === "Cancelled" ? (
                          <span
                            className="label label-lg label-light-danger label-inline"
                            style={{ marginLeft: "0", marginTop: "0" }}
                          >
                            {statusObject.name}
                          </span>
                        ) : statusObject.id === "Finish" ? (
                          <span
                            className="label label-lg label-light-success label-inline"
                            style={{ marginLeft: "0", marginTop: "0" }}
                          >
                            {statusObject.name}
                          </span>
                        ) : statusObject.id === "Purchased" ? (
                          <span
                            className="label label-lg label-light-warning label-inline"
                            style={{ marginLeft: "0", marginTop: "0" }}
                          >
                            {statusObject.name}
                          </span>
                        ) : (
                          <span
                            className="label label-lg label-light-dark label-inline"
                            style={{ marginLeft: "0", marginTop: "0" }}
                          >
                            {statusObject.name}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

            
                  <div className="form-group row my-2">
                    <label className="col-5 col-form-label">
                      Ngày đặt hàng:
                    </label>
                    <div className="col-7">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.created_at
                          ? Moment(orderObject.created_at).format(
                              "DD-MM-YYYY HH:MM"
                            )
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-5 col-form-label">
                      Cập nhật lần cuối:
                    </label>
                    <div className="col-7">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.updated_at
                          ? Moment(orderObject.updated_at).format(
                              "DD-MM-YYYY HH:MM"
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
          </div>
          <div className="col-6">
          <Card style={{ height: "340px" }}>
                <CardHeader>
                    <div className="row w-100">
                        <div className="col pt-7 ">
                            <h3 className="card-label" style={{fontWeight: '500', fontSize: '1.275rem'}}>Thông tin nhà cung cấp</h3>
                        </div>
                        <div className="col pt-5">
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
                
                </CardHeader>
                <CardBody>
                <div className="form-group row my-2">
                    <label className="col-4 col-form-label">Tên nhà cung cấp:</label>
                    <div className="col-8">
                      <span className="form-control-plaintext font-weight-bolder">
                        {supplierObject.name}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-4 col-form-label pr-0">
                     Email: 
                    </label>
                    <div className="col-8">
                      <span className="form-control-plaintext font-weight-bolder">
                        {supplierObject.email}
                      </span>
                    </div>
                  </div>
                  <div className="form-group row my-2">
                    <label className="col-4 col-form-label pr-0">
                     Địa chỉ: 
                    </label>
                    <div className="col-8">
                      <span className="form-control-plaintext font-weight-bolder">
                        {supplierObject.address}
                      </span>
                    </div>
                  </div>
                </CardBody>
            </Card>
          </div>
          <div className="col-12">
          <Card>
                <CardHeader title={"Nội dung hàng hoá"}></CardHeader>
                <CardBody>
                <BootstrapTable
                                wrapperClasses="table-responsive"
                                classes="table table-head-custom table-vertical-center overflow-hidden"
                              
                                onTableChange={console.log('Ok')}
                                rowStyle={{cursor: "pointer"}}
                                bordered={false}
                                keyField='id'
                                data={orderObject.order_items}
                                columns={columns
                                }
                                cellEdit={ cellEditFactory({
                                  mode: 'click',
                                  beforeSaveCell: (oldValue, newValue, row, column) => { 
                                    if(column.dataField==='price'){
                                      dispatch(updateItemOrder({
                                        id: row.id,
                                        price: newValue
                                      })).then(()=>{
                                        swal("Đã cập nhật giá!", {
                                          icon: "success",
                                        });
                                      })
                                    }else if(column.dataField=='quantity'){
                                      dispatch(updateItemOrder({
                                        id: row.id,
                                        quantity: newValue
                                      })).then(()=>{
                                        swal("Đã cập nhật số lượng!", {
                                          icon: "success",
                                        });
                                      })
                                    }
                                   },
                                }) }
                                expandRow={ expandRow }
                            />
                  </CardBody>
                  </Card>
         
          </div>
      </div>
   
        </>

    );
}


