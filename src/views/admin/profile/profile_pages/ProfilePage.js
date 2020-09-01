import React, { Component } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import ProfileInfo from "../profile_components/ProfileInfo";
import PersonIcon from "@material-ui/icons/Person";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { getUser } from "../profileCRUD";
import { ContentRoute } from "../../../../_metronic/layout";
import ChangePassword from "../profile_components/ChangePassword";
import { Link, Switch, Redirect } from "react-router-dom";
import { UserCreate } from "../profile_components/userCreate";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
    };
  }

  componentDidMount() {
    getUser()
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          email: data.email,
          id: data.id,
        });
      });
  }

  render() {
    return (
      <div class="d-flex flex-column-fluid">
        <div class=" container ">
          <div class="d-flex flex-row">
            <div
              class="flex-row-auto offcanvas-mobile w-250px w-xxl-260px"
              id="kt_profile_aside"
            >
              <div class="card card-custom card-stretch">
                <div class="card-body pt-4">
                  <div class="d-flex align-items-center">
                    <div>
                      <a
                        href="#"
                        class="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
                      >
                        {this.state.id.toUpperCase()}
                      </a>
                    </div>
                  </div>

                  <div class="py-5">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="font-weight-bold mr-2">Email:</span>
                      <a href="#" class="text-muted text-hover-primary">
                        {this.state.email}
                      </a>
                    </div>
                  </div>
                  <hr />
                  <div class="navi navi-bold navi-hover navi-active navi-link-rounded">
                    <div class="navi-item mb-2">
                      <Link to="/admin/profile" className=" navi-link py-4 ">
                        <span class="navi-icon mr-2">
                          <span class="svg-icon">
                            <PersonIcon></PersonIcon>
                          </span>{" "}
                        </span>
                        <span class="navi-text font-size-lg">
                          Thông tin cá nhân
                        </span>
                      </Link>
                    </div>

                    <div class="navi-item mb-2">
                      <Link
                        to="/admin/profile/change-password"
                        className=" navi-link py-4 "
                      >
                        <span class="navi-icon mr-2">
                          <span class="svg-icon">
                            <VpnKeyIcon></VpnKeyIcon>
                          </span>{" "}
                        </span>
                        <span class="navi-text font-size-lg">Đổi mật khẩu</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-row-fluid ml-lg-8">
              <Switch>
                <ContentRoute
                  path="/admin/profile/user-manage/create"
                  component={UserCreate}
                ></ContentRoute>
                <ContentRoute
                  path="/admin/profile/profile-info"
                  component={ProfileInfo}
                />
                <ContentRoute
                  path="/admin/profile/change-password"
                  component={ChangePassword}
                />
                <Redirect
                  from="/admin/profile"
                  exact={true}
                  to="/admin/profile/profile-info"
                />
                <Redirect to="/admin/profile/profile-info" />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;