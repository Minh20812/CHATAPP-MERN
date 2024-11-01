// import { useEffect } from "react";
// import { getRedirectResult } from "firebase/auth";
// import { auth } from "./config";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { setCredentials } from "../../../redux/feature/auth/authSlice";
// import { useLoginGoogleMutation } from "../../../redux/api/userApiSlice";
// import { toast } from "react-toastify";

// const GoogleLogin = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [loginGoogle, { isLoading }] = useLoginGoogleMutation();
//   const { userInfo } = useSelector((state) => state.auth);

//   const { search } = useLocation();
//   const sp = new URLSearchParams(search);
//   const redirect = sp.get("redirect") || "/";

//   useEffect(() => {
//     if (userInfo) {
//       navigate(redirect);
//     }
//   }, [navigate, redirect, userInfo]);

//   // Handle the result of Google Sign-In after redirect
//   useEffect(() => {
//     const handleRedirectResult = async () => {
//       try {
//         const result = await getRedirectResult(auth);
//         if (result) {
//           const email = result.user.email;
//           const res = await loginGoogle({ email }).unwrap();
//           dispatch(setCredentials({ ...res }));
//           navigate(redirect);
//         }
//       } catch (err) {
//         toast.error(err?.data?.message || err.error);
//       }
//     };

//     handleRedirectResult();
//   }, [dispatch, loginGoogle, navigate, redirect]);

//   const handleGoogleSignIn = async () => {
//     try {
//       // Set the prompt parameter to force account selection
//       provider.setCustomParameters({
//         prompt: "select_account",
//       });

//       // Use signInWithRedirect
//       await signInWithRedirect(auth, provider);
//     } catch (err) {
//       toast.error(err?.message || err.error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleGoogleSignIn} disabled={isLoading} type="button">
//         {isLoading ? "Signing In..." : "Sign In With Google"}
//       </button>
//     </div>
//   );
// };

// export default GoogleLogin;

import { useEffect } from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../../../redux/feature/auth/authSlice";
import { useLoginGoogleMutation } from "../../../redux/api/userApiSlice";
import { toast } from "react-toastify";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginGoogle, { isLoading }] = useLoginGoogleMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      const res = await loginGoogle({ email }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn} disabled={isLoading} type="button">
        {isLoading ? "Signing In..." : "Sign In With Google"}
      </button>
    </div>
  );
};

export default GoogleLogin;
