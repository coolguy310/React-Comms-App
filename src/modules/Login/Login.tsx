import React from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleButton, LoginHeading, Wrapper } from "./Login.styled";
import { doc, getDoc, setDoc } from "firebase/firestore";
import db from "../../firebase";

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
      const { user } = await signInWithPopup(auth, provider);

      // If user does not already exist in the database, add user to database
      const snap = await getDoc(doc(db, "users", user.uid!));

      if (!snap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
        });
      }

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
