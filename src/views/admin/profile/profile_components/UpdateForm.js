import { Field, Form, Formik, FormikProps } from "formik";

import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import "../../../../assets/css/wizard.wizard-4.css";
import "../../../../assets/css/style-main.css";
import { Button, Row, Col } from "react-bootstrap";
import swal from "sweetalert";
import { useLocation } from "react-router";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { Update, getStatus } from "../profileCRUD";
import { Tree } from "antd";
import {
  assignManageUsers,
  assignMyManager,
  getRolesWithPermissions,
  getDirectPermissions,
  givePermission,
  giveRoles
} from "../../../_redux_/allUserSlice";

const ProductSchema = Yup.object().shape({});

export function UpdateForm() {
  const ids = String(window.location.href).slice(
    String(window.location.href).lastIndexOf("/") + 1
  );
  const [dataRoles, setData] = useState({
    roles: [],
    permissions: [],
  });
  const [status, setStatus] = useState([]);
  const [user_manage, setUserManage] = useState([]);
  const [manageUser, setManageUser] = useState([]);
  const [directPermissions, setDirectPermissions]=useState([]);
  const [role_req, setRoleReq] = useState([]);
  const [permission_req, setPermissionReq] = useState([]);
  const [status_req, setStatusReq] = useState([]);
  const history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const ids = String(window.location.href).slice(
      String(window.location.href).lastIndexOf("/") + 1
    );
    // React creates function whenever rendered
    swal({
      title: "Bạn thực sự muốn thay đổi thông tin?",
      icon: "warning",
      dangerMode: true,
      buttons: ["No", "Yes"],
    }).then((willUpdate) => {
      if (willUpdate) {
        Update(ids, status_req);
        givePermission(ids,JSON.stringify(permission_req))
        giveRoles(ids,JSON.stringify(role_req))
        assignManageUsers(ids, JSON.stringify(manageUser))
        assignMyManager(ids, JSON.stringify(user_manage))
          .then((res) => {
            swal("Đã cập nhật thành công!", {
              icon: "success",
            }).then(history.push(`/admin/users/${ids}`));
          })
          .catch((err) => {
            console.log(err);
            swal("Cập nhật không thành công!", {
              icon: "warning",
            });
          });
      }
    });
  };

  useEffect(() => {
    getStatus()
      .then((response) => response.json())
      .then((result) => setStatus(result))
      .catch((err) => console.log(err));
    getRolesWithPermissions()
      .then((response) => response.json())
      .then((result) =>
        setData({
          ...dataRoles,
          roles: result?.data,
          permissions: result?.data?.map((x) => x.permissions),
        })
      )
      .catch((error) => console.log("error", error));
    getDirectPermissions()
      .then((response) => response.json())
      .then((result) => setDirectPermissions(result.data))
      .catch((error) => console.log("error", error));
  }, [location]);
  console.log("per", typeof(permission_req));
  // let permissionsArr = [];
  // for (let item of dataRoles.permissions) {
  //   for (let item2 of item) {
  //     let title = item2.name;
  //     let key = item2.id;
  //     permissionsArr.push({ title: title, key: key });
  //   }
  // }
  // console.log("ARR", permissionsArr);
  let rolesArr = [];
  for (let item of dataRoles.roles) {
    let title = item.name;
    let key = item.id;
    
    rolesArr.push({ title: title, key: key});
  }

  const onStatusChange = async (event, values) => {
    if (values) {
      await setStatusReq(values?.id);
    }
  };

  const onPermissionChange = async (event, values) => {
    if (values) {
      await setPermissionReq(values?.id);
    }
  };
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    setRoleReq(checkedKeys)
    console.log("onCheck", checkedKeys, info);
  };
 console.log(role_req)
  return (
    <div className="card card-custom card-transparent">
      {
        <Formik
          initialValues={{
            id: "",
            status_id: "",
            roles: [],
            permissions: [],
          }}
          validationSchema={ProductSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {(props) => (
            <Form>
              <Card>
                <CardHeader title="Cập nhật thông tin người dùng">
                  <CardHeaderToolbar>
                    <Link
                      type="button"
                      className="btn btn-danger ml-2"
                      to={`/admin/users/${ids}`}
                    >
                      <i className="fa fa-arrow-left"></i>
                      Trở về
                    </Link>
                    {`  `}

                    <button
                      onClick={handleUpdate}
                      type="submit"
                      className=" btn btn-primary ml-2"
                    >
                      <i className="far fa-save"></i>
                      Lưu
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>

                <CardBody style={{ display: "flex" }}>
                  <div style={{ width: "40%", margin: "0 7%" }}>
                    <div style={{ paddingBottom: "5%" }}>
                      <label>ID người dùng</label>
                      <input
                        class="form-control form-control-lg form-control-solid"
                        type="text"
                        disabled
                        defaultValue={ids}
                      />
                    </div>
                    <div style={{ paddingBottom: "5%" }}>
                      <label>Trạng thái người dùng </label>
                      <Autocomplete
                        onChange={onStatusChange}
                        id="combo-box-demo"
                        options={status}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Trạng thái"
                            variant="outlined"
                          />
                        )}
                      />
                    </div>
                    <div style={{ paddingBottom: "5%" }}>
                      <label>Được quản lý </label>
                      <input
                        onChange={(e) => setManageUser(e.target.value)}
                        class="form-control form-control-lg form-control-solid"
                        type="text"
                        placeholder="Nhập ID người được quản lý"
                      />
                    </div>
                    <div style={{ paddingBottom: "5%" }}>
                      <label>Bị quản lý bởi </label>
                      <input
                        onChange={(e) => setUserManage(e.target.value)}
                        class="form-control form-control-lg form-control-solid"
                        type="text"
                        placeholder="Nhập ID người quản lý"
                      />
                    </div>
                  </div>

                  <div style={{ width: "40%" }}>
                    <div style={{ paddingBottom: "5%" }}>
                      <label>Phân quyền theo chức năng</label>
                      <Autocomplete
                        onChange={onPermissionChange}
                        id="combo-box-demo"
                        options={directPermissions}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Quyền"
                            variant="outlined"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label>Phân quyền theo vai trò</label>
                      <Tree
                        checkable
                        onSelect={onSelect}
                        onCheck={onCheck}
                        treeData={rolesArr}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Form>
          )}
        </Formik>
      }
    </div>
  );
}
