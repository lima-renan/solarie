import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <div className="font-monoton text-3xl hover:text-red-800 cursor-pointer text-center transition">
        solarié
      </div>
    </Link>
  );
};

export default Logo;
