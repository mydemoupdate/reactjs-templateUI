import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import Moment from "moment";
import {Link, useHistory} from "react-router-dom";
import {Form, FormControl} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { toAbsoluteUrl, removeCSSClass, addCSSClass } from "../../../_metronic/_helpers";
import { getPurchasesAll, getSupplierList, getPurchasesNoBuy,getProductList} from '../../_redux_/ordersSlice'
export function OrderPurchaseList() {
    const dispatch = useDispatch()
    const [listOrder, setListOrder] = useState([]);
    const [typeSearch, setTypeSearch] = useState();
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [checkExpand, setCheckExpand] = useState('true');
    const [purchaseListNoBuy, setPurchaseListNoBuy] = useState([]);
    const history = useHistory();
    useEffect(() => {
        dispatch(getPurchasesAll()).then(res=>{
            const dataObject = res.data || {};
            const dataItems = dataObject.data || [];
            var supplierID = [];
            for (var i = 0; i < dataItems.length; i++) {
              supplierID.push(dataItems[i].supplier_id);
            }
            dispatch(getSupplierList(supplierID.join(";")))
              .then((response) => {
                const _data = response.data.data || [];
                dataItems.forEach((value, i) => {
                  _data.forEach((supplier) => {
                    if (value.supplier_id === supplier.id) {
                      value["supplier"] = {
                        name: supplier.name,
                        email: supplier.email,
                        address: supplier.address,
                        note: supplier.note,
                      };
                    }
                  });
                  if (i === dataItems.length - 1) {
                      var productID = [];
                    for(var i = 0;i<dataItems.length;i++){
                        if(dataItems[i].items.length>0){
                           productID.push(dataItems[i].items[0].product_id);
                        }
                    }
                    console.log(productID)
                    dispatch(getProductList(productID.join(";"))).then((response)=>{
                        const dataProduct = response.data.data || [];
                        if(dataProduct.length>0){
                            for(var item =0;item<dataItems.length;item++){
                                for(var itemProduct=0;itemProduct< dataProduct.length;itemProduct++){
                                    if(dataItems[item].items[0].product_id== dataProduct[itemProduct].id){
                                        dataItems[item]['product']= {
                                            id: dataProduct[itemProduct].id,
                                            name: dataProduct[itemProduct].name
                                        }
                                    }
                                }
                            }
                            setListOrder(dataItems);
                        }else{
                            setListOrder(dataItems);
                        }
                        
                    }).catch(()=>{
                        setListOrder(dataItems);
                    })
                    setListOrder(dataItems);
                  }
                });
              })
              .catch(() => {
                setListOrder(dataItems);
              });
            setPerPage(dataObject.per_page);
            setTotal(dataObject.total);
            console.log(dataItems)
            
        })

        dispatch(getPurchasesNoBuy()).then((response)=>{
            setPurchaseListNoBuy(response.data.data);
        })

    }, [dispatch]);
    const onFindChange = (e) => {
        setTypeSearch(e.target.value);
    }
    const onFindChangeOrder = (e) => {

        setTypeSearch(e.target.value);
    }
    const onKeySearch = (e) => {
        if (e.key === 'Enter') {
            if(typeSearch){
                dispatch(getPurchasesAll('search='+typeSearch+':'+e.target.value)).then(res=>{
                    const _data = res.data || {};
                    setPerPage(_data.per_page);
                    setTotal(_data.total);
                    setListOrder(_data.data);
                })
            }else {
                dispatch(getPurchasesAll('search'+e.target.value)).then(res=>{
                    const _data = res.data || {};
                    setPerPage(_data.per_page);
                    setTotal(_data.total);
                    setListOrder(_data.data);


                })
            }
            e.target.value="";

        }
    }

    const options = {
        hideSizePerPage: true,
        sizePerPage:perPage,
        totalSize:total,
        onPageChange: (page, sizePerPage) => {

        }
    };
    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            history.push('/admin/purchase/'+row.id);
        }
    };
    const columns = [
        {
            dataField: "id",
            text: "Mã đơn ",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "12344",
            text: "Sản phẩm",
            formatter: productMainFormatter,
        },
        {
            dataField: "supplier_id",
            text: "Nhà cung cấp",
            formatter: supplierFormatter,
        },
        {
            dataField: "status",
            text: "Trạng thái",
            formatter: statusFormatter,
        },

        {
            dataField: "updated_at",
            text: "Ngày tạo",
            sort: true,
            formatter: createFormatter,
            sortCaret: sortDate
        }
    ]
