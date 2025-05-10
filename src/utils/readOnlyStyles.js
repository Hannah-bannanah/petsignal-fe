export function makeReadOnlyStyles(readOnly) {
    return {
        input: readOnly
            ? {
                backgroundColor: '#f8f9fa',
                color: '#495057',
                borderColor: '#ced4da',
                cursor: 'not-allowed',
                pointerEvents: 'none'
            }
            : {},
        label: readOnly
            ? {
                color: '#6c757d',
            }
            : {},
    };
}
