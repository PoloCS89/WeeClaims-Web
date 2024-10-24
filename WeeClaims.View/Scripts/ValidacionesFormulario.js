$(document).ready(function () {

    document.getElementById('regresarBtn').addEventListener('click', function () {
        location.reload(); // Recargar la página
    });

    $('#registroForm').on('submit', function (e) {
        e.preventDefault();

        
        $('#errorMessage').hide();

        $('#successCapturedData').html('');
        $('#errorCapturedData').html('');

        var isValid = true;
        var nombreCompania = $('#nombreCompania').val().trim();
        var nombrePersonaContacto = $('#nombrePersonaContacto').val().trim();
        var correoElectronico = $('#correoElectronico').val().trim();
        var telefono = $('#telefono').val().trim();

        var successData = '';
        var errorData = '';

        // Validar que los campos no estén vacíos
        if (nombreCompania === '') {
            isValid = false;
            errorData += '<span class="text-danger">' + nombreCompania + '</span><br>';
        } else {
            successData += nombreCompania + '<br>';
        }

        if (nombrePersonaContacto === '') {
            isValid = false;
            errorData += '<span class="text-danger">' + nombrePersonaContacto + '</span><br>';
        } else {
            successData += nombrePersonaContacto + '<br>';
        }

        // Validar formato de correo electrónico
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoElectronico)) {
            isValid = false;
            errorData += '<span class="text-danger">' + correoElectronico + '</span><br>';
        } else {
            successData += correoElectronico + '<br>';
        }

        // Validar el formato del teléfono (10 dígitos)
        var telefonoRegex = /^[0-9]{10}$/;
        if (!telefonoRegex.test(telefono)) {
            isValid = false;
            errorData += '<span class="text-danger">' + telefono + '</span><br>';
        } else {
            successData += telefono + '<br>';
        }

        // Si todo está bien, se envía el formulario
        if (isValid) {
            var data = {
                nombreCompania: nombreCompania,
                nombrePersonaContacto: nombrePersonaContacto,
                correoElectronico: correoElectronico,
                telefono: telefono
            };

            $.ajax({
                url: '/Compania/CapturaCompania',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                data: data,
                success: function (response) {
                    if (response.success) {
                        $('#modalNombreCompania').text(nombreCompania);
                        $('#modalNombreContacto').text(nombrePersonaContacto);
                        $('#modalCorreo').text(correoElectronico);
                        $('#modalTelefono').text(telefono);

                        // Mostrar el modal de datos guardados
                        $('#successModal').modal('show');
                        $('#errorModal').modal('hide');

                        $('#successMessage').show();
                        $('#errorMessage').hide();

                        //ocultar formulario de registro
                        $('#tituloRegistroPersona').hide();
                        $('#registroForm').hide();

                        //Consultar los datos guardados antes de mostrar la tabla de resutlados
                        obtenerRegistrosDesdeApiExterna();
                        //mostrar formulario de tabla
                        $('#tablaDatos').show();
                        $('#tituloTablaRegistros').show();
                    } else {
                        $('#errorMessage').show();
                        $('#successMessage').hide();
                    }
                },
                error: function () {
                    $('#errorMessage').show();
                    $('#successMessage').hide();
                }
            });
        } else { //si algun campo marca error muestra modal de error con campos en error
            $('#successCapturedData').html(successData);
            $('#errorCapturedData').html(errorData);

            $('#successModal').modal('hide');
            $('#errorModal').modal('show');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const continuarBtn = document.getElementById('continuarBtn');
    const inputs = document.querySelectorAll('#registroForm input');

    // Función para verificar si todos los campos están llenos
    function verificarCampos() {
        let todosLlenos = true;

        inputs.forEach(input => {
            if (input.type !== 'checkbox' && input.value.trim() === '') {
                todosLlenos = false;
            }
            if (input.type === 'checkbox' && !input.checked) {
                todosLlenos = false;
            }
        });

        // Si todos los campos están llenos, habilitar el botón
        continuarBtn.disabled = !todosLlenos;
    }

    // Escuchar los cambios en los campos del formulario
    inputs.forEach(input => {
        input.addEventListener('input', verificarCampos);
        input.addEventListener('change', verificarCampos);  // Para el checkbox
    });

    verificarCampos();  // Verificar al cargar la página si los campos ya están completos
});
function obtenerRegistrosDesdeApiExterna() {
    $.ajax({
        url: '/Compania/ObtenerCompanias',  // Ruta del controlador que llama a la API externa
        type: 'GET',
        success: function (response) {
            // Limpiar la tabla antes de agregar nuevos datos
            $("#datosTabla tbody").empty();

            // Suponiendo que `response` es un array de registros
            response.forEach(function (registro) {
                $("#datosTabla tbody").append(`
                                <tr>
                                    <td>${registro.NombreCompania}</td>
                                    <td>${registro.NombrePersonaContacto}</td>
                                    <td>${registro.CorreoElectronico}</td>
                                    <td>${registro.Telefono}</td>
                                </tr>
                            `);
            });

            $('#errorMessage').hide();
            $('#successMessage').hide();
            mostrarTabla();
        },
        error: function (xhr, status, error) {
            alert("Error al obtener los datos: " + error);
        }
    });
}

function mostrarTabla() {
    // Mostrar el div y cambiar el ancho dinámicamente
    var tablaDatos = document.getElementById('tablaDatos');
    tablaDatos.style.display = "block"; // Mostrar el div
    tablaDatos.classList.add("mostrar"); // Cambiar el ancho
}