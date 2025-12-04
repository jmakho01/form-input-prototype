let table = new DataTable('#edit-table', {
        order: [[0, 'desc']],     // sorts by most recent timestamp
        columnDefs: [
            { type: 'datetime', targets: 0 }   // force column type to date to ensure no errors
        ]
    });