function sortDate(){
    return (
        <>
               <span className="svg-icon svg-icon-sm svg-icon-primary ml-1">
        <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Up-2.svg")}/>
      </span>

        </>
    )
}
function createFormatter(cell, row){
    return (
        <>
                <span>
                    {Moment(row.created_at).format('DD-MM-YYYY HH:MM') }
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


function supplierFormatter(cell, row){
    return (
        <>
            <div>
                {row?.supplier?.name}
            </div>
            <div>
            {row?.supplier?.address}
            </div>

        </>
    )
}
    const getHandlerTableChange = (e) => {
        console.log("Change  ",e );
    }
    const dataLeft = [
        {
            id: 11,
            name: 'Bách hoá Nhật Bản'
        },
        {
            id: 12,
            name: 'Quan jean'
        },
        {
            id: 13,
            name: 'Mỹ phẩm Nhật Bản'
        },
        {
            id: 14,
            name: 'Mỹ phẩm Nhật Bản'
        },
        {
            id: 15,
            name: 'Hiro Shima'
        },
        {
            id: 16,
            name: 'Nobita'
        },
    ]
    const columnsLeft = [
        {
            dataField: "id",
            text: "Mã đơn ",
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "customer_id",
            text: "Sản phẩm",
            formatter: productFormatter,
        }
    ]
    function productFormatter(cell, row){
        return (
            <>
                    <span>
                    {row.name}
                    </span>
            </>
        )
    }
    function productMainFormatter(cell, row){
        return (
            <>
                    <div>
                    {row?.product?.name?row.product.name:'Bách hoá Nhật Bản'}
                    </div>
                    <div>{
                        row?.product?.id?row.product.id:'2313131'
                        }</div>
            </>
        )
    }
    return (
        <React.Fragment>


<div className="row">
    <div className="col-3">
    <Card style={{height: '100%'}}>
                <CardHeader title="Đơn hàng chưa mua">
                    <CardHeaderToolbar>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <div className="row">
                        <div className="col-12 ">

                            <Form.Control as="select" onChange={onFindChangeOrder}>
                                <option value='director.type.id:Retail'>Đơn lẻ</option>
                                <option value='director.type.id:Wholesale'>Đơn sỉ</option>
                                <option value='director.type.id:Payment'>Đơn thanh toán hộ</option>
                            </Form.Control>
                        </div>
              

                    </div>

                    <div className="row mt-2">
                        <div className="col-12">
                            <BootstrapTable
                                wrapperClasses="table-responsive"
                                classes="table table-head-custom table-vertical-center overflow-hidden"
                                remote
                                hover
                                rowStyle={{cursor: "pointer"}}
                                bordered={false}
                                keyField='id'
                                data={purchaseListNoBuy.length>0?purchaseListNoBuy: dataLeft}
                                columns={columnsLeft}
                                // onTableChange={getHandlerTableChange}
                                // rowEvents={ rowEvents }
                                // pagination={paginationFactory(options)}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>
    </div>
    {/* <div className="col-3"> */}
    {/* <Card style={{height: '100%'}}>
                <CardHeader title="Hàng tồn kho">
                    <CardHeaderToolbar>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>

                    <div className="row mt-2">
                        <div className="col-12">
                            <BootstrapTable
                                wrapperClasses="table-responsive"
                                classes="table table-head-custom table-vertical-center overflow-hidden"
                                remote
                                hover
                                rowStyle={{cursor: "pointer"}}
                                bordered={false}
                                keyField='id'
                                data={listOrder}
                                columns={columnsLeft}
                                // onTableChange={getHandlerTableChange}
                                // rowEvents={ rowEvents }
                                // pagination={paginationFactory(options)}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>
    </div> */}
    <div className="col-9">
    <Card style={{height: '100%'}}>
                <CardHeader title="Danh sách đơn mua hàng">
                    <CardHeaderToolbar>
               
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <div className="row">
                        <div className="col-3 ">

                            <Form.Control as="select" onChange={onFindChange}>
                                <option value=''>Tất cả</option>
                                <option value='id'>Mã đơn hàng</option>
                                <option value='product.suppliers.name'>Nhà cung cấp</option>
                                <option value='product.products.id'>Mã hàng hoá</option>
                                <option value='product.products.name'>Tên hàng hoá</option>
                                <option value='director.status.name'>Trạng thái</option>
                                <option value='updated_at'>Ngày tạo</option>

                            </Form.Control>
                        </div>
                        <div className="col-9">
                            <FormControl
                                placeholder="Nội dung tìm kiếm"
                                onKeyPress={onKeySearch}
                            />
                        </div>

                    </div>

                    <div className="row mt-2">
                        <div className="col-12 pl-0">
                            <BootstrapTable
                                wrapperClasses="table-responsive"
                                classes="table table-head-custom table-vertical-center overflow-hidden"
                                remote
                                hover
                                rowStyle={{cursor: "pointer"}}
                                bordered={false}
                                keyField='id'
                                data={listOrder}
                                columns={columns}
                                onTableChange={getHandlerTableChange}
                                rowEvents={ rowEvents }
                                pagination={paginationFactory(options)}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>
    </div>
</div>
           

        </React.Fragment>

    );
}


