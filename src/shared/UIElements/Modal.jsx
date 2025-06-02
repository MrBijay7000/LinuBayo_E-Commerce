import React, { forwardRef, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import Backdrop from "./Backdrop";

import "./Modal.css";

const ModalOverlay = forwardRef((props, ref) => {
  const content = (
    <div className="modal__wrapper">
      <div
        ref={ref}
        className={`modal ${props.className || ""}`}
        style={props.style}
      >
        {/* <header className={`modal__header ${props.headerClass || ""}`}>
          <div class="modal__header">
            <span>An Error Occurred!</span>
          </div>
          <h2>{props.header}</h2>
        </header> */}
        <header className={`modal__header ${props.headerClass || ""}`}>
          <div className="modal__shimmer-header">
            <span>{props.header || "An Error Occured!"}</span>
          </div>
          {/* {props.header && <h2>{props.header || "An Error Occured!"}</h2>} */}
        </header>

        <div className={`modal__content ${props.contentClass || ""}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass || ""}`}>
          {props.footer}
        </footer>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
});

export default function Modal(props) {
  const nodeRef = useRef(null);

  return (
    <>
      {/* {props.show && <div className="backdrop" onClick={props.onCancel}></div>} */}
      {props.show && <Backdrop onClick={props.onCancel} />}

      <CSSTransition
        in={props.show}
        timeout={300}
        mountOnEnter
        unmountOnExit
        classNames="modal"
        nodeRef={nodeRef}
      >
        <ModalOverlay {...props} ref={nodeRef} />
      </CSSTransition>
    </>
  );
}
