import { Field, Form, Formik, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';

import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { Link, useHistory } from "react-router-dom";
import "../../../assets/css/wizard.wizard-4.css"
import '../../../assets/css/style-main.css'
import swal from 'sweetalert';
import { useLocation } from "react-router";
import { Input } from "../FieldFeedbackLabel/input";
import * as Yup from "yup";
import { updatePackage,getPackage } from "../../_redux_/productsSlice";
import { result } from 'lodash';

const ProductSchema = Yup.object().shape({
    quantity: Yup.string(),
    weight: Yup.string(),
    
    height: Yup.string(),

    length: Yup.string(),
    width: Yup.string(),
    // tax_id:Yup.string(),

});

export function UpdatePackage() {

    const ids = String(window.location.href).slice(
        String(window.location.href).lastIndexOf("/") + 1
    );
    const [packages, setPackage] = useState([])
    const [quantity, setQuantity] = useState('')
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState([])
    const [length, setLength] = useState('')
    const [width, setWidth] = useState([])
    const history = useHistory();
    let location = useLocation();

    useEffect(() => {
        getPackage(ids).then(result =>{ 
            setPackage(result.data)
            setQuantity(result.data.quantity)
            setWeight(result.data.weight)
            setHeight(result.data.height)
            setLength(result.data.length)
            setWidth(result.data.width)
        })

    }, [location]);


    const styles = {
        ui: {
            display: 'flex'
        }
    }
    console.log("pack",packages)

    return (
        <div className="card card-custom card-transparent">
            {
                <Formik
                    initialValues={{ quantity: "", weight: "", height: "", length: "", width: "" }}
                    validationSchema={ProductSchema}
                    onSubmit={async (values, actions) => {
                        await setTimeout(() => {
                            swal({
                                title: "Bạn có cập nhập thông tin?",
                                icon: "warning",
                                dangerMode: true,
                                buttons: ["No", "Yes"],
                              }).then((willUpdate) => {
                                if (willUpdate) {
                                 setTimeout(()=>{
                                    updatePackage(ids,quantity,weight, height, length, width)
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
                                 },500)

                                }
                              });
                                
                        }, 500);
                    }}
                >
                    {(props: FormikProps<any>) => (
                        <Form>
                            <Card>
                                <CardHeader title="Chỉn sửa thông tin thùng">
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
                                            <i className="fa fa-plus-circle"></i>
                                          Lưu
                                              </button>
                                    </CardHeaderToolbar>
                                </CardHeader>

                                <div style={styles.ui}>
                                    <CardBody>
                                        <div className="form-group row mt-5">
                                            <div className="col-lg-4">
                                                <label>ID sản phẩm</label>
                                                <Field
                                                    type="id"
                                                    name="id"
                                                    placeholder="ID Sẩn Phẩm"
                                                    label=""
                                                    component={Input}
                                                    value={ids}
                                                />
                                            </div>
                                            <div className="col-lg-4">
                                                <label>Số lượng </label>
                                                <Field
                                                    type="quantity"
                                                    name="quantity"
                                                    value={quantity}
                                                    onInput={e => setQuantity(e.target.value)}
                                                    placeholder="Nhập số lượng"
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                            <div className="col-lg-4">
                                                <label>Cân nặng</label>
                                                <Field
                                                    type="weight"
                                                    name="weight"
                                                    value={weight}
                                                    onInput={e => setWeight(e.target.value)}
                                                    placeholder="Nhập cân nặng "
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>                  
                                        </div>
                                        <div className="form-group row mt-5">
                                            <div className="col-lg-4">
                                                <label>Chiều cao</label>
                                                <Field
                                                    type="height"
                                                    name="height"
                                                    value={height}
                                                    onInput={e => setHeight(e.target.value)}
                                                    placeholder="Nhập chiều cao sản phẩm"
                                                    component={Input}
                                                />
                                            </div>
                                                                                       
                                            <div className="col-lg-4">
                                                <label>Chiều dài</label>
                                                <Field
                                                    type="length"
                                                    name="length"
                                                    value={length}
                                                    onInput={e => setLength(e.target.value)}
                                                    placeholder="Nhập chiều dài sản phẩm "
                                                    label=""
                                                    component={Input}
                                                />
                                            </div>
                                                                                       
                                            <div className="col-lg-4">
                                                <label>Chiều rộng</label>
                                                <Field
                                                    type="width"
                                                    name="width"
                                                    value={width}
                                                    onInput={e => setWidth(e.target.value)}
                                                    placeholder="Nhập chiều rộng sản phẩm "
                                                    label=""
                                                    component={Input}
                                                />
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