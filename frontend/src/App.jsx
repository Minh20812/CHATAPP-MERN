import Routers from "./routers/Routers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSocketConnection } from "./redux/feature/userSlice";
import socket from "./socket";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Lắng nghe trạng thái kết nối
    socket.on("connect", () => {
      dispatch(setSocketConnection(true));
    });

    socket.on("disconnect", () => {
      dispatch(setSocketConnection(false));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
  return (
    <>
      <Routers />
    </>
  );
};

export default App;
