import { Field, Form, Formik, FormikProps } from "formik";

import React from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";

import "../../../../assets/css/wizard.wizard-4.css";
import "../../../../assets/css/style-main.css";
import { Input } from "../../FieldFeedbackLabel/input";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { values } from "lodash";

const userSchema = Yup.object().shape({
  manager_id: Yup.string()
    .min(1, "Vui lòng nhập giá trị hợp lệ")
    .max(20, "Vui lòng nhập giá trị hợp lệ")
    .required("Vui lòng nhập ID của người quản lý"),
  user_id: Yup.string()
    .min(1, "Vui lòng nhập giá trị hợp lệ")
    .max(20, "Vui lòng nhập giá trị hợp lệ")
    .required("Vui lòng nhập ID của người dùng"),
});
export function UserCreate() {
  const dispatch = useDispatch();
  return (
    <div className="card card-custom card-transparent">
      {
        <Formik
          initialValues={{
            user_id: "",
            manager_id: "",
          }}
          validationSchema={userSchema}
          onSubmit={async (values, actions) => {
            setTimeout(() => {
              dispatch();
          
            }, 500);
          }}
        >
          {(props) => (
            <Form>
              <Card>
                <CardHeader title="Thêm người dùng mới"></CardHeader>
                <CardBody>
                  <div
                    className="form-group"
                    style={{ display: "flex", marginLeft: "20%" }}
                  >
                    <div style={{ marginRight: "4%" }}>
                      <label>ID người quản lí</label>
                      <Field
                        type="id"
                        name="manager_id"
                        placeholder="ID của người quản lý"
                        label=""
                        component={Input}
                      />
                    </div>
                    <div className="">
                      <label>ID của người dùng</label>
                      <Field
                        type="id"
                        name="user_id"
                        placeholder="ID của người dùng"
                        label=""
                        component={Input}
                      />
                    </div>
                  </div>
                </CardBody>
                <CardHeaderToolbar style={{ textAlign: "end", padding: "4%" }}>
                  <Link
                    type="button"
                    className="btn btn-light"
                    to={"/admin/manage-user"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Trở về
                  </Link>
                  {`  `}

                  <button type="submit" className="btn btn-primary ml-2">
                    <i className="far fa-save"></i>
                    Lưu
                  </button>
                </CardHeaderToolbar>
              </Card>
            </Form>
          )}
        </Formik>
      }
    </div>
  );
}