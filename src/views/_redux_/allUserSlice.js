import { token } from "../admin/profile/profileCRUD";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ro } from "date-fns/locale";

const initialUsersState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  perPage: 0,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const allUsersSlice = createSlice({
  name: "allusers",
  initialState: initialUsersState,
  reducers: {
    // getProducts
    Userssuccess: (state, action) => {
      state.perPage = action.payload;
      state.totalCount = action.payload;
      state.entities = action.payload;
    },
  },
});
const api = axios.create({
  baseURL: "http://139.180.207.4:81/api/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const { Userssuccess } = allUsersSlice.actions;
export const getManageUsersList = (user_id) => async (dispatch) => {
  try {
    api.get(`users/${user_id}/?with=manageUsers`).then((res) => {
      var entities = res.data.manage_users || [];
      var totalCount = res.data.total || 0;
      var perPage = res.data.per_page || 0;
      const data = {
        entities,
        totalCount,
        perPage,
      };
      dispatch(Userssuccess(data));
    });
  } catch (e) {
    return console.error(e.message);
  }
};
export const deleteUsers = (id) => async (dispatch) => {
  return api.delete("users/" + id);
};

export const createUser = (manager_id, user_id) => async (dispatch) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  return await fetch(
    `http://139.180.207.4:81/api/manage-users?manager_id=${manager_id}&user_id=${user_id}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      alert("Add new user successfull");
    })
    .catch((error) => console.log("error", error));
};
export const getAllUserDetail = (id) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `http://139.180.207.4:81/api/users/${id}?with=roles.permissions;directPermissions`,
    requestOptions
  );
};
export const revokeRoles = (user_id, object) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `http://139.180.207.4:81/api/users/${user_id}?action=detach&params=["roles", ${object}]`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};
export const revokePermissions = (user_id, object) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `http://139.180.207.4:81/api/users/${user_id}?action=detach&params=["directPermissions", ${object}]`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};
export const assignManageUsers = (user_id, object) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `http://139.180.207.4:81/api/users/${user_id}?params=["manageUsers",${object}]&action=detach`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};
export const assignMyManager = (user_id, object) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `http://139.180.207.4:81/api/users/${user_id}?params=["mymanagers",${object}]&action=detach`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};
export const getRolesWithPermissions = () => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    "http://139.180.207.4:81/api/roles?with=permissions",
    requestOptions
  );
};
export const getDirectPermissions = () => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch("http://139.180.207.4:81/api/permissions", requestOptions);
};
export const givePermission=(user_id, object)=>{
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  return fetch(`http://139.180.207.4:81/api/users/${user_id}?action=attach&params=["directPermissions",${object}]`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
export const giveRoles=(user_id, object)=>{
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  return fetch(`http://139.180.207.4:81/api/users/${user_id}?action=attach&params=["roles",${object}]`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}