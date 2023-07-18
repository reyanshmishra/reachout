import React, { useCallback } from 'react';
// import { GoogleLogin } from 'react-google-login';

const GoogleButton = () => {
  const responseGoogle = useCallback(() => {}, []);

  return (
    <button className="copy-button" role="button">
      {/* <GoogleLogin
        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      /> */}
      <img
        width="15x"
        style={{ marginRight: 8 }}
        alt="Google sign-in"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleButton;
