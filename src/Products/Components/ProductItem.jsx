import { useNavigate, useParams } from "react-router-dom";
import Card from "../../shared/UIElements/Card";
import "./ProductItem.css";

export default function ProductItem(props) {
  const navigate = useNavigate();

  function updateProductHandler() {
    navigate(`/admin/updateProduct/${props.id}`);
  }

  return (
    <li className="product-item">
      <Card className="product-item__content">
        <div className="product-item__image">
          {/* <img src={props.image} alt={props.name} /> */}
          <img src={`http://localhost:5001/${props.image}`} alt={props.name} />
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
          <button>VIEW DETAILS</button>
          <button onClick={updateProductHandler}>UPDATE</button>
          <button>DELETE</button>
        </div>
      </Card>
    </li>
  );
}
