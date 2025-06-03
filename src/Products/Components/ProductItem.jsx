import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../shared/UIElements/Card";
import Modal from "../../shared/UIElements/Modal";
import Button from "../../shared/FormElements/Button";
import "./ProductItem.css";

export default function ProductItem(props) {
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
            <button className="btn-view">VIEW DETAILS</button>
            <button className="btn-update" onClick={updateProductHandler}>
              UPDATE
            </button>
            <button
              className="btn-delete"
              onClick={showDeleteWarningHandler}
              disabled={props.isDeleting}
            >
              DELETE
            </button>
          </div>
        </Card>
      </li>
    </>
  );
}
