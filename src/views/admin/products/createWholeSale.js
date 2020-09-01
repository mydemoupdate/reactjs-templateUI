import React, { useEffect, useState } from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BootstrapTable from "react-bootstrap-table-next";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {
    getProductList, getProducts, getTaxesList, getShipmentList, createOrder, saveShipment,
    deleteShipment, getCustomer, getSupplier, getProductsS
} from '../../_redux_/productsSlice'
import { useDispatch } from "react-redux";
import Select from "react-select";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { result } from 'lodash';
export function CreateWholesale( props) {
    console.log(props?.match?.params?.id)
    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const dispatch = useDispatch();
    const history = useHistory();
    const [taxList, setTaxList] = useState([0]);
    const [selectedValue, setSelectedValue] = useState(0);
    const [customerList, setCustomerList] = useState([]);
    const [customerID, setCustomerID] = useState('');
    const [shipmentList, setShipmentList] = useState([]);
    const [shipMentObiect, setShipMentObject] = useState({
        consignee: '',
        address: '',
        tel: '',
        id: ''
    })
    const [productList, setPrdoctList] = useState([]);
    const [productObject, setProductObject] = useState({
        id: '',
        name: '',
        price: 0,
        quantity: 0,

    });
    const [product, setProduct] = useState([]);
    const [supplierList, setSupplierList] = useState([])
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isBox, setIsBox] = useState(false);
    const [properties, setProperties] = useState('');
    const [note, setNote] = useState('');
    const [noteItem, setNoteItem] = useState('');
    const [methodShip, setMethod] = useState('sea');
    const [supplierObject, setSupplierObject] = useState({
        id: '',
        name: '',
        address: '',
        email: ''
    })

    useEffect(() => {
        dispatch(getProductList()).then(res => {
            setPrdoctList(res.data.data);
        })

        dispatch(getTaxesList()).then(res => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    'value': _data[i].id,
                    'label': _data[i].name
                })
            }
            setSelectedValue(_data[0].id)
            setTaxList(result);
        })

        dispatch(getShipmentList()).then(res => {
            setShipmentList(res.data.data);
            console.log(res.data.data)
        })

        dispatch(getCustomer()).then(res => {
            setCustomerList(res.data.data);
        })
        // dispatch(getSupplier()).then(res=>{
        //     setSupplierList(res.data);
        // })
        getProductsS(ids).then(result => setProduct(result.data))
        getProductsS(ids).then(result => setSupplierList(result.data?.suppliers))
    }, [dispatch])
    let num = 1;
    const columns = [
        {
            dataField: "id_",
            text: "STT",
            sort: true,
        },
        {
            dataField: "name",
            text: "Tên",
            sort: true,
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
        },
        {
            dataField: "address",
            text: "Địa chỉ ",
            sort: true,
        },
        {
            dataField: "note",
            text: "Ghi chú",
            sort: true,
        },

    ]
    const onProductChange = (event, values) => {
        if (values) {
            setProductObject(values);
            setPrice(values.price);
        }
    }
    const onShipmentChange = (event, values) => {
        if (values) {
            setShipMentObject(values)
        }
    }
    const onCustomerChange = (event, values) => {
        if (values) {
            console.log(values)
            setCustomerID(values.id)
        }
    }
    const onSupplierChange = (event, values) => {
        if (values) {
            setSupplierObject(values)
        }
    }
    // handle onChange event of the dropdown
    const taxChange = (e) => {
        setSelectedValue(e.value);
        console.log(e.value)
    }
    const checkBox = (product?.unit?.name) === "Box" ? "1" : "0"

    const save = () => {

        if (shipMentObiect.id === '') {
            swal("Chọn thôn tin nhận hàng  !", {
                icon: "warning",
            });
            return;
        }
        if (customerID === '') {
            swal("Chọn khách hàng  !", {
                icon: "warning",
            });
            return;
        }
        const data = {
            shipment_method_id: methodShip,
            shipment_infor_id: shipMentObiect.id,
            type: 'payment'
        }
        data['item'] = JSON.stringify({
            'product_id': product.id,
            'price': product.price,
            'quantity': (product?.package?.quantity) === null ? "0" : product?.package?.quantity,
            'is_box': checkBox,
            'tax_percent': product?.tax_id,
            'note': noteItem,

        })
        console.log(data)


        swal({
            title: "Bạn có muốn tạo đơn hàng này?",
            icon: "warning",
            dangerMode: true,
            buttons: ["No", "Yes"],
        }).then((willUpdate) => {
            if (willUpdate) {
                setTimeout(() => {
                    dispatch(createOrder(data))
                        .then((res) => {
                            swal("Đã tạo đơn thành công!", {
                                icon: "success",
                            }).then(history.push("/admin/product"));

                        })
                        .catch((err) => {
                            console.log(err);
                            swal("Tạo đơn không thành công!", {
                                icon: "warning",
                            });
                        });
                }, 500)

            }
        });


    }
    console.log(product?.suppliers?.map(x => x.id))
    console.log(checkBox)

    return (
        <div>

            <div className="card card-custom card-transparent" style={{ height: "10%",  marginBottom:"1%" }}>
                <CardHeader title="Tạo đơn sỉ cho sản phẩm"></CardHeader>
            </div>
            <div style={{ height: "50%", display: "flex" }}>
                <Card style={{ width: "64%", marginRight: "1%", padding: "1% 1% 1% 1%" }}>
                    <div className="col-md-7">
                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-text-xl" style={{ marginBottom: "4%", marginTop: "3%" }}>
                            Thông tin sản phẩm
                        </div>
                    </div>
                    <div className="col-7 border-top-0">
                        <div className="table-responsive border-top-0">
                            <table className="table border-top-0">
                                <tbody>
                                    <tr className="font-weight-boldest border-top-0">
                                        <td className="pt-1 border-top-0 " style={{ display: 'flex' }}>
                                            <span className="bullet bullet-bar bg-success align-self-stretch" style={{ marginRight: "3%" }}></span>
                                            <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                Mã sản phẩm:
                                            </div>
                                        </td>
                                        <td className="pt-1 border-top-0">{product.id}</td>
                                        <div style={{ marginRight: "1rem" }}></div>
                                    </tr>
                                    <tr className="font-weight-boldest">
                                        <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                            <span className="bullet bullet-bar bg-primary align-self-stretch" style={{ marginRight: "3%" }}></span>
                                            <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                Tên sản phẩm:
                                            </div>
                                        </td>
                                        <td className="pt-5 border-top-0 ">{product.name}</td>
                                    </tr>
                                    <tr className="font-weight-boldest">
                                        <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                            <span className="bullet bullet-bar bg-warning align-self-stretch" style={{ marginRight: "3%" }}></span>
                                            <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                Giá:
                                            </div>
                                        </td>
                                        <td className="pt-5  border-top-0 ">{product.price}</td>
                                    </tr>

                                    <tr className="font-weight-boldest">
                                        <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                            <span className="bullet bullet-bar bg-dark align-self-stretch" style={{ marginRight: "3%" }}></span>
                                            <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                Số lượng:
                                            </div>
                                        </td>
                                        <td className="pt-5 border-top-0 ">{product?.package?.quantity}</td>
                                    </tr>
                                    <tr className="font-weight-boldest">
                                        <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                            <span className="bullet bullet-bar bg-danger align-self-stretch" style={{ marginRight: "3%" }}></span>
                                            <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                Đơn vị:
                                            </div>
                                        </td>
                                        <td className="pt-5 border-top-0 ">{product?.unit?.name}</td>
                                    </tr>

                                    <tr className="font-weight-boldest">
                                        <td className="pt-5 border-top-0   " style={{ display: 'flex' }}>
                                            <span className="bullet bullet-bar bg-muted align-self-stretch" style={{ marginRight: "3%" }}></span>
                                            <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                Thuộc tính:
                                            </div>
                                        </td>
                                        <td className="pt-5  border-top-0  ">
                                            <input type="text" className="form-control" defaultValue={properties} onChange={(e) => { setProperties(e.target.value) }} />
                                        </td>
                                    </tr>

                                    <tr className="font-weight-boldest">
                                        <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                            <span className="bullet bullet-bar bg-info align-self-stretch" style={{ marginRight: "3%" }}></span>
                                            <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                Thuế:
                                            </div>
                                        </td>
                                        <td className="pt-5 border-top-0 "> {product?.tax?.name}</td>
                                    </tr>
                                    <tr className="font-weight-boldest">
                                        <td className="pt-5 border-top-0" style={{ display: 'flex' }}>
                                            <span className="bullet bullet-bar bg-success align-self-stretch" style={{ marginRight: "3%" }}></span>
                                            <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                Ghi chú:
                                            </div>
                                        </td>
                                        <td className="pt-1 border-top-0">
                                            <input className="form-control" defaultValue={noteItem} onChange={(e) => { setNoteItem(e.target.value) }} />
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
                <Card style={{ width: "35%", marrginRight: "1%", padding: "1% 1% 1% 1%" }}>
                    <div className="form-group row mb-1">
                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-text-xl" style={{ marginBottom: "2%", marginTop: "3%" }} >
                            Thông tin người nhận hàng
                        </div>
                        <div className="col-7">
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
                    </div>
                    {
                        shipMentObiect.consignee ?
                            <div className="table-responsive border-top-0">
                                <table className="table border-top-0">
                                    <tbody>
                                        <tr className="font-weight-boldest border-top-0">
                                            <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                <span className="bullet bullet-bar bg-success align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg border-top-0">
                                                    Người nhận:
                                                </div>
                                            </td>
                                            <td className="pt-5 border-top-0">{shipMentObiect.consignee} </td>
                                        </tr>
                                        <tr className="font-weight-boldest">
                                            <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                <span className="bullet bullet-bar bg-primary align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                    Địa chỉ:
                                                </div>
                                            </td>
                                            <td className="pt-5 border-top-0 ">{shipMentObiect.address}</td>
                                        </tr>
                                        <tr className="font-weight-boldest">
                                            <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                <span className="bullet bullet-bar bg-warning align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                    Số điện thoại:
                                                </div>
                                            </td>
                                            <td className="pt-5  border-top-0 ">{shipMentObiect.tel} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            : ''
                    }
                </Card>
            </div>
            <div style={{ height: "20%" }}>
                <Card style={{ padding: "1% 1% 1% 1%" }}>
                    <div className="col-7">
                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-text-xl" style={{ marginBottom: "2%", marginTop: "3%" }} >
                            Thông tin khách hàng
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <tbody>
                                    <tr className="font-weight-boldest">
                                        <td className=" pt-5 border-top-0" >Khách hàng:</td>
                                        <td className="pt-2 border-top-0" >
                                            <Autocomplete
                                                options={customerList}
                                                autoHighlight
                                                onChange={onCustomerChange}
                                                getOptionLabel={option => option.email}
                                                renderOption={option => (
                                                    <React.Fragment>
                                                        {option.email} -  ({option.id})
                                                    </React.Fragment>
                                                )}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </td>
                                    </tr>

                                    <tr className="font-weight-boldest">
                                        <td className="pt-5 border-top-0" >Hình thức vận chuyển:</td>
                                        <td className="pt-2 border-top-0" >
                                            <select defaultValue="sea" onChange={(e) => { setMethod(e.target.value) }} className="form-control">

                                                <option value="sea">Đường biển</option>
                                                <option value="air">Đường bay</option>

                                            </select>
                                        </td>
                                    </tr>

                                    <tr className="font-weight-boldest">
                                        <td className="border-top-0" >Ghi chú:</td>
                                        <td className="border-top-0" >
                                            <textarea className="form-control" defaultValue={note} onChange={(e) => { setNote(e.target.value) }}></textarea>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-12">
                        <button type="button" className="btn btn-primary float-right" onClick={save}>Tạo đơn</button>
                    </div>
                </Card>
            </div>
        </div>


    );
}


