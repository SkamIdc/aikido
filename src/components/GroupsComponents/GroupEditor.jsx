import { useState } from "react";
import "./GroupComponents.css";

function GroupEditorModal({ closeModal, groupData, onSaveClick }) {
  console.log(groupData);

  const [formData, setFormData] = useState(groupData);
  const [selectedDays, setSelectedDays] = useState([]);
  const [extraDays, setExtraDays] = useState([]);
  const [minorDays, setMinorDays] = useState([]);

  const handleDayClick = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddExtraDay = () => {
    setExtraDays([...extraDays, { id: Date.now() }]);
  };
  const handleAddMinorDay = () => {
    setMinorDays([...minorDays, { id: Date.now() }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveClick({ ...groupData, ...formData });
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
          <p className="modal__header">Отредактировать группу</p>
          <form className="club__creator__form" onSubmit={handleSubmit}>
            <div className="creator__part">
              <p className="creator__part-title">Название</p>
              <input
                id="name"
                name="name"
                className="creator__part-input"
                placeholder="Название группы"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="creator__part">
              <p className="creator__part-title">Возрастная группа</p>
              <select
                className={`creator__part-select ${
                  formData.ageGroup === "" ? "placeholder" : ""
                }`}
                id="ageGroup"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
              >
                <option disabled value="">
                  Выбрать
                </option>
                <option value="Дети">Дети</option>
                <option value="Подростки">Подростки</option>
                <option value="Взрослые">Взрослые</option>
              </select>
            </div>
            <div className="creator__part">
              <p className="creator__part-title">Выбрать тренера</p>
              <select
                className={`creator__part-select ${
                  formData.coach === "" ? "placeholder" : ""
                }`}
                id="coach"
                name="coach"
                value={formData.coach}
                onChange={handleInputChange}
              >
                <option disabled value="">
                  Выбрать
                </option>
                <option value="Смирнов Д.">Смирнов Д.</option>
                <option value="Лобиков Т.">Лобиков Т.</option>
                <option value="Зайцева В.">Зайцева В.</option>
              </select>
            </div>
            <div className="creator__part">
              <p className="creator__part-title">Выбрать клуб</p>
              <select
                className={`creator__part-select ${
                  formData.club === "" ? "placeholder" : ""
                }`}
                id="club"
                name="club"
                value={formData.club}
                onChange={handleInputChange}
              >
                <option disabled value="">
                  Выбрать
                </option>
                <option value="Божественный ветер">Божественный ветер</option>
                <option value="Катана">Катана</option>
                <option value="Прайм">Прайм</option>
              </select>
            </div>
            <div className="creator__part">
              <p className="creator__part-title">Дни недели</p>
              <div className="days__container">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                  <div
                    key={day}
                    className={`day__box ${
                      formData.schedule && formData.schedule[day] ? "selected" : ""
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            <div className="time__container">
              <div className="creator__part time">
                <p className="creator__part-title">Начало</p>
                <input
                  className="time__input"
                  type="time"
                  id="startTime"
                  name="startTime"
                  min="00:00"
                  max="24:00"
                  value={formData.schedule && Object.values(formData.schedule)[0]?.split('-')[0] || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="creator__part time">
                <p className="creator__part-title">Окончание</p>
                <input
                  className="time__input"
                  type="time"
                  id="endTime"
                  name="endTime"
                  min="00:00"
                  max="24:00"
                  value={formData.schedule && Object.values(formData.schedule)[0]?.split('-')[1] || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="extra__days">
              <p className="extra__days__add" onClick={handleAddExtraDay}>
                + Добавить дополнительный день в расписание
              </p>
              <div className="extra__days__container">
                {formData.extraDates && formData.extraDates.map((day, index) => (
                  <div key={index} className="creator__part extra">
                    <p className="creator__part-title">Дополнительный день</p>
                    <input
                      type="date"
                      id={`extraDate_${index}`}
                      name={`extraDate_${index}`}
                      className="creator__part-input extra"
                      placeholder="Выбрать дату"
                      value={day}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="extra__days">
              <p className="extra__days__add" onClick={handleAddMinorDay}>
                + Исключить день из расписания
              </p>
              <div className="extra__days__container">
                {formData.minorDates && formData.minorDates.map((day, index) => (
                  <div key={index} className="creator__part">
                    <p className="creator__part-title">Исключенный день</p>
                    <input
                      type="date"
                      id={`minorDate_${index}`}
                      name={`minorDate_${index}`}
                      className="creator__part-input extra"
                      placeholder="Выбрать дату"
                      value={day}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button className="button creator__submit">Сохранить</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default GroupEditorModal;
