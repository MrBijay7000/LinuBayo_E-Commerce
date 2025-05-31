import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingBag,
  FaBars,
} from "react-icons/fa";

import "./MainNavigation.css";

const Navbar = () => {
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        {/* Top Section: Logo, Search Bar, and Icons */}
        <div className="nav-top">
          <div className="logo">
            <NavLink to="/"> PAHIRAN</NavLink>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Search for products..." />
            <button>
              <FaSearch />
            </button>
          </div>

          <div className="icons">
            <FaUser className="icon" />
            <FaHeart className="icon" />
            <FaShoppingBag className="icon" />
          </div>
        </div>

        {/* Bottom Section: Navigation Links */}
        <div className="nav-links">
          <ul>
            <li>
              <NavLink to="/new-arrivals">New Arrivals</NavLink>
            </li>
            <li>
              <NavLink to="/best-sellers">Best Sellers</NavLink>
            </li>
            <li className="dropdown">
              <NavLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCollectionsOpen((prev) => !prev);
                }}
              >
                Collections ▾
              </NavLink>
              {collectionsOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/collections/spring">
                      Spring Collection
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/ethnic">Ethnic Wear</NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/western">Western</NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/work">Work Wear</NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/casuals">Casuals</NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink to="/shop-by">Shop By</NavLink>
            </li>
            <li>
              <NavLink to="/gifting">Gifting</NavLink>
            </li>
            <li>
              <NavLink to="/seasonal">Seasonal Collection</NavLink>
            </li>
            <li>
              <NavLink to="/track-order">Track Order</NavLink>
            </li>
            <li>
              <NavLink to="/about">About Us</NavLink>
            </li>
          </ul>
        </div>
      </nav>
      {/* <nav class="nav">
        <ul class="nav-menu">
          <li class="nav-item">
            <a href="#" class="nav-link">
              Home
            </a>
          </li>

          <li class="nav-item dropdown">
            <a href="#" class="nav-link">
              Collection
            </a>
            <div class="dropdown-menu">
              <div class="dropdown-column">
                <h4>Category</h4>
                <a href="#">Dresses</a>
                <a href="#">Tops</a>
                <a href="#">Bottoms</a>
                <a href="#">Co-ords</a>
                <a href="#">Jumpsuits</a>
              </div>
              <div class="dropdown-column">
                <h4>Occasion</h4>
                <a href="#">Casual</a>
                <a href="#">Party</a>
                <a href="#">Work</a>
                <a href="#">Festive</a>
                <a href="#">Wedding</a>
              </div>
              <div class="dropdown-column">
                <h4>Style</h4>
                <a href="#">Trendy</a>
                <a href="#">Minimal</a>
                <a href="#">Boho</a>
                <a href="#">Chic</a>
                <a href="#">Vintage</a>
              </div>
              <div class="dropdown-column">
                <h4>Season</h4>
                <a href="#">Spring</a>
                <a href="#">Summer</a>
                <a href="#">Fall</a>
                <a href="#">Winter</a>
              </div>
            </div>
          </li>
        </ul>
      </nav> */}
    </>
  );
};

export default Navbar;
