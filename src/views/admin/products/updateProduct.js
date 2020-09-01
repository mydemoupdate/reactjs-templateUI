
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
import { getProducts, getUnitsList, getSuppliersList, getOriginsList, getTaxesList, updateProduct, getProduct, getProductsS, updateImage } from "../../_redux_/productsSlice";
import { useDispatch } from "react-redux";
import Select from 'react-select';
import { result, set, valuesIn } from 'lodash';
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
        // name: Yup.string()
        //     // .min(1, "Vui lòng nhập tên sản phẩm hợp lệ")
        //     // .max(20, "Vui lòng nhập tên sản phẩm hợp lệ")
        //     .required("Vui lòng nhập tên sản phẩm"),
        // price: Yup.number()
        //     .min(1, "Vui lòng nhập số tiền")
        //     .max(1000000, "$1000000 là lớn nhất")
        //     .required("Nhập giá"),
        // // origin_id:Yup.string(),
        // // supplier_id:Yup.string() ,
        // // unit_id:Yup.string(),
        // // id: Yup.string()
        // //     .min(1, "Vui lòng nhập ID hợp lệ")
        // //     .max(13, "Vui lòng nhập ID hợp lệ")
        // //     .required("Vui lòng nhập ID"),
        // // locale: Yup.string()
        // //     .min(1, "Vui lòng nhập locale hợp lệ")
        // //     .max(20, "Vui lòng nhập locale hợp lệ")
        // //     .required("Vui lòng nhập locale"),
        // ingredients: Yup.string()
        //     .min(1, "Vui lòng nhập thành phần cho sản phẩm")
        //     .max(50, "Vui lòng nhập thành phần cho sản phẩm hợp lệ")
        //     .required("Vui lòng nhập thành phần cho sản phẩm"),
        // // tax_id:Yup.string(),

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


