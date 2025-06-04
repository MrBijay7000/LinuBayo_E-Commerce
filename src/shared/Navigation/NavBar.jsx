import React, { useContext, useState } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

import "./NavBar.css";
import MobileNav from "./MobileNav";
import { AuthContext } from "../Context/auth-context";
import CartContext from "../Context/CartContext";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const totalCartItems = cartCtx.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  function handleLogOut() {
    auth.logout();
    cartCtx.clearCart();
  }

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <button
            className="mobile-menu-icon"
            onClick={toggleDrawer}
            aria-label="Open navigation menu"
          >
            <FaBars />
          </button>
          <NavLink to="/" className="logo-link">
            LINUBAYO
          </NavLink>
        </div>

        {/* Search (desktop only, hidden on mobile via CSS) */}

        {/* <div className="nav-center"> */}
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for clothes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" style={{ background: "none", border: "none" }}>
            <FaSearch />
          </button>
        </form>
        {/* </div> */}

        {/* Icons (desktop only, hidden on mobile via CSS) */}
        <div className="nav-icons">
          {!auth.isLoggedIn ? (
            <NavLink to="/auth" className="nav-auth-btn login">
              <FaSignInAlt className="icon" />
              <span>Login</span>
            </NavLink>
          ) : (
            <NavLink
              to="/"
              className="nav-auth-btn logout"
              onClick={handleLogOut}
            >
              <FaSignOutAlt className="icon" />
              <span>Logout</span>
            </NavLink>
          )}
          {/* {auth.isLoggedIn && auth.role === "admin" ? (
            <NavLink to="/admin/homepage" className="nav-icon">
              <FaUser />
            </NavLink>
          ) : (
            <NavLink to="/users/home" className="nav-icon">
              <FaUser />
            </NavLink>
          )} */}
          {auth.isLoggedIn && (
            <NavLink
              to={
                auth.role?.toLowerCase() === "admin"
                  ? "/admin/homepage"
                  : "/users/home"
              }
              className="nav-icon"
            >
              <FaUser />
            </NavLink>
          )}

          <NavLink to="/cart" className="cart-icon">
            <FaShoppingBag />
            {totalCartItems > 0 && (
              <span className="cart-badge">{totalCartItems}</span>
            )}
          </NavLink>
        </div>
      </div>

      {/* Navigation Links (desktop only) */}
      <ul className="nav-links">
        {auth.role === "admin" ? (
          <NavLink to="/admin/homepage">Admin Home page</NavLink>
        ) : (
          <NavLink to="/">Home</NavLink>
        )}
        {/* <NavLink to="/limited-edition">Limited Edition</NavLink> */}
        <NavLink to="/limited-edition" className="limited-link">
          Limited Edition
          <span className="limited-badge">🔥</span>
        </NavLink>

        {auth.isLoggedIn && auth.role === "admin" && (
          <NavLink to="/admin/addProduct">Add Products</NavLink>
        )}
        <NavLink to="/best-seller">Best Seller</NavLink>
        <li className="dropdown">
          <span className="dropbtn">Shop By</span>
          <div className="dropdown-content">
            <NavLink to="/tops">Tops</NavLink>
            <NavLink to="/pants">Pants</NavLink>
            <NavLink to="/dresses">Dresses</NavLink>
            <NavLink to="/skirts">Skirts</NavLink>
            <NavLink to="/coord">Co-ords</NavLink>
          </div>
        </li>
        <li>
          <NavLink to="/aboutus">About Us</NavLink>
        </li>
      </ul>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div className="drawer-overlay show" onClick={toggleDrawer}></div>
          <MobileNav
            toggleDrawer={toggleDrawer}
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
          />
        </>
      )}
    </nav>
  );
}
