let table = new DataTable('#loc-table');
$("#reviewFilter").on("change", function() {
    table.column(0)  // Under Review column index
    .search(this.value)
    .draw();
});