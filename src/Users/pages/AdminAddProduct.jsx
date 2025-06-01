import Input from "../../shared/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../util/validators";

import Button from "../../shared/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";

import "./Product.css";

export default function AdminAddProduct() {
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
    },
    false
  );

  function addProductHandler(event) {
    event.preventDefault();
    console.log(formState.inputs);
  }

  return (
    <form className="place-form" onSubmit={addProductHandler}>
      <Input
        id="name"
        element="input"
        type="text"
        label="Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid name"
        onInput={inputHandler}
      />
      <Input
        id="price"
        element="input"
        type="number"
        label="Price"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid price"
        onInput={inputHandler}
      />
      <Input
        id="category"
        element="input"
        type="text"
        label="Category"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid category"
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid description"
        onInput={inputHandler}
      />
      <Input
        id="quantity"
        element="input"
        type="number"
        label="Quantity"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid quantity (AtLeast One)"
        onInput={inputHandler}
      />
      <Input
        id="originalPrice"
        element="input"
        type="number"
        label="OriginalPrice"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid originalPrice"
        onInput={inputHandler}
      />

      <Button type="submit" disabled={!formState.isValid}>
        ADD PRODUCT
      </Button>
    </form>
  );
}
