import React from "react";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className=" ">
      <Sidebar />
      <div className="  mx-[1rem] sm:ml-[18rem] mt-[6rem] sm:me-10">{children}</div>
    </div>
  );
};

export default Layout;
