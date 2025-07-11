import { useEffect, useState, useCallback } from "react";
import "./ClubsPage.css";
import GroupDeleteModal from "../components/GroupsComponents/GroupDelete";
import GroupCreatorModal from "../components/GroupsComponents/GroupCreator";
import GroupEditorModal from "../components/GroupsComponents/GroupEditor";

const API_HOST = "http://158.160.168.25:5000";

function Groups() {
    const [groupsListShort, setGroupsListShort] = useState([]);
    const [groupFull, setGroupFull] = useState({});

    const [groups, setGroups] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const fetchShortGroups = useCallback(async () => {
        try {
            const response = await fetch(`${API_HOST}/api/group/get/list`);
            if (!response.ok)
                throw new Error(
                    `HTTP ${response.status} ${response.statusText}`
                );
            const data = await response.json();
            setGroupsListShort(data);
            setSelectedId(data[0]?.id);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchShortGroups();
    }, [fetchShortGroups]);

    const getGroupInfo = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_HOST}/api/group/get/info/${selectedId}`
            );
            if (!response.ok)
                throw new Error(
                    `HTTP ${response.status} ${response.statusText}`
                );
            const data = await response.json();
            setGroupFull(data);
            // setSelectedId(data[0]?.id);
        } catch (error) {
            console.log(error);
        } finally {
        }
    }, [selectedId]);

    useEffect(() => {
        getGroupInfo();
    }, [getGroupInfo]);

    const openCreator = () => setIsCreatorOpen(true);
    const closeCreator = () => setIsCreatorOpen(false);
    const openDelete = () => setIsDeleteOpen(true);
    const closeDelete = () => setIsDeleteOpen(false);
    const openEditor = () => setIsEditorOpen(true);
    const closeEditor = () => setIsEditorOpen(false);

    // if (!groups.length) return <div className="load">Загрузка...</div>;
    // const selectedGroup = groups.find((group) => group.id === selectedId);

    const onDeleteButtonClick = (id) => {
        const updatedGroups = groups.filter((group) => group.id !== id);
        setGroups(updatedGroups);
        localStorage.setItem("groups", JSON.stringify(updatedGroups));
        setSelectedId(updatedGroups[0]?.id || null);
        closeDelete();
    };

    const onSaveButtonClick = (updatedGroup) => {
        const updatedGroups = groups.map((group) =>
            group.id === updatedGroup.id ? updatedGroup : group
        );
        setGroups(updatedGroups);
        localStorage.setItem("clubs", JSON.stringify(updatedGroups));
    };

    return (
        <>
            {isCreatorOpen && (
                <GroupCreatorModal closeModal={closeCreator} groups={groups} />
            )}
            {isDeleteOpen && (
                <GroupDeleteModal
                    closeModal={closeDelete}
                    onDeleteClick={() => onDeleteButtonClick(selectedId)}
                />
            )}
            {isEditorOpen && (
                <GroupEditorModal
                    closeModal={closeEditor}
                    groupData={groupFull}
                    onSaveClick={onSaveButtonClick}
                />
            )}

            <div className="container">
                <div className="clubs__container">
                    <h1 className="clubs__title">Группы</h1>
                    <button
                        className="button clubs__button"
                        onClick={openCreator}
                    >
                        <img src="./src/assets/add.svg" /> Создать
                    </button>
                </div>
                <div className="columns">
                    <div className="left_block">
                        <ul className="left_block_ul">
                            {groupsListShort.map((group) => (
                                <li
                                    key={group.id}
                                    // className={`left_block_li`}
                                    className={`left_block_li ${
                                        selectedId === group.id ? "active" : ""
                                    }`}
                                    onClick={() => setSelectedId(group.id)}
                                >
                                    <h3 className="left_block_name">
                                        {group.name}
                                    </h3>
                                    <span className="left_block_city">
                                        {group.ageGroup}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mid_block">
                        <h4 className="mid_block_name">{groupFull.name}</h4>
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
                            <p
                                className="mid_block_tags"
                                style={{ marginTop: 24 }}
                            >
                                Участники группы:
                            </p>
                            {groupFull.groupMembers &&
                                groupFull.groupMembers.map((member) => (
                                    <div key={member.id}>
                                        <div>
                                            <p>
                                                {member.id}. {member.member}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="right__block">
                        <h4 className="mid_block_name">Информация</h4>
                        <div className="right__block__part">
                            <span className="right__block__tag">Тренер</span>
                            <p className="right__block__text">
                                {groupFull.coach}
                            </p>
                        </div>
                        <div className="right__block__part">
                            <span className="right__block__tag">
                                Возрастная группа
                            </span>
                            <p className="right__block__text">
                                {groupFull.ageGroup}
                            </p>
                        </div>
                        <div className="right__block__part">
                            <span className="right__block__tag">Клуб</span>
                            <p className="right__block__text">
                                {groupFull.club}
                            </p>
                        </div>
                        <div className="right__block__part">
                            <span className="right__block__tag">
                                Расписание
                            </span>
                            {groupFull.schedule &&
                                Object.entries(groupFull.schedule).map(
                                    ([day, time]) => (
                                        <p
                                            className="right__block__text"
                                            key={day}
                                        >
                                            {day}: {time}
                                        </p>
                                    )
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Groups;
