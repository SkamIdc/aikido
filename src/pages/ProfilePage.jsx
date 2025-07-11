// src/pages/Profile.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import CreateStudentModal from "../components/Members/CreateStudentModal";
import "./ProfilePage.css";
import mapUserDtoToForm from "../utils/mapUserDtoToForm";

const API_HOST = "http://158.160.168.25:5000";
const USER_ID = "148";

function CutName(fullName) {
    const splittedName = fullName.toString().split(/\s+/);
    const lastName = splittedName[0];
    const name = splittedName[1];
    return name ? `${lastName} ${name}` : `${lastName}`;
}

function formatGender(sex) {
    return sex === "Male" ? "Мужской" : "Женский";
}
const toIntOrNull = (v) => (v === "" || v == null || isNaN(+v) ? null : +v);

const formatDate = (src) => {
    const date = new Date(src);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const jsonBlob = (o) =>
    new Blob([JSON.stringify(o)], { type: "application/json" });

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [clubsList, setClubsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const blankForm = useMemo(
        () => ({
            ...mapUserDtoToForm({}),
            registrationDate: new Date().toISOString().substring(0, 10),
        }),
        []
    );
    const [form, setForm] = useState(blankForm);

    useEffect(() => {
        fetch(`${API_HOST}/api/club/get/list`)
            .then((r) => r.json())
            .then((data) => {
                setClubsList(data);
            })
            .catch(console.error);
    }, []);
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            // console.log(2)
            const resp = await fetch(`${API_HOST}/api/user/get/${USER_ID}`);
            if (!resp.ok)
                throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
            const data = await resp.json();

            const photo = data.photo
                ? `data:image/jpeg;base64,${data.photo}`
                : "/src/assets/default-avatar.svg";

            setProfile({
                photo,
                cutName: CutName(data.fullName),
                fullName: data.fullName,
                role: data.role,
                login: data.login,
                city: data.city,
                gender: formatGender(data.sex),
                phone: data.phoneNumber,
                birthDate: formatDate(data.birthday),
                rank: data.grade,
                rankDate: formatDate(data.certificationDate),
            });

            setForm(mapUserDtoToForm(data));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = useCallback((field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleAvatarSelect = (file) => {
        if (!file) return;
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("JPG или PNG!");
            return;
        }
        const r = new FileReader();
        r.onload = () =>
            setForm((p) => ({
                ...p,
                avatar: file,
                avatarBase64: r.result.split(",")[1],
            }));
        r.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const userJson = {
                Photo: form.avatarBase64 ?? "",
                Login: form.login,
                Password: form.password,
                FullName: form.fullName,
                City: form.city,
                ClubId: toIntOrNull(form.clubId),
                GroupId: toIntOrNull(form.groupId),
                PhoneNumber: form.phone,
                Birthday: form.birthDate || null,
                Sex: form.gender,
                Role: form.role,
                SchoolClass: toIntOrNull(form.schoolClass),
                Grade: form.rank,
                CertificationDate: form.rankDate || null,
                AnnualFee:
                    form.annualFee === "" ? null : Number(form.annualFee),
                ParentFullName: form.parentName,
                ParentFullNumber: form.parentPhone,
                RegistrationDate: form.registrationDate || null,
            };
            const fd = new FormData();
            fd.append("UserDataJson", jsonBlob(userJson));
            const resp = await fetch(`${API_HOST}/api/user/update/${USER_ID}`, {
                method: "PUT",
                body: fd,
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
            setIsModalOpen(false);
            await fetchProfile();
        }
    };

    if (loading) return <p className="profile__loading">Загрузка…</p>;
    if (error) return <p className="profile__error">Ошибка: {error}</p>;

    const mainInfoItems = [
        { title: "Логин", value: profile.login },
        { title: "Город", value: profile.city },
        { title: "ФИО", value: profile.fullName },
        { title: "Пол", value: profile.gender },
        { title: "Номер телефона", value: profile.phone },
        { title: "Дата рождения", value: profile.birthDate },
    ];

    const rankInfoItems = [
        { title: "Кю / Дан", value: profile.rank },
        { title: "Дата аттестации", value: profile.rankDate },
    ];

    return (
        <>
            <CreateStudentModal
                isEdit
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                form={form}
                onChange={handleChange}
                onAvatarSelect={handleAvatarSelect}
                onSubmit={handleSubmit}
                isLoading={isSaving}
                readOnly={false}
                clubsOptions={clubsList}
                apiHost={API_HOST}
            />

            <h1 className="profile__header">Профиль</h1>

            <div className="profile">
                <div className="profile__card data">
                    <div className="profile__data">
                        <div className="profile__photo">
                            <img
                                className="profile__photo__img"
                                src={profile.photo}
                                alt=""
                            />
                        </div>
                        <div className="profile__nameRole">
                            <p className="profile__name">{profile.cutName}</p>
                            <p className="profile__role">{profile.role}</p>
                        </div>
                    </div>
                    <button
                        className="profile__edit"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <img src="/src/assets/edit.svg" alt="Редактировать" />
                    </button>
                </div>

                <div className="profile__card mainInfo">
                    <p className="profile__card__title">Основная информация</p>
                    <div className="profile__card__items">
                        {mainInfoItems.map(({ title, value }) => (
                            <div key={title} className="profile__card__item">
                                <p className="item__title">{title}</p>
                                <div className="item__content">
                                    <p className="item__content-value">
                                        {value || "—"}
                                    </p>
                                    {title === "Дата рождения" && (
                                        <img
                                            src="/src/assets/sidebar/events.svg"
                                            alt=""
                                        />
                                    )}
                                    {title === "Город" && (
                                        <img
                                            src="/src/assets/location.svg"
                                            alt=""
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="profile__card rankInfo">
                    <p className="profile__card__title">Информация о ранге</p>
                    <div className="profile__card__items rank">
                        {rankInfoItems.map(({ title, value }) => (
                            <div key={title} className="profile__card__item">
                                <p className="item__title">{title}</p>
                                <div className="item__content">
                                    <p className="item__content-value">
                                        {value || "—"}
                                    </p>
                                    {title === "Дата аттестации" && (
                                        <img
                                            src="/src/assets/sidebar/events.svg"
                                            alt=""
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
