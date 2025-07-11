import React, { useRef, useState, useEffect } from "react";
import Modal from "./Modal";
import "./CreateStudentModal.css";
import {
    ROLE_OPTIONS,
    RANK_OPTIONS,
    GENDER_OPTIONS,
    CLASS_OPTIONS,
} from "./CreateStudentModalEnums";

export default function CreateStudentModal({
    isEdit,
    isOpen,
    onClose,
    form,
    onChange,
    onAvatarSelect,
    onSubmit,
    isLoading,
    readOnly,
    clubsOptions = [],
    apiHost,
}) {
    if (!isOpen) return null;

    const disabled = readOnly || isLoading;
    const set = (field) => (e) => onChange(field, e.target.value);

    const [groupOptions, setGroupOptions] = useState([]);
    const [isGroupLoading, setGroupLoading] = useState(false);

    useEffect(() => {
        if (!form.clubId) {
            setGroupOptions([]);
            return;
        }
        setGroupLoading(true);
        fetch(`${apiHost}/api/group/get-by-club/${form.clubId}`)
            .then((r) => r.json())
            .then(setGroupOptions)
            .catch(console.error)
            .finally(() => setGroupLoading(false));
    }, [form.clubId, apiHost]);

    const handleClubChange = (e) => {
        const id = e.target.value;
        onChange("clubId", id);
        onChange("groupId", "");
        const club = clubsOptions.find((c) => String(c.id) === id);
        onChange("city", club ? club.city : "");
    };
    const fileRef = useRef(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className="student-modal" onSubmit={onSubmit}>
                <h2>
                    {readOnly
                        ? "Информация о пользователе"
                        : "Данные пользователя"}
                </h2>

                <div className="student-modal__avatar">
                    <img
                        className="student-modal__avatar-img"
                        src={
                            form.avatar
                                ? URL.createObjectURL(form.avatar)
                                : form.avatarBase64
                                ? `data:image/jpeg;base64,${form.avatarBase64}`
                                : "/src/assets/default-avatar.svg"
                        }
                        alt="avatar"
                    />

                    {!readOnly && (
                        <>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                    onAvatarSelect(e.target.files[0])
                                }
                                disabled={isLoading}
                            />

                            <button
                                type="button"
                                className="student-modal__avatar-btn"
                                onClick={() =>
                                    fileRef.current && fileRef.current.click()
                                }
                                disabled={isLoading}
                            >
                                <img src="/src/assets/upload.svg" alt="" />
                            </button>
                        </>
                    )}
                </div>

                <label className="student-modal__role">
                    Роль
                    <select
                        value={form.role}
                        onChange={set("role")}
                        disabled={disabled}
                        required
                    >
                        <option value="">—</option>
                        {ROLE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </label>

                {form.role !== "" && (
                    <div className="student-modal__section">
                        <h2 className="student-modal__section-title">
                            Основная информация
                        </h2>
                        <div className="main-info student-modal__grid">
                            <label>
                                Логин
                                <input
                                    value={form.login}
                                    onChange={set("login")}
                                    disabled={disabled}
                                    required
                                />
                            </label>
                            {!readOnly && (
                                <label>
                                    Пароль
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={set("password")}
                                        disabled={isLoading}
                                    />
                                </label>
                            )}
                            <label>
                                ФИО
                                <input
                                    value={form.fullName}
                                    onChange={set("fullName")}
                                    disabled={disabled}
                                    required
                                />
                            </label>

                            <label>
                                Пол
                                <select
                                    value={form.gender}
                                    onChange={set("gender")}
                                    disabled={disabled}
                                >
                                    {GENDER_OPTIONS.map((g) => (
                                        <option key={g.value} value={g.value}>
                                            {g.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Дата рождения
                                <input
                                    type="date"
                                    value={form.birthDate}
                                    onChange={set("birthDate")}
                                    disabled={disabled}
                                />
                            </label>

                            <label>
                                Номер телефона
                                <input
                                    value={form.phone}
                                    onChange={set("phone")}
                                    disabled={disabled}
                                />
                            </label>

                            <label>
                                Класс
                                <select
                                    value={form.schoolClass}
                                    onChange={set("schoolClass")}
                                    disabled={disabled}
                                >
                                    <option value="">—</option>
                                    {CLASS_OPTIONS.map((c) => (
                                        <option key={c.id} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Клуб
                                <select
                                    value={form.clubId}
                                    onChange={handleClubChange}
                                    disabled={disabled}
                                >
                                    <option value="">—</option>
                                    {clubsOptions.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Город
                                <input
                                    value={form.city || ""}
                                    disabled
                                    style={{ background: "#f1f5f9" }}
                                    onChange={set("city")}
                                />
                            </label>

                            {form.role === "Ученик" && (
                                <label>
                                    Группа
                                    <select
                                        value={form.groupId || ""}
                                        onChange={set("groupId")}
                                        disabled={
                                            disabled ||
                                            !form.clubId ||
                                            isGroupLoading ||
                                            !groupOptions.length
                                        }
                                    >
                                        {!form.clubId && (
                                            <option value="">
                                                Сначала выберите клуб
                                            </option>
                                        )}
                                        {form.clubId &&
                                            (isGroupLoading ? (
                                                <option value="">
                                                    Загрузка…
                                                </option>
                                            ) : (
                                                <>
                                                    <option value="">—</option>
                                                    {groupOptions.map((g) => (
                                                        <option
                                                            key={g.id}
                                                            value={g.id}
                                                        >
                                                            {g.name}
                                                        </option>
                                                    ))}
                                                </>
                                            ))}
                                    </select>
                                </label>
                            )}
                        </div>
                    </div>
                )}
                {form.role !== "" && (
                    <div className="student-modal__section">
                        <h2 className="student-modal__section-title">Спорт</h2>
                        <div className="main-info student-modal__grid">
                            <label>
                                Кю / Дан
                                <select
                                    value={form.rank}
                                    onChange={set("rank")}
                                    disabled={disabled}
                                >
                                    {RANK_OPTIONS.map((r) => (
                                        <option key={r} value={r}>
                                            {r || "—"}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Дата аттестации
                                <input
                                    type="date"
                                    value={form.rankDate}
                                    onChange={set("rankDate")}
                                    disabled={disabled}
                                />
                            </label>
                        </div>
                    </div>
                )}
                {form.role === "Ученик" && (
                    <div className="student-modal__section">
                        <h2 className="student-modal__section-title">
                            Данные родителя
                        </h2>
                        <div className="main-info student-modal__grid">
                            <label>
                                ФИО родителя
                                <input
                                    value={form.parentName}
                                    onChange={set("parentName")}
                                    disabled={disabled}
                                />
                            </label>

                            <label>
                                Телефон родителя
                                <input
                                    value={form.parentPhone}
                                    onChange={set("parentPhone")}
                                    disabled={disabled}
                                />
                            </label>
                        </div>
                    </div>
                )}

                {form.role === "Ученик" && (
                    <div className="student-modal__section">
                        <h2 className="student-modal__section-title">
                            Дополнительные данные
                        </h2>
                        <div className="main-info student-modal__grid">
                            <label>
                                Годовой взнос
                                <input
                                    type="number"
                                    value={form.annualFee}
                                    onChange={set("annualFee")}
                                    disabled={disabled}
                                    min="0"
                                />
                            </label>

                            <label>
                                Дата регистрации
                                <input
                                    type="date"
                                    value={form.registrationDate}
                                    onChange={set("registrationDate")}
                                    disabled={disabled}
                                />
                            </label>
                        </div>
                    </div>
                )}

                {!readOnly && form.role && (
                    <button
                        className="button"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? isEdit
                                ? "Сохранение…"
                                : "Создание…"
                            : isEdit
                            ? "Сохранить"
                            : "Создать"}
                    </button>
                )}
            </form>
        </Modal>
    );
}
