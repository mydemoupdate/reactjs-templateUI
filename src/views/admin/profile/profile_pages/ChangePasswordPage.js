import React, { Component } from "react";
import {toAbsoluteUrl} from "../../../../_metronic/_helpers"
import ChangePass from "../profile_components/ChangePassword";
import PersonIcon from "@material-ui/icons/Person";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { getUser } from "../profileCRUD";
class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      name: "",
    };
  }

  componentDidMount() {
    getUser()
    .then((res) => res.json())
    .then((data) => {
      this.setState({
        email: data.email,
        id: data.id,
        name: data.roles["0"].name,
      });
    });
  }

   
  render() {
    return (
      <div class="d-flex flex-column-fluid">
        <div class=" container ">
          <div class="d-flex flex-row">
            <div
              class="flex-row-auto offcanvas-mobile w-250px w-xxl-350px"
              id="kt_profile_aside"
            >
              <div class="card card-custom card-stretch">
                <div class="card-body pt-4">
                  <div class="d-flex justify-content-end">
                    <div class="dropdown dropdown-inline">
                      <a
                        href="#"
                        class="btn btn-clean btn-hover-light-primary btn-sm btn-icon"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="ki ki-bold-more-hor"></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                        <ul class="navi navi-hover py-5">
                          <li class="navi-item">
                            <a href="#" class="navi-link">
                              <span class="navi-icon">
                                <i class="flaticon2-drop"></i>
                              </span>
                              <span class="navi-text">New Group</span>
                            </a>
                          </li>
                          <li class="navi-item">
                            <a href="#" class="navi-link">
                              <span class="navi-icon">
                                <i class="flaticon2-list-3"></i>
                              </span>
                              <span class="navi-text">Contacts</span>
                            </a>
                          </li>
                          <li class="navi-item">
                            <a href="#" class="navi-link">
                              <span class="navi-icon">
                                <i class="flaticon2-rocket-1"></i>
                              </span>
                              <span class="navi-text">Groups</span>
                              <span class="navi-link-badge">
                                <span class="label label-light-primary label-inline font-weight-bold">
                                  new
                                </span>
                              </span>
                            </a>
                          </li>
                          <li class="navi-item">
                            <a href="#" class="navi-link">
                              <span class="navi-icon">
                                <i class="flaticon2-bell-2"></i>
                              </span>
                              <span class="navi-text">Calls</span>
                            </a>
                          </li>
                          <li class="navi-item">
                            <a href="#" class="navi-link">
                              <span class="navi-icon">
                                <i class="flaticon2-gear"></i>
                              </span>
                              <span class="navi-text">Settings</span>
                            </a>
                          </li>

                          <li class="navi-separator my-3"></li>

                          <li class="navi-item">
                            <a href="#" class="navi-link">
                              <span class="navi-icon">
                                <i class="flaticon2-magnifier-tool"></i>
                              </span>
                              <span class="navi-text">Help</span>
                            </a>
                          </li>
                          <li class="navi-item">
                            <a href="#" class="navi-link">
                              <span class="navi-icon">
                                <i class="flaticon2-bell-2"></i>
                              </span>
                              <span class="navi-text">Privacy</span>
                              <span class="navi-link-badge">
                                <span class="label label-light-danger label-rounded font-weight-bold">
                                  5
                                </span>
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
                      <div
                        class="symbol-label"
                        style={{
                          backgroundImage: `url(${toAbsoluteUrl(
                              "/media/users/300_21.jpg"
                          )})`}}
                      ></div>
                      <i class="symbol-badge bg-success"></i>
                    </div>
                    <div>
                      <a
                        href="#"
                        class="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
                      >
                        {this.state.name}
                      </a>
                      <div class="text-muted">{this.state.id}</div>
                      <div class="mt-2">
                        <a
                          href="#"
                          class="btn btn-sm btn-primary font-weight-bold mr-2 py-2 px-3 px-xxl-5 my-1"
                        >
                          Chat
                        </a>
                        <a
                          href="#"
                          class="btn btn-sm btn-success font-weight-bold py-2 px-3 px-xxl-5 my-1"
                        >
                          Follow
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="py-9">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="font-weight-bold mr-2">Email:</span>
                      <a href="#" class="text-muted text-hover-primary">
                        {this.state.email}
                      </a>
                    </div>
                  </div>

                  <div class="navi navi-bold navi-hover navi-active navi-link-rounded">
                    <div class="navi-item mb-2">
                      <a href="/admin/profile" class="navi-link py-4 ">
                        <span class="navi-icon mr-2">
                          <span class="svg-icon">
                            <PersonIcon></PersonIcon>
                          </span>{" "}
                        </span>
                        <span class="navi-text font-size-lg">
                          Personal Information
                        </span>
                      </a>
                    </div>

                    <div class="navi-item mb-2">
                      <a
                        href="/admin/profile/change-password"
                        class="navi-link py-4 active"
                      >
                        <span class="navi-icon mr-2">
                          <span class="svg-icon">
                            <VpnKeyIcon></VpnKeyIcon>
                          </span>{" "}
                        </span>
                        <span class="navi-text font-size-lg">
                          Change Password
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-row-fluid ml-lg-8">
              <ChangePass></ChangePass>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
