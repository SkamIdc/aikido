import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
import "./MembersPage.css";

import ImportExcelModal from "../components/Members/ImportExcelModal";
import CreateStudentModal from "../components/Members/CreateStudentModal";
import MembersList from "../components/Members/MembersList";
import FilterPanel from "../components/Members/FilterPanel";
import calculateAge from "../utils/CalculateAge";
import mapUserDtoToForm from "../utils/mapUserDtoToForm";
import {
    ROLE_OPTIONS,
    RANK_OPTIONS,
} from "../components/Members/CreateStudentModalEnums";

const API_HOST = "http://158.160.168.25:5000";
const PAGE_SIZE = 6;

const uniq = (arr) => [...new Set(arr)];
const jsonBlob = (o) =>
    new Blob([JSON.stringify(o)], { type: "application/json" });

export default function MembersPage() {
    const [members, setMembers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [clubsList, setClubsList] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isListLoading, setListLoading] = useState(false);

    const [filters, setFilters] = useState({
        roles: [],
        cities: [],
        ranks: [],
        clubs: [],
    });

    const [activeFilter, setActiveFilter] = useState({
        roles: [],
        cities: [],
        grades: [],
        clubIds: [],
        name: "",
    });

    const [ui, setUi] = useState({
        searchTerm: "",
        isFilterOpen: false,
        isImportOpen: false,
        isCreateOpen: false,
        isEditOpen: false,
        isViewOpen: false,
        isImporting: false,
        isSaving: false,
    });

    const [importMode, setImportMode] = useState("create");
    const [importFile, setImportFile] = useState(null);

    const blankForm = useMemo(
        () => ({
            ...mapUserDtoToForm({}),
            registrationDate: new Date().toISOString().substring(0, 10),
        }),
        []
    );
    const [form, setForm] = useState(blankForm);
    const [editId, setEditId] = useState(null);
    const [viewUser, setViewUser] = useState(blankForm);

    const mapDtoBatch = (arr) =>
        arr.map((u) => ({
            id: u.id ?? u.Id,
            avatar: u.photo
                ? `data:image/jpeg;base64,${u.photo}`
                : "/src/assets/default-avatar.svg",
            name: u.fullName ?? u.FullName,
            login: u.login ?? u.Login,
            role: u.role ?? u.Role,
            city: u.city ?? u.City,
            age: calculateAge(u.birthday ?? u.Birthday),
            rank: u.grade ?? u.Grade,
            clubId: u.clubId ?? u.ClubId ?? null,
            club: u.clubName ?? u.ClubName ?? "—",
        }));

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            roles: ROLE_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
                checked:
                    prev.roles.find((i) => i.value === o.value)?.checked ??
                    false,
            })),
            ranks: RANK_OPTIONS.map((o) => ({
                value: o,
                label: o,
                checked:
                    prev.ranks.find((i) => i.value === o)?.checked ?? false,
            })),
        }));
    }, []);

    useEffect(() => {
        fetch(`${API_HOST}/api/club/get/list`)
            .then((r) => r.json())
            .then((data) => {
                setClubsList(data);
                setFilters((prev) => {
                    const clubs = data.map((c) => ({
                        value: c.id,
                        label: c.name,
                        checked:
                            prev.clubs.find((i) => i.value === c.id)?.checked ??
                            false,
                    }));
                    const cities = uniq(data.map((c) => c.city)).map(
                        (city) => ({
                            value: city,
                            label: city,
                            checked:
                                prev.cities.find((i) => i.value === city)
                                    ?.checked ?? false,
                        })
                    );
                    return { ...prev, clubs, cities };
                });
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!clubsList.length) return;
        setMembers([]);
        setStartIndex(0);
        setHasMore(true);
        fetchPage(0, true);
    }, [activeFilter, clubsList]);

    const fetchPage = useCallback(
        async (firstIndex, replace = false) => {
            // console.log(firstIndex);
            if (!hasMore && !replace) return;
            setListLoading(true);
            try {
                const qs = new URLSearchParams();
                activeFilter.roles.forEach((v) => qs.append("roles", v));
                activeFilter.cities.forEach((v) => qs.append("cities", v));
                activeFilter.grades.forEach((v) => qs.append("grades", v));
                activeFilter.clubIds.forEach((v) => qs.append("clubIds", v));
                if (activeFilter.name) qs.append("name", activeFilter.name);

                const url = `${API_HOST}/api/user/get/short-list-cut-data/${firstIndex}/${
                    firstIndex + PAGE_SIZE
                }?${qs.toString()}`;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

                const data = await resp.json();
                const arr = data?.users?.result ?? data?.result ?? [];
                const batch = mapDtoBatch(arr);

                setTotalCount(data.totalCount ?? data.TotalCount ?? 0);
                setMembers((prev) => (replace ? batch : [...prev, ...batch]));

                const newIndex = firstIndex + PAGE_SIZE;
                setStartIndex(newIndex);
                setHasMore(
                    newIndex < (data.totalCount ?? data.TotalCount ?? 0)
                );
            } catch (err) {
                console.error(err);
            } finally {
                setListLoading(false);
            }
        },
        [activeFilter, hasMore]
    );

    const handleFilterChange = (group, val) =>
        setFilters((p) => ({
            ...p,
            [group]: p[group].map((i) =>
                i.value === val ? { ...i, checked: !i.checked } : i
            ),
        }));

    const applyFilter = () => {
        setActiveFilter({
            roles: filters.roles.filter((i) => i.checked).map((i) => i.value),
            cities: filters.cities.filter((i) => i.checked).map((i) => i.value),
            grades: filters.ranks.filter((i) => i.checked).map((i) => i.value),
            clubIds: filters.clubs.filter((i) => i.checked).map((i) => i.value),
            name: activeFilter.name,
        });
        setUi((p) => ({ ...p, isFilterOpen: false }));
    };

    const submitSearch = (e) => {
        e.preventDefault();
        setActiveFilter((p) => ({ ...p, name: ui.searchTerm.trim() }));
    };

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

    const saveUser = async (e) => {
        e.preventDefault();
        setUi((p) => ({ ...p, isSaving: true }));
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
            if (form.avatar) fd.append("Photo", form.avatar, form.avatar.name);

            const url = editId
                ? `${API_HOST}/api/user/update/${editId}`
                : `${API_HOST}/api/user/create`;
            const method = editId ? "PUT" : "POST";

            const resp = await fetch(url, { method, body: fd });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            setMembers([]);
            setStartIndex(0);
            setHasMore(true);
            fetchPage(0, true);
            setUi((p) => ({ ...p, isCreateOpen: false }));
            setEditId(null);
        } catch (err) {
            alert(err.message);
        } finally {
            setUi((p) => ({ ...p, isSaving: false }));
        }
    };

    const viewDetails = async (id) => {
        try {
            const r = await fetch(`${API_HOST}/api/user/get/${id}`);
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            setViewUser(mapUserDtoToForm(await r.json()));
            setUi((p) => ({ ...p, isViewOpen: true }));
        } catch (e) {
            alert(e.message);
        }
    };

    const startEdit = async (id) => {
        try {
            const r = await fetch(`${API_HOST}/api/user/get/${id}`);
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            setForm(mapUserDtoToForm(await r.json()));
            setEditId(id);
            setUi((p) => ({ ...p, isEditOpen: true }));
        } catch (e) {
            alert(e.message);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Удалить пользователя?")) return;
        try {
            const r = await fetch(`${API_HOST}/api/user/delete/${id}`, {
                method: "DELETE",
            });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            setMembers([]);
            setStartIndex(0);
            setHasMore(true);
            fetchPage(0, true);
        } catch (e) {
            alert(e.message);
        }
    };

    const handleFileSelect = (e) => setImportFile(e.target.files[0]);

    const toIntOrNull = (v) => (v === "" || v == null || isNaN(+v) ? null : +v);

    const parseDate = (v) => {
        if (v === "" || v == null) return null;
        const d =
            typeof v === "number"
                ? new Date(Date.UTC(1899, 11, 30) + v * 864e5)
                : new Date(v.toString().trim().replaceAll(/[./]/g, "-"));
        return isNaN(d) ? null : d.toISOString();
    };

    const buildUser = (r) => ({
        role: r["Роль"].trim(),
        login: r["Логин"].trim(),
        password: r["Пароль"].trim(),
        fullName: r["ФИО"].trim(),
        phoneNumber: r["Телефон"].toString() || null,
        birthday: parseDate(r["Дата рождения"]),
        city: r["Город"]?.trim() || null,
        grade: r["Кю/Дан"]?.toString().trim() || null,
        certificationDate: parseDate(r["Дата аттестации"]),
        annualFee: r["Взнос"],
        sex: r["Пол"]?.trim() || null,
        clubId: toIntOrNull(r["Клуб ID"]),
        groupId: toIntOrNull(r["Группа ID"]),
        schoolClass: toIntOrNull(r["Класс"]),
        parentFullName: r["ФИО родителя"]?.trim() || null,
        parentFullNumber: r["Телефон родителя"]?.trim() || null,
        registrationDate: parseDate(r["Дата регистрации"]),
        photo: null,
        id: importMode === "update" ? r["ID"] : null,
    });

    const handleImportConfirm = async () => {
        if (!importFile) return;

        setUi((p) => ({ ...p, isImporting: true }));
        const invalidRows = [];
        const users = [];

        try {
            const buf = await importFile.arrayBuffer();
            const wb = XLSX.read(buf);
            const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
                defval: "",
            });

            rows.forEach((r, idx) => {
                const login = r["Логин"]?.toString().trim();
                const role = r["Роль"]?.toString().trim();
                const name = r["ФИО"]?.toString().trim();
                if (importMode === "create") {
                    const pass = r["Пароль"]?.toString().trim();
                    if (!pass) {
                        invalidRows.push(idx + 2);
                        return;
                    }
                }

                if (!login || !role || !name) {
                    invalidRows.push(idx + 2);
                    return;
                }
                users.push(buildUser(r));
            });
            if (!users.length) {
                alert("Файл не содержит ни одной корректной строки.");
                return;
            }

            const fd = new FormData();
            fd.append(
                "UserListJson",
                new Blob([JSON.stringify(users)], { type: "application/json" }),
                "users.json"
            );

            const resp = await fetch(
                `${API_HOST}/api/user/${importMode}/list`,
                {
                    method: "POST",
                    body: fd,
                }
            );

            // const resp = await fetch(`${API_HOST}/api/user/create/list`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(users),
            // });

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            setMembers([]);
            setStartIndex(0);
            setHasMore(true);
            fetchPage(0, true);
            setUi((p) => ({ ...p, isImportOpen: false }));
            setImportFile(null);

            if (invalidRows.length) {
                alert(
                    "Импорт завершён частично.\nПропущены строки: " +
                        invalidRows.join(", ")
                );
            } else {
                alert("Импорт успешно завершён!");
            }
        } catch (e) {
            alert(e.message);
        } finally {
            setUi((p) => ({ ...p, isImporting: false }));
        }
    };
    return (
        <div className="members-page">
            <div className="members-page__header">
                <h1 className="members-page__title">
                    База участников ({totalCount})
                </h1>
                <div className="members-page__header-buttons">
                    <button
                        className="button members__import"
                        onClick={() =>
                            setUi((p) => ({ ...p, isImportOpen: true }))
                        }
                    >
                        <img src="/src/assets/arrow-down.svg" alt="" /> Импорт
                        Excel
                    </button>
                    <button
                        className="button members__import"
                        onClick={() => {
                            setForm(blankForm);
                            setEditId(null);
                            setUi((p) => ({ ...p, isCreateOpen: true }));
                        }}
                    >
                        <img src="/src/assets/plus.svg" alt="" />
                        Создать ученика
                    </button>
                </div>
            </div>
            <div className="members-page__filters-block">
                <form
                    onSubmit={submitSearch}
                    className="members-page__search-form"
                >
                    <input
                        className="search-form__input"
                        type="text"
                        placeholder="Поиск"
                        value={ui.searchTerm}
                        onChange={(e) =>
                            setUi((p) => ({ ...p, searchTerm: e.target.value }))
                        }
                    />
                    <button className="search-form__button" type="submit">
                        Найти
                    </button>
                </form>

                <button
                    className="members__filter"
                    aria-label="Фильтр"
                    onClick={() =>
                        setUi((p) => ({ ...p, isFilterOpen: !p.isFilterOpen }))
                    }
                >
                    <span className="members__filter-icon" />
                </button>
            </div>

            {ui.isFilterOpen && (
                <FilterPanel
                    filters={filters}
                    onChange={handleFilterChange}
                    onClose={() =>
                        setUi((p) => ({ ...p, isFilterOpen: false }))
                    }
                    onApply={applyFilter}
                />
            )}
            <div className="members-wrapper">
                {isListLoading && (
                    <div className="members-page__overlay">
                        <div className="loader" />
                    </div>
                )}
                <MembersList
                    members={members}
                    onView={viewDetails}
                    onEdit={startEdit}
                    onDelete={deleteUser}
                />
                {hasMore && (
                    <button className="show-more-btn" onClick={() => fetchPage(startIndex)}>Ещё</button>
                )}
            </div>

            <ImportExcelModal
                isOpen={ui.isImportOpen}
                onClose={() => setUi((p) => ({ ...p, isImportOpen: false }))}
                mode={importMode}
                file={importFile}
                onModeChange={setImportMode}
                onFileSelect={handleFileSelect}
                onConfirm={handleImportConfirm}
                isLoading={ui.isImporting}
            />
            <CreateStudentModal
                isOpen={ui.isCreateOpen}
                onClose={() => setUi((p) => ({ ...p, isCreateOpen: false }))}
                clubsOptions={clubsList}
                form={form}
                onChange={(f, v) => setForm((p) => ({ ...p, [f]: v }))}
                onAvatarSelect={handleAvatarSelect}
                onSubmit={saveUser}
                isLoading={ui.isSaving}
                readOnly={false}
                apiHost={API_HOST}
            />
            <CreateStudentModal
                isOpen={ui.isEditOpen}
                isEdit={ui.isEditOpen}
                onClose={() => setUi((p) => ({ ...p, isEditOpen: false }))}
                clubsOptions={clubsList}
                form={form}
                onChange={(f, v) => setForm((p) => ({ ...p, [f]: v }))}
                onAvatarSelect={handleAvatarSelect}
                onSubmit={saveUser}
                isLoading={ui.isSaving}
                readOnly={false}
                apiHost={API_HOST}
            />

            <CreateStudentModal
                isOpen={ui.isViewOpen}
                onClose={() => setUi((p) => ({ ...p, isViewOpen: false }))}
                clubsOptions={clubsList}
                form={viewUser}
                onChange={() => {}}
                onAvatarSelect={() => {}}
                onSubmit={() => {}}
                isLoading={false}
                readOnly={true}
                apiHost={API_HOST}
            />
        </div>
    );
}
