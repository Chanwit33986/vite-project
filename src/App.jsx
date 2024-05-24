import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { FacebookLogin } from "@capacitor-community/facebook-login";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useEffect } from "react";
import axios from "axios";
import AppUrlListener from "./AppUrlListener";

function App() {
  const query = new URLSearchParams(window.location.search);
  let lineCode = query.get("code");
  const client_id = "1657921784";
  const redirect_link = "http://localhost:5173";
  const clientSecret = "a7a2f5e62e3d1e44146f59ec608771fb";
  const scope = "openid%20profile%20email";
  const state = "open";
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_link}&state=${state}&scope=${scope}`;
  GoogleAuth.initialize({
    clientId:
      "91134879409-eu93nrho0a2lhnvb7i72v9dlks06dron.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    grantOfflineAccess: true,
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("lineCode", lineCode);
    if (lineCode) {
      getLineToken();
    }
  }, [lineCode]);

  const getLineToken = async () => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", lineCode);
    params.append("redirect_uri", redirect_link);
    params.append("client_id", client_id);
    params.append("client_secret", clientSecret);

    const request = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("request", request);

    const tokenData = request.data;
    const verifyParams = new URLSearchParams();
    verifyParams.append("client_id", client_id);
    verifyParams.append("id_token", tokenData.id_token);
    const requestVerify = await axios.post(
      "https://api.line.me/oauth2/v2.1/verify",
      verifyParams,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("requestVerify", requestVerify);
  };

  const fbLogin = async () => {
    await FacebookLogin.initialize({ appId: "649462510208526" });
    const FACEBOOK_PERMISSIONS = [
      "email",
      "user_birthday",
      "user_photos",
      "user_gender",
    ];
    const result = await FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });
    console.log("fb result", result);
    if (result.accessToken) {
      // Login successful.
      console.log(`Facebook access token is ${result.accessToken.token}`);
      const fbProfileResult = await FacebookLogin.getProfile({
        fields: ["email", "picture", "name"],
      });

      console.log("fbProfileResult", fbProfileResult);
    }
  };

  const googleSignIn = async () => {
    const response = await GoogleAuth.signIn();
    console.log(response);
  };

  const lineLogin = async () => {
    window.location.href = lineLoginUrl;
  };
  return (
    <>
      <AppUrlListener />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={fbLogin}>Facebook login</button>
      <button onClick={googleSignIn}>Google login</button>
      <button onClick={lineLogin}>Line login</button>
    </>
  );
}

export default App;
