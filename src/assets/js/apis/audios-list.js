var defaultDataTableOptions = {
    "language": {
        "paginate": {
            "previous": "<i class='mdi mdi-chevron-left'>",
            "next": "<i class='mdi mdi-chevron-right'>"
        },
        "info": "Showing products _START_ to _END_ of _TOTAL_",
        "lengthMenu": "Afficher <select class='form-select form-select-sm ms-1 me-1'>"+
              '<option value="5">5</option>'+
              '<option value="10">10</option>'+
              '<option value="20">20</option>'+
              '<option value="-1">All</option>'+
              '</select> audios',
    },
    "pageLength": -1,
    "columns": [
        {
            'orderable': false, 'targets': 0,
            'render': function(data, type, row, meta){
                if(type === 'display'){
                    data = "<div class=\"form-check\"><input type=\"checkbox\" class=\"form-check-input dt-checkboxes\"><label class=\"form-check-label\">&nbsp;</label></div>";
                }
                return data;
             },
            'checkboxes': {
                'selectRow': true,
                'selectAllRender': '<div class=\"form-check\"><input type=\"checkbox\" class=\"form-check-input dt-checkboxes\"><label class=\"form-check-label\">&nbsp;</label></div>'
            }
        },
        {'orderable': true},
        {'orderable': true},
        {'orderable': true},
        {'orderable': false}
    ],
    "select": {
        "style": "multi"
    },
    "order": [[ 1, "asc" ]],
    "drawCallback": function () {
        $('.dataTables_paginate > .pagination').addClass('pagination-rounded');
        $('#audios-datatable_length label').addClass('form-label');

        // Col add & remove
        var filterDiv = document.querySelector('.dataTables_wrapper .row');
        if (filterDiv !== null) {
            filterDiv.querySelectorAll('.col-md-6').forEach(function(element){
              element.classList.add('col-sm-6');
              element.classList.remove('col-sm-12');
              element.classList.remove('col-md-6');
            });
          }
    }
}
// Fonction pour initialiser DataTable
function initDataTable() {
    $('#audios-datatable').DataTable(defaultDataTableOptions);
  }

initDataTable();

document.addEventListener('DOMContentLoaded', function() {
// L'URL de la requête
var baseUrl = 'http://18.198.48.125/api3.php?action=';
var url = baseUrl+'getfinalrec';

// Effectuer la requête GET en utilisant fetch
fetch(url)
  .then(function(response) {
    // Vérifier si la réponse est réussie (code HTTP 200)
    if (!response.ok) {
      throw new Error('Erreur réseau');
    }
    // Convertir la réponse en JSON
    return response.json();
  })
  .then(function(audios) {
    console.log(audios); // Affiche les données dans la console, à adapter à vos besoins
    // On récupère la référence du tableau
    var audiosDatatable = $('#audios-datatable').DataTable();

    // On efface l'instance DataTable existante
    audiosDatatable.clear().destroy();

    // On alimente le tableau d'audios
    for (var i = 0; i < audios.length; i++) {
        // Ajoutez les lignes de données
        audiosDatatable.row.add([
        '<div class="form-check"><input type="checkbox" class="form-check-input" id="customCheck' + i + '"><label class="form-check-label" for="customCheck' + i + '">&nbsp;</label></div>',
        '<p class="m-0 d-inline-block align-middle font-16"><a href="audio-details.html" class="text-body">' + audios[i].audioname + '</a></p>',
        audios[i].creation_date,
        '<span class="badge bg-success">' + audios[i].status + '</span>',
        '<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-eye"></i></a><a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a><a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>'
        ]);
    }

    // Redessinez le DataTable avec les nouvelles données
    audiosDatatable.draw();
    initDataTable();

  })
  .catch(function(error) {
    // Gérer les erreurs de la requête
    console.error('Erreur:', error);
  });
  
});
