import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";

import "./ImageUpload.css";
const ImageUpload = (props) => {
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();

  useEffect(() => {
    if (!props.initialValue) return;
    setPreviewUrl(props.initialValue);
    setIsValid(true);
  }, [props.initialValue]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = false;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setPreviewUrl(URL.createObjectURL(pickedFile));
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="image-upload__form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div
          className={`image-upload__preview ${
            previewUrl ? "image-upload__preview--glow" : ""
          }`}
        >
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>

        <button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
