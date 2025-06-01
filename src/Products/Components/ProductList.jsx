import Card from "../../shared/UIElements/Card";
import ProductItem from "./ProductItem";
import "./ProductList.css";

export default function ProductList(props) {
  if (props.items.length === 0) {
    return (
      <div className="no-product-container">
        <Card className="no-product">
          <p className="no-product-text">
            No Items Found! Please Try Again Later!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <ul className="product-list">
      {props.items.map((item) => (
        <ProductItem
          key={item._id}
          id={item._id}
          name={item.name}
          image={item.image}
          price={item.price}
          category={item.category}
          quantity={item.quantity}
          originalPrice={item.originalPrice}
          discount={item.discount}
        />
      ))}
    </ul>
  );
}
