import { useParams, useNavigate } from "react-router-dom";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MIN } from "../../util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useEffect, useState } from "react";
import "./Product.css";

export default function AdminUpdateProduct() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProduct, setLoadedProduct] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      originalPrice: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      quantity: {
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
    },
    false
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/products/getProduct/${pid}`
        );

        setLoadedProduct(responseData);
        setFormData(
          {
            name: {
              value: responseData.name,
              isValid: true,
            },
            originalPrice: {
              value: responseData.originalPrice || "",
              isValid: !!responseData.originalPrice,
            },
            price: {
              value: responseData.price,
              isValid: true,
            },
            quantity: {
              value: responseData.quantity,
              isValid: true,
            },
            category: {
              value: responseData.category,
              isValid: true,
            },
            description: {
              value: responseData.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [pid, sendRequest, setFormData]);

  const productUpdateHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `http://localhost:5001/api/products/updateProduct/${pid}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          originalPrice: formState.inputs.originalPrice.value,
          price: formState.inputs.price.value,
          quantity: formState.inputs.quantity.value,
          category: formState.inputs.category.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      navigate("/admin/homepage");
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedProduct && !error) {
    return (
      <div className="center">
        <h2>Could not find product!</h2>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={productUpdateHandler}>
        <Input
          id="name"
          element="input"
          type="text"
          label="Product Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name"
          onInput={inputHandler}
          initialValue={loadedProduct?.name}
          initialValid={true}
        />
        <Input
          id="originalPrice"
          element="input"
          type="number"
          label="Original Price"
          validators={[VALIDATOR_MIN(0)]}
          errorText="Please enter a valid price"
          onInput={inputHandler}
          initialValue={loadedProduct?.originalPrice}
          initialValid={true}
        />
        <Input
          id="price"
          element="input"
          type="number"
          label="Selling Price"
          validators={[VALIDATOR_MIN(0)]}
          errorText="Please enter a valid price"
          onInput={inputHandler}
          initialValue={loadedProduct?.price}
          initialValid={true}
        />
        <Input
          id="quantity"
          element="input"
          type="number"
          label="Quantity in Stock"
          validators={[VALIDATOR_MIN(0)]}
          errorText="Please enter a valid quantity"
          onInput={inputHandler}
          initialValue={loadedProduct?.quantity}
          initialValid={true}
        />
        <Input
          id="category"
          element="input"
          type="text"
          label="Category"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid category"
          onInput={inputHandler}
          initialValue={loadedProduct?.category}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid description"
          onInput={inputHandler}
          initialValue={loadedProduct?.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PRODUCT
        </Button>
        <Button type="button" inverse onClick={() => navigate("/admin")}>
          CANCEL
        </Button>
      </form>
    </>
  );
}
