import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import SVG from "react-inlinesvg";
import {
  toAbsoluteUrl,
  sortCaret,
  headerSortingClasses,
} from "../../../_metronic/_helpers";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import Moment from "moment";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import swal from "sweetalert";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { id } from "date-fns/locale";

export function TransactionList() {
  const [typeSearch, setTypeSearch] = useState();
  const [typeProduct, setTypeProduct] = useState("Retail");
  const [params, setParams] = useState("");
  const { SearchBar } = Search;
  const onFindChange = (e) => {
    setTypeSearch(e.target.value);
  };
  const onKeySearch = (e) => {
    if (e.key === "Enter") {
      setParams(
        "search=director.type.id:" +
          typeProduct +
          ";" +
          e.target.value +
          "&searchJoin=and&page=1"
      );
      if (typeSearch) {
        setParams(
          "search=director.type.id:" +
            typeProduct +
            ";" +
            typeSearch +
            ":" +
            e.target.value +
            "&searchJoin=and&page=1"
        );
      }
      // dispatch(getProductsList(params));
      e.target.value = "";
    }
  };
  const getHandlerTableChange = (e) => {}; // React creates function whenever rendered
  const data = [
    {
      id: 1,
      amount: 1000,
      type_id: "deposit_jpy",
      description: "nộp tiền",
      user_id: "customer.1",
      prepared_by_id: "admin",
      payment_method_id: "cash",
      created_at: null,
      updated_at: null,
    },
    {
      id: 2,
      amount: 700,
      type_id: "order",
      description: "thanh toán đơn hàng",
      user_id: "customer.1",
      prepared_by_id: "admin",
      payment_method_id: "visa",
      created_at: null,
      updated_at: null,
    },
    {
      id: 3,
      amount: -9702,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "seller",
      payment_method_id: null,
      created_at: "2020-08-11T05:49:28.000000Z",
      updated_at: "2020-08-11T05:49:28.000000Z",
    },
    {
      id: 4,
      amount: -515.1,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "seller",
      payment_method_id: null,
      created_at: "2020-08-11T05:49:49.000000Z",
      updated_at: "2020-08-11T05:49:49.000000Z",
    },
    {
      id: 5,
      amount: -463.5,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "seller",
      payment_method_id: null,
      created_at: "2020-08-11T05:50:00.000000Z",
      updated_at: "2020-08-11T05:50:00.000000Z",
    },
    {
      id: 6,
      amount: -45,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "customer.2",
      payment_method_id: null,
      created_at: "2020-08-11T05:50:15.000000Z",
      updated_at: "2020-08-11T05:50:15.000000Z",
    },
    {
      id: 7,
      amount: 1000000,
      type_id: "deposit_jpy",
      description: "nộp tiền",
      user_id: "customer.2",
      prepared_by_id: "accountant",
      payment_method_id: "visa",
      created_at: "2020-08-11T05:50:24.000000Z",
      updated_at: "2020-08-11T05:50:24.000000Z",
    },
    {
      id: 8,
      amount: 500,
      type_id: "purchase",
      description: "mua hàng",
      user_id: "buyer",
      prepared_by_id: "accountant",
      payment_method_id: "cash",
      created_at: "2020-08-11T05:50:24.000000Z",
      updated_at: "2020-08-11T05:50:24.000000Z",
    },
    {
      id: 9,
      amount: -202,
      type_id: "ladingbill",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "admin",
      payment_method_id: null,
      created_at: "2020-08-11T05:54:36.000000Z",
      updated_at: "2020-08-11T05:54:36.000000Z",
    },
    {
      id: 10,
      amount: -202,
      type_id: "ladingbill",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "admin",
      payment_method_id: null,
      created_at: "2020-08-11T05:58:46.000000Z",
      updated_at: "2020-08-11T05:58:46.000000Z",
    },
    {
      id: 11,
      amount: -9702,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "seller",
      payment_method_id: null,
      created_at: "2020-08-11T08:47:52.000000Z",
      updated_at: "2020-08-11T08:47:52.000000Z",
    },
    {
      id: 12,
      amount: -515.1,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "seller",
      payment_method_id: null,
      created_at: "2020-08-11T08:48:09.000000Z",
      updated_at: "2020-08-11T08:48:09.000000Z",
    },
    {
      id: 13,
      amount: -463.5,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "seller",
      payment_method_id: null,
      created_at: "2020-08-11T08:48:18.000000Z",
      updated_at: "2020-08-11T08:48:18.000000Z",
    },
    {
      id: 14,
      amount: -45,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "customer.2",
      payment_method_id: null,
      created_at: "2020-08-11T08:48:27.000000Z",
      updated_at: "2020-08-11T08:48:27.000000Z",
    },
    {
      id: 15,
      amount: -463.5,
      type_id: "order",
      description: null,
      user_id: "customer.2",
      prepared_by_id: "seller",
      payment_method_id: null,
      created_at: "2020-08-12T06:34:39.000000Z",
      updated_at: "2020-08-12T06:34:39.000000Z",
    },
  ];
  const columns = [
    {
      dataField: "created_at",
      text: "Ngày thực hiện ",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: dateFormatter,
    },
    {
      dataField: "prepared_by_id",
      text: "Người thực hiện ",
    },
    {
      dataField: "amount",
      text: "Số tiền",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "description",
      text: "Nội dung",
    },
  ];
  const options = {
    hideSizePerPage: false,
  };
  function dateFormatter(created_at) {
    return (
      <>
        <span>
          {" "}
          {created_at ? Moment(created_at).format("DD-MM-YYYY HH:MM") : ""}
        </span>
      </>
    );
  }
  return (
    <>
      <Card>
        <CardHeader title="Danh sách giao dịch">
          <CardHeaderToolbar>
            <Link
              to={"createproduct"}
              type="button"
              className="btn btn-primary"
            >
              <i className="fa fa-plus"></i>
              Tạo giao dịch
            </Link>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {/* <div className="col-12 pl-0">
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bordered={false}
                keyField="id"
                data={data}
                columns={columns}
                onTableChange={getHandlerTableChange}
                pagination={paginationFactory(options)}
              />
            </div> */}
          <ToolkitProvider keyField="id" data={data} columns={columns} search>
            {(props) => (
              <div>
                <SearchBar {...props.searchProps} />
                <hr />
                <BootstrapTable
                  wrapperClasses="table-responsive"
                  classes="table table-head-custom table-vertical-center overflow-hidden"
                  bordered={false}
                  {...props.baseProps}
                />
              </div>
            )}
          </ToolkitProvider>
        </CardBody>
      </Card>
    </>
  );
}