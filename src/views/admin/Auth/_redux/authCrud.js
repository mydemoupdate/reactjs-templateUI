export const HOST ="http://139.180.207.4:81"
export const LOGIN_URL = `${HOST}/oauth/token`;
export const REGISTER_URL = `${HOST}/api/register`;
export const REQUEST_PASSWORD_URL =
  `${HOST}/api/password/email`;
export const RESET_PASSWORD_URL = `${HOST}/api/password/reset`;

export function login(
  username,
  password,
  grant_type,
  client_id,
  client_secret,
  scope
) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    username: username,
    password: password,
    grant_type: grant_type,
    client_id: client_id,
    client_secret: client_secret,
    scope: scope,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(LOGIN_URL, requestOptions);
}

export function register(email, id, password, password_confirmation) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${REGISTER_URL}?email=${email}&id=${id}&password=${password}&password_confirmation=${password_confirmation}`,
    requestOptions
  )
   
}

export function requestPassword(email) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${REQUEST_PASSWORD_URL}?email=${email}`, requestOptions)
    .then((response) => {
      response.text();
      alert("Open your email to change password");
      window.open("https://mail.google.com", "_blank");
      window.location.href = "/auth/reset-password";
    })
    .catch((error) => console.log("error", error));
}

export function resetPassword(email, password, password_confirmation, token) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `${RESET_PASSWORD_URL}?email=${email}&password=${password}&password_confirmation=${password_confirmation}&token=${token}`,
    requestOptions
  )
    .then((response) => {
      response.text();
      window.location.href = "/auth/login";
    })
    .catch((error) => console.log("error", error));
}
