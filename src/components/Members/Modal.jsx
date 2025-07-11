import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content--wrapper">
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Modal;
