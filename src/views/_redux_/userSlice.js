import { token } from "../admin/profile/profileCRUD";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

export const usersSlice = createSlice({
  name: "users",
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
const { Userssuccess } = usersSlice.actions;

export const getAllUser = () => {
  return api.get("users")
};

export const getUserDetail = (id) => {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `http://139.180.207.4:81/api/users/${id}?with=roles`,
    requestOptions
  );
};
