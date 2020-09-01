import React, {useEffect, useState} from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {FormControl,Button, Modal,Tab,Tabs} from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import {getOrderById,getProductList,updateItemOrder,getTaxesList} from '../../_redux_/ordersSlice'
import {useDispatch} from "react-redux";
import { useLocation} from "react-router";
import {useParams} from 'react-router-dom';
import {Link } from "react-router-dom";
import swal from "sweetalert";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    icon: {
        margin: theme.spacing(2),
    },
    iconHover: {
        margin: theme.spacing(2),
        '&:hover': {
            color: red[800],
        },
    },
}));


export function OrderDetailDemo() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [selectedValue, setSelectedValue] = useState();
    const [taxList, setTaxList] = useState([]);
    const [checkStatusOrder, setCheckStatusOrder] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [orderObject, setOrderObject] = useState({
        type: {id: ''},
        status: {name: {vi: ''}},
        cost: {},
        items: [{
            amount: 0
        }]
    });

    const columns = [
        {
            dataField: "id",
            text: "Mã đơn ",
            sort: true,
        },
        {
            dataField: "name",
            text: "Khách ",
            sort: true,
        }
    ]
   const arr = [
        {
            id: 1,
            name: 'name'
        }
    ]
    const { id } = useParams()
    let location = useLocation();
    useEffect(() => {
        dispatch(getTaxesList()).then(res=>{
            const _data = res.data || [];
            var result = [];
            for(var i = 0;i<_data.length;i++){
                result.push({
                    'value': _data[i].percent,
                    'label': _data[i].name
                })
            }
            // setSelectedValue(_data[0].percent)
            setTaxList(result);
        })
        dispatch(getOrderById(id)).then(res=>{
            const object = res.data || {};
            var productID = [];
            var objectItems = object.items || [];
            for(var i=0 ;i<objectItems.length;i++){
                productID.push(object.items[i].product_id);
            }
            console.log(object)
            if(objectItems.length>0){
                dispatch(getProductList(productID.join(';'))).then(response=>{
                    const _data = response.data.data || [];
                    objectItems.forEach((value,i) => {
                        _data.forEach(product => {
                            if(value.product_id === product.id){
                                if(product.name.ja){
                                    value['name']= product.name.ja;
                                }else if(product.name.en){
                                    value['name']= product.name.en;
                                }else {
                                    value['name']= product.name.vi;
                                }
                            }

                        })
                        value.tax_percent = Number(value.tax_percent);
                        console.log(value)
                        if(i===objectItems.length-1){


                            setOrderObject(res.data);
                        }
                    })
                }).catch(()=>{
                    objectItems.forEach((value,i) => {
                        console.log(Number(value.tax_percent))
                        value.tax_percent = Number(value.tax_percent);

                        if(i===objectItems.length-1){
                            setOrderObject(res.data);

                        }
                    })
                })
            }else {
                objectItems.forEach((value,i) => {
                    console.log(Number(value.tax_percent))
                    value.tax_percent = Number(value.tax_percent);
                    if(i===objectItems.length-1){
                        setOrderObject(res.data);
                    }
                })
            }
        })
    },[dispatch,location])

    const updatePrice= (e,item)=> {
        if (e.key === 'Enter') {
            console.log(e.target.value+'   ', item)
            const parms = {
                id: item.id,
                price: e.target.value
            }
            dispatch(updateItemOrder(parms)).then(()=>{
                swal("Đã thay đổi giá!", {
                    icon: "success",
                });
            })
        }
    }
    const updateQuantity= (e,item)=> {
        if (e.key === 'Enter') {
            const parms = {
                id: item.id,
                quantity: e.target.value
            }
            dispatch(updateItemOrder(parms)).then(()=>{
                swal("Đã thay đổi số lượng!", {
                    icon: "success",
                });
            })
        }
    }
    // handle onChange event of the dropdown
    const handleChange = (e) => {
        console.log(e.target.value)
    }
    return (
        <>

            <Card>
                <CardHeader title="Chi tiết đơn hàng">
                    <CardHeaderToolbar>
                        <Link
                            type="button"
                            to={'/admin/order-'+orderObject.type.id.toLowerCase()}
                            className="btn btn-light"
                        >
                            <i className="fa fa-arrow-left"></i>
                            Trở về
                        </Link>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                        <Tab eventKey="home" title="Thông tin chung">



                            <div className="card card-custom overflow-hidden">
                                <div className="card-body p-0">

                                    <div className="row justify-content-center py-8 px-8 py-md-27 px-md-0">
                                        <div className="col-md-9">
                                            <div className="d-flex justify-content-between pb-10 pb-md-20 flex-column flex-md-row">
                                                <h1 className="display-4 font-weight-boldest mb-10">Đơn lẻ <a href="#" className="mb-5">
                                                    <h4>#1299353</h4>
                                                </a></h1>
                                                <div className="d-flex flex-column align-items-md-end px-0">

                                                    {
                                                        checkStatusOrder?
                                                                    <select  defaultValue='0' onChange={()=>{
                                                                        setCheckStatusOrder(false)
                                                                    }} className="form-control">
                                                                        {taxList.map(object =>
                                                                            <option key={object.value} value={object.value}>{object.label}</option>
                                                                        )}
                                                                    </select>

                                                            :
<>

                                                      <span>
                                                                    <span className="badge badge-pill badge-success ml-2"
                                                                    > {orderObject.status.name.vi}</span>
                                                        <span className="svg-icon svg-icon-md svg-icon-primary"  style={{cursor: 'pointer'}} onClick={()=>setCheckStatusOrder(true)}>
                            <SVG
                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                            />
                        </span>
                                                      </span>
                                                                </>
                                                    }

                                                    <span className=" d-flex flex-column align-items-md-end opacity-70">
                            <span>Khách hàng: admin1</span>
                            <span>Ngày tạo: 12/2/1992</span>
                                                        <span>Cập nhật lần cuối: 12/2/1992</span>
                        </span>
                                                </div>
                                            </div>
                                            <div className="border-bottom w-100"></div>
                                            <div className="d-flex justify-content-between pt-6">
                                                <div className="d-flex flex-column flex-root">
                                                    <span className="font-weight-bolder mb-2">Hình thức vận chuyển</span>
                                                    <span className="opacity-70">Đường biển</span>
                                                    <span className="opacity-70">5k/1kg</span>
                                                </div>
                                                <div className="d-flex flex-column flex-root">
                                                    <span className="font-weight-bolder mb-2">Thông tin giao hàng</span>
                                                    <span className="opacity-70">Admin</span>
                                                    <span className="opacity-70">53 Hoá Mỹ, P Khuê Trung....</span>
                                                    <span className="opacity-70">000014</span>
                                                </div>
                                                <div className="d-flex flex-column flex-root">
                                                    <span className="font-weight-bolder mb-2">Ghi chú</span>
                                                    <span className="opacity-70">Iris Watson, P.O. Box 283 8562 Fusce RD.<br/>Fredrick Nebraska 20620</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row justify-content-center py-8 px-8 py-md-10 px-md-0">
                                        <div className="col-md-9">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th className="pl-0 font-weight-bold text-muted  text-uppercase">Description</th>
                                                        <th className="text-right font-weight-bold text-muted text-uppercase">Hours</th>
                                                        <th className="text-right font-weight-bold text-muted text-uppercase">Rate</th>
                                                        <th className="text-right pr-0 font-weight-bold text-muted text-uppercase">Amount</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr className="font-weight-boldest">
                                                        <td className="pl-0 pt-7">Creative Design</td>
                                                        <td className="text-right pt-7">80</td>
                                                        <td className="text-right pt-7">$40.00</td>
                                                        <td className="text-danger pr-0 pt-7 text-right">$3200.00</td>
                                                    </tr>
                                                    <tr className="font-weight-boldest border-bottom-0">
                                                        <td className="border-top-0 pl-0 py-4">Front-End Development</td>
                                                        <td className="border-top-0 text-right py-4">120</td>
                                                        <td className="border-top-0 text-right py-4">$40.00</td>
                                                        <td className="text-danger border-top-0 pr-0 py-4 text-right">$4800.00</td>
                                                    </tr>
                                                    <tr className="font-weight-boldest border-bottom-0">
                                                        <td className="border-top-0 pl-0 py-4">Back-End Development</td>
                                                        <td className="border-top-0 text-right py-4">210</td>
                                                        <td className="border-top-0 text-right py-4">$60.00</td>
                                                        <td className="text-danger border-top-0 pr-0 py-4 text-right">$12600.00</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row justify-content-center bg-gray-100 py-8 px-8 py-md-10 px-md-0">
                                        <div className="col-md-9">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th className="font-weight-bold text-muted  text-uppercase">BANK</th>
                                                        <th className="font-weight-bold text-muted  text-uppercase">ACC.NO.</th>
                                                        <th className="font-weight-bold text-muted  text-uppercase">DUE DATE</th>
                                                        <th className="font-weight-bold text-muted  text-uppercase">TOTAL AMOUNT</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr className="font-weight-bolder">
                                                        <td>BARCLAYS UK</td>
                                                        <td>12345678909</td>
                                                        <td>Jan 07, 2018</td>
                                                        <td className="text-danger font-size-h3 font-weight-boldest">20,600.00</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row justify-content-center py-8 px-8 py-md-10 px-md-0">
                                        <div className="col-md-9">
                                            <div className="d-flex justify-content-between">
                                                <button type="button" className="btn btn-light-primary font-weight-bold"
                                                        onClick="window.print();">Download Invoice
                                                </button>
                                                <button type="button" className="btn btn-primary font-weight-bold"
                                                        onClick="window.print();">Print Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </Tab>
                        <Tab eventKey="profile" title="Danh sách sản phẩm">
                            Danh sách sản phẩm
                        </Tab>
                        <Tab eventKey="contact" title="Contact">
                           dgd
                        </Tab>
                    </Tabs>


                </CardBody>
            </Card>






        <Card>
            <CardHeader title="Chi tiết đơn hàng">
                <CardHeaderToolbar>
                    <Link
                        type="button"
                        to={'/admin/order-'+orderObject.type.id.toLowerCase()}
                        className="btn btn-light"
                    >
                        <i className="fa fa-arrow-left"></i>
                        Trở về
                    </Link>
                </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
                <div className="col-12">
                        <p className="mb-2 font-weight-bold">
                            Đơn hàng:
                            <span className="text-primary font-size-lg"> #{orderObject.id}</span>
                        </p>

                    {
                        checkStatusOrder?
                            <div className="form-group row">
                                <label className="col-auto col-form-label font-weight-bold">Trạng thái:</label>
                                <div className="col-auto">
                                    <select  defaultValue='0' onChange={()=>{
                                        setCheckStatusOrder(false)
                                    }} className="form-control">
                                        {taxList.map(object =>
                                            <option key={object.value} value={object.value}>{object.label}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            :
                            <p className="mb-2 font-weight-bold">
                                Trạng thái:

                                <span className="badge badge-pill badge-success ml-2"
                                > {orderObject.status.name.vi}</span> <span className="svg-icon svg-icon-md svg-icon-primary"  style={{cursor: 'pointer'}} onClick={()=>setCheckStatusOrder(true)}>
                            <SVG
                                src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                            />
                        </span>
                            </p>
                    }


                        <p className="mb-2 font-weight-bold">
                            Khách hàng:
                            <span className="text-primary"> {orderObject.customer_id}</span>
                        </p>

                    {
                        orderObject.type.id === 'PaymentPartner' || orderObject.type.id === 'ShippingPartner'?
                            <div className="float-right">
                                <div className={classes.root}>
                                    <Icon className={classes.icon} color="primary" fontSize="large">
                                        add_circle
                                    </Icon>
                                </div>
                            </div>:''
                    }
                </div>
            </CardBody>
            <CardBody>
                <div className="table-responsive table-bordered">
                    <table className="table mb-0">
                        <thead>
                        <tr>
                            <th>Jancode</th>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thuế</th>
                            <th>Tổng tiền</th>

                            <th width="10%">Tracking</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderObject.items.map((item, i)=>
                            <tr key={i}>
                                <td>{item.product_id}</td>
                                <td width="30%">{item.name}</td>
                                <td width="12%">
                                    <FormControl type="number" defaultValue={item.price}  onChange={()=>{}} onKeyPress={(e)=>updatePrice(e,item)}/>
                                </td>
                                <td width="10%">
                                    <FormControl type="number" defaultValue={item.quantity} onChange={(e)=>{}} onKeyPress={(e)=>updateQuantity(e,item)}/>
                                </td>
                                <td>
                                    <select  defaultValue={item.tax_percent} onChange={handleChange} className="form-control">
                                        {taxList.map(object =>
                                            <option key={object.value} value={object.value}>{object.label}</option>
                                        )}
                                    </select>
                                </td>
                                <td>{item.amount.toLocaleString()}</td>

                                <td className="text-center">
                                    {
                                        item.tracking? item.tracking.map((track,i)=>
                                            <div key={i}>
                                                <span className="badge badge-success">{track.id}</span>
                                            </div>
                                        ):''
                                      }


                                </td>
                            </tr>
                        )}


                        <tr>
                            <th scope="col" colSpan="6" className="text-right">Thuế</th>
                            <th className="font-weight-bold text-center">{orderObject.cost.tax}</th>

                        </tr>
                        <tr>
                            <th scope="col" colSpan="6" className="text-right">Số dư</th>
                            <th className="font-weight-bold text-center">{orderObject.cost.balance}</th>

                        </tr>
                        <tr>

                            <th colSpan="6" className="text-right">Phần trăm chiếc khấu thuế</th>
                            <th className="font-weight-bold text-center">
                                <FormControl type="number" defaultValue={orderObject.cost.discount_tax_percent} onChange={(e)=>{}}/>

                            </th>
                        </tr>
                        <tr>

                            <th colSpan="6" className="text-right">Phụ phí</th>
                            <th className="font-weight-bold text-center">
                                <FormControl type="number" defaultValue={orderObject.cost.addtional} onChange={(e)=>{}}/>
                            </th>
                        </tr>

                        <tr>

                            <th colSpan="6" className="text-right">Phí vận chuyển hàng từ nhà cung cấp về kho</th>
                            <th className="font-weight-bold text-center">
                                <FormControl type="number" defaultValue={orderObject.cost.shipping_inside} onChange={(e)=>{}}/>
                            </th>
                        </tr>

                        <tr>

                            <th colSpan="6" className="text-right">Tổng</th>
                            <th className="font-weight-bold text-center">{orderObject.cost.sub_total}</th>
                        </tr>

    <tr>
        <th colSpan="7">
            {/*<Button variant="success" >Sửa đơn</Button>*/}
        <Button  className="ml-2 mr-2" onClick={handleShow}>Nhật ký đơn</Button>
    {/*<Button className="mr-2">Phát sinh gao dịch</Button>*/}
    {/*<Button>Đơn vận chuyển</Button>*/}
</th>
</tr>
</tbody>
</table>
</div>
            </CardBody>
        </Card>



    <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>
               Nhật ký đơn #{orderObject.id}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="table-responsive table-bordered">
                <table className="table mb-0">
                    <thead>
                    <tr>
                        <th width="15%" className="font-weight-bold text-center">Thao tác</th>
                        <th  className="font-weight-bold text-center">Nội dung</th>
                        <th width="15%" className="font-weight-bold text-center">Tác giả</th>
                    </tr>
                    </thead>
                    <tbody>


                    <tr>
                        <th className="font-weight-bold text-center">Thuế</th>
                        <th className="font-weight-bold text-center">sfs</th>
                        <th className="font-weight-bold text-center">dsd </th>
                    </tr>
                    </tbody>
                </table>
            </div>
        </Modal.Body>
    </Modal>
</>
    );
}


