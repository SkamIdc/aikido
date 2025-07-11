import "./GroupComponents.css";

function GroupDeleteModal({ closeModal, groupId, onDeleteSuccess }) {
  const handleDelete = async () => {
    try {
      await fetch(`http://158.160.168.25:5000/api/group/delete/${groupId}`, {
        method: "DELETE",
      });
      onDeleteSuccess();
      closeModal();
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    }
  };

  return (
    <div className="creator__modal">
      <div className="delete__content">
        <div className="close__button" onClick={closeModal}>
          <img className="close__button__img" src="../src/assets/close.svg" alt="Закрыть" />
        </div>
        <p className="modal__header">Удалить группу</p>
        <p className="delete__message">Группа будет удалена навсегда. Вы точно хотите ее удалить?</p>
        <button className="button delete__button" onClick={handleDelete}>Удалить</button>
      </div>
    </div>
  );
}

export default GroupDeleteModal;