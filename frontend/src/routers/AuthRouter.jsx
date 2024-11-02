import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, SignUp } from "../screens";

const AuthRouter = () => {
  return (
    <>
      <div className="flex min-h-screen">
        <div className="w-1/2 bg-gray-100 max-lg:hidden flex justify-center items-center flex-col">
          <h1 className=" text-[#009ED8] mt-[33px] font-inter text-[47px] font-semibold leading-[56.88px]">
            CHAT APP
          </h1>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
};

export default AuthRouter;
