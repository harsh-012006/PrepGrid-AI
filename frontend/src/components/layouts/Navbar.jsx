import React from "react";
import ProfileInfoCard from "../cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="h-16 bg-white border border-gray-200/50 backdrop-blur-md flex items-center justify-between gap-5 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/dashboard">
          <h2 className="text-lg md:text-xl font-bold text-black leading-5">
            PrepGrid AI
          </h2>
        </Link>

        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default Navbar;
