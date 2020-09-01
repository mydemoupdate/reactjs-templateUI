import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getOrderList, deleteOrder,getOrderAll } from '../../_redux_/ordersSlice'
import BootstrapTable from "react-bootstrap-table-next";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { FormControl, InputGroup, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import swal from 'sweetalert';
import { useLocation } from "react-router";
import {Link, useHistory} from "react-router-dom";
import Moment from 'moment';
export function OrderList() {
    const [listOrder, setListOrder] = useState([]);
    const [typeSearch, setTypeSearch] = useState();
    const [typeOrder, setTypeOrder] = useState();
    const [params, setParams] = useState();
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(0);

    const history = useHistory();

    const onFindChange = (e) => {
        setTypeSearch(e.target.value);
    }
    const onKeySearch = (e) => {
        if (e.key === 'Enter') {

            console.log(typeSearch)

            if(typeSearch){
                dispatch(getOrderAll('search='+typeSearch+':'+e.target.value+'&locale=vi')).then(res=>{
                    const _data = res.data || {};
                    setPerPage(_data.per_page);
                    setTotal(_data.total);
                    setListOrder(_data.data);


                })
            }else {
                dispatch(getOrderAll('search='+e.target.value+'&locale=vi')).then(res=>{
                    const _data = res.data || {};
                    setPerPage(_data.per_page);
                    setTotal(_data.total);
                    setListOrder(_data.data);


                })
            }
            e.target.value="";

        }
    }


    function deleteModal(object) { // React creates function whenever rendered
        swal({
            title: "Bạn có muốn xoá đơn " + object.id + " ?",
            icon: "warning",
            dangerMode: true,
            buttons: ["Huỷ", "Xoá"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    dispatch(deleteOrder(object.id)).then(() => {
                        swal("Đã xoá thành công!", {
                            icon: "success",
                        });
                        setParams("search=" + typeOrder + "&searchFields=director.type.id&page=1");
                        dispatch(getOrderList(params));

                    }).catch((err) => {
                        swal("Xoá thất bại !", {
                            icon: "warning",
                        });
                    })
                }
            });
    }
    const getHandlerTableChange = (e) => {
        console.log("Change  ",e );
    } // React creates function whenever rendered
    // Products UI Context
    const dispatch = useDispatch()
    let location = useLocation();

    useEffect(() => {
        // var orderType = 'retail';
        // if(location.pathname.includes('wholesale')){
        //     setTypeOrder('wholesale');
        //     orderType = 'wholesale';
        // }else if(location.pathname.includes('auction')){
        //     setTypeOrder("auction");
        //     orderType= "auction"
        // }else if (location.pathname.includes('shipping')){
        //     setTypeOrder("shippingpartner");
        //     orderType= "shippingpartner"
        // }else if (location.pathname.includes('payment')){
        //     setTypeOrder("paymentpartner");
        //     orderType= "paymentpartner"
        // }else{
        //     setTypeOrder("retail");
        //     orderType= "retail"
        // }
        // setParams("search="+typeOrder+"&searchFields=director.type.id&page=1");
        // console.log(typeOrder,'   parms:  ',params);
        // dispatch(getOrderList("page=1"));
        dispatch(getOrderAll('page=1&locale=vi&with=cost')).then(res=>{
            const _data = res.data || {};
            setPerPage(_data.per_page);
            setTotal(_data.total);
            setListOrder(_data.data);
        })

    }, [dispatch,location]);

    function sortPrice(){
        return (
            <>
               <span className="svg-icon svg-icon-sm svg-icon-primary ml-1" onClick={()=>{
                  // dispatch(getOrderAll('orderBy='))
               }}>
        <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Up-2.svg")}/>
      </span>

            </>
        )
    }

    function sortDate(){
        return (
            <>
               <span className="svg-icon svg-icon-sm svg-icon-primary ml-1">
        <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Down-2.svg")}/>
      </span>

            </>
        )
    }
    const columns = [
        {
            dataField: "id",
            text: "Mã đơn ",
            headerStyle: { color: 'black' },
            //  headerStyle: { fontWeight: 'bold' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Khách hàng",
        },
        {
            dataField: "status",
            text: "Trạng thái",
            formatter: statusFormatter,
        },
        {
            dataField: "cost.balance",
            text: "Đơn giá",
            sort: true,
            sortCaret: sortPrice,

        },
        {
            dataField: "note",
            text: "Ghi chú",
        },
        {
            dataField: "updated_at",
            text: "Cập nhật lúc",
            sort: true,
            formatter: createFormatter,
            sortCaret: sortDate,
        },
        {
            dataField: "type.name",
            text: "Loại đơn",
            sort: true,
            formatter: typeFormater

        }
    ]


    const columnsPayment = [
        {
            dataField: "id",
            text: "Mã đơn ",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Khách hàng",
            sort: true,
        },
        {
            dataField: "status",
            text: "Trạng thái",
            sort: true,
            formatter: statusFormatter,
        },
        {
            dataField: "shipment_infor_id",
            text: "Đơn giá",
            sort: true,
            sortCaret: sortPrice,

        },
        {
            dataField: "vv",
            text: "Nhà cung cấp",
            sort: true,
            formatter: supplierFormatter,
            // headerStyle: {textAlign: 'center'},
            // style:{textAlign: 'center'}
        },

        {
            dataField: "note",
            text: "Ghi chú",
            sort: true
        },
        {
            dataField: "updated_at",
            text: "Cập nhật lúc",
            sort: true,
            formatter: createFormatter,
            sortCaret: sortDate,
        },
        {
            dataField: "type.name",
            text: "Loại đơn",
            sort: true,

        }

        ]
    function supplierFormatter(cell, row){
        return (
            <>
                <div className="font-weight-bold">Đây là supplier {row.id}</div>
                <div>53 Hoa My ......</div>

            </>
        )
    }
    const columnsAuction = [
        {
            dataField: "id",
            text: "Mã đơn ",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Khách hàng",
            sort: true,
        },
        {
            dataField: "status",
            text: "Trạng thái",
            sort: true,
            formatter: statusFormatter,
        },
        {
            dataField: "jancode",
            text: "Sản phẩm",
            formatter: productFormatter,
            headerStyle: {textAlign: 'center'},
            style:{textAlign: 'center'}
        },
        {
            dataField: "shipment_infor_id",
            text: "Đơn giá",
            sort: true
        },
        {
            dataField: "note",
            text: "Ghi chú"
        },
        {
            dataField: "updated_at",
            text: "Cập nhật lúc",
            sort: true,
            formatter: createFormatter,
        },
        {
            dataField: "type.name.vi",
            text: "Loại đơn",
            sort: true,

        }

    ]
    function productFormatter(cell, row){
        return (
            <>
                <div className="font-weight-bold">Đây là sản phẩm {row.id}</div>
                <div>843883</div>

            </>
        )
    }
    const columnsShipping = [
        {
            dataField: "id",
            text: "Mã đơn ",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Khách hàng",
            sort: true,
        },
        {
            dataField: "status",
            text: "Trạng thái",
            formatter: statusFormatter,
        },
        {
            dataField: "note",
            text: "Ghi chú",
        },
        {
            dataField: "updated_at",
            text: "Cập nhật lúc",
            sort: true,
            formatter: createFormatter,
        },
        {
            dataField: "tr",
            text: "Danh sách tracking",
            formatter: trackingFormatter,
        },
        {
            dataField: "type.name",
            text: "Loại đơn",
            sort: true,

        }
    ]
    function trackingFormatter(cell, row){
        return (
            <>
                <span className="badge badge-pill badge-success">
                    123
                </span>
            </>
        )
    }
    function statusFormatter(cell, row){
        return (
            <>
                {row.status.id==='Approved'?
                    <span className="label label-lg label-light-info label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                    {row.status.name}
                    </span>
                    :
                    row.status.id==='Pending'?
                        <span className="label label-lg label-light-primary label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                    {row.status.name}
                    </span>
                        :
                        row.status.id==='Cancelled'?
                            <span className="label label-lg label-light-danger label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                    {row.status.name}
                    </span>:
                    row.status.id==='Finish'?
            <span className="label label-lg label-light-success label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                    {row.status.name}
                    </span>:
                    row.status.id==='Purchased'?
                    <span className="label label-lg label-light-warning label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                            {row.status.name}
                            </span>:
                             <span className="label label-lg label-light-dark label-inline" style={{marginLeft: '0', marginTop: '0'}}>
                             {row.status.name}
                             </span>
                }
            </>
        )
    }
    function createFormatter(cell, row){
        return (
            <>
                <span>
                    {row.created_at?Moment(row.created_at).format('DD-MM-YYYY HH:MM'):'' }
                </span>
            </>
        )
    }

    function typeFormater(cele, row){
        return (
            <>
            <span>
                <span className="label label-primary label-dot mr-2" style={{marginLeft: '0', marginTop: '0'}}></span>
                {
                    row.type.id=='Retail'?
                <span className="font-weight-bold text-primary" >{row.type.name}</span>:
                row.type.id=='Wholesale'?
                <span className="font-weight-bold text-danger">{row.type.name}</span>:
                row.type.id =='Auction'?
                <span className="font-weight-bold text-success">{row.type.name}</span>:
                row.type.id =='Shipment'?
                <span className="font-weight-bold text-info">{row.type.name}</span>:
                <span className="font-weight-bold text-warning">{row.type.name}</span>
                }
               
            </span>
            </>
        )
    }

    const options = {
        hideSizePerPage: true,
        sizePerPage:perPage,
        totalSize:total,
        onPageChange: (page, sizePerPage) => {
            console.log(page)
            dispatch(getOrderAll('page='+page+'&locale=vi')).then(res=>{
                console.log(res);
                const _data = res.data || {};
                setPerPage(_data.per_page);
                setTotal(_data.total);
                setListOrder(_data.data);


            })

        },
    };


    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            history.push('/admin/orders/'+row.id);
        }
    };

   
    return (
        <React.Fragment>

        <Card>
            <CardHeader title="Danh sách đơn hàng">
                <CardHeaderToolbar>
                    <Link to={'/admin/orders/create-wholesale'}
                          type="button"
                          className="btn btn-primary"
                    ><i className="fa fa-plus"></i>
                        Tạo đơn sỉ
                    </Link>
                    <Link to={'create-shippingpartner'}
                          type="button"
                          className="btn btn-primary ml-1 mr-1"
                    ><i className="fa fa-plus"></i>
                        Tạo đơn vận chuyển hộ
                    </Link>
                    <Link to={'create-paymentpartner'}
                          type="button"
                          className="btn btn-primary"
                    ><i className="fa fa-plus"></i>
                        Tạo đơn thanh toán hộ
                    </Link>
                </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <div className="row">
                        <div className="col-3 pl-0">

                            <Form.Control as="select" onChange={onFindChange}>
                                <option value=''>Tất cả</option>
                                <option value='id'>Mã đơn hàng</option>
                                <option value='customer_id'>Khách hàng</option>
                                <option value='note'>Ghi chú</option>
                                <option value='director.status.name'>Trạng thái</option>
                                <option value='director.type.name'>Loại đơn</option>
                                <option value='items.product_id'>Mã hàng hoá</option>
                                {
                                    typeOrder==='shippingpartner'?
                                        <option value='tracking.code'>Mã tracking</option>
                                        :
                                        typeOrder==='paymentpartner'?
                                            <option value='supplier.name'>Nhà cung cấp</option>:''

                                }
                            </Form.Control>
                        </div>
                        <div className="col-9 pr-0">
                            <FormControl
                                placeholder="Nội dung tìm kiếm"
                                onKeyPress={onKeySearch}
                            />
                        </div>

                    </div>

                    <div className="row mt-2">
                        <div className="col-12 pl-0">
                            <BootstrapTable
                                wrapperClasses="table-responsive table-hover"
                                classes="table table-head-custom table-vertical-center overflow-hidden"
                                remote
                                // hover
                                rowStyle={{cursor: "pointer"}}
                                bordered={false}
                                keyField='id'
                                data={listOrder}
                                columns={
                                    typeOrder==='shippingPartner'?
                                        columnsShipping:
                                        typeOrder === 'paymentPartner'?
                                            columnsPayment:
                                            typeOrder==='auction'?
                                                columnsAuction:columns

                                }
                                onTableChange={getHandlerTableChange}
                                rowEvents={ rowEvents }
                                pagination={paginationFactory(options)}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

        </React.Fragment>

    );
}


