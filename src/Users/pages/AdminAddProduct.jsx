import { useState } from "react";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
} from "../../util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/FormElements/ImageUpload";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Product.css";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [file, setFile] = useState(null);
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      quantity: {
        value: "",
        isValid: false,
      },
      originalPrice: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const addProductHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("quantity", formState.inputs.quantity.value);
      formData.append("originalPrice", formState.inputs.originalPrice.value);
      if (file) {
        formData.append("image", file);
      }

      await sendRequest(
        "http://localhost:5001/api/products/addProduct",
        "POST",
        formData
      );

      toast.success("Product added successfully!");
      //   navigate("/admin/homepage");
      navigate(
        `/admin/products/${formState.inputs.category.value.toLowerCase()}`
      );
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    }
  };

  const categories = [
    { value: "tops", label: "Tops" },
    { value: "pants", label: "Pants" },
    { value: "jackets", label: "Jackets" },
    { value: "accessories", label: "Accessories" },
    // Add more categories as needed
  ];

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="place-form" onSubmit={addProductHandler}>
        <Input
          id="name"
          element="input"
          type="text"
          label="Product Name"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
          errorText="Please enter a valid name (at least 3 characters)"
          onInput={inputHandler}
        />
        <Input
          id="price"
          element="input"
          type="number"
          label="Selling Price"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN(1)]}
          errorText="Please enter a valid price (minimum 1)"
          onInput={inputHandler}
        />
        <Input
          id="originalPrice"
          element="input"
          type="number"
          label="Original Price"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN(1)]}
          errorText="Please enter a valid original price"
          onInput={inputHandler}
        />
        {/* <Input
          id="category"
          element="input"
          type="text"
          label="Category"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid category"
          onInput={inputHandler}
        /> */}
        <div className="form-control">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            onChange={(e) =>
              inputHandler("category", e.target.value, !!e.target.value)
            }
            value={formState.inputs.category.value}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {!formState.inputs.category.isValid && (
            <p className="form-control__error-text">
              Please select a category.
            </p>
          )}
        </div>

        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(10)]}
          errorText="Please enter a valid description (at least 10 characters)"
          onInput={inputHandler}
        />
        <Input
          id="quantity"
          element="input"
          type="number"
          label="Quantity in Stock"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN(0)]}
          errorText="Please enter a valid quantity"
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={(id, file, isValid) => {
            inputHandler(id, file, isValid);
            setFile(file);
          }}
          //   errorText="Please provide an image"
        />

        <Button type="submit" disabled={!formState.isValid || isLoading}>
          {isLoading ? "ADDING..." : "ADD PRODUCT"}
        </Button>
      </form>
    </>
  );
}
