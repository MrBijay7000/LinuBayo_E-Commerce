import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./MobileNav.css";
import { useContext } from "react";
import { AuthContext } from "../Context/auth-context";

export default function MobileNav({
  toggleDrawer,
  query,
  setQuery,
  handleSearch,
}) {
  const auth = useContext(AuthContext);
  return (
    <div className="mobile-drawer open">
      <div className="drawer-header">
        <button className="close-btn" onClick={toggleDrawer}>
          <FaTimes />
        </button>
      </div>

      {/* 🔍 Mobile Search */}
      <form className="mobile-search" onSubmit={(e) => handleSearch(e)}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <ul className="mobile-links">
        <NavLink to="/" onClick={toggleDrawer}>
          Home
        </NavLink>
        {/* <NavLink to="/limited-edition">Limited Edition</NavLink> */}
        <NavLink
          to="/limited-edition"
          className="limited-link"
          onClick={toggleDrawer}
        >
          Limited Edition
          <span className="limited-badge">🔥</span>
        </NavLink>
        {auth.isLoggedIn && auth.role === "admin" && (
          <NavLink to="/admin/addProduct">Add Products</NavLink>
        )}
        <NavLink to="/new-arrivals" onClick={toggleDrawer}>
          New Arrivals
        </NavLink>
        <NavLink to="/best-seller" onClick={toggleDrawer}>
          Best Seller
        </NavLink>
        <NavLink to="/tops" onClick={toggleDrawer}>
          Tops
        </NavLink>
        <NavLink to="/pants" onClick={toggleDrawer}>
          Pants
        </NavLink>
        <NavLink to="/dresses" onClick={toggleDrawer}>
          Dresses
        </NavLink>
        <NavLink to="/skirts" onClick={toggleDrawer}>
          Skirts
        </NavLink>
        <NavLink to="/coord" onClick={toggleDrawer}>
          Co-ords
        </NavLink>
        <NavLink to="/about" onClick={toggleDrawer}>
          About Us
        </NavLink>
      </ul>
    </div>
  );
}
