import React, { useContext, useState } from "react";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingBag,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

import "./NavBar.css";

export default function Navbar() {
  // const auth = useContext(AuthContext);
  // const { clearCart, items } = useContext(CartContext);

  // const totalCartItems = items.reduce(
  //   (total, item) => total + item.quantity,
  //   0
  // );

  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   auth.logout();
  //   clearCart();
  //   navigate("/");
  // };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          LINUBAYO
        </NavLink>

        {/* 🔍 Global Search Bar */}
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
        {/* <div className="search-container">
          <SearchBar />
        </div> */}

        {/* 👤 Icons */}
        <div className="nav-icons">
          <NavLink to="/auth">
            <FaUser />
          </NavLink>
          {/* {auth.isLoggedIn ? (
            <>
              <NavLink to="/profile">
                <FaUser />
              </NavLink>
              <button onClick={handleLogout} className="logout-btn">
                Log Out
              </button>
            </>
          ) : (
            <NavLink to="/auth">
              <FaUser />
            </NavLink>
          )} */}

          {/* {auth.isLoggedIn && (
            <NavLink to="/myDetails">
              <FaUserCircle />
            </NavLink>
          )} */}

          {/* {auth.isLoggedIn && } */}
          {/* {auth.role === "user" ? (
            <NavLink to="/cart" className="cart-icon">
              <FaShoppingBag />
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
            </NavLink>
          ) : null} */}
        </div>
      </div>

      {/* 🔗 Navigation Links */}
      <ul className="nav-links">
        {/* <li>
          <NavLink
            to={
              auth.isLoggedIn ? (auth.role === "admin" ? "/admin" : "/") : "/"
            }
          >
            {auth.isLoggedIn
              ? auth.role === "admin"
                ? "Admin Page"
                : "Home Page"
              : "Home"}
          </NavLink>
        </li> */}

        <NavLink to="/new-arrivals">New Arrivals</NavLink>

        {/* {(!auth.isLoggedIn || auth.role === "user") && (
          <li>
            <NavLink to="/new-arrivals">New Arrivals</NavLink>
          </li>
        )} */}
        <NavLink to="/add">Add Products</NavLink>

        {/* {auth.isLoggedIn && auth.role === "admin" && (
          <li>
            <NavLink to="/add">Add Products</NavLink>
          </li>
        )} */}
        <NavLink to="/best-seller">Best Seller</NavLink>

        {/* {(!auth.isLoggedIn || auth.role === "user") && (
          <li>
            <NavLink to="/best-seller">Best Seller</NavLink>
          </li>
        )} */}
        {/* {auth.isLoggedIn && auth.role === "admin" && (
          <li>
            <NavLink to="/user-list">View All Users</NavLink>
          </li>
        )} */}

        {/* <li>
          <NavLink to="/best-seller">Best Seller</NavLink>
        </li> */}
        {/* {auth.isLoggedIn && auth.role === "admin" ? (
          <li>
            <NavLink to="/update/:pid">Update Products</NavLink>
          </li>
        ) : (
          //       {products.map((product) => (
          //   <li key={product._id}>
          //     <NavLink to={`/update/${product._id}`}>{product.name}</NavLink>
          //   </li>
          // ))}
          auth.isLoggedIn && (
            <li>
              <NavLink to="/best-seller">Best Seller</NavLink>
            </li>
          )
        )} */}
        {/* <li>
          <NavLink to="/best-seller">Best Seller</NavLink>
        </li> */}

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
          <NavLink to="/about">About Us</NavLink>
        </li>
      </ul>
    </nav>
  );
}
