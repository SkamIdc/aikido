import './ClubDelete.css';

function ClubDeleteModal({ closeModal, onDeleteClick, clubName }) {
  return (
    <>
      <div className="creator__modal">
        <div className="delete__content">
          <div className="close__button" onClick={closeModal}>
            <img
              className="close__button__img"
              src="../src/assets/close.svg"
              alt="Закрыть"
            />
          </div>
          <p className="modal__header">Удалить клуб</p>
          <p className="delete__message">Клуб <span className='delete__message-bold'>{clubName}</span> будет удален навсегда. Вы точно хотите его удалить?</p>
          <button className="button delete__button" onClick={onDeleteClick}>Удалить</button>
        </div>
      </div>
    </>
  );
}

export default ClubDeleteModal;
