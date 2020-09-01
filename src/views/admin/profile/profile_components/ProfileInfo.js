import React, { Component } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { getUser, getBalance } from "../profileCRUD";
// import BootstrapTable from "reactjs-bootstrap-table";
// import { Tag } from "antd";
import Badge from "react-bootstrap/Badge";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      roles: [],
      persmissions: [],
      status_id: "",
      balance: 0,
      currency_id: "",
      balance_vn: 0,
      balance_jp: 0,
    };
  }
  componentDidMount() {
    getUser()
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          ...this.state,
          email: data.email,
          id: data.id,
          roles: data.roles,
          persmissions: data.direct_permissions,
          status_id: data.status_id,
        });
      });
    setTimeout(() => {
      getBalance(this.state.id)
        .then((response) => response.json())
        .then((result) => {
          this.setState({
            ...this.state,
            currency_id: result.data[0].currency_id,
            balance: result.data[0].balance,
          });
        })
        .catch((error) => console.log("error", error));
      if (this.state.currency_id !== "JPY")
        this.setState({
          ...this.state,
          balance_vn: 0,
          balance_jp: this.state.balance,
        });
      else
        this.setState({
          ...this.state,
          balance_jp: 0,
          balance_vn: this.state.balance,
        });
    }, 3000);
  }
  render() {
    const data = [
      {
        id: 21,
        amount: 1000000,
        type_id: "deposit_jpy",
        description: "nộp tiền",
        user_id: "customer.2",
        prepared_by_id: "accountant",
        payment_method_id: "visa",
        created_at: "2020-08-15T14:07:09.000000Z",
        updated_at: "2020-08-15T14:07:09.000000Z",
      },
    ];
    const options = {
      hideSizePerPage: true,
    };

    const columns = [
      {
        dataField: "amount",
        text: "Số tiền",
        sort: true,
      },
      {
        dataField: "description",
        text: "Nội dung",
      },
      {
        dataField: "prepared_by_id",
        text: "Người thực hiện ",
        sort: true,
      },
      {
        dataField: "created_at",
        text: "Ngày thực hiện ",
      },
    ];
    let roles = this.state.roles ? this.state.roles : "";
    let persmissions = this.state.persmissions ? this.state.persmissions : "";
    return (
      <div class="card card-custom card-stretch">
        <div class="card-header py-3">
          <div class="card-title align-items-start flex-column">
            <h3 class="card-label font-weight-bolder text-dark">
              Thông tin cá nhân
            </h3>
            <span class="text-muted font-weight-bold font-size-sm mt-1">
              Cập nhật thông tin của bạn
            </span>
          </div>
        </div>

        <div>
          <form style={{ float: "left", width: "60%" }} class="form">
            <div class="card-body">
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">
                  ID
                </label>
                <div class="col-lg-9 col-xl-6">
                  <input
                    class="form-control form-control-lg form-control-solid"
                    type="text"
                    value={this.state.id}
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">
                  Trạng thái
                </label>
                <div class="col-lg-9 col-xl-6">
                  <input
                    class="form-control form-control-lg form-control-solid"
                    type="text"
                    value={this.state.status_id}
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">
                  Địa chỉ email
                </label>
                <div class="col-lg-9 col-xl-6">
                  <div class="input-group input-group-lg input-group-solid">
                    <div class="input-group-prepend">
                      <span class="input-group-text">@</span>
                    </div>
                    <input
                      type="text"
                      class="form-control form-control-lg form-control-solid"
                      value={this.state.email}
                      placeholder="Email"
                    />
                  </div>
                  <span class="form-text text-muted">
                    We'll never share your email with anyone else.
                  </span>
                </div>
              </div>
            </div>
          </form>

          <form class="form">
            <div class="card-body">
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">
                  Vai trò
                </label>
                <div class="col-lg-9 col-xl-6">
                  {roles
                    ? roles.map((item) => (
                        <Badge
                          style={{ padding: "10%", fontSize: "100%" }}
                          variant="primary"
                        >
                          {item.name}
                        </Badge>
                      ))
                    : []}
                </div>
              </div>
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">
                  Quyền
                </label>
                <div class="col-lg-9 col-xl-6">
                  {persmissions
                    ? persmissions.map((item) => (
                        <Badge
                          style={{ padding: "10%", fontSize: "100%" }}
                          variant="info"
                        >
                          {item.name}
                        </Badge>
                      ))
                    : []}
                </div>
              </div>
            </div>
          </form>
        </div>
        <hr />

        <div style={{ display: "flex" }}>
          <form
            style={{
              float: "left",
              width: "39%",
              borderRight: "1px solid #EBEDF3",
            }}
            class="form"
          >
            <div class="card-header py-3" style={{ borderBottom: "none" }}>
              <div class="card-title align-items-start flex-column">
                <h3 class="card-label font-weight-bolder text-dark">
                  Thông tin tài khoản tiền
                </h3>
              </div>
            </div>
            <div class="card-body">
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">
                  VND
                </label>
                <div class="col-lg-9 col-xl-6">
                  <input
                    class="form-control form-control-lg form-control-solid"
                    type="text"
                    value={this.state.balance_vn}
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">
                  JPY
                </label>
                <div class="col-lg-9 col-xl-6">
                  <input
                    class="form-control form-control-lg form-control-solid"
                    type="text"
                    value={this.state.balance_jp}
                  />
                </div>
              </div>
            </div>
          </form>
          <div style={{ marginLeft: "2%" }}>
            <div
              class="card-header py-3"
              style={{ borderBottom: "none", display: "flex" }}
            >
              <div class="card-title align-items-start flex-column">
                <h3 class="card-label font-weight-bolder text-dark">
                  Giao dịch gần đây
                </h3>
              </div>
              <Link
                to="/admin/profile/transaction"
                style={{ marginLeft: "auto", color: "blue" }}
              >
                Xem thêm &gt;&gt;
              </Link>
            </div>
            <BootstrapTable
              wrapperClasses="table-responsive"
              classes="table table-head-custom table-vertical-center overflow-hidden"
              bordered={false}
              keyField="id"
              data={data}
              columns={columns}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileInfo;