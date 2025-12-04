document.addEventListener("DOMContentLoaded", function () {
    const table = $("#loc-table").DataTable({
        order: [] // prevents automatic initial sorting
    });

    // review filter
    $("#reviewFilter").on("change", function () {
        table.column(1).search(this.value).draw();
    });

    // year filter
    $("#yearFilter").on("change", function () {
        let year = this.value;

        if (year === "") {
            table.column(0).search("").draw();
        } else {
            table.column(0).search("^" + year + "$", true, false).draw();
        }
    });
});