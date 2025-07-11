import React from "react";

export default function calculateAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const diffMs = Date.now() - birthDate.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
}
