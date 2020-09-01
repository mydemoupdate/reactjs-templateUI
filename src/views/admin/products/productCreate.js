
import { Field, Form, Formik, FormikProps } from 'formik';
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
import { Button, Row, Col } from "react-bootstrap";
import swal from 'sweetalert';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { useLocation } from "react-router";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Input } from "../FieldFeedbackLabel/input";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { createProducts, getUnitsList, getSuppliersList, getOriginsList, getTaxesList, getProductIndex, updateSuppliers, updateImage } from "../../_redux_/productsSlice";
import { useDispatch } from "react-redux";
import Select from 'react-select';
import { result, set } from 'lodash';
import { typeOf } from 'react-is';
import ImageUpload from "./ImageUpload.js";
import './imageUpload.css';


// const unitId = [
//     { label: "box" },
//     { label: "slice" },
// ];

// const originId = [
//     { label: "ja" },
//     { label: "vn" },
//     { label: "en" },

// ]
// const supplierId = [
//     { label: "Amazon JP" },
//     { label: "Rakuten" },
//     { label: "Uniqlo" },
// ]

const ProductSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, "Vui lòng nhập tên sản phẩm hợp lệ")
        .max(20, "Vui lòng nhập tên sản phẩm hợp lệ")
        .required("Vui lòng nhập tên sản phẩm"),
    price: Yup.number()
        .min(1, "Vui lòng nhập số tiền")
        .max(1000000, "$1000000 là lớn nhất")
        .required("Nhập giá"),
    // origin_id:Yup.string(),
    // supplier_id:Yup.string() ,
    // unit_id:Yup.string()

    id: Yup.string()
        .min(1, "Vui lòng nhập ID hợp lệ")
        .max(13, "Vui lòng nhập ID hợp lệ")
        .required("Vui lòng nhập ID"),
    // locale: Yup.string()
    //     .min(1, "Vui lòng nhập locale hợp lệ")
    //     .max(20, "Vui lòng nhập locale hợp lệ")
    //     .required("Vui lòng nhập locale"),
    ingredients: Yup.string()
        .min(1, "Vui lòng nhập thành phần cho sản phẩm")
        .max(50, "Vui lòng nhập thành phần cho sản phẩm hợp lệ")
        .required("Vui lòng nhập thành phần cho sản phẩm"),
    // tax_id:Yup.string(),

});
String.prototype.escapeSpecialChars = function () {
    return this.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
};


