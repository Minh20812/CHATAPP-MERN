import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const getUserDetailsFromToken = async (token) => {
  try {
    if (!token) return null;

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Truy xuất thông tin người dùng từ cơ sở dữ liệu
    const user = await UserModel.findById(decoded.id).select("-password");

    return user || null;
  } catch (err) {
    console.error("Error decoding token:", err.message);
    return null;
  }
};

export default getUserDetailsFromToken;
