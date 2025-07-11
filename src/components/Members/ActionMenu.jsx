import React, { useEffect, useRef } from "react";
import "./ActionMenu.css";

function ActionMenu({ onClose, onView, onEdit, onDelete }) {
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    return (
        <ul className="actions-menu" ref={ref}>
            <li onClick={onView}>Посмотреть</li>
            <li onClick={onEdit}>Редактировать</li>
            <li className="danger" onClick={onDelete}>
                Удалить
            </li>
        </ul>
    );
}

export default ActionMenu;
