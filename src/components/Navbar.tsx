import React from "react";
import farmer from "../farmer.png";
import { NavbarProps } from "../interfaces";

const NavBar = ({ account }: NavbarProps) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <img src={farmer} width="30" height="30" className="d-inline-block align-top" alt="" />
      &nbsp; DApp Token Farm
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small className="text-secondary">
            <small id="account">{account}</small>
          </small>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;