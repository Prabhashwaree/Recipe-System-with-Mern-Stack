import React from "react";
import { logoLogin } from "../../assets";
import { Link } from "react-router-dom";

const Logo = ({ customCss, hideName = false }) => {
  return (
    <Link
      to={"/"}
      className={`max-w-max ${customCss}`}
    >
      <div className="flex gap-1.5 items-center">
        <div className="w-12">
          <img
            src={logoLogin}
            alt="recipen logo"
            className="w-full h-full"
          />
        </div>
        {!hideName && <h1 className="font-bold text-xl">Cook Book Recipen</h1>}
      </div>
    </Link>
  );
};

export default Logo;
