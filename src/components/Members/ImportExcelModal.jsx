import React, { useRef } from "react";
import Modal from "./Modal";
import "./ImportExcelModal.css";

const API_HOST = "http://158.160.168.25:5000";

function ImportExcelModal({
    isOpen,
    onClose,
    mode,
    file,
    onModeChange,
    onFileSelect,
    onConfirm,
    isLoading,
}) {
    const fileInputRef = useRef(null);

    const downloadFile = async (endpoint, name) => {
        try {
            const resp = await fetch(`${API_HOST}${endpoint}`, {
                method: "GET",
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const blob = await resp.blob();
            const urlObject = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = urlObject;
            a.download = decodeURIComponent(name);

            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(urlObject);
        } catch (e) {
            alert(e.message);
        }
    };

    const handleGetAll = () =>
        downloadFile("/api/user/get/table", "База участников.xlsx");
    const handleGetList = () =>
        downloadFile(
            "/api/user/get/table-template-for-create",
            "Шаблон для создания.xlsx"
        );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="import-excel-modal">
                <h2 className="import-excel-modal__title">Импорт Excel</h2>
                <div className="import-excel-modal__template">
                    <div className="import-excel-modal__template-buttons">
                        <button
                            type="button"
                            className="import-excel-modal__template-button"
                            onClick={handleGetAll}
                        >
                            <img
                                className="import-excel-modal__template-image"
                                src="../src/assets/attach.svg"
                                alt=""
                            />
                            База участников
                        </button>
                        <button
                            type="button"
                            className="import-excel-modal__template-button"
                            onClick={handleGetList}
                        >
                            <img
                                className="import-excel-modal__template-image"
                                src="../src/assets/attach.svg"
                                alt=""
                            />
                            Шаблон для создания
                        </button>
                    </div>
                </div>
                <p>
                    Импортировать можно файл с учениками для создания новых
                    учеников в системе или файл итоговой ведомости с
                    результатами аттестации, для обновления данных участников
                    семинара. Выберите то, что хотите импортировать.
                </p>
                <div className="import-excel-modal__mode-toggle">
                    <button
                        type="button"
                        className={`import-excel-modal__mode-toggle-button import-excel-modal__mode-toggle-button--left${
                            mode === "create"
                                ? " import-excel-modal__mode-toggle-button--active"
                                : ""
                        }`}
                        onClick={() => onModeChange("create")}
                    >
                        Создание
                    </button>
                    <button
                        type="button"
                        className={`import-excel-modal__mode-toggle-button import-excel-modal__mode-toggle-button--right${
                            mode === "update"
                                ? " import-excel-modal__mode-toggle-button--active"
                                : ""
                        }`}
                        onClick={() => onModeChange("update")}
                    >
                        Изменение
                    </button>
                </div>
                <div className="import-excel-modal__file-section">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={onFileSelect}
                        style={{ display: "none" }}
                    />
                    <div
                        className={`import-excel-modal__file-block`}
                        //     ${
                        //     file
                        //         ? ""
                        //         : " import-excel-modal__file-block--inactive"
                        // }
                        
                    >
                        <div
                            className={`import-excel-modal__file${
                                file
                                    ? ""
                                    : " import-excel-modal__file--inactive"
                            }`}
                        >
                            <img
                                className="import-excel-modal__file-image"
                                src="../src/assets/attach.svg"
                                alt=""
                            />
                            {!file && (
                                <span className="import-excel-modal__file-name">
                                    Необходимо выбрать файл
                                </span>
                            )}
                            {file && (
                                <span className="import-excel-modal__file-name">
                                    {file.name}
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            className="import-excel-modal__file-button"
                            onClick={() =>
                                fileInputRef.current &&
                                fileInputRef.current.click()
                            }
                        >
                            Выбрать файл
                        </button>
                    </div>

                    <div className="import-excel-modal__file-buttons">
                        <button
                            type="button"
                            className={`import-excel-modal__import-button${
                                file
                                    ? ""
                                    : " import-excel-modal__import-button--inactive"
                            }`}
                            disabled={!file || isLoading}
                            onClick={onConfirm}
                        >
                            {isLoading ? "Импорт..." : "Импортировать"}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ImportExcelModal;
