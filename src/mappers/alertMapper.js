export function toForm(apiAlert) {
    return {
        ...apiAlert,
        date: apiAlert.date ? apiAlert.date.split('T')[0] : '',
    };
}

export function toAlert(formAlert) {
    return {
        ...formAlert,
        userId: formAlert.user.id || 1, // TODO implement user validation for logged in user
        date: formAlert.date?.split("T")[0] + "T00:00:00"
    };
}