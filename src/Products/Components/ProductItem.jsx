import Card from "../../shared/UIElements/Card";
import "./ProductItem.css";

export default function ProductItem(props) {
  return (
    <li className="product-item">
      <Card className="product-item__content">
        <div className="product-item__image">
          {/* <img src={props.image} alt={props.name} /> */}
          <img src={`http://localhost:5001/${props.image}`} alt={props.name} />
        </div>
        <div className="product-item__info">
          <h2 className="product-item__title">
            {props.name} <br />
            <span className="product-item__price">Rs {props.price}</span>
          </h2>
          <span className="product-item__quantity">
            Quantity: {props.quantity}
          </span>
        </div>
        <div className="product-item__buttons">
          <button>VIEW DETAILS</button>
          <button>DELETE</button>
        </div>
      </Card>
    </li>
  );
}
