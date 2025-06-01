import { useParams } from "react-router-dom";
import Input from "../../shared/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../util/validators";
import { useForm } from "../../shared/hooks/form-hook";

import "./Product.css";
import { useEffect } from "react";

export default function AdminUpdateProduct() {
  const productId = useParams().productId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setFormData(
      {
        name: {
          value: "",
          isValid: true,
        },
        price: {
          value: "",
          isValid: true,
        },
      },
      true
    );
  }, [setFormData]);

  function productUpdateHandler(event) {
    event.preventDefault();
    console.log(formState.inputs);
  }

  return (
    <form className="place-form" onSubmit={productUpdateHandler}>
      <Input
        id="name"
        element="input"
        type="text"
        label="Name"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid name"
        onInput={inputHandler}
        initialValue={formState.inputs.name.value}
        initialValid={formState.inputs.name.valid}
      />
      <Input
        id="price"
        element="input"
        type="number"
        label="Price"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid price"
        onInput={inputHandler}
        initialValue={formState.inputs.price.value}
        initialValid={formState.inputs.price.valid}
      />
      <Button type="submit" diasbled={!formState.isValid}>
        UPDATE PRODUCT
      </Button>
    </form>
  );
}
