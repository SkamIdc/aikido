import { useEffect, useState, useCallback } from "react";
import "./ClubsPage.css";
import ClubCreatorModal from "../components/ClubsComponents/ClubCreator";
import ClubDeleteModal from "../components/ClubsComponents/ClubDelete";
import ClubEditorModal from "../components/ClubsComponents/ClubEditor";

const API_HOST = "http://158.160.168.25:5000";

function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const fetchClubs = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_HOST}/api/club/get/details/list`
            );
            if (!response.ok)
                throw new Error(
                    `HTTP ${response.status} ${response.statusText}`
                );
            const data = await response.json();
            setClubs(data);
            setSelectedId(data[0]?.id);
        } catch (err) {
            console.log(err);
        } finally {
        }
    }, []);
    useEffect(() => {
        fetchClubs();
    }, [fetchClubs]);

    const openCreator = () => setIsCreatorOpen(true);
    const closeCreator = () => setIsCreatorOpen(false);
    const openDelete = () => setIsDeleteOpen(true);
    const closeDelete = () => setIsDeleteOpen(false);
    const openEditor = () => setIsEditorOpen(true);
    const closeEditor = () => setIsEditorOpen(false);

    if (!clubs.length) return <div className="load">Загрузка...</div>;
    const selectedClub = clubs.find((club) => club.id === selectedId);

    const onCreateButtonClick = async (evt) => {
        evt.preventDefault();

        const clubInfo = {};

        new FormData(evt.target).forEach((value, key) => {
            clubInfo[key] = value.trim();
        });

        try {
            const fd = new FormData();
            const clubJson = new Blob([JSON.stringify(clubInfo)], {
                type: "application/json",
            });
            fd.append("ClubDataJson", clubJson);

            const response = await fetch(`${API_HOST}/api/club/create`, {
                method: "POST",
                body: fd,
            });
            if (!response.ok)
                throw new Error(
                    `HTTP ${response.status} ${response.statusText}`
                );
        } catch (err) {
            console.error("Ошибка запроса:", err);
        } finally {
            closeCreator();
            fetchClubs();
        }
    };

    const onDeleteButtonClick = async (id) => {
        try {
            const response = await fetch(`${API_HOST}/api/club/delete/${id}`, {
                method: "DELETE",
            });
            if (!response.ok)
                throw new Error(
                    `HTTP ${response.status} ${response.statusText}`
                );
        } catch (err) {
            console.log(err);
        } finally {
            closeDelete();
            fetchClubs();
        }
    };

    const onSaveButtonClick = (updatedClub) => {
        const updatedClubs = clubs.map((club) =>
            club.id === updatedClub.id ? updatedClub : club
        );
        setClubs(updatedClubs);
        localStorage.setItem("clubs", JSON.stringify(updatedClubs));
    };

    return (
        <>
            {isCreatorOpen && (
                <ClubCreatorModal
                    closeModal={closeCreator}
                    handleCreateSubmit={onCreateButtonClick}
                />
            )}
            {isDeleteOpen && (
                <ClubDeleteModal
                    closeModal={closeDelete}
                    onDeleteClick={() => onDeleteButtonClick(selectedId)}
                    clubName={selectedClub.name}
                />
            )}
            {isEditorOpen && (
                <ClubEditorModal
                    closeModal={closeEditor}
                    clubData={clubs.filter((club) => club.id === selectedId)[0]}
                    onSaveClick={onSaveButtonClick}
                />
            )}

            <div className="container">
                <div className="clubs__container">
                    <h1 className="clubs__title">Клубы</h1>
                    <button
                        className="button clubs__button"
                        onClick={openCreator}
                    >
                        <img src="./src/assets/add.svg" />
                        Создать
                    </button>
                </div>
                <div className="columns">
                    <div className="left_block">
                        <ul className="left_block_ul">
                            {clubs.map((club) => (
                                <li
                                    key={club.id}
                                    className={`left_block_li ${
                                        selectedId === club.id ? "active" : ""
                                    }`}
                                    onClick={() => setSelectedId(club.id)}
                                >
                                    <h3 className="left_block_name">
                                        {club.name}
                                    </h3>
                                    <span className="left_block_city">
                                        {club.city}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mid_block">
                        <h4 className="mid_block_name">{selectedClub.name}</h4>
                        <div className="club__button edit" onClick={openEditor}>
                            <img
                                className="club__button__img"
                                src="../src/assets/edit.svg"
                                alt="Изменить"
                            ></img>
                        </div>
                        <div
                            className="club__button delete"
                            onClick={openDelete}
                        >
                            <img
                                className="club__button__img"
                                src="../src/assets/delete.svg"
                                alt="Удалить"
                            ></img>
                        </div>
                        <div className="mid_block_content">
                            {selectedClub.groups.map((group, index) => (
                                <div key={index} style={{ marginTop: 24 }}>
                                    <p className="mid_block_tags">Тренер:</p>
                                    {group.coach && (
                                        <div>
                                            <p>{group.coach.name}</p>
                                            <p>{group.coach.degree}</p>
                                            <p>{group.coach.phone}</p>
                                        </div>
                                    )}
                                    {!group.coach && <p>Отсутсвует</p>}
                                    <p className="mid_block_tags">Группа:</p>
                                    <div>
                                        <span>{group.name}</span>
                                    </div>
                                    <p className="mid_block_tags">
                                        Расписание:
                                    </p>
                                    <div>
                                        {Object.entries(group.schedule).map(
                                            ([day, time]) => (
                                                <p key={day}>
                                                    {day}: {time}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="right__block">
                        <h4 className="mid_block_name">Информация</h4>
                        <div className="right__block__part">
                            <span className="right__block__tag">Создатель</span>
                            <p className="right__block__text">Смирнов Денис</p>
                        </div>
                        <div className="right__block__part">
                            <span className="right__block__tag">Город</span>
                            <p className="right__block__text">
                                {selectedClub.city}
                            </p>
                        </div>
                        <div className="right__block__part">
                            <span className="right__block__tag">
                                Адрес клуба
                            </span>
                            <p className="right__block__text">
                                {selectedClub.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Clubs;
