$(document).ready(function () {
    $('#data').DataTable({
      columns: [
        {searchable: false},
        {orderable: false, searchable: false},
        {orderable: false, searchable: false},
        null,
        {searchable: false},
        ],
    });
  });


