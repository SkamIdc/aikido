import React, { useState } from "react";
import "./MembersList.css";
import ActionMenu from "./ActionMenu";
import { getRoleLabel } from "./CreateStudentModalEnums";

const normalize = (value) => {
    if (
        value === null ||
        value === undefined ||
        (typeof value === "number" && isNaN(value)) ||
        value === ""
    ) {
        return "—";
    }
    return String(value);
};

function MembersList({ members = [], onView, onEdit, onDelete }) {
    const [openId, setOpenId] = useState(null);

    return (
        <ul className="members__list">
            {members.map((m, idx) => {
                const uid = m.id ?? m.login ?? idx;
                const infoFields = [
                    { label: "Роль", value: getRoleLabel(m.role) },
                    { label: "Город", value: normalize(m.city) },
                    { label: "Полных лет", value: normalize(m.age) },
                    { label: "Кю/Дан", value: normalize(m.rank) },
                    { label: "Клуб", value: normalize(m.club) },
                ];

                return (
                    <li key={uid} className="members__item">
                        <div className="members__header">
                            <img
                                className="members__avatar"
                                src={m.avatar}
                                alt={normalize(m.name)}
                            />
                            <div className="members__header-text">
                                <h2 className="members__name">
                                    {normalize(m.name)}
                                </h2>
                                <p className="members__login">
                                    {normalize(m.login)}
                                </p>
                            </div>
                        </div>

                        <ul className="members__info">
                            {infoFields.map((f, i) => (
                                <li key={i} className="members__info-item">
                                    <span className="members__info-label">
                                        {f.label}
                                    </span>
                                    <p className="members__info-value">
                                        {f.value}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="members__actions"
                            aria-label="Действия"
                            onClick={() =>
                                setOpenId((prev) => (prev === uid ? null : uid))
                            }
                            type="button"
                        >
                            <img src="/src/assets/more.svg" alt="" />
                        </button>

                        {openId === uid && (
                            <ActionMenu
                                onClose={() => setOpenId(null)}
                                onView={() => onView(m.id)}
                                onEdit={() => onEdit(m.id)}
                                onDelete={() => onDelete(m.id)}
                            />
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
export default MembersList;
