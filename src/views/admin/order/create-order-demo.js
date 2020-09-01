import { Field, Form, Formik, FormikProps,ErrorMessage } from 'formik';

import React, {useEffect, useState} from 'react';

import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import '../../../assets/css/wizard.wizard-4.css';
import '../../../assets/css/style-main.css'
import {Button, Row, Col, FormControl} from "react-bootstrap";
import swal from 'sweetalert';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { useLocation} from "react-router";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Input } from "./InputCustome";
import * as Yup from "yup";
import {Link, useHistory } from "react-router-dom";
import {getProductList,getSupplierList,getTaxesList,getShipmentList,createOrder,saveShipment,
    deleteShipment} from '../../_redux_/ordersSlice'
import {useDispatch} from "react-redux";
import Select from "react-select";
import Icon from "@material-ui/core/Icon";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
// Validation schema
const OrderSchema = Yup.object().shape({
    price: Yup.number()
        .min(0, "$0 là nhỏ nhất")
        .max(1000000, "$1000000 là lớn nhất")
        .required("Nhập giá"),
    quantity: Yup.number()
        .min(1, "$1 là nhỏ nhất")
        .max(1000000, "$1000000 là lớn nhất")
        .required("Nhập số lượng"),
});

const ShipmentInfor = Yup.object().shape({
    consignee: Yup.string().required('Nhập người nhận'),
    address: Yup.string().required('Nhập địa chỉ'),
    tel: Yup.string().required('Nhập SĐT')
})

