import React from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleButton, LoginHeading, Wrapper } from "./Login.styled";

export default function Login() {
  const auth = getAuth();
  let navigate = useNavigate();
  let location = useLocation();

  let fromPath = location.state as any;
  fromPath = fromPath?.pathname || "/";

  const signinWithGoogle = async () => {
    // Retrieve Google provider object
    const provider = new GoogleAuthProvider();
    // Set language to the default browser preference
    auth.useDeviceLanguage();
    // Start sign in process
    try {
      await signInWithPopup(auth, provider);

      // return the user back to the most recent route
      navigate(fromPath, { replace: true });
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <Wrapper>
      <LoginHeading>Login to Comms</LoginHeading>

      <GoogleButton onClick={signinWithGoogle}>
        <FcGoogle /> Login with Google
      </GoogleButton>
    </Wrapper>
  );
}
