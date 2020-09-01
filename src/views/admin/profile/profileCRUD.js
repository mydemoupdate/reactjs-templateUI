export const token = localStorage.getItem("accessToken");
export const GET_USER_URL =
  "http://139.180.207.4:81/api/me?with=roles;directPermissions";
export const CHANGE_PASSWORD_URL = "http://139.180.207.4:81/api/me/password";
export async function getUser() {
  return await fetch(GET_USER_URL, {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });
}
export const GET_BALANCE_URL = "http://139.180.207.4:82/api/accounts";
export async function getBalance(id) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return await fetch(
    `${GET_BALANCE_URL}?search=${id}&searchFields=user_id`,
    requestOptions
  );
}
export function getRoles() {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch("http://139.180.207.4:81/api/roles?with=permissions", requestOptions);
}
export function getStatus() {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch("http://139.180.207.4:81/api/user-statuses", requestOptions);
}
export function Update(user_id, status_id) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `http://139.180.207.4:81/api/users/${user_id}?status_id=${status_id}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