export function ProductCreate() {

    const ids = String(window.location.href).slice(44, 57);
    const [step, setStep] = useState(false);
    const [typeProduct, setTypeProduct] = useState();
    const [selectedValue, setSelectedValue] = useState('');
    const [origins, setOrigins] = useState([]);
    const [suppliers, setSupplier] = useState([]);
    const [units, setUnits] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [originId, setOriginId] = useState('')
    const [taxesId, setTaxesId] = useState('')
    const [supplierId, setSupplierId] = useState('')
    const [unitId, setUnitId] = useState('')
    const [texesDefaullt, setTaxesDefault] = useState({})
    const [productIndex, setProductIndex] = useState([])
    const [productIndexs, setProductIndexs] = useState([])
    const [profileImg, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
    const [images, setImages] = useState(null);

    // const unitId = [
    //     {
    //         value: 1,
    //         label: "cerulean"
    //     },
    //     {
    //         value: 2,
    //         label: "fuchsia rose"
    //     },
    //     {
    //         value: 3,
    //         label: "true red"
    //     },
    //     {
    //         value: 4,
    //         label: "aqua sky"
    //     },
    //     {
    //         value: 5,
    //         label: "tigerlily"
    //     },
    //     {
    //         value: 6,
    //         label: "blue turquoise"
    //     }
    // ];
    // const originId = [
    //     { label: "ja" },
    //     { label: "vn" },
    //     { label: "en" },
    // ]
    // const supplierId = [
    //     { label: "Amazon JP" },
    //     { label: "Rakuten" },
    //     { label: "Uniqlo" },
    // ]

    const history = useHistory();
    let location = useLocation();

    const handleChange = e => {
        setSelectedValue(e.value);
    }
    const styles = {
        ui: {
            display: 'flex'
        }
    }

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
        dispatch(getOriginsList()).then(res => {
            setOrigins(res.data)
            setTaxesDefault(res.data[0].name)
        })
        dispatch(getSuppliersList()).then(res => {
            setSupplier(res.data.data)
        })
        dispatch(getUnitsList()).then(res => {
            setUnits(res.data)
        })
        dispatch(getTaxesList()).then(res => {
            setTaxes(res.data)
        })
        getProductIndex().then(result => setProductIndex(result.data.total))
        getProductIndex().then(result => setProductIndexs(result.data.total))
        // getSupplier().then(result => setSupplier(result.data) )
        // getUnits().then(result => setUnits(result.data))
    }, [location]);
    const dispatch = useDispatch();
    const onOriginChange = (event, values) => {
        if (values) {
            setOriginId(values?.id)
        }
    }
    const ontTaxesChange = async (event, values) => {
        if (values) {
            await setTaxesId(values?.id)
        }
    }
    const ontSupplierChange = async (event, values) => {
        if (values) {
            await setSupplierId(values.map(x => x?.id))
        }
    }
    const onUnitChange = async (event, values) => {
        if (values) {
            await setUnitId(values?.id)
        }
    }
    const checkValidation = () => {
        if (originId === '' && supplierId === '' && unitId === '' && taxesId === '') {
            swal("Bạn nhập thiếu thông tin!", {
                icon: "warning"
            })
            return;
        }
    }
    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImage({ profileImg: reader.result })
            }
        }
        reader.readAsDataURL(e.target.files[0])
        setImages(e.target.files[0])
        console.log(e.target.files[0])

    };
    return (
        <div className="card card-custom card-transparent">
            {
                <Formik
                    initialValues={{ name: "", price: "", id: "", ingredients: "" }}
                    validationSchema={ProductSchema}
                    onSubmit={async (values, actions) => {
                        await setTimeout(() => {
                            //   alert(JSON.stringify(values, null, 2));
                            //   console.log(values)

                            const params = {
                                name: values.name,
                                price: values.price,
                                origin_id: originId,
                                supplier_id: supplierId,
                                unit_id: unitId,
                                id: values.id,
                                ingredients: JSON.stringify(values.ingredients),
                                tax_id: taxesId
                            }
                            swal({
                                title: "Bạn có muốn tạo sản phẩm này?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["No", "Yes"],
                            }).then((willUpdate) => {
                                if (willUpdate) {
                                    setTimeout(() => {
                                        (createProducts(params)  && updateImage(values.id, images))
                                        updateSuppliers(values.id, supplierId.map(m => m).join())
                                            .then((res) => {
                                                swal("Đã cập nhật thành công!", {
                                                    icon: "success",
                                                }).then(history.push("/admin/product"));

                                            })
                                            .catch((err) => {
                                                console.log(err);
                                                swal("Cập nhật không thành công!", {
                                                    icon: "warning",
                                                });
                                            });
                                    }, 500)

                                }
                            });

                        }, 500);
                    }}
                >
                    {(props: FormikProps<any>) => (
                        <Form>
                            <Card>
                                <CardHeader title="Thêm sản phẩm mới">
                                    <CardHeaderToolbar>
                                        <Link
                                            type="button"
                                            className="btn btn-light"
                                            to={'/admin/product'}
                                        >
                                            <i className="fa fa-arrow-left"></i>
                                                   Trở về
                                              </Link>
                                        {`  `}

                                        <button type="submit"
                                            className="btn btn-primary ml-2"
                                            onClick={checkValidation}
                                        >
                                            <i className="fa fa-plus-circle"></i>
                                          Lưu
                                              </button>
                                    </CardHeaderToolbar>
                                </CardHeader>

                                <div style={styles.ui}>
                                    <div>
                                        <div >
                                            <div className="img-holder">
                                                <img src={profileImg} alt="" id="img" className="img" />
                                            </div>
                                            <input type="file" accept="image/*" name="image-upload" id="input" onChange={imageHandler} />
                                            <div className="label">

                                                <label className="image-upload" htmlFor="input">
                                                    <i className="material-icons">add_photo_alternate</i>
						                            Thêm ảnh
					                            </label>
                                            </div>
                                        </div>

                                    </div>
                                    <CardBody>
                                        <div className="form-group row mt-5">
                                            <div className="col-lg-6">
                                                <label>ID sản phẩm</label>
                                                <Field
                                                    type="id"
                                                    name="id"
                                                    placeholder="ID Sẩn Phẩm"
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Giá tiền sẩn phẩm</label>
                                                <Field
                                                    type="price"
                                                    name="price"
                                                    placeholder="Nhập số tiền "
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mt-5">
                                            <div className="col-lg-6">
                                                <label>Tên sản phẩm </label>
                                                <Field
                                                    type="name"
                                                    name="name"
                                                    placeholder="Tên sản phẩm"
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Thành phần sản phẩm</label>
                                                <Field
                                                    type="ingredients"
                                                    name="ingredients"
                                                    placeholder="Thành phần sản phẩm"
                                                    component={Input}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row mt-5">
                                            <div className="col-lg-6">
                                                <label>Phần trăm thuế</label>
                                                <Autocomplete
                                                    // name="tax_id"
                                                    // type="tax_id"
                                                    placeholder={"Nhập phần trăm thuế"}
                                                    onChange={ontTaxesChange}
                                                    options={taxes}
                                                    autoHighlight
                                                    getOptionLabel={option => option.name}
                                                    renderOption={option => (
                                                        <React.Fragment>
                                                            {option.name}
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
                                            <div className="col-lg-6">
                                                <label>Tên nơi xuất xứ </label>
                                                <Autocomplete
                                                    // name="origin_id"
                                                    // type="origin_id"
                                                    onChange={onOriginChange}
                                                    options={origins}
                                                    autoHighlight
                                                    getOptionLabel={option => option.name}
                                                    renderOption={option => (
                                                        <React.Fragment>
                                                            {option.name} ({option.id})
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

                                        <div className="form-group row mt-5">
                                            <div className="col-lg-6">
                                                <label>Tên nhà cung cấp </label>
                                                <Autocomplete
                                                    // name="supplier_id"
                                                    // type="supplier_id"
                                                    multiple
                                                    id="tags-standard"
                                                    onChange={ontSupplierChange}
                                                    options={suppliers}
                                                    autoHighlight
                                                    getOptionLabel={option => option.name}
                                                    renderOption={option => (
                                                        <React.Fragment>
                                                            {option.name}
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

                                            <div className="col-lg-6">
                                                <label>Đơn vị </label>
                                                <Autocomplete
                                                    // name="unit_id"
                                                    // type="unit_id"
                                                    onChange={onUnitChange}
                                                    options={units}
                                                    // value={units.find(obj => obj.value === selectedValue)}
                                                    // onChange={handleChange}
                                                    autoHighlight
                                                    getOptionLabel={option => option.name}
                                                    renderOption={option => (
                                                        <React.Fragment>
                                                            {option.name}
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
                                        <div className="form-group row mt-5">
                                        </div>
                                    </CardBody>
                                </div>
                            </Card>
                        </Form>
                    )}
                </Formik>
            }
        </div>
    );
}