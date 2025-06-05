import { useContext, useState } from "react";
import { FaEye, FaEdit, FaTrashAlt, FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Card from "../../shared/UIElements/Card";
import Modal from "../../shared/UIElements/Modal";
import Button from "../../shared/FormElements/Button";
import "./ProductItem.css";
import { AuthContext } from "../../shared/Context/auth-context";
import CartContext from "../../shared/Context/CartContext";
import { toast } from "react-toastify";

export default function ProductItem(props) {
  const auth = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  function showDeleteWarningHandler() {
    setShowConfirmModal(true);
  }

  function cancelDeleteHandler() {
    setShowConfirmModal(false);
  }

  function confirmDeleteHandler() {
    setShowConfirmModal(false);
    props.onDeleteProduct(props.id); // Deletion is now handled by parent
  }

  function updateProductHandler() {
    navigate(`/admin/updateProduct/${props.id}`);
  }

  function addItemToCartHandler() {
    if (!auth.isLoggedIn) {
      navigate("/auth");
      return;
    }
    const selectedItem = {
      id: props.id,
      name: props.name,
      image: props.image,
      price: props.price,
      quantity: 1,
    };

    cartCtx.addItem(selectedItem);
    toast.success(`${props.name} added to cart!`, {
      style: {
        backgroundColor: "#0d1823",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "10px",
      },
    });
  }

  return (
    <>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        footerClass="place-item__modal-actions"
        header="Are you sure?"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed? Please note that it can't be undone
          thereafter.
        </p>
      </Modal>
      <li className="product-item">
        <Card className="product-item__content">
          <div className="product-item__image">
            {/* <img src={props.image} alt={props.name} /> */}
            <img
              src={`http://localhost:5001/${props.image}`}
              alt={props.name}
            />
          </div>
          <div className="product-item__info">
            <h2 className="product-item__title">{props.name}</h2>

            <div className="product-item__prices">
              {props.originalPrice && (
                <span className="product-item__original-price">
                  Original: Rs {props.originalPrice}
                </span>
              )}
              <span className="product-item__price">
                Offer Price: Rs {props.price}
              </span>
              {props.discount && (
                <span className="product-item__discount">
                  -{props.discount}% OFF
                </span>
              )}
            </div>

            <span className="product-item__quantity">
              Quantity: {props.quantity}
            </span>
          </div>

          <div className="product-item__buttons">
            <button className="btn-view">
              <FaEye className="btn-icon" />
              VIEW DETAILS
            </button>

            {auth.role === "admin" && (
              <button className="btn-update" onClick={updateProductHandler}>
                <FaEdit className="btn-icon" />
                UPDATE
              </button>
            )}
            {auth.role === "admin" ? (
              <button
                className="btn-delete"
                onClick={showDeleteWarningHandler}
                disabled={props.isDeleting}
              >
                <FaTrashAlt className="btn-icon" />
                DELETE
              </button>
            ) : (
              <button className="btn-addtocart" onClick={addItemToCartHandler}>
                <FaCartPlus className="btn-icon" />
                ADD TO CART
              </button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
}