export function CreateOrder() {
    const [initialValues, setInitialValues] = useState({
        price: 0, quantity: 1, link: '', note: ''
    });
    const [shipment,setShipment] = useState('');
    const [step,setStep] = useState(1);
    const [shipMethod, setShipMethod] = useState('');
    const [trackList, setTrackList] = useState([]);
    const [code, setCode] = useState('');


    const [typeOrder,setTypeOrder] = useState();
    const [productList,setPrdoctList] = useState([]);
    const [supplierList,setSupplierList] = useState([]);
    const [shipmentList,setShipmentList] = useState([]);
    const [taxList,setTaxList] = useState([0]);

    // set value for default selection
    const [price,setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [link,setLink] = useState('');
    const [note,setNote] = useState('');
    const [selectedValue, setSelectedValue] = useState(0);
    const [product_id, setProductID] = useState('');
    const [supplier_id, setSupplierID] = useState('');
    const [shipment_infor_id, setShipmentID] = useState('');
    const [is_box, setIsBox] = useState(false);
    const [sea,setSea] = useState(true);
    const [consignee, setConsignee] = useState('');
    const [address, setAddress] = useState('');
    const [tel, setTel] = useState('');

    const [checkFormShipment, setCheckFormShipment] = useState(false);
    const history = useHistory();

    var arraysTracking = [];





    // handle onChange event of the dropdown
    const handleChange = (e) => {
        setSelectedValue(e.value);
        console.log(e.value)
    }


    const dispatch = useDispatch()
// Similar to componentDidMount and componentDidUpdate:
    const stepClickOne= (e)=>{
        setStep(1)
        console.log(step)
    }
    const stepClickTwo= (e)=>{
        if(shipment!=''){
            setStep(2)
            return;
        }
        swal("Chọn địa chỉ giao hàng!", {
            icon: "warning",
        });
    }
    const stepClickThree= (e)=>{
        if(shipment!=''&& shipMethod!==''){
            setStep(3)
            return;
        }else if(shipment===''){
            swal("Chọn địa chỉ giao hàng!", {
                icon: "warning",
            });
            return ;
        }
        swal("Chọn hình thức vận chuyển!", {
            icon: "warning",
        });
    }
    let location = useLocation();

    useEffect(() => {
        if(location.pathname.includes('wholesale')){
            setTypeOrder('wholesale');
        }else if(location.pathname.includes('auction')){
            setTypeOrder("auction");
        }else if (location.pathname.includes('shipping')){
            setTypeOrder("shippingpartner");
        }else if (location.pathname.includes('payment')){
            setTypeOrder("paymentpartner");
        }else{
            setTypeOrder("retail");
        }
        dispatch(getProductList()).then(res=>{
            setPrdoctList(res.data.data);
            console.log(res.data.data)
        })
        dispatch(getShipmentList()).then(res=>{
            setShipmentList(res.data.data);
            console.log(res.data.data)
        })
        dispatch(getSupplierList()).then(res=>{
            setSupplierList(res.data.data)
            console.log(res.data.data)
        })

        dispatch(getTaxesList()).then(res=>{
            const _data = res.data || [];
            var result = [];
            for(var i = 0;i<_data.length;i++){
                result.push({
                    'value': _data[i].id,
                    'label': _data[i].percent
                })
            }
            setSelectedValue(_data[0].id)
            setTaxList(result);
        })
        console.log(consignee)
    },[location]);

    const onProductChange = (event, values) => {
        console.log(values)
        if(values){
            setProductID(values.id)
        }else {
            setProductID('')
        }
    }

    const onSupplierChange = (event, values) => {
        console.log(values)
        setSupplierID(values.id);
    }
    const onShipmentChange= (event, values) => {
        console.log(values)
        setShipmentID(values.id);
    }
    const refreshForm=()=>{
        window.location.reload(false);
    }


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
    const expectedDelivery = `${year}-${month}-${date}`;
    const [expected_delivery, setExpectedDelivery]= useState(expectedDelivery);
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
        console.log(trackList.filter(val=>val.code ===code))
        if(trackList.filter(val=>val.code ===code).length>0){
            swal("Nhập tracking khác!", {
                icon: "warning",
            });
            return;
        }
        setTrackList([...trackList,{code: code,expected_delivery: expected_delivery}]);
        setCode('');
    }

    const createPartner = ()=>{
        console.log(trackList)
        console.log(JSON.stringify(trackList))
        var track = JSON.stringify(trackList);
        console.log(JSON.parse(track))
        const data = {
            shipment_method_id: shipMethod,
            shipment_infor_id: shipment,
            type: 'shippingPartner',
            trackings: track
        }
        dispatch(createOrder(data)).then(res=>{
            console.log(res.data.id)
            history.push('/admin/orders/'+res.data.id);
        })
    }
return (
    <div className="card card-custom card-transparent">
        {
            typeOrder === 'shippingpartner'?

                <div className="card-body p-0">


                    {step===3?
                        <div className="card-header row m-0 py-2">
                            <div className="card-title col float-left"><h3 className="card-label"></h3></div>
                            <div className="card-toolbar float-right"><button type="button" className="btn btn-primary"
                            onClick={createPartner}><i className="fa fa-save"></i>Lưu</button></div>
                        </div>:''}

                    <div className="wizard wizard-4" id="kt_wizard" data-wizard-state="first"
                         data-wizard-clickable="true">
                        <div className="wizard-nav">
                            <div className="wizard-steps">
                                <div className="wizard-step" data-wizard-type="step"
                                     data-wizard-state={step===1 ? "current" : ''} onClick={stepClickOne}>
                                    <div className="wizard-wrapper">
                                        <div className="wizard-number">
                                            1
                                        </div>
                                        <div className="wizard-label">
                                            <div className="wizard-title">
                                                Chọn địa chỉ
                                            </div>
                                            <div className="wizard-desc">
                                                Thông tin địa chỉ người nhận
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="wizard-step" data-wizard-type="step"
                                     data-wizard-state={step===2 ? "current" : ''} onClick={stepClickTwo}>
                                    <div className="wizard-wrapper">
                                        <div className="wizard-number">
                                            2
                                        </div>
                                        <div className="wizard-label">
                                            <div className="wizard-title">
                                                Hình thức vận chuyển
                                            </div>
                                            <div className="wizard-desc">
                                                Thông tin vận chuyển của người nhận
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="wizard-step" data-wizard-type="step"
                                     data-wizard-state={step===3 ? "current" : ''} onClick={stepClickThree}>
                                    <div className="wizard-wrapper">
                                        <div className="wizard-number">
                                            3
                                        </div>
                                        <div className="wizard-label">
                                            <div className="wizard-title">
                                                Tạo tracking
                                            </div>
                                            <div className="wizard-desc">
                                                Thông tin dự kiến giao hàng
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="card card-custom card-shadowless rounded-top-0">

                            <div className="card-body p-0">
                                <div className="row justify-content-center py-8 px-8 py-lg-15 px-lg-10">
                                    <div className="col-xl-12 col-xxl-10">

                                        <div className="form fv-plugins-bootstrap fv-plugins-framework"
                                              id="kt_form">
                                            <div className="row justify-content-center">
                                                <div className="col-xl-12">

                                                    <div className="my-5 step" data-wizard-type="step-content"
                                                         data-wizard-state={step ===1 ? "current" : ''}>
                                                        <div className="row">

                                                            {shipmentList.map((item, i)=>
                                                            <div className="col-4" key={i}>
                                                                <div className="card card-custom gutter-b">
                                                                    <div
                                                                        className="card-header h-auto py-3 border-0">
                                                                        <div className="card-title">
                                                                            <h3 className="card-label text-danger">
                                                                                {item.consignee}
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-body pt-2">
                                                                        <p>Địa chỉ: {item.address}</p>
                                                                        <span>SDT: {item.tel}</span>
                                                                        <div className="mt-5">
                                                                            <Button
                                                                               className={shipment == item.id ? 'btn btn-success btn-sm font-weight-bold mr-2' : '"btn btn-light btn-sm font-weight-bold mr-2"'}
                                                                               onClick={() => {
                                                                                   setShipment(item.id);
                                                                                   setStep(2)
                                                                               }}>Giao đến địa chỉ này</Button>
                                                                            <Button
                                                                               className="btn btn-danger btn-sm font-weight-bold"
                                                                               onClick={()=>dispatch(deleteShipment(item.id)).catch((error)=>{
                                                                                   console.log(error);
                                                                                   swal("Địa chỉ này đang được dùng !", {
                                                                                       icon: "warning",
                                                                                   });
                                                                               })
                                                                                   .then(()=>{
                                                                                   dispatch(getShipmentList()).then(res=>{
                                                                                       setShipmentList(res.data.data);
                                                                                   })
                                                                            })}>Xoá</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                                )}
                                                        </div>

                                                        <div className="col-12">
                                                            <Button variant="primary" size="sm" onClick={()=>setCheckFormShipment(true)}><i
                                                                className="fa fa-plus"></i>Thêm địa chỉ</Button>
                                                        </div>
                                                        {checkFormShipment?
                                                        <div className="row justify-content-center text-center mt-5">
                                                            <div className="col-6">

                                                                <Formik
                                                                    initialValues={{ consignee: '', address: '', tel: '' }}

                                                                    validationSchema={Yup.object({
                                                                        consignee: Yup.string()
                                                                            .required('Nhập người nhận'),
                                                                        address: Yup.string()
                                                                            .required('Nhập địa chỉ '),
                                                                        tel: Yup.string()
                                                                            .required('Nhập SĐT'),
                                                                    })}
                                                                    onSubmit={(values, { setSubmitting,resetForm }) => {
                                                                        dispatch(saveShipment(values)).then(()=>{
                                                                            dispatch(getShipmentList()).then(res=>{
                                                                                setShipmentList(res.data.data);
                                                                               resetForm();
                                                                            })
                                                                        }).catch(err=>{

                                                                        })
                                                                        // console.log(values)
                                                                    }}
                                                                >

                                                                    {({ resetForm }) => (
                                                                    <Form>
                                                                                    <div className="form-group row">
                                                                                        <label
                                                                                               className="col-sm-3 col-form-label">Người nhận</label>
                                                                                        <div className="col-sm-9">
                                                                                            <Field name="consignee"  component={Input}/>

                                                                                        </div>
                                                                                    </div>

                                                                        <div className="form-group row">
                                                                            <label
                                                                                   className="col-sm-3 col-form-label">Địa chỉ</label>
                                                                            <div className="col-sm-9">
                                                                                <Field name="address"  component={Input}/>
                                                                            </div>
                                                                        </div>

                                                                        <div className="form-group row">
                                                                            <label htmlFor="inputPassword"
                                                                                   className="col-sm-3 col-form-label">SĐT</label>
                                                                            <div className="col-sm-9">
                                                                                <Field name="tel"  component={Input}/>
                                                                            </div>
                                                                        </div>

                                                                        <div className="row">
                                                                            <div className="col justify-content-center">
                                                                                <button type="submit"
                                                                                        className="btn btn-success mr-2 btn-sm">Lưu
                                                                                </button>
                                                                                <button type="button"
                                                                                        className="btn btn-danger btn-sm" onClick={()=>{setCheckFormShipment(false); resetForm()}}>Huỷ
                                                                                </button>
                                                                            </div>

                                                                        </div>

                                                                    </Form>

                                                                    )}
                                                                </Formik>










                                                            </div>
                                                        </div>
                                                        :''}

                                                    </div>

                                                    <div className="my-5 step" data-wizard-type="step-content"
                                                         data-wizard-state={step === 2 ? "current" : ''}>


                                                        <ul className="dashboard-tabs nav nav-pills nav-danger row row-paddingless m-0 p-0"
                                                            role="tablist">
                                                            <li className="nav-item d-flex col flex-grow-1 flex-shrink-0 mr-3 mb-3 mb-lg-0" onClick={() => {
                                                                setShipMethod('air');
                                                                setStep(3)
                                                            }}>
                                                                <a className={shipMethod==='air'?'nav-link border py-10 d-flex flex-grow-1 rounded flex-column align-items-center active':'nav-link border py-10 d-flex flex-grow-1 rounded flex-column align-items-center'}
                                                                   data-toggle="pill" href="#tab_forms_widget_1">
                    <span className="nav-icon py-2 w-auto">
                        <span className="svg-icon svg-icon-3x">
                      <SVG
                          src={toAbsoluteUrl("/media/svg/icons/Communication/Send.svg")}
                      />
                            </span>                    </span>
                                                                    <span
                                                                        className="nav-text font-size-lg py-2 font-weight-bold text-center">
                        Vận chuyển đường bay
                    </span>
                                                                </a>
                                                            </li>

                                                            <li className="nav-item d-flex col flex-grow-1 flex-shrink-0 mr-3 mb-3 mb-lg-0" onClick={() => {
                                                                setShipMethod('sea');
                                                                setStep(3)
                                                            }}>
                                                                <a className={shipMethod==='sea'?'nav-link border py-10 d-flex flex-grow-1 rounded flex-column align-items-center active':'nav-link border py-10 d-flex flex-grow-1 rounded flex-column align-items-center'}
                                                                   data-toggle="pill" href="#tab_forms_widget_2">
                    <span className="nav-icon py-2 w-auto">
                        <span className="svg-icon svg-icon-3x">
                        <SVG
                            src={toAbsoluteUrl("/media/svg/icons/Cooking/Dishes.svg")}
                        />
                           </span>                    </span>
                                                                    <span
                                                                        className="nav-text font-size-lg py-2 font-weight-bolder text-center">
                        Vận chuyển đường biển
                    </span>
                                                                </a>
                                                            </li>
                                                        </ul>


                                                    </div>

                                                    <div className="my-5 step" data-wizard-type="step-content"
                                                         data-wizard-state={step === 3 ? "current" : ''}>

 <Card>


                                                        <CardBody>
                                                            <div className="table-responsive table-bordered">
                                                                <table className="table mb-0">
                                                                    <thead>
                                                                    <tr>
                                                                        <th>Mã tracking</th>
                                                                        <th>Ngày giao dự kiến</th>
                                                                        <th>#</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        <Formik
                                                                            initialValues={{ code: ''}}

                                                                            validationSchema={Yup.object({
                                                                                code: Yup.string()
                                                                                    .required('Nhập mã tracking'),
                                                                            })}

                                                                        >
                                                                            {({ resetForm }) => (
                                                                                <tr>


                                                                                    <td> <Field name="code"  component={Input} value={code} onInput={e => setCode(e.target.value)}/></td>
                                                                                    <td>

                                                                                        <TextField
                                                                                            type="date"
                                                                                            defaultValue={expected_delivery}
                                                                                            onInput={e=>setExpectedDelivery(e.target.value)}
                                                                                            InputLabelProps={{
                                                                                                shrink: true
                                                                                            }}
                                                                                        />
                                                                                    </td>
                                                                                    <td> <button type="submit"
                                                                                                 className="btn btn-success mr-2 btn-sm" onClick={AddTracking}>Tạo tracking
                                                                                    </button>
                                                                                        <button type="button"
                                                                                                className="btn btn-danger btn-sm" onClick={()=> setCode('')}>Huỷ
                                                                                        </button></td>
                                                                                </tr>
                                                                            )}
                                                                        </Formik>
                                                                    {trackList.map((item, i)=>
                                                                        <tr key={i}>
                                                                            <td>{item.code}</td>
                                                                            <td width="30%">{item.expected_delivery}</td>
                                                                            <td><button type="button"
                                                                                        className="btn btn-danger btn-sm" onClick={()=>setTrackList(trackList.filter(val=>val.code !==item.code))}>Xoá
                                                                            </button></td>
                                                                        </tr>
                                                                    )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </CardBody>
                                                    </Card>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
                :
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={OrderSchema}
            onSubmit={(values, actions) => {
                if(product_id==''){
                    swal("Chọn san sản phẩm !", {
                        icon: "warning",
                    });
                    return;
                }
                if (typeOrder==='wholesale'){
                    if(supplier_id==''){
                        swal("Chọn nhà cung cấp !", {
                            icon: "warning",
                        });
                        return;
                    }
                }

                if(shipment_infor_id==''){
                    swal("Chọn thôn tin vận chuyển  !", {
                        icon: "warning",
                    });
                    return;
                }
                const data = {
                    'shipment_infor_id': shipment_infor_id,
                    'shipment_method_id': sea?'sea':'air',

                }

                if (typeOrder==='wholesale'){
                    data['item']= JSON.stringify({
                        'product_id': product_id,
                        'price': values.price,
                        'quantity': values.quantity,
                        'is_box': is_box?1:0,
                        'supplier_id': supplier_id,
                        'tax_percent': selectedValue,
                        'link': values.link,
                        'note': values.note,
                    })
                    data['type']='wholesale';
                }else if(typeOrder === 'auction'){
                    data['item']= JSON.stringify({
                        'product_id': product_id,
                        'price': values.price,
                        'quantity': values.quantity,
                        'link': values.link
                    })
                    data['type']='auction';
                }else if (typeOrder === 'paymentpartner'){
                    data['item']= JSON.stringify({
                        'product_id': product_id,
                        'price': values.price,
                        'quantity': values.quantity,
                        'tax_percent': selectedValue
                    })
                    data['type']='paymentPartner';
                }
                console.log(data)
                dispatch(createOrder(data)).then(res=>{
                    console.log(res.data.id)
                    history.push('/admin/orders/'+res.data.id);
                })
            }}
        >
            {(props: FormikProps<any>) => (

                <Form>
                    <Card>
                        <CardHeader title="Tạo đơn hàng">
                            <CardHeaderToolbar>
                                <Link
                                    type="button"
                                    className="btn btn-light"
                                    to={'/admin/orders'}
                                >
                                    <i className="fa fa-arrow-left"></i>
                                    Trở về
                                </Link>
                                {`  `}
                                <button type="button" className="btn btn-light ml-2" onClick={
                                  refreshForm}>
                                    <i className="fa fa-redo"></i>
                                    Làm mới
                                </button>
                                {`  `}
                                <button
                                    type="submit"
                                    className="btn btn-primary ml-2"
                                >
                                    Lưu
                                </button>
                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                    <div className="form-group row">
                        <div className="col-lg-8">
                            <label>Chọn sản phẩm </label>
                            <Autocomplete
                                // style={{ width: 800 }}
                                options={productList}
                                autoHighlight
                                onChange={onProductChange}
                                getOptionLabel={option => option.id}
                                renderOption={option => (
                                    <React.Fragment>
                                        {option.name.ja}  ({option.id})
                                    </React.Fragment>
                                )}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="form-group row mt-5">

                        <div className="col-lg-4">
                            <Field
                                type="number"
                                name="price"
                                placeholder="Nhập giá"
                                label="Giá"
                                component={Input}
                            />
                        </div>
                        <div className="col-lg-4">
                            <Field
                                type="number"
                                name="quantity"
                                placeholder="Nhập số lượng"
                                label="Số lượng"
                                component={Input}
                            />
                        </div>
                        { typeOrder !=='auction'&& typeOrder !== 'paymentpartner'?
                        <div className="col-lg-4">
                            <div className="checkbox-inline mt-9">
                                <label className="checkbox checkbox-lg">
                                    <input type="checkbox" checked={is_box} onChange={()=>setIsBox(!is_box)}/>
                                    <span></span>
                                    Thùng
                                </label>
                            </div>
                        </div>
                            :''}

                    </div>
                            {typeOrder==='auction'|| typeOrder === 'paymentpartner'?
                                <div className="form-group row">
                                    <div className="col-lg-8">
                                        <label>Thông tin vận chuyển</label>
                                        <Autocomplete
                                            options={shipmentList}
                                            autoHighlight
                                            onChange={onShipmentChange}
                                            getOptionLabel={option => option.address}
                                            renderOption={option => (
                                                <React.Fragment>
                                                    {option.consignee} - {option.address} + {option.tel}
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
                                </div>:''}
                            { typeOrder !=='auction'&& typeOrder !== 'paymentpartner'?
                                <div className="form-group row">
                                    <div className="col-lg-4">
                                        <label>Chọn nhà cung cấp </label>
                                        <Autocomplete
                                            options={supplierList}
                                            autoHighlight
                                            onChange={onSupplierChange}
                                            getOptionLabel={option => option.id}
                                            renderOption={option => (
                                                <React.Fragment>
                                                    {option.name ? option.name : option.id} {option.address ? '- ' + (option.address) : ''}
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
                                    <div className="col-lg-4">
                                        <label>Thông tin vận chuyển</label>
                                        <Autocomplete
                                            options={shipmentList}
                                            autoHighlight
                                            onChange={onShipmentChange}
                                            getOptionLabel={option => option.address}
                                            renderOption={option => (
                                                <React.Fragment>
                                                    {option.consignee} - {option.address} + {option.tel}
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
                                    <div className="col-lg-4">
                                        <label>Thuế</label>
                                        <Select
                                            value={taxList.filter(obj => obj.value === selectedValue)}
                                            options={taxList}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            :''}

                                    <div className="form-group row">
                                        <div className="col-lg-4">
                                            <label>Vận chuyển</label>
                                            <div className="radio-inline">
                                                <label className="radio radio-lg">
                                                    <input type="radio"  name="radios3_1" checked={sea} onChange={()=>setSea(true)}/>
                                                    <span></span>
                                                    Đường biển
                                                </label>
                                                <label className="radio radio-lg">
                                                    <input type="radio" name="radios3_1" onChange={()=>setSea(false)}/>
                                                    <span></span>
                                                    Đường bay
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            typeOrder !=='paymentpartner'?
                                        <div className="col-lg-4">
                                            <label>Đường dẫn</label>
                                            <Field
                                                name="link"
                                                className="form-control"
                                            />
                                        </div>
                                                :''
                                        }
                                        {
                                            typeOrder==='paymentpartner'?
                                                <div className="col-lg-4">
                                                    <label>Thuế</label>
                                                    <Select
                                                        value={taxList.filter(obj => obj.value === selectedValue)}
                                                        options={taxList}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                :''
                                        }
                                    </div>

                            {
                                typeOrder !== 'auction' && typeOrder !== 'paymentpartner'?
                                    <div className="form-group">
                                        <label>Mô tả</label>
                                        <Field
                                            name="note"
                                            as="textarea"
                                            className="form-control"
                                        />
                                    </div>
                                    :
                                   ''
                            }



                </CardBody>
                </Card>
                </Form>
            )}
        </Formik>
        }



        <div className="card-body p-0">
        </div>
    </div>




);
}