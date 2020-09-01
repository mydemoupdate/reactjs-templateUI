import React, { useState } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import {token} from "../profileCRUD"
function ChangePassword() {
  const password = useFormInput("");
  const password_confirmation = useFormInput("");
  const handleChangePass = () => {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );

    var formdata = new FormData();
    formdata.append("password", password.value);
    formdata.append("password_confirmation", password_confirmation.value);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://139.180.207.4:81/api/me/password?password=${password.value}&password_confirmation=${password_confirmation.value}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.message !== undefined) alert(result.message);
        else alert("Your password has been changed");
      })
      .catch((error) => alert(error));
  };
  return (
   
      <div class="card card-custom card-stretch">
        <div class="card-header py-3">
          <div class="card-title align-items-start flex-column">
            <h3 class="card-label font-weight-bolder text-dark">
              Thay đổi mật khẩu
            </h3>
            <span class="text-muted font-weight-bold font-size-sm mt-1">
              Thay đổi mật khẩu cho tài khoản của bạn
            </span>
          </div>
          <div class="card-toolbar">
            <button
              type="button"
              class="btn btn-success mr-2"
              onClick={handleChangePass}
            >
              Lưu mật khẩu
            </button>
            <button type="reset" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>

        <form class="form">
          <div class="card-body">
            <div
              class="alert alert-custom alert-light-danger fade show mb-10"
              role="alert"
            >
              <div class="alert-icon">
                <span class="svg-icon svg-icon-3x svg-icon-danger">
                  <CancelIcon style={{ color: "pink" }}></CancelIcon>
                </span>{" "}
              </div>
              <div class="alert-text font-weight-bold">
                Configure user passwords to expire periodically. Users will need
                warning that their passwords are going to expire,
                <br />
                or they might inadvertently get locked out of the system!
              </div>
              <div class="alert-close">
                <button
                  type="button"
                  class="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">
                    <i class="ki ki-close"></i>
                  </span>
                </button>
              </div>
            </div>

            <div class="form-group row">
              <label class="col-xl-3 col-lg-3 col-form-label text-alert">
                Mật khẩu mới
              </label>
              <div class="col-lg-9 col-xl-6">
                <input
                  type="password"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="New password"
                  {...password}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-xl-3 col-lg-3 col-form-label text-alert">
                Xác nhận lại mật khẩu
              </label>
              <div class="col-lg-9 col-xl-6">
                <input
                  type="password"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Verify password"
                  {...password_confirmation}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    
  );
}

export default ChangePassword;
const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};