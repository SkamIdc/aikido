import { useState } from "react";
import "./GroupComponents.css";

function GroupCreatorModal({ closeModal, groups }) {
  const [ageGroup, setAgeGroup] = useState("");
  const [coach, setCoach] = useState("");
  const [club, setClub] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [extraDays, setExtraDays] = useState([]);
  const [minorDays, setMinorDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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

  const handleSelectChangeAge = (e) => setAgeGroup(e.target.value);
  const handleSelectChangeCoach = (e) => setCoach(e.target.value);
  const handleSelectChangeClub = (e) => setClub(e.target.value);
  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newGroup = {
      name: formData.get("name")?.trim() || "",
      ageGroup: formData.get("ageGroup")?.trim() || "",
      coach: formData.get("coach")?.trim() || "",
      club: formData.get("club")?.trim() || "",
      schedule: {},
      extraDates: [],
      minorDates: [],
      groupMembers: [],
    };

    if (selectedDays.length > 0) {
      const timeRange = `${startTime}-${endTime}`;
      selectedDays.forEach((day) => {
        newGroup.schedule[day] = timeRange;
      });
    }

    formData.forEach((value, key) => {
      if (key.startsWith("extraDate_")) {
        newGroup.extraDates.push(value);
      } else if (key.startsWith("minorDate_")) {
        newGroup.minorDates.push(value);
      }
    });

    const updatedGroups = [...groups, newGroup];
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    window.location.reload();
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
          <p className="modal__header">Создать группу</p>
          <form className="club__creator__form" onSubmit={onSubmit}>
            <div className="creator__part">
              <p className="creator__part-title">Название</p>
              <input
                id="name"
                name="name"
                className="creator__part-input"
                placeholder="Название группы"
              />
            </div>
            <div className="creator__part">
              <p className="creator__part-title">Возрастная группа</p>
              <select
                className={`creator__part-select ${
                  ageGroup === "" ? "placeholder" : ""
                }`}
                id="ageGroup"
                name="ageGroup"
                value={ageGroup}
                onChange={handleSelectChangeAge}
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
                  coach === "" ? "placeholder" : ""
                }`}
                id="coach"
                name="coach"
                value={coach}
                onChange={handleSelectChangeCoach}
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
                  club === "" ? "placeholder" : ""
                }`}
                id="club"
                name="club"
                value={club}
                onChange={handleSelectChangeClub}
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
                      selectedDays.includes(day) ? "selected" : ""
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
                  value={startTime}
                  onChange={handleStartTimeChange}
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
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
              </div>
            </div>
            <div className="extra__days">
              <p className="extra__days__add" onClick={handleAddExtraDay}>
                + Добавить дополнительный день в расписание
              </p>
              <div className="extra__days__container">
                {extraDays.map((day) => (
                  <div key={day.id} className="creator__part extra">
                    <p className="creator__part-title">Дополнительный день</p>
                    <input
                      type="date"
                      id={`extraDate_${day.id}`}
                      name={`extraDate_${day.id}`}
                      className="creator__part-input extra"
                      placeholder="Выбрать дату"
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
                {minorDays.map((day) => (
                  <div key={day.id} className="creator__part">
                    <p className="creator__part-title">Исключенный день</p>
                    <input
                      type="date"
                      id={`minorDate_${day.id}`}
                      name={`minorDate_${day.id}`}
                      className="creator__part-input extra"
                      placeholder="Выбрать дату"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button className="button creator__submit">Создать</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default GroupCreatorModal;
