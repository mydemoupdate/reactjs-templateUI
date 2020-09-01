import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import {
  getUsersList,
  deleteUsers,
  getAllUser,
} from "../../../_redux_/userSlice";
import BootstrapTable from "react-bootstrap-table-next";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
import SVG from "react-inlinesvg";
import {
  toAbsoluteUrl,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import {
  FormControl,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Form,
} from "react-bootstrap";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import swal from "sweetalert";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { id } from "date-fns/locale";

export function UserList() {
  const [status, setStatus] = useState([]);
  const [typeProduct, setTypeProduct] = useState("Retail");
  const [params, setParams] = useState("");
  const { SearchBar } = Search;

  function deleteModal(object) {
    // React creates function whenever rendered
    swal({
      title: "Bạn có chắc muốn xoá người dùng này ?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Huỷ", "Xoá"],
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteUsers(object.id))
          .then((res) => {
            console.log(res);
            swal("Đã xoá thành công!", {
              icon: "success",
            });
            dispatch(getUsersList());
          })
          .catch((err) => {
            console.log(err);
            swal("Xoá thất bại !", {
              icon: "warning",
            });
          });
      }
    });
  }
  const getHandlerTableChange = (e) => {}; // React creates function whenever rendered
  const dispatch = useDispatch();
  let location = useLocation();
  useEffect(() => {
    dispatch(getUsersList());
    getAllUser().then((result) => setStatus(result.data.data));
  }, [location]);
  const { currentState } = useSelector(
    (state) => ({ currentState: state.users }),
    shallowEqual
  );

  const { totalCount, entities, perPage } = currentState;
  const columns = [
    {
      dataField: "user_id",
      text: "Mã người dùng",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        fontWeight: "600",
      },
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "status_id",
      text: "Trạng thái ",
      sort: true,
    },
    {
      dataField: "created_at",
      text: "Ngày đăng kí ",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
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
    },
  ];
  function rankFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <>
        <OverlayTrigger overlay={<Tooltip>Chi tiết</Tooltip>}>
          <Link
            to={`/admin/all-users/${row.user_id}`}
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <RemoveRedEyeIcon></RemoveRedEyeIcon>
            </span>
          </Link>
        </OverlayTrigger>
        <></>
        <OverlayTrigger overlay={<Tooltip>Xoá Người dùng</Tooltip>}>
          <a
            className="btn btn-icon btn-light btn-hover-danger btn-sm mx-3"
            onClick={() => deleteModal(row)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      </>
    );
  }
  const options = {
    hideSizePerPage: true,
    onPageChange: (page, sizePerPage) => {
      dispatch(getUsersList(params));
    },
  };
  return (
    <>
      <Card style={{ marginBottom: "0" }}>
        <CardHeader title="Danh sách người dùng">
          <CardHeaderToolbar>
            <Link
              to="/admin/profile/user-manage/create"
              type="button"
              className="btn btn-primary"
            >
              <i className="fa fa-plus"></i>
              Cấp quyền quản lý
            </Link>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <ToolkitProvider
            keyField="id"
            data={
              entities === null
                ? []
                : entities.entities?.map((user) => ({
                    ...user,
                    status_id: status?.find(
                      (status) => status?.id === user?.user_id
                    )?.status_id,
                    email: status?.find((email) => email?.id === user?.user_id)
                      ?.email,
                  }))
            }
            columns={columns}
            search
          >
            {(props) => (
              <div>
                <div className="row">
                  <div className="col-6 pl-0">
                    <InputGroup style={{marginLeft:"2%"}}>
                      
                      <InputGroup.Append>
                        <Form.Group>
                          <Form.Control as="select">
                            <option value="">Tất cả</option>
                            <option value="id">Mã Người dùng</option>
                            <option value="name">Email</option>
                            <option value="name">Trạng thái</option>
                          </Form.Control>
                        </Form.Group>
                      </InputGroup.Append>
                      <SearchBar style={{marginLeft:"4%"}} {...props.searchProps} />
                    </InputGroup>
                  </div>
                </div>
                
                <BootstrapTable
                  hover
                  wrapperClasses="table-responsive"
                  classes="table table-head-custom table-vertical-center overflow-hidden"
                  bordered={false}
                  {...props.baseProps}
                  onTableChange={getHandlerTableChange}
                  pagination={paginationFactory(options)}
                />
              </div>
            )}
          </ToolkitProvider>
        </CardBody>
      </Card>
    </>
  );
}