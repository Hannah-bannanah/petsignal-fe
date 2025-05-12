export function toForm(apiAlert) {
    return {
        ...apiAlert,
        date: apiAlert.date ? apiAlert.date.split('T')[0] : '',
    };
}

export function toAlert(formAlert) {
    return {
        ...formAlert,
        date: formAlert.date?.split("T")[0] + "T00:00:00"
    };
}