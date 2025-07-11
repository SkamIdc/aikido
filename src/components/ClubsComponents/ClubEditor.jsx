import { useState } from "react";

function ClubEditorModal({ closeModal, clubData, onSaveClick }) {
  const [formData, setFormData] = useState(clubData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveClick({ ...clubData, ...formData });
    closeModal();
  };

  return (
    <>
      <div className="creator__modal">
        <div className="creator__content">
          <div className="close__button" onClick={closeModal}>
            <img
              className="close__button__img"
              src="../src/assets/close.svg"
              alt="Закрыть"
            />
          </div>
          <p className="modal__header">Отредактировать клуб</p>
          <form className="club__creator__form" onSubmit={handleSubmit}>
            <div className="creator__part">
              <p className="creator__part-title">Название</p>
              <input
                id="name"
                name="name"
                className="creator__part-input"
                placeholder="Название клуба"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="creator__part">
              <p className="creator__part-title">Город</p>
              <input
                id="city"
                name="city"
                className="creator__part-input"
                placeholder="Все города"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="creator__part">
              <p className="creator__part-title">Адрес</p>
              <div className="club__input__container">
                <input
                  id="address"
                  name="address"
                  className="creator__part-input"
                  placeholder="Адрес клуба"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <img
                  className="address"
                  src="../src/assets/location.svg"
                  alt="Местоположение"
                />
              </div>
            </div>
            <button className="button creator__submit">Сохранить</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ClubEditorModal;
