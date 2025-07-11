import React from "react";

export const ROLE_OPTIONS = [
    // { value: "", label: "—" },
    { value: "Ученик", label: "Ученик" },
    { value: "Тренер", label: "Тренер" },
    { value: "Руководитель", label: "Руководитель" },
    { value: "Администратор", label: "Администратор" },
];

export const ROLE_LABELS = ROLE_OPTIONS.reduce(
    (acc, o) => ({ ...acc, [o.value]: o.label }),
    {}
);

export const getRoleLabel = (value) => ROLE_LABELS[value] ?? value;

export const GENDER_OPTIONS = [
    { value: "Male", label: "Мужской" },
    { value: "Female", label: "Женский" },
];

export const RANK_OPTIONS = [
    "Нет",
    "6 Кю",
    "5 Кю",
    "4 Кю",
    "3 Кю",
    "2 Кю",
    "1 Кю",
    "1 Дан",
    "2 Дан",
    "3 Дан",
    "4 Дан",
    "5 Дан",
    "6 Дан",
    "7 Дан",
    "8 Дан",
    "9 Дан",
    "10 Дан",
];

export const CLASS_OPTIONS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
];