export function ProductUpdate() {

    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [step, setStep] = useState(false);
    const [typeProduct, setTypeProduct] = useState();
    const [origins, setOrigins] = useState([]);
    const [suppliers, setSupplier] = useState([]);
    const [units, setUnits] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [originId, setOriginId] = useState('')
    const [taxesId, setTaxesId] = useState('')
    const [supplierId, setSupplierId] = useState('')
    const [unitId, setUnitId] = useState('')
    const [texesDefaullt, setTaxesDefault] = useState({})
    const [product, setProduct] = useState({})
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [ingredient, setIngredient] = useState([])
    const [selectedTax, setSelectedTax] = useState("");
    const [selectedOrigin, setSelectedOrigin] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [profileImg, setImage] = useState("")
    const [images, setImages] = useState(null);
    const [taxList, setTaxList] = useState([0]);
    const [selectedValueTax, setSelectedValueTax] = useState(0);
    const [originList, setOriginList] = useState([0]);
    const [selectedValueOrigin, setSelectedValueOrigin] = useState('');
    const [unitList, setUnitList] = useState([0]);
    const [selectedValueUnit, setSelectedValueUnit] = useState('');
    const [products, setProducts] = useState([])


    const history = useHistory();
    let location = useLocation();


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

        getProductsS(ids).then(result => {

            setProduct(result.data);
            setName(result.data.name);
            setPrice(result.data.price)
            setSelectedValueTax(result.data.tax_id)
            setSelectedValueOrigin(result.data.origin_id)
            setSelectedValueUnit(result.data.unit_id)
            setIngredient(result.data?.ingredients)

        })
        getProducts(ids, "en").then(result => setProducts(result.data))


        dispatch(getTaxesList()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name,
                });
            }
            setTaxList(result);
        });
        dispatch(getOriginsList()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name,
                });
            }
            setOriginList(result);
        });
        dispatch(getOriginsList()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name,
                });
            }
            setOriginList(result);
        });
        dispatch(getUnitsList()).then((res) => {
            const _data = res.data || [];
            var result = [];
            for (var i = 0; i < _data.length; i++) {
                result.push({
                    value: _data[i].id,
                    label: _data[i].name,
                });
            }
            setUnitList(result);
        });
        
    }, [location]);

    
    function check(image){
        if(image !== undefined){
           return JSON.parse(image )
        }
    }
    const image = check(products.images)?.original
    const linkImage = `http://139.180.207.4:84/storage/${image}`

    const taxChange = (e) => {
        setSelectedValueTax(e.value);
    };
    const originChange = (e) => {
        setSelectedValueOrigin(e.value);
    };
    const unitChange = (e) => {
        setSelectedValueUnit(e.value);
    };
   
    const dispatch = useDispatch();
    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImage({ profileImg: reader.result })
            }
        }
        reader.readAsDataURL(e.target.files[0])
        setImages(e.target.files[0])


    };
    // console.log(images)
    // console.log('product1', taxList.filter(
    //     (obj) => obj.value === selectedValueTax
    // ))
    // console.log('product2', selectedOrigin)
    // console.log('product3', selectedUnit)
    return (
        <div className="card card-custom card-transparent">
            {
                <Formik
                    initialValues={{ name: "", ingredients: "", price: "" }}
                    validationSchema={ProductSchema}
                    onSubmit={async (values, actions) => {
                        await setTimeout(() => {
                            // alert(JSON.stringify(values, null, 2));
                            // console.log(values)
                            // arrayIngre.push(values.ingredients)
                            const params = {
                                name: name,
                                ingredients: JSON.stringify(ingredient),
                                unit_id: unitId,
                                price: price

                            }
                            swal({
                                title: "Bạn chắc muốn chỉnh sửa thông tin sản phẩm này?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["No", "Yes"],
                            }).then((willUpdate) => {
                                if (willUpdate) {
                                    setTimeout(() => {
                                    (updateProduct(ids, values.name, JSON.stringify(values.ingredients), selectedValueUnit, values.price, selectedValueTax, selectedValueOrigin) && updateImage(ids, images) && updateImage(ids, images))
                                        .then((res) => {
                                                swal("Đã cập nhật thành công!", {
                                                    icon: "success",
                                                }).then(history.push("/admin/products/detail/" + ids));
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
                            // createProducts(params)
                            // actions.setSubmitting(false);
                            console.log("DONE1")
                        }, 500);
                        console.log("DONE2")
                    }}
                >
                    {(props) => (
                        <Form>
                            <Card>
                                <CardHeader title="Cập nhập thông tin sản phẩm mới">
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
                                        >
                                            Lưu
                                                </button>
                                    </CardHeaderToolbar>
                                </CardHeader>

                                <div style={styles.ui}>
                                    <div>
                                        <div >
                                            <div className="img-holder">
                                                <img src={linkImage} alt="" id="img" className="img" />
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
                                                    value={ids}
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Giá tiền sẩn phẩm</label>
                                                <Field
                                                    type="price"
                                                    name="price"
                                                    value={price}
                                                    onInput={e => setPrice(e.target.value)}
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
                                                    value={name}
                                                    onInput={e => setName(e.target.value)}
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
                                                    value={ingredient}
                                                    onInput={e => setIngredient(e.target.value)}
                                                    placeholder="Thành phần sản phẩm"
                                                    component={Input}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row mt-5">
                                            <div className="col-lg-4">
                                                <label>Phần trăm thuế</label>
                                                <div className="col-13" >
                                                    <Select
                                                        value={taxList.filter(
                                                            (obj) => obj.value === selectedValueTax
                                                        )}
                                                        options={taxList}
                                                        onChange={taxChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <label>Tên nơi xuất xứ </label>
                                                <div className="col-13" >
                                                    <Select
                                                        value={originList.filter(
                                                            (obj) => obj.value === selectedValueOrigin
                                                        )}
                                                        options={originList}
                                                        onChange={originChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <label>Đơn vị </label>
                                                <div className="col-13" >
                                                    <Select
                                                        value={unitList.filter(
                                                            (obj) => obj.value === selectedValueUnit
                                                        )}
                                                        options={unitList}
                                                        onChange={unitChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group row mt-5">
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