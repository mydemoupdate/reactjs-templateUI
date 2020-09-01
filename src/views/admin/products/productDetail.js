import { Field, Formik, FormikProps } from 'formik';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,

} from "../../../_metronic/_partials/controls";
// import '../../../assets/css/wizard.wizard-4.css';
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import { OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import swal from 'sweetalert';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { useLocation } from "react-router";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Input } from "../FieldFeedbackLabel/input";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { getProduct, getPackage, getOrigins, getTaxes, getUnits, getProducts } from "../../_redux_/productsSlice";
import 'semantic-ui-css/semantic.min.css';
import { Image } from 'semantic-ui-react';
import { sortCaret, headerSortingClasses } from "../../../_metronic/_helpers/TableSortingHelpers"
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';
import { result, isEmpty, set } from 'lodash';
import { Suppliers } from "./supplier";
import Typography from '@material-ui/core/Typography';
import { LanguageSelectorDropdown } from "./languageSelector";
import clsx from "clsx";
import { Dropdown } from "react-bootstrap";
import { DropdownTopbarItemToggler } from "./dropDowntop";
import ImageShow from "./imageShow"

const languages = [
    {
        lang: "en",
        name: "English",
        flag: toAbsoluteUrl("/media/svg/flags/226-united-states.svg"),
    },

    {
        lang: "ja",
        name: "Japanese",
        flag: toAbsoluteUrl("/media/svg/flags/063-japan.svg"),
    },
    {
        lang: "vi",
        name: "Việt Nam",
        flag: toAbsoluteUrl("/media/svg/flags/220-vietnam.svg"),
    },

];


const unitId = [
    { label: "Box" },
    { label: "Slice" },
];
const originId = [
    { label: "ja" },
    { label: "vn" },
    { label: "en" },
]
const supplierId = [
    { label: "Amazon JP" },
    { label: "Rakuten" },
    { label: "Uniqlo" },
]
const ProductSchema = Yup.object().shape({
    price: Yup.number()
        .min(1, "Vui lòng nhập số tiền")
        .max(1000000, "$1000000 là lớn nhất")
        .required("Nhập giá"),
    id: Yup.string()
        .min(1, "Vui lòng nhập ID hợp lệ")
        .max(20, "Vui lòng nhập ID hợp lệ")
        .required("Vui lòng nhập ID"),
    name_VN: Yup.string()
        .min(1, "Vui lòng nhập tên sản phẩm hợp lệ")
        .max(20, "Vui lòng nhập tên sản phẩm hợp lệ")
        .required("Vui lòng nhập tên sản phẩm"),
    name_JA: Yup.string()
        .min(1, "Vui lòng nhập tên sản phẩm hợp lệ")
        .max(20, "Vui lòng nhập tên sản phẩm hợp lệ")
        .required("Vui lòng nhập tên sản phẩm"),
    tax_id: Yup.string()
        .min(1, "Vui lòng nhập mã số thuế hợp lệ")
        .max(20, "Vui lòng nhập mã số thuế hợp lệ")
        .required("Vui lòng nhập mã số thuế"),
    origin_id: Yup.string()
        .min(3, "Vui lòng nhập ID hợp lệ")
        .max(20, "Vui lòng nhập ID hợp lệ")
        .required("Vui lòng nhập ID"),
    ingredients_VN: Yup.string()
        .min(1, "Vui lòng nhập thành phần cho sản phẩm")
        .max(50, "Vui lòng nhập thành phần cho sản phẩm")
        .required("Vui lòng nhập thành phần cho sản phẩm"),
    ingredients_EN: Yup.string()
        .min(1, "Vui lòng nhập thành phần cho sản phẩm")
        .max(50, "Vui lòng nhập thành phần cho sản phẩm")
        .required("Vui lòng nhập thành phần cho sản phẩm")
});


export function ProductDetail(props) {
    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );

    const [step, setStep] = useState(false)
    const [shipment, setShipment] = useState('');
    const [typeProduct, setTypeProduct] = useState();
    const [productDetail, setProductDetail] = useState([]);
    const [origins, setOrigins] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [units, setUnits] = useState([]);
    const [packages, setPackages] = useState([]);
    const [product, setProduct] = useState([])
    const [language, setLanguage] = useState('vi');

    const history = useHistory();
    let location = useLocation();
    useEffect(() => {
        if (location.pathname.includes('wholesale')) {
            setTypeProduct('wholesale');
        } else if (location.pathname.includes('auction')) {
            setTypeProduct("auction");
        } else if (location.pathname.includes('shipping')) {
            setTypeProduct("shippingpartner");
        } else if (location.pathname.includes('payment')) {
            setTypeProduct("paymentpartner");
        } else {
            setTypeProduct("retail");
        }
        getProduct(ids).then(result => setProductDetail(result.data));
        getOrigins().then(result => setOrigins(result.data));
        getTaxes().then(result => setTaxes(result.data));
        getUnits().then(result => setUnits(result.data));
        getPackage(ids).then(result => setPackages(result.data))
        getProducts(ids, language).then(result => setProduct(result.data))
    }, [location]);
    const dispatch = useDispatch()
    const columnsInfor = [
        {
            dataField: "id",
            text: "STT",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "name",
            text: "Tên nhà cung cấp",
            sort: true,
        },
        {
            dataField: "email",
            text: "Email",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "address",
            text: "Đại chỉ ",
            sort: true,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "note",
            text: "Ghi chú ",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },

    ]
    function createData(id, amount, weight, volume, datecreate) {
        return { id, amount, weight, volume, datecreate };
    }

    const rows = [
        createData('123456789', "100", "50", "70", "2020-12-30  13:00"),
    ];
    

    const columnsInventory = [
        {
            dataField: "stt",
            text: "STT",
            sort: true,
            style: {
                fontWeight: "bold"
            },
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "id",
            text: "Mã số hàng",
            sort: true,
            headerStyle: { color: 'black' },
            style: { fontWeight: 'bold' }
        },
        {
            dataField: "amount",
            text: "Số lượng",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "weight",
            text: "Trọng lượng ",
            sort: true,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "volume",
            text: "Thể tích ",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "datecreate",
            text: "Ngày tạo ",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                fontWeight: "500"
            }
        },
        {
            dataField: "action",
            text: "Actions",
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            formatter: rankFormatter,
            style: {
                minWidth: "100px",
            },
        }

    ]
    // console.log(product)
    function rankFormatter(cell, row, rowIndex, formatExtraData) {
        return (
            <>
                <OverlayTrigger
                    overlay={<Tooltip>Xoá nhà cung cấp</Tooltip>}
                >
                    <button
                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                    // onClick={() => {
                    //     swal({
                    //         title: "Bạn có muốn xoá nhà sản xuất này?",
                    //         icon: "warning",
                    //         dangerMode: true,
                    //         buttons: ["No", "Yes"],
                    //     }).then((willUpdate) => {
                    //         if (willUpdate) {
                    //             setTimeout(() => {
                    //                 // deleteSupplier(ids, row.id)
                    //                     then((res) => {
                    //                         swal("Đã xoá thành công!", {
                    //                             icon: "success",
                    //                         }).then(history.push(`products/detail/` + ids));

                    //                     })
                    //                     .catch((err) => {
                    //                         console.log(err);
                    //                         swal("Xoá không thành công!", {
                    //                             icon: "warning",
                    //                         });
                    //                     });
                    //             }, 500)

                    //         }
                    //     })


                    // }}
                    >
                        <span className="svg-icon svg-icon-md svg-icon-danger">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                        </span>
                    </button>
                </OverlayTrigger>
            </>
        );
    }
    const getHandlerTableChange = (e) => { }
    const styles = {
        ui: {
            display: 'flex'
        },
        image: {
            marginTop: "5rem",
            marginLeft: "1rem",
            margin: "1% 2% 1% 0%",
        }
    }
    // const options = {
    //     hideSizePerPage: true,
    //     onPageChange: (page, sizePerPage) => {
    //         setParams("search=" + typeProduct + "&searchFields=director.type.id&page=" + page);
    //         dispatch(getProductsList(params));
    //     },
    // };
     function escape(key, val) {
        if (typeof (val) != "string") return val;
        return val
            .replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t')
            .replace(/[\"]/g, '\\"')
            .replace(/\\'/g, "\\'");
    }
    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }
    function replaces(str) {
        str.replace('/"', ' ')
    }
    function check(image){
        if(image !== undefined){
           return JSON.parse(image )
        }
    }

    return (
        <div>
            <div className="card card-custom" style={{ height: "10%" }}>
                <CardHeader title="Chi tiết sản phẩm">
                    <CardHeaderToolbar>
                        {/* onClick={history.push("/admin/createpaymentorder/" + ids)} */}
                        <Link
                            type="button"
                            className="btn btn-info "
                            to={("/admin/orders/create-wholesale/" + ids)}
                            style={{ marginRight: "5px" }}
                            onClick ={props === ids}
                        >
                            <i class="fa fa-plus" aria-hidden="true"></i>
                            Tạo đơn sỉ
                    </Link>
                        {`  `}
                        {`  `}
                        <Link
                            type="button"
                            className="btn btn-success"
                            to={("/admin/orders/create-paymentpartner/" + ids)}

                        >
                            <i class="fa fa-plus" aria-hidden="true"></i>
                            Tạo đơn thanh toán hộ
                    </Link>
                        {`  `}
                        <Dropdown drop="down" alignRight>
                            <Dropdown.Toggle
                                as={DropdownTopbarItemToggler}
                                id="dropdown-toggle-my-cart"
                            >
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip id="language-panel-tooltip">Select Language</Tooltip>
                                    }
                                >
                                    <div className="btn btn-icon btn-clean btn-dropdown btn-lg mr-1">
                                        <img
                                            className="h-25px w-25px rounded"
                                            src={toAbsoluteUrl("/media/svg/flags/220-vietnam.svg")}
                                            alt={"Việt Nam"}
                                        />
                                    </div>
                                </OverlayTrigger>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround">
                                <ul className="navi navi-hover py-4">
                                    {languages.map((language) => (
                                        <li
                                            key={language.lang}
                                            className={clsx("navi-item", {
                                                active: language.lang === languages.lang,
                                            })}
                                        >
                                            <a
                                                onClick={() =>  getProducts(ids, language.lang).then(result => setProduct(result.data))}
                                                className="navi-link"
                                            >
                                                <span className="symbol symbol-20 mr-3">
                                                    <img src={language.flag} alt={language.name} />
                                                </span>
                                                <span className="navi-text">{language.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>
                    </CardHeaderToolbar>
                </CardHeader>
            </div>
            <div style={{ height: "80%" }}>
                <div style={{ display: "flex", height: "30%" }}>
                    <div style={{ width: "20%", margin: "1% 2% 1% 0%" }}>
                       <ImageShow/>

                    </div>
                    <div style={{ width: "77%", margin: "1% 0% 0% 0%" }}>
                        <div className="row" style={{ display: 'flex' }}>
                            <Card style={{ width: productDetail?.unit_id === "box" ? "65%" : "100%", height :"380px"}}>
                                <div className="table-responsive" style={{ overflowX: "unset", padding: "1% 1% 1% 3%" }}>
                                    <table className="table">
                                        <tbody>
                                            <tr className="font-weight-boldest">
                                                <td className="border-top-0" style={{ width: "40%", }} >
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Thông tin sản phẩm
                                                    </div>
                                                </td>
                                                <td className="border-top-0">
                                                    <OverlayTrigger
                                                        overlay={<Tooltip>Cập nhập</Tooltip>}
                                                    >

                                                        <Link to={`/admin/updateprodut/${ids}`}
                                                            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                                            style={{ float: "right" }}
                                                        >
                                                            <span className="svg-icon svg-icon-md svg-icon-primary">
                                                                <SVG
                                                                    src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                                                />
                                                            </span>
                                                        </Link>
                                                    </OverlayTrigger>
                                                </td>
                                            </tr>

                                            <tr className="font-weight-boldest">
                                                <td className="pt-1" style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-success align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Mã sản phẩm:
                                                    </div>
                                                </td>
                                                <td className="pt-1 ">{product.id}</td>
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
                                                        Xuất xứ:
                                                    </div>
                                                </td>
                                                <td className="pt-5 border-top-0 ">{product?.origin?.name}</td>
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
                                                <td className="pt-5 border-top-0 " style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-info align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Thuế:
                                                    </div>
                                                </td>
                                                <td className="pt-5 border-top-0 "> {product?.tax?.name}</td>
                                            </tr>
                                            <tr className="font-weight-boldest">
                                                <td className="pt-5 border-top-0   " style={{ display: 'flex' }}>
                                                    <span className="bullet bullet-bar bg-muted align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                    <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                        Thành phần:
                                                    </div>
                                                </td>
                                                <td className="pt-5  border-top-0  ">{(product?.ingredients) + " "}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <>
                                    </>
                                    {/* <Link
                                        type="button"
                                        className="btn btn-primary"
                                        to={`/admin/updateprodut/${ids}`}
                                        style={{ float: "right", marginRight: "2%" }}
                                    >
                                        <i className="fa fa-arrow-right"></i>
                                                               Cập nhập
                                        </Link> */}

                                </div>
                            </Card>
                            {productDetail?.unit_id === "box" ?
                                <Card style={{ width: "33%", marginLeft: "2%" }}>
                                    <div className="table-responsive" style={{ overflowX: "unset", marginRight: "2%", padding: "1% 3% 1% 3%" }}>
                                        <table className="table">

                                            <tbody>
                                                <tr className="font-weight-boldest">
                                                    <td className="border-top-0" style={{ width: "55%" }} >
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Thông tin thùng chứa
                                                        </div>
                                                    </td>
                                                    <td className="border-top-0">
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>Cập nhập</Tooltip>}
                                                        >

                                                            <Link to={`/admin/createpackage/${ids}`}
                                                                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                                                style={{ float: "right" }}
                                                            >
                                                                <span className="svg-icon svg-icon-md svg-icon-primary">
                                                                    <SVG
                                                                        src={toAbsoluteUrl("/media/svg/icons/General/Edit.svg")}
                                                                    />
                                                                </span>
                                                            </Link>
                                                        </OverlayTrigger>
                                                    </td>
                                                </tr>

                                                <tr className="font-weight-boldest">
                                                    <td className="pt-1  " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-success align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Số lượng:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-1  ">{packages?.quantity} </td>
                                                </tr>

                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5 border-top-0 " style={{ display: 'flex' }} >
                                                        <span className="bullet bullet-bar bg-primary align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Trọng lượng:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 ">{packages?.weight} </td>
                                                </tr>

                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-warning align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Chiều dài:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 ">{packages?.length}</td>
                                                </tr>

                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-dark align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Chiều rộng:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 "> {packages?.width}</td>
                                                </tr>
                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-danger align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Chiều cao:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 ">{packages?.height}</td>
                                                </tr>
                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-info align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Thể tích:
                                                        </div>
                                                    </td>
                                                    <td className=" pt-5 border-top-0 ">{packages?.volume} </td>
                                                </tr>
                                                <tr className="font-weight-boldest">
                                                    <td className="pt-5   border-top-0 " style={{ display: 'flex' }}>
                                                        <span className="bullet bullet-bar bg-muted align-self-stretch" style={{ marginRight: "3%" }}></span>
                                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                                            Dung trọng:
                                                        </div>

                                                    </td>
                                                    <td className=" pt-5 border-top-0  " >{packages?.volumetric_weight} </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        {/* <Link
                                            type="button"
                                            className="btn btn-primary"
                                            to={`/admin/createpackage/${ids}`}
                                            style={{ float: "right", marginRight: "2%" }}>
                                            <i className="fa fa-arrow-right"></i>
                                                            Cập nhập
                                        </Link> */}
                                    </div>
                                </Card>
                                : ""}
                        </div>

                    </div>
                </div>
                <div>
                    <Suppliers />
                </div>
                <div>
                    <Card style={{ padding: "1% 1% 1% 3%" }}>
                        <div >
                            <div className="row mt-2" style={{ padding: "1% 3% 1% 1%" }} >
                                <div className="col-12 pl-0">
                                    <tr className="font-weight-boldest">
                                        <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                                            Danh sách hàng tồn kho
                                        </div>
                                    </tr>
                                    <BootstrapTable
                                        wrapperClasses="table-responsive"
                                        classes="table table-head-custom table-vertical-center overflow-hidden"
                                        bordered={false}
                                        keyField='id'
                                        data={rows === null ? [] : rows?.map(supp => ({
                                            ...supp,
                                            stt: 1,

                                        }))}
                                        columns={columnsInventory}
                                        onTableChange={getHandlerTableChange}
                                    // pagination={paginationFactory(options)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <div style={{ height: "10%" }}>
                <CardHeaderToolbar>
                    <Link
                        type="button"
                        className="btn btn-danger "
                        to={'/admin/product'}
                        style={{ float: "left" }}
                    >
                        <i className="fa fa-arrow-left"></i>
                      Trở về
                    </Link>
                    {`  `}

                    <Link
                        type="button"
                        className="btn btn-primary"
                        to={`/admin/updateprodut/${ids}`}
                        style={{ float: "right" }}
                    >
                        <i className="fa fa-arrow-right"></i>
                    Cập nhập thông tin sản phẩm
                    </Link>
                    {`  `}
                </CardHeaderToolbar>

            </div>

        </div>
    );
}