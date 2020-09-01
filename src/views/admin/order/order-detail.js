import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  CardFooter,
} from "../../../_metronic/_partials/controls";
import {
  getOrderById,
  getProductList,
  getSupplierList,
  getShimmentMethodBy,
  getBox,
  getTransaction,
  getLadingBills,
  getNotification,
  updateStatus,
  updateOrder,
  writeNotification,
  createTracking,
  updateItemOrder
} from "../../_redux_/ordersSlice";
import { useParams } from "react-router-dom";
import Moment from "moment";
import swal from "sweetalert";
import Select from "react-select";
import { Link, useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "../../../assets/css/style-main.css";
import { Button, Modal, OverlayTrigger, Tooltip} from 'react-bootstrap';
import TextField from "@material-ui/core/TextField";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import cellEditFactory from 'react-bootstrap-table2-editor';
export function OrderDetail() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [steps, setStep] = useState([]);
  const [checkModalTracking, setCheckModalTracking] = useState(false);
  const [statusObject, setStatusObject] = useState({
    id: "",
    name: "",
  });
  const [orderObject, setOrderObject] = useState({
    type: {
      id: "Retail",
      name: "",
    },
    steps: [],
    id: "",
    status: { name: "" },
    note: "",
    created_at: "",
    updated_at: "",
    cost: {
      sub_total: 0,
      tax: 0,
      addtional: 0,
      discount_tax_percent: 0,
      balance: 0,
    },
    items: [
      {
        id: "",
        trackings: [],
        purchase: { items: [] },
      },
    ],
    shipment_infor: {
      consignee: "",
      address: "",
      tel: "",
    },
    shipment_method_id: "air",
    shipmentMethodWarehouse: { fee: 0 },
    trackings: [],
  });
  const classArray = ["warning", "success", "danger", "info", "primary"];
  const [fee, setFee] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const [ladingBill, setLadingBill] = useState([]);
  const [transition, setTransition] = useState([]);
  const [log, setLog] = useState([
    {
      content: {},
      class: "",
    },
  ]);
  const [selectedValue, setSelectedValue] = useState("");
  const [contentLog, setContentLog] = useState("");
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


  const { id } = useParams();
  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id)).then((res) => {
        const object = res.data || {};
        setSelectedValue(object.shipment_method_id);
        setStep(object.steps);
        setStatusObject({
          id: object.status.id,
          name: object.status.name,
        });
        if (object.type.id !== "Shipment") {
          var productID = [];
          var objectItems = object.items || [];
          for (var i = 0; i < objectItems.length; i++) {
            productID.push(objectItems[i].product_id);
          }
          console.log(object);
          if (objectItems.length > 0) {
            dispatch(getProductList(productID.join(";")))
              .then((response) => {
                const _data = response.data.data || [];
                objectItems.forEach((value, i) => {
                  _data.forEach((product) => {
                    if (value.product_id === product.id) {
                      value["name"] = product.name;
                    }
                  });
                  if (object.type.id !== "Payment") {
                    if (i === objectItems.length - 1) {
                      setOrderObject(object);
                    }
                  }
                });

                if (object.type.id === "Payment") {
                  var supplierID = [];
                  for (var i = 0; i < objectItems.length; i++) {
                    supplierID.push(objectItems[i].supplier_id);
                  }
                  dispatch(getSupplierList(supplierID.join(";")))
                    .then((response) => {
                      const _data = response.data.data || [];
                      objectItems.forEach((value, i) => {
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
                        if (i === objectItems.length - 1) {
                          setOrderObject(object);
                        }
                      });
                    })
                    .catch(() => {
                      setOrderObject(object);
                    });
                }
              })
              .catch(() => {
                setOrderObject(object);
              });
          } else {
            setOrderObject(object);
          }
        } else {
          setOrderObject(object);
        }

        dispatch(getShimmentMethodBy(object.shipment_method_id)).then((res) => {
          setFee(res.data.fee);
        });

        
      });
      dispatch(getBox(id)).then((res) => {
        setBoxes(res.data.data);
      });

      dispatch(getLadingBills(id)).then((res) => {
        setLadingBill(res.data.data);
      });

      dispatch(getTransaction(id)).then((res) => {
        setTransition(res.data.data);
      });
    
      getMessage(id);
    }
  }, [dispatch]);
  function getOrderShipment(id){
    dispatch(getOrderById(id)).then((res) => {
      const object = res.data || {};
      setOrderObject(object);
    });
  }
  function getMessage(id){
    var logArr = [];
    dispatch(getNotification(id,1)).then((res) => {
      const _data = res.data.data || [];
      const pageLast = res.data.last_page;
      logArr=logArr.concat(changeDataLog(_data));
      if(pageLast>1){
        for(var i=2 ;i<=pageLast;i++){
          dispatch(getNotification(id,i)).then((log) => {
            var arrDataLog = log.data.data || [];
            logArr = logArr.concat(changeDataLog(arrDataLog));
            if(i>pageLast){
              setLog(logArr)
            }  
          })
        }
      }else{
        // console.log(logArr);
        setLog(logArr)
      }
       
    });
  }
  function changeDataLog(arr){
    var index = 0;
    for(var i =0 ;i<arr.length;i++){
      index += 1;
      if (index > classArray.length - 1) {
        index = 0;
      }
      arr[i]["class"] = classArray[index];
      arr[i].content = JSON.parse(arr[i].content);
      if (arr[i].content.wrote) {
        if (arr[i].content.wrote.toString().indexOf("{") != -1) {
          arr[i].content.wrote = JSON.parse(arr[i].content.wrote);
        }
      }
      console.log(arr[i].content);
      for(var key in arr[i].content){
       
        if(key == 'wrote' || key =='supplier_id' || key =='director_id' || key =='product_id'){
          console.log(key);
          break;
        }else{
          arr[i].content['product']={
            id: key,
            name: arr[i].content[key]
          };
          console.log(key);
          console.log(arr[i].content[key])
          // if(arr[i].content[key]?.quantity){
          //   console.log(i, ' quantity');
          // }else if(arr[i].content[key]?.price){
          //   console.log(i,'   price');
          // }
         
        }
      }
      console.log(arr);
    }
    return arr;
  }
  const shipOption = [
    {
      label: "Đường biển",
      value: "sea",
    },
    {
      label: "Đường bay",
      value: "air",
    },
  ];
  const shipMethodChange = (e) => {
    console.log(e.value);
    setSelectedValue(e.value);
    dispatch(
      updateOrder({
        id: orderObject.id,
        shipment_method_id: e.value,
      })
    ).then((res) => {
      orderObject.shipment_method_id = res.data.shipment_method_id;

      swal("Đã cập nhật hình thức vận chuyển!", {
        icon: "success",
      });
      console.log(orderObject);
    });
  };

  const columns = [
    {
      dataField: "id",
      text: "STT",
      formatter: STTFormatter,
      editable: false,
    },
    {
      dataField: "xcv",
      text: "Sản phẩm",
      formatter: productFormatter,
      editable: false,
    },
    {
      dataField: "price",
      text: "Giá",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "quantity",
      text: "Số lượng",

      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "13",
      text: "Chi phí",
      editable: false,
      formatter: costFormatter,
    },
    {
      dataField: "123",
      text: "Tracking",
      editable: false,
      formatter: trackingFormatter,
    },
  ];
  const columnsWholesale = [
    {
      dataField: "id",
      text: "STT",
      formatter: STTFormatter,
      editable: false,
    },
    {
      dataField: "xcv",
      text: "Sản phẩm",
      formatter: productFormatter,
      editable: false,
    },
    {
      dataField: "price",
      text: "Giá bán",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "xvxvsd",
      text: "Giá mua",
      formatter: priceFormatter,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      dataField: "quantity",
      text: "Số lượng bán",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "12",
      text: "Số lượng mua",
      formatter: quantityFormatter,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      dataField: "13",
      text: "Chi phí",
      formatter: costFormatter,
      editable: false,
    },
    {
      dataField: "123",
      text: "Tracking",
      formatter: trackingFormatter,
      editable: false,
    },
  ];
  
  const columnsPayment = [
    {
      dataField: "id",
      text: "STT",
      formatter: STTFormatter,
      editable: false,
    },
    {
      dataField: "xcv",
      text: "Sản phẩm",
      formatter: productFormatter,
      editable: false,
    },
    {
      dataField: "price",
      text: "Giá",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "quantity",
      text: "Số lượng",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "13",
      text: "Chi phí",
      formatter: costFormatter,
      editable: false,
    },
    {
      dataField: "su",
      text: "Nhà cung cấp",
      formatter: supplierFormatter,
      editable: false,
    },
    {
      dataField: "123",
      text: "Tracking",
      formatter: trackingFormatter,
      editable: false,
    },
  ];
  function supplierFormatter(cell, row, i) {
    return (
      <>
        <div>{row.supplier?.name}</div>
        <div>{row.supplier?.email}</div>
        <div>{row.supplier?.address}</div>
        <div>{row.supplier?.note}</div>
      </>
    );
  }
  function STTFormatter(cell, row, i) {
    return (
      <>
        <span>{i + 1}</span>
      </>
    );
  }
  function productFormatter(cell, row) {
    return (
      <>
        <div className="font-weight-bolder font-size-lg">{row.name}</div>
        <div>
          Thuế: <span className="text-primary font-weight-bold">{row.tax}</span>
        </div>
        <div>
          Hình thức:{" "}
          <span className="text-info">{row.is_box ? "Thùng" : "Cái"}</span>
        </div>
      </>
    );
  }
  function priceFormatter(cell, row) {
    return (
      <>
            {row?.purchase != null ? 
          
                row.purchase?.items.filter(
                  (val) => val.product_id == row.product_id
                ).length > 0 ? (
                  row?.purchase?.items.filter(
                    (val) => val.product_id == row.product_id
                  )[0].price
                ) :            
                0
             :         
              0
             
            }
      </>
    );
  }
  function quantityFormatter(cell, row) {
    return (
      <>
            {row?.purchase != null ? 
           
                row.purchase.items.filter(
                  (val) => val.product_id == row.product_id
                ).length > 0 ? (
                  row.purchase.items.filter(
                    (val) => val.product_id == row.product_id
                  )[0].quantity
                ): 
                0       
            :  
              0}
          </>
    );
  }
  function costFormatter(cell, row) {
    return (
      <>
        <div>
          Tiền hàng: <span className="text-primary">{row.amount}</span>
        </div>
        <div>
          Tiền thuế: <span className="text-primary">{row.tax}</span>{" "}
        </div>
        <div>
          Tổng tiền: <span className="text-primary">{row.balance}</span>{" "}
        </div>
      </>
    );
  }
  function trackingFormatter(cell, row) {
    return (
      <>
        {row.trackings.map((track, i) =>
          track.checked ? (
            <div key={i} className="mb-1">
              <span className="badge badge-info">{track.code}</span>
            </div>
          ) : (
            <div key={i} className="mb-1">
              <span className="badge badge-light">{track.code}</span>
            </div>
          )
        )}
      </>
    );
  }

  const CaptionElement = () => (
    <h3 style={{ color: "#3F4254" }}>
      Danh sách hàng hoá
    </h3>
  );
  const columnsBox = [
    {
      dataField: "id",
      text: "Mã SKU",
    },
    {
      dataField: "weight",
      text: "Trọng lượng",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "volume",
      text: "Thể tích",
      align: "center",
      headerAlign: "center",
    },
  ];
  const dataBox = [
    {
      id: 1223,
      weight: 23.4,
      volume: 12.3
    },
    {
      id: 12234,
      weight: 23.4,
      volume: 12.3
    },
    {
      id: 12235,
      weight: 23.4,
      volume: 12.3
    }
  ]
  const columnsLadingBills = [
    {
      dataField: "id",
      text: "Mã",
    },
    {
      dataField: "xcv",
      text: "Phương thức vận chuyển",
      align: "center",
      headerAlign: "center",
      formatter: shipmentMethodFormatter,
    },
    {
      dataField: "balance",
      text: "Tổng tiền",
      align: "center",
      headerAlign: "center",
    },
  ];
  const dataLadingBills = [
    {
      id: 1234,
      shipment_method_id: 'sea',
      balance: 123.25
    },
    {
      id: 12324,
      shipment_method_id: 'air',
      balance: 123.23
    },
    {
      id: 12354,
      shipment_method_id: 'sea',
      balance: 1233.2
    },
  ]
  function shipmentMethodFormatter(cell, row) {
    return (
      <>
        {row.shipment_method_id === "sea" ? (
           <span
           className="label label-lg label-light-primary label-inline"
           style={{ marginLeft: "0", marginTop: "0" }}
         >
           Đường bay
         </span>
        ) : (
          <span
          className="label label-lg label-light-info label-inline"
          style={{ marginLeft: "0", marginTop: "0" }}
        >
          Đường biển
         </span>
        )}
      </>
    );
  }

  const columnsTransaction = [
    {
      dataField: "amount",
      text: "Số tiền",
    },
    {
      dataField: "description",
      text: "Nội dung",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "user_id",
      text: "Người thực hiện",
      align: "center",
      headerAlign: "center",
    },
  ];
  const dataTrasaction = [
    {
      amount: 123.2,
      description: 'description',
      user_id: 'Admin'
    },
    {
      amount: 123.222,
      description: 'description',
      user_id: 'Admin'
    },
    {
      amount: 123.234,
      description: 'description',
      user_id: 'Admin'
    },
  ]

  const columnsTracking = [
    {
      dataField: "id",
      text: "STT",
      formatter: STTFormatter,
    },
    {
      dataField: "code",
      text: "Mã Tracking",
    },

    {
      dataField: "xvxvsd",
      text: "Ngày nhận hàng",
      align: "center",
      headerAlign: "center",
      formatter: expectedDeliveryFormatter,
    },
    {
      dataField: "12",
      text: "Hạn thanh toán",
      align: "center",
      headerAlign: "center",
      formatter: paymentDueDateFormatter,
    },
    {
      dataField: "xcv",
      text: "Trạng thái",
      formatter: statusFormatter,
    },
    {
      dataField: "action",
      text: "#",
      classes: "text-right",
      headerClasses: "text-right",
      formatter: actionFormatter,
      style: {
          minWidth: "100px",
      },
  },
  ];
  function actionFormatter(cell, row, rowIndex, formatExtraData) {
    return (
            <>
            <OverlayTrigger
                overlay={<Tooltip>Xoá Tracking</Tooltip>}
            >
                <a
                    className="btn btn-icon btn-light btn-hover-danger btn-sm"
                    onClick={() => {
                      dispatch(updateOrder({
                        id: orderObject.id,
                        params: JSON.stringify(['trackings',row.id.toString()]),
                        action: 'detach'
                      })).then(()=>{
                        swal("Xoá tracking thành công!", {
                          icon: "success",
                      });
                      getOrderShipment(id);
                      })
                    }}
                >
                    <span className="svg-icon svg-icon-md svg-icon-danger">
                        <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                    </span>
                </a>
            </OverlayTrigger>
        </>
    );
}
  function expectedDeliveryFormatter(cell, row) {
    return (
      <>
        {row.expected_delivery
          ? Moment(row.expected_delivery).format("DD-MM-YYYY HH:MM")
          : ""}
      </>
    );
  }
  function paymentDueDateFormatter(cell, row) {
    return (
      <>
        {row.payment_due_date
          ? Moment(row.payment_due_date).format("DD-MM-YYYY HH:MM")
          : ""}
      </>
    );
  }
  function statusFormatter(cell, row) {
    return (
      <>
        {row.checked ? (
          <span
            className="label label-lg label-light-success label-inline"
            style={{ marginLeft: "0", marginTop: "0" }}
          >
            Đã nhận
          </span>
        ) : (
          <span
            className="label label-lg label-light-info label-inline"
            style={{ marginLeft: "0", marginTop: "0" }}
          >
            Chưa nhận
          </span>
        )}
      </>
    );
  }

  const AddTracking= ()=>{
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
 dispatch(updateOrder({
     id: orderObject.id,
     params: JSON.stringify(['trackings',_data.id.toString()]),
     action: 'attach'
 })).then((res)=>{
  swal("Tạo tracking thành công!", {
    icon: "success",
});
getOrderShipment(id);
 })
}).catch(()=>{
swal("Mã tracking đã tồn tại!", {
  icon: "warning",
});
})

      setCode('');
  }
  return (
    <React.Fragment>
      <div className="row">
        <div className="col pl-0 pr-0">
          <Card>
            <CardHeader title={
              orderObject.type?.id == "Wholesale" ?'Chi tiết đơn sỉ':
              orderObject.type?.id == "Retail" ?'Chi tiết đơn lẻ':
              orderObject.type?.id == "Shipment" ?'Chi tiết đơn vận chuyển hộ':
              orderObject.type?.id == "Payment" ?'Chi tiết đơn thanh toán hộ':
              'Chi tiết đơn đấu giá'
            }>
              <CardHeaderToolbar>
                {orderObject.type?.id == "Wholesale" ? (
                  <Link
                    to={"/admin/orders/create-wholesale"}
                    type="button"
                    className="btn btn-primary mr-1"
                  >
                    <i className="fa fa-plus"></i>
                    Tạo đơn sỉ
                  </Link>
                ) : orderObject.type?.id == "Shipment" ? (
                  <Link
                    to={"create-shippingpartner"}
                    type="button"
                    className="btn btn-primary mr-1"
                  >
                    <i className="fa fa-plus"></i>
                    Tạo đơn vận chuyển hộ
                  </Link>
                ) : orderObject.type?.id == "Payment" ? (
                  <Link
                    to={"create-paymentpartner"}
                    type="button"
                    className="btn btn-primary mr-1"
                  >
                    <i className="fa fa-plus"></i>
                    Tạo đơn thanh toán hộ
                  </Link>
                ) : (
                  ""
                )}
              </CardHeaderToolbar>
            </CardHeader>
          </Card>
        </div>
        {steps.length > 0 ? (
          <div className="col-auto pr-0">
            <Card>
              <CardHeader title={"Thay đổi trạng thái đơn "}>
                <CardHeaderToolbar>
                  {steps.map((item) => (
                    <div key={item}>
          
                      <button
                        type="button"
                        className="btn btn-primary mr-1"
                        onClick={() => {
                          dispatch(updateStatus(orderObject.id, item))
                            .then((res) => {
                              swal("Đã cập nhật trạng thái!", {
                                icon: "success",
                              });
                              setStep(res.data.steps);
                              setStatusObject({
                                name: res.data.status.name,
                                id: res.data.status.id,
                              });
                              getMessage(id);
                            })
                            .catch(() => {
                              swal("Chưa có sản phẩm nào trong đơn!", {
                                icon: "warning",
                              });
                            });
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

      {orderObject.type.id !== "Shipment" ? (
        <>
          <div className="row">
            <div className="col-5 pl-0 pr-0">
              <Card style={{ height: "410px" }}>
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
                    <label className="col-5 col-form-label">Loại:</label>
                    <div className="col-7">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.type.id == "Retail" ? (
                          <span className="font-weight-bold text-primary">
                            {orderObject.type.name}
                          </span>
                        ) : orderObject.type.id == "Wholesale" ? (
                          <span className="font-weight-bold text-danger">
                            {orderObject.type.name}
                          </span>
                        ) : orderObject.type.id == "Auction" ? (
                          <span className="font-weight-bold text-success">
                            {orderObject.type.name}
                          </span>
                        ) : orderObject.type.id == "Auction" ? (
                          <span className="font-weight-bold text-info">
                            {orderObject.type.name}
                          </span>
                        ) : (
                          <span className="font-weight-bold text-warning">
                            {orderObject.type.name}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-5 col-form-label">Ghi chú:</label>
                    <div className="col-7">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.note}
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
            <div className="col-3">
              <Card style={{ height: "410px" }}>
                <CardHeader title={"Chi phí"}></CardHeader>
                <CardBody>
                  <div className="form-group row my-2">
                    <label className="col-7 col-form-label">Tiền hàng:</label>
                    <div className="col-5 pl-0">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.cost.sub_total}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-7 col-form-label">Phụ phí:</label>
                    <div className="col-5 pl-0">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.cost.addtional}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-7 col-form-label pr-0">
                      Chiết khấu thuế:
                    </label>
                    <div className="col-5 pl-0">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.cost.discount_tax_percent}%
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-7 col-form-label">Tổng tiền:</label>
                    <div className="col-5">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.cost.balance}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-4">
              <div className="row">
                <div className="col-12 pl-0 pr-0">
                <Card style={{ height: "160px" }} className="mb-2">
                  <CardHeader className="pr-1" title={"Hình thức vận chuyển"} >
                  
                  </CardHeader>
                  <CardBody className="pb-1 pt-1">
                  <div className="form-group row my-2">
                      <label className="col-3 col-form-label"> Tên:</label>
                      <div className="col-9">
                      <Select
                          value={shipOption.filter(
                            (obj) => obj.value === selectedValue
                          )}
                          options={shipOption}
                          onChange={shipMethodChange}
                        />
                      </div>
                    </div>
                    {/* <div className="form-group row my-2">
                      <label className="col-3 col-form-label"> Tên:</label>
                      <div className="col-9">
                        <span className="form-control-plaintext font-weight-bolder">
                          {selectedValue == "air" ? "Đường bay" : "Đường biển"}
                        </span>
                      </div>
                    </div> */}
                    <div className="form-group row my-2">
                      <label className="col-3 col-form-label">Phí:</label>
                      <div className="col-9">
                        <span className="form-control-plaintext font-weight-bolder">
                          {fee}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                </div>
              
              </div>
              <div className="row">
             <div className="col-12 pl-0 pr-0">
             <Card style={{ height: "243px" }}>
                  <CardHeader title={"Thông tin giao hàng"}></CardHeader>
                  <CardBody className="pt-0 pb-0">
                    <div className="form-group row my-2">
                      <label className="col-4 col-form-label pr-0 pl-0">
                      
                        Người nhận:
                      </label>
                      <div className="col-8">
                        <span className="form-control-plaintext font-weight-bolder">
                          {orderObject.shipment_infor.consignee}
                        </span>
                      </div>
                    </div>
                    <div className="form-group row my-2">
                      <label className="col-4 col-form-label pr-0 pl-0">
                        Số điện thoại:
                      </label>
                      <div className="col-8">
                        <span className="form-control-plaintext font-weight-bolder">
                          {orderObject.shipment_infor.tel}
                        </span>
                      </div>
                    </div>
                    <div className="form-group row my-2">
                      <label className="col-4 col-form-label pr-0 pl-0">Địa chỉ:</label>
                      <div className="col-8">
                        <span className="form-control-plaintext font-weight-bolder">
                     
                          {orderObject.shipment_infor.address}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
             </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 pl-0 pr-0">
              <Card>
                <CardBody>
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    onTableChange={console.log('Ok')}
                    bordered={false}
                    keyField="id"
                    
                    caption={<CaptionElement />}
                    data={orderObject.items.length > 0 ? orderObject.items : []}
                    columns={
                      orderObject.type.id == "Payment"
                        ? columnsPayment
                        : orderObject.type.id=="Wholesale"?
                        columnsWholesale:
                        columns
                    }
                    cellEdit={ cellEditFactory({
                      mode: 'click',
                      beforeSaveCell: (oldValue, newValue, row, column) => { 
                        console.log(column);
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

                  />
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="row">
            <div className="col pl-0">
              <Card>
                <CardHeader
                  title={"Danh sách thùng hàng (Chưa có vận đơn)"}
                ></CardHeader>
                <CardBody style={{ height: "250px", overflow:'auto' }}>
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    remote
                    bordered={false}
                    keyField="id"
                    data={boxes.length > 0 ? boxes : dataBox}
                    columns={columnsBox}
                  />
                </CardBody>
              </Card>
            </div>
            <div className="col pr-0">
              <Card>
                <CardHeader title={"Danh sách vận đơn"}></CardHeader>
                <CardBody style={{ height: "250px", overflow:'auto' }}>
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    remote
                    bordered={false}
                    keyField="id"
                    data={ladingBill.length > 0 ? ladingBill : dataLadingBills}
                    columns={columnsLadingBills}
                  />
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="row">
            <div className="col pl-0">
              <Card>
                <CardHeader title={"Giao dịch phát sinh"}></CardHeader>
                <CardBody style={{ height: "300px", overflow:'auto' }}>
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    remote
                    bordered={false}
                    keyField="id"
                    data={transition.length > 0 ? transition : dataTrasaction}
                    columns={columnsTransaction}
                  />
                </CardBody>
              </Card>
            </div>
            <div className="col pr-0">
              <Card>
                <CardHeader title={"Lịch sử cập nhật"}></CardHeader>
                <CardBody>
                  <div style={{height: '200px', overflow: 'auto'}} onScroll={(event)=>{
                    const target = event.target;
                    if(target.scrollHeight - target.scrollTop == target.clientHeight){
                      console.log(target.scrollHeight+ '   '+target.scrollTop);
                      // target.scrollTop+=0;
                    }
                  }}>
                  <div
                    className="timeline timeline-5 mt-3 timeline-demo"
                    
                  >
                    {log.map((val, i) => (
                      <div className="timeline-item align-items-start" key={i}>
                        <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                          {val.updated_at
                            ? Moment(val.updated_at).format("DD-MM-YYYY HH:MM")
                            : "20/3/2020 10:30"}
                        </div>

                        <div className="timeline-badge">
                          <i
                            className={
                              "fa fa-genderless icon-xl text-" + val.class
                            }
                          ></i>
                        </div>

                        <div className="font-weight-mormal font-size-lg timeline-content text-muted pl-3">
                          {val.content?.wrote?.status ? (
                            <span>
                              Đã cập nhật trạng thái{" "}
                              <span className="text-primary">
                                {" "}
                                {val.content?.wrote?.status}
                              </span>
                            </span>
                          ) : val.content?.wrote ? (
                            val.content?.wrote
                          ) : val.content?.supplier_id ? (
                            <span>
                              Đã cập nhật supplier_id{" "}
                              <span className="text-primary">
                                {" "}
                                {val.content?.supplier_id}
                              </span>
                            </span>
                          ) : val.content?.director_id ? (
                            <span>
                              Đã cập nhật director_id{" "}
                              <span className="text-primary">
                                {" "}
                                {val.content?.director_id}
                              </span>
                            </span>
                          ) : val.content?.product_id ? (
                            <span>
                              Đã cập nhật product_id{" "}
                              <span className="text-primary">
                                {" "}
                                {val.content?.product_id}
                              </span>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

         
                  </div>
                  <div className="input-group mt-4">
                    <input
                      className="form-control"
                      value={contentLog}
                      onChange={(e) => {
                        setContentLog(e.target.value);
                      }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          console.log("OK", contentLog);
                          dispatch(
                            writeNotification({
                              content: contentLog,
                              logable_type: "AppEntitiesOrder",
                              logable_id: orderObject.id.toString(),
                            })
                          ).then((res) => {
                            console.log(res);
                            setContentLog("");
                            getMessage(orderObject.id)
                          });
                        }}
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
               
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-6 pl-0">
              <Card style={{ height: "405px" }}>
                <CardHeader title={"Thông tin đơn hàng"}></CardHeader>
                <CardBody>
                  <div className="form-group row my-2">
                    <label className="col-6 col-form-label">Mã đơn:</label>
                    <div className="col-6">
                      <span className="form-control-plaintext font-weight-bolder">
                        #{orderObject.id}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-6 col-form-label">Trạng thái:</label>
                    <div className="col-6">
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
                    <label className="col-6 col-form-label">Loại:</label>
                    <div className="col-6">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.type.id == "Retail" ? (
                          <span className="font-weight-bold text-primary">
                            {orderObject.type.name}
                          </span>
                        ) : orderObject.type.id == "Wholesale" ? (
                          <span className="font-weight-bold text-danger">
                            {orderObject.type.name}
                          </span>
                        ) : orderObject.type.id == "Auction" ? (
                          <span className="font-weight-bold text-success">
                            {orderObject.type.name}
                          </span>
                        ) : orderObject.type.id == "Auction" ? (
                          <span className="font-weight-bold text-info">
                            {orderObject.type.name}
                          </span>
                        ) : (
                          <span className="font-weight-bold text-warning">
                            {orderObject.type.name}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-6 col-form-label">Ghi chú:</label>
                    <div className="col-6">
                      <span className="form-control-plaintext font-weight-bolder">
                        {orderObject.note}
                      </span>
                    </div>
                  </div>

                  <div className="form-group row my-2">
                    <label className="col-6 col-form-label">
                      Ngày đặt hàng:
                    </label>
                    <div className="col-6">
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
                    <label className="col-6 col-form-label">
                      Cập nhật lần cuối:
                    </label>
                    <div className="col-6">
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
            <div className="col-6 pr-0">
              <div className="row">
                  <div className="col-12">
                  <Card>
                  <CardHeader title={"Hình thức vận chuyển"}>
                    {/* <CardHeaderToolbar>
                      <div style={{ width: "120px" }}>
                        {" "}
                        <Select
                          value={shipOption.filter(
                            (obj) => obj.value === selectedValue
                          )}
                          options={shipOption}
                          onChange={shipMethodChange}
                        />
                      </div>
                    </CardHeaderToolbar> */}
                  </CardHeader>
                  <CardBody className="pb-1 pt-1">
                  <div className="form-group row my-2">
                      <label className="col-2 col-form-label"> Tên:</label>
                      <div className="col-7">
                      <Select
                          value={shipOption.filter(
                            (obj) => obj.value === selectedValue
                          )}
                          options={shipOption}
                          onChange={shipMethodChange}
                        />
                      </div>
                    </div>
                    {/* <div className="form-group row my-2">
                      <label className="col-2 col-form-label"> Tên:</label>
                      <div className="col-10">
                        <span className="form-control-plaintext font-weight-bolder">
                          {selectedValue == "air" ? "Đường bay" : "Đường biển"}
                        </span>
                      </div>
                    </div> */}
                    <div className="form-group row my-2">
                      <label className="col-2 col-form-label">Phí:</label>
                      <div className="col-7">
                        <span className="form-control-plaintext font-weight-bolder">
                          {fee}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                  </div>
              </div>
              <div className="row">
                <div className="col-12">
                <Card>
                  <CardHeader title={"THÔNG TIN GIAO HÀNG"}></CardHeader>
                  <CardBody className="pt-0 pb-0">
                    <div className="form-group row my-2">
                      <label className="col-4 col-form-label">
                        {" "}
                        Người nhận:
                      </label>
                      <div className="col-8">
                        <span className="form-control-plaintext font-weight-bolder">
                          {orderObject.shipment_infor.consignee}
                        </span>
                      </div>
                    </div>
                    <div className="form-group row my-2">
                      <label className="col-4 col-form-label">
                        Số điện thoại:
                      </label>
                      <div className="col-8">
                        <span className="form-control-plaintext font-weight-bolder">
                          {orderObject.shipment_infor.tel}
                        </span>
                      </div>
                    </div>
                    <div className="form-group row my-2">
                      <label className="col-4 col-form-label">Địa chỉ:</label>
                      <div className="col-8">
                        <span className="form-control-plaintext font-weight-bolder">
                          {" "}
                          {orderObject.shipment_infor.address}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 pl-0 pr-0">
              <Card>
                <CardHeader title={"Danh sách tracking"}>
                  <CardHeaderToolbar>
                    <i className="ki ki-plus" style={{cursor: 'pointer'}} onClick={()=>setCheckModalTracking(true)}></i>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    classes="table table-head-custom table-vertical-center overflow-hidden"
                    remote
                    bordered={false}
                    keyField="id"
                    data={
                      orderObject.trackings.length > 0
                        ? orderObject.trackings
                        : []
                    }
                    columns={columnsTracking}
                   
                  />
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="row">
            <div className="col pl-0">
              <div className="row">
                <div className="col">
                  <Card style={{height: '100%'}}>
                    <CardHeader
                      title={"Danh sách thùng hàng (Chưa có vận đơn)"}
                    ></CardHeader>
                    <CardBody>
                      <BootstrapTable
                        wrapperClasses="table-responsive"
                        classes="table table-head-custom table-vertical-center overflow-hidden"
                        remote
                        bordered={false}
                        keyField="id"
                        data={boxes.length > 0 ? boxes : dataBox}
                        columns={columnsBox}
                      />
                    </CardBody>
                  </Card>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col">
                  <Card style={{height: '100%'}}>
                    <CardHeader title={"Danh sách vận đơn"}></CardHeader>
                    <CardBody>
                      <BootstrapTable
                        wrapperClasses="table-responsive"
                        classes="table table-head-custom table-vertical-center overflow-hidden"
                        remote
                        bordered={false}
                        keyField="id"
                        data={ladingBill.length > 0 ? ladingBill : dataLadingBills}
                        columns={columnsLadingBills}
                      />
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
            <div className="col pr-0">
              <Card style={{height: '100%'}}>
                <CardHeader title={"Lịch sử cập nhật"}></CardHeader>
                <CardBody className="pb-0">
           <div style={{height:'455px', overflow:'auto'}}>
           <div
                    className="timeline timeline-5 timeline-demo mt-3"
                   
                  >
                    {log.map((val, i) => (
                      <div className="timeline-item align-items-start" key={i}>
                        <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                          {val.updated_at
                            ? Moment(val.updated_at).format("DD-MM-YYYY HH:MM")
                            : "12/2/2020 12:30"}
                        </div>

                        <div className="timeline-badge">
                          <i
                            className={
                              "fa fa-genderless icon-xl text-" + val.class
                            }
                          ></i>
                        </div>

                        <div className="font-weight-mormal font-size-lg timeline-content text-muted pl-3">
                          {val.content?.wrote?.status ? (
                            <span>
                              Đã cập nhật trạng thái{" "}
                              <span className="text-primary">
                                {val.content?.wrote?.status}
                              </span>
                            </span>
                          ) : val.content?.wrote ? (
                            val.content?.wrote
                          ) : val.content?.supplier_id ? (
                            <span>
                              Đã cập nhật supplier_id{" "}
                              <span className="text-primary">
                                {val.content?.supplier_id}
                              </span>
                            </span>
                          ) : val.content?.director_id ? (
                            <span>
                              Đã cập nhật director_id{" "}
                              <span className="text-primary">
                                {val.content?.director_id}
                              </span>
                            </span>
                          ) : val.content?.product_id ? (
                            <span>
                              Đã cập nhật product_id{" "}
                              <span className="text-primary">
                                {val.content?.product_id}
                              </span>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                
           </div>
        
            </CardBody>
            <CardFooter className="pt-0">
            <div className="input-group mt-4">
                    <input
                      className="form-control"
                      value={contentLog}
                      onChange={(e) => {
                        setContentLog(e.target.value);
                      }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() => {
                          dispatch(
                            writeNotification({
                              content: contentLog,
                              logable_type: "AppEntitiesOrder",
                              logable_id: orderObject.id.toString(),
                            })
                          ).then((res) => {
                            console.log(res);
                            setContentLog("");
                            getMessage(orderObject.id)
                          });
                        }}
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
             
            </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}


<Modal
          show={checkModalTracking}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Tạo Tracking
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="form-group row">
                      <label className="col-4 col-form-label"> Mã Tracking:</label>
                      <div className="col-8">
                      <input className="form-control" value={code} onChange={(e)=>{
    setCode(e.target.value)
}}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label"> Ngày giao hàng:</label>
                      <div className="col-8">
                      <TextField
    // style={{ width: 125 }}
    type="date"
    defaultValue={expected_delivery}
    onInput={e=>setExpectedDelivery(e.target.value)}
    InputLabelProps={{
        shrink: true
    }}
/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label"> Hạn thanh toán:</label>
                      <div className="col-8">
                      <TextField
    // style={{ width: 125 }}
    type="date"
    defaultValue={payment_due_date}
    onInput={e=>setPaymentDueDate(e.target.value)}
    InputLabelProps={{
        shrink: true
    }}
/>
                      </div>
                    </div>
          </Modal.Body>
          <Modal.Footer >
            <Button variant="secondary" onClick={()=>setCheckModalTracking(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={()=>AddTracking()}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
    </React.Fragment>
  );
}
