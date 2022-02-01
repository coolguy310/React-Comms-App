import React from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

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
      navigate(fromPath, { replace: true });
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div className="justify-center items-center flex min-h-screen flex-col space-y-12">
      <h1 className="text-4xl font-extrabold">Login to Comms</h1>

      <button
        onClick={signinWithGoogle}
        className="flex items-center bg-primary py-3 px-5 rounded-md text-white"
      >
        <FcGoogle className="mr-2" /> Login with Google
      </button>
    </div>
  );
}
