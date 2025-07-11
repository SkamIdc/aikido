import React from "react";
import "/src/pages/MembersPage.css";
import "./FilterPanel.css";

const FilterSection = ({ title, items, group, onChange }) =>
    items.length ? (
        <div className="members__filter-section">
            <strong className="members__filter-section__title">{title}</strong>
            <ul className="members__filter-list">
                {items.map((i) => (
                    <li key={i.value} className="members__filter-item">
                        <input
                            type="checkbox"
                            checked={i.checked}
                            onChange={() => onChange(group, i.value)}
                        />
                        {i.label}
                    </li>
                ))}
            </ul>
        </div>
    ) : null;

function FilterPanel({ filters, onChange, onClose, onApply }) {
    const { roles = [], cities = [], ranks = [], clubs = [] } = filters;

    return (
        <div className="members__filter-panel--wrapper">
            Í
            <div className="members__filter-panel">
                <div className="members__filter-panel__header">
                    <h3 className="members__filter-title">Фильтры</h3>
                    <button className="members__filter-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <FilterSection
                    title="Роль"
                    items={roles}
                    group="roles"
                    onChange={onChange}
                />
                <FilterSection
                    title="Город"
                    items={cities}
                    group="cities"
                    onChange={onChange}
                />
                <FilterSection
                    title="Кю/Дан"
                    items={ranks}
                    group="ranks"
                    onChange={onChange}
                />
                <FilterSection
                    title="Клуб"
                    items={clubs}
                    group="clubs"
                    onChange={onChange}
                />

                <button
                    className="button members__filter-apply"
                    onClick={onApply}
                >
                    Применить
                </button>
            </div>
        </div>
    );
}

export default FilterPanel;