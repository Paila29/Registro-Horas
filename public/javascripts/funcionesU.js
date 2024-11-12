
// Cargar SweetAlert desde una CDN utilizando una etiqueta <script>
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11.0.18/dist/sweetalert2.min.js';
document.head.appendChild(script);

// Esperar a que SweetAlert se cargue antes de utilizarlo
script.onload = function () {
  // Aquí puedes utilizar SweetAlert

};
//////////////////Metodo implementado para el AutoIncrement
function cantRegs(callback) {

  let timerInterval
  Swal.fire({
    title: 'Cargando!',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */

  })

  let registros = 0;

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;
      
      respuesta.forEach(e => {

        registros = e._id + 1;
       
      }); 
      //se movió el callback (el retorno) para que no se itere el swal
      callback(registros);
    }
  });
  xhr.open('GET', 'http://localhost:3000/students');//ruta de conexion
  xhr.responseType = 'json';
  xhr.send();
}

function limpiarCampos() {
  document.getElementById('date').value = "";
  document.getElementById('et').value = "";
  document.getElementById('dt').value = "";
  document.getElementById('hr').value = "";
  document.getElementById('txt').value = "";
}

///////////////////Metodo Agregar registro de horas
//Metodo encargado de la insercion de los datos ingresados por parametros hacia la base de datos por medio del JSON con la estructura correspondiente
// ...


function postData(date, eTime, dTime, hoursReal, description) {
  if (validarLogueo() == true) {
    if (date == "" || eTime == "" || dTime == "" || hoursReal == "" || description == "") {
      mostrarError("No puede dejar campos vacios :D", "a");
    } else {
      const carnet = sessionStorage.getItem('carnet');
      const nombre = sessionStorage.getItem('nombre');
      //se crea una variable de sesion con las horas del registro
      sessionStorage.setItem('hr', hoursReal);

  

      //Metodo AI
      cantRegs(function (registros) {

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status <= 299) {   
             //Metodo que consulta las horas realizadas FU DESPLAZADO DESDE AFUERA PARA QUE SE EJECUTE CUANDO LA SOLICITUD ES CORRECTA
     
      
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Registro guardado exitosamente!!!',
              showConfirmButton: false,
              timer: 1500
            });
     consultarHoras(carnet);
            // Llamada al método seguimientoHoras() después de guardar los datos para actualizar las horas hechas en la parte superior
            limpiarCampos();
            seguimientoHoras();
          } else {
            mostrarError("Error al realizar la solicitud");
          }
        });

        const obj = {
          _id: registros,
          carnet: carnet,
          name: nombre,
          date: date,
          eTime: eTime,
          dTime: dTime,
          cantHor: hoursReal,
          description: description
        };

        xhr.open('POST', 'http://localhost:3000/students');
        xhr.setRequestHeader('Content-Type', 'application/json');
        let json = JSON.stringify(obj);
        xhr.send(json);
      });
    }
  } else {
    window.location.href = 'index.html';
    mostrarError("Necesitas realizar el logueo de nuevo ", "top");

  }
}


///////// Consulta la cantidad de horas que tenga realizadas dentro de la BD
function consultarHoras(carnet) {

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;
      //se crea una variable de sesion para mantener el dato de la cantidad de horas que hay en la BD
      sessionStorage.setItem('horC', respuesta.hoursReal);
      actualizarHorasReal(carnet);
    }
  });
  xhr.open('GET', 'http://localhost:3000/user/' + carnet);//acceso al user en cuestion con la concatenacion del id
  xhr.responseType = 'json';
  xhr.send();
}

//cambia las horas realizadas a nivel de BD desde la primer interfaz por medio de los datos ingresados por parametros
function actualizarHorasReal(carnet) {

  let horaEntrante = parseInt(sessionStorage.getItem('hr'));//nueva cantidad de horas
  let horaAlmacenada = parseInt(sessionStorage.getItem('horC'));// cantidad de horas en BD

  let nueva = 0;
  nueva = horaEntrante + horaAlmacenada;

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      //llamado a metodos ejecutables
    }
  });
  //consulta PATCH por medio de la ruta "http://localhost:3000/api" para setear los nuevos valores (stock)
  xhr.open('PATCH', 'http://localhost:3000/user/' + carnet);
  xhr.setRequestHeader('Content-Type', 'application/json');
  let json = `{"_id":"${carnet}","hoursReal":"${nueva}"}`
  xhr.send(json);
}


function seguimientoHoras() {
  let id = sessionStorage.getItem('carnet');
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;
      const tabla = document.getElementById('seguimiento');
      let tag;
      if (respuesta.hoursReal >= respuesta.assignedHours) {
        tag = '<div id="user" style="background-color: rgb(100, 255, 100);">Realizó ' + respuesta.hoursReal + ' de ' + respuesta.assignedHours + '</div>';
      } else {
        tag = '<div id="user style="background-color: rgb(196, 196, 196);">Realizó ' + respuesta.hoursReal + ' de ' + respuesta.assignedHours + '</div>';
      }
      tabla.innerHTML = tag;
    } else {
      // La solicitud no fue exitosa, manejar el error aquí
      console.log(`Error al realizar la solicitud: ${xhr.statusText}`);
    }
  });
  xhr.open('GET', 'http://localhost:3000/user/' + id);
  xhr.responseType = 'json';
  xhr.send();
}



function validarLogueo() {

  if (sessionStorage.getItem('carnet') == null) {
    window.location.href = 'index.html';
    console.log("entró el hpta");
    return false;
  }
  return true;
}

function validarRol() {
  if (sessionStorage.getItem('rol') != 1) {
    window.location.href = 'index.html';

  }
}

function logout() {
  sessionStorage.removeItem('carnet');
  window.location.href = 'index.html';
}



function postUsuario(id, name, secondName, assignedHours, passw) {

  let defect = 0;
  id = id.trim(); // Eliminar espacios en blanco al inicio y al final
  name = name.trim(); // Eliminar espacios en blanco al inicio y al final
  secondName = secondName.trim(); // Eliminar espacios en blanco al inicio y al final
  passw = passw.trim(); // Eliminar espacios en blanco al inicio y al final

  if (id == 0 || name === "" || secondName === "" || assignedHours === "" || passw === "") {
    mostrarError("No puede dejar campos vacíos >:(", "s");
  } else {
    let check = document.querySelector('input[id="flexSwitchCheckDefault"]:checked');
    let rol = 0;
    if (check) {
      rol = 1;
    }

    // Convertir el id a mayúsculas
    id = id.toUpperCase();

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario agregado exitosamente!!!',
        showConfirmButton: false,
        timer: 1500
      }),
        mostrarUsuarios();
    });

    const obj = {
      _id: id,
      name: name,
      secondName: secondName,
      assignedHours: assignedHours,
      hoursReal: defect,
      rol: rol,
      password: passw
    };

    xhr.open('POST', 'http://localhost:3000/user');
    xhr.setRequestHeader('Content-Type', 'application/json');
    let json = JSON.stringify(obj);
    xhr.send(json);
  }
}



//Metodo para mostrar el usuario en la parte superior
function datosUsuario() {
  carnet = sessionStorage.getItem('carnet');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;
      const tabla = document.getElementById('datosUser');
      const tag = '<div id="user">' + respuesta.name + ' - ' + respuesta._id + '</div>';
      tabla.innerHTML = tag;
    } else {
      mostrarError("Error al realizar la solicitud");
    }
  });
  xhr.open('GET', 'http://localhost:3000/user/' + carnet);
  xhr.responseType = 'json';
  xhr.send();

}


function compUsuario(carnet, pass) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;

      if (respuesta) {
        if (respuesta.password == pass) {
          sessionStorage.setItem('carnet', carnet);
          sessionStorage.setItem('nombre', respuesta.name);
          sessionStorage.setItem('rol', respuesta.rol);
          if (respuesta.rol == 1) {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'registroHora.html';
          }
        } else {
          mostrarError("Usuario o contraseña incorrecta");
        }
      } else {
        mostrarError("Usuario no existe");
      }
    } else {
      mostrarError("Error al realizar la solicitud");
    }
  });
  xhr.open('GET', 'http://localhost:3000/user/' + carnet);
  xhr.responseType = 'json';
  xhr.send();
}

function mostrarError(mensaje, pos) {
  if (pos == null) {
    pos = "top-end";
  } else {
    pos = "top";
  }
  Swal.fire({
    text: mensaje,
    icon: "error",
    toast: true,
    position: pos,
    showConfirmButton: false,
    timer: 1500,
  });
}

//Metodo para mostrar el usuario en la parte superior
function extraerids(id) {

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;
      respuesta.forEach(e => {
        if (e.carnet == id) {
          limpiarRegsUsuario(e._id)
        }
      });
    } else {
      mostrarError("Error al realizar la solicitud");
    }
  });
  xhr.open('GET', 'http://localhost:3000/students');
  xhr.responseType = 'json';
  xhr.send();

}

function limpiarRegsUsuario(id) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {

    }
  });
  //consulta DELETE por medio de la ruta "http://localhost:3000/api" y concatenando el 'id' para setear los nuevos valores (stock)
  xhr.open('DELETE', 'http://localhost:3000/students/' + id);
  xhr.send();
}

//Metodo encargado de eliminar un Usuario especifico ubicandolo por el id ingresado en parametros
function deleteU(id) {
  if (validarLogueo() == true) {
    Swal.fire({
      title: 'Seguro que quiere eliminar este registro?',
      text: 'Eliminar el Usuario ' + id,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status <= 299) {
            //llamado a metodos ejecutables
            mostrarUsuarios();
          }
        });
        //consulta DELETE por medio de la ruta "http://localhost:3000/api" y concatenando el 'id' para setear los nuevos valores (stock)
        xhr.open('DELETE', 'http://localhost:3000/user/' + id);
        xhr.send();
      }
    });
  } else {
    mostrarError("Necesitas loguearte de nuevo ", "top");
  }
}

function editU(id, nombre, apellido, password, horasAsignadas) {

  if (validarLogueo() == true) {
    Swal.fire({
      title: 'Seguro que quiere eliminar este registro?',
      text: 'Eliminar el Usuario ' + nombre + 'con el ID' + id,
      html: '<br>' + "  <strong>Nombre: </strong> " + '<input class="edit" type="text" id=' + "name" + id + ' name="password" value="' + nombre + '">' +
        '<br>' + "  <strong>Apellido: </strong> " + '<input class="edit" type="text" id=' + "sname" + id + ' name="password" value="' + apellido + '">' +
        '<br>' + "  <strong>Contraseña: </strong> " + '<input class="edit" type="text" id=' + "password" + id + ' name="password" value="' + password + '">' +
        '<br>' + "  <strong>Horas Asignadas: </strong> " + '<input class="edit" type="text" id=' + "horasA" + id + ' name="password" value="' + horasAsignadas + '">',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status <= 299) {
            //llamado a metodos ejecutables
            extraerids(id);
            mostrarUsuarios();
          }
        });
        //consulta DELETE por medio de la ruta "http://localhost:3000/api" y concatenando el 'id' para setear los nuevos valores (stock)

        xhr.open('PUT', 'http://localhost:3000/user/' + id);
        xhr.setRequestHeader('Content-Type', 'application/json');
        let json = `{"_id":"${id}","name":"${document.getElementById('name' + id).value}","secondName":"${document.getElementById('sname' + id).value}","assignedHours":"${document.getElementById('horasA' + id).value}","password":"${document.getElementById('password' + id).value}"}`
        xhr.send(json);
      }
    });
  } else {
    mostrarError("Necesitas loguearte de nuevo ", "top");
  }
}

//eliminacion de unRegistro de Horas
function deleteRH(id, carnet, cantidad) {
  if (validarLogueo() == true) {
    Swal.fire({
      title: 'Seguro que quiere eliminar este registro?',
      text: 'Eliminar Hora',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
       
        getHorasRTotales(carnet, function (horasConsulta) {
          resteoHoras(carnet, cantidad, horasConsulta, function () {
            if (sessionStorage.getItem('rol') == 1) {
              getAll();
            } else {
              get();
            }
          });
        });

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status <= 299) {

            // La solicitud DELETE se realizó correctamente
          }
        });
        // consulta DELETE por medio de la ruta "http://localhost:3000/api" y concatenando el 'id' para setear los nuevos valores (stock)
        xhr.open('DELETE', 'http://localhost:3000/students/' + id);
        xhr.send();
      }
    });
  } else {
    mostrarError("Necesitas loguearte de nuevo ", "top");
  }
}

function getHorasRTotales(id, callback) {
  let timerInterval
  Swal.fire({
    title: 'Cargando!',
    timer: 1000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */

  })
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;
      const horasConsulta = respuesta.hoursReal;
      sessionStorage.setItem('horasConsulta', horasConsulta);
      callback(horasConsulta);

    } else {
      // La solicitud no fue exitosa, manejar el error aquí
      console.log(`Error al realizar la solicitud: ${xhr.statusText}`);
    }
  });
  xhr.open('GET', 'http://localhost:3000/user/' + id);
  xhr.responseType = 'json';
  xhr.send();
}


//metodo enfocado en la reduccion de horasTrabajadas en caso de eliminar un registro de horas
function resteoHoras(carnet, cantidad, horasConsulta, callback) {
  const total = parseInt(horasConsulta) - cantidad;
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      callback();
    }
  });
  xhr.open('PATCH', 'http://localhost:3000/user/' + carnet);
  xhr.setRequestHeader('Content-Type', 'application/json');
  const json = `{"_id":"${carnet}","hoursReal":"${total}"}`;
  xhr.send(json);
}


//Metodo que busca complir la solicitud get el cual muestra todos los datos que se encuentren en la tabla de la DB
function mostrarUsuarios() {
  // Seteo de una tabla de contenidos en el HTML
  const tabla = document.getElementById('response');
  const tag = '<table id="myTable" class="display style="background-color: rgba(255, 255, 255, 0.884)"></table>';
  tabla.innerHTML = tag;

  $("#myTable").append('<thead>' + '<tr>' +
    '<th style="width: 150px">Carnet</th>' +
    '<th style="width: 150px">Nombre</th>' +
    '<th style="width: 80px">Apellido</th>' +
    '<th style="width: 80px">Contraseña</th>' +
    '<th style="width: 80px">Horas Realizadas</th>' +
    '<th style="width: 80px">Horas Asignadas</th>' +
    '<th style="width: 140px">Funciones</th>' + '</thead>' + '<tbody>');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response; // Cambio aquí
      respuesta.forEach(e => {
        $("#myTable").append('<tr>' +
          '<td>' + e._id + '</td>' +
          '<td>' + e.name + '</td>' +
          '<td>' + e.secondName + '</td>' +
          '<td>' + e.password + '</td>' +
          '<td>' + e.hoursReal + '</td>' +
          '<td>' + e.assignedHours + '</td>' +
          '<td>' + `<button class="btn btn-danger" style="margin: 2%;" onclick="deleteU('${e._id}')">Eliminar</button>` +
          `<button class="btn btn-warning" onclick="editU('${e._id}','${e.name}','${e.secondName}','${e.password}','${e.assignedHours}')">
           Editar
        </button> </td>` +
          '</tr>');
      });
      $('#myTable').append('</tbody>');
      $(document).ready(function () {
        $('#myTable').DataTable({
          responsive: true
        });
      });
      tabla.innerHTML += `<div id="cont"><button id="imprimir" onclick="generarPDF('USUARIOS')">PDF</button><button id="expExcel" onclick="exportarExcel('USUARIOS')">Excel</button></div>`;


    } else {
      document.getElementById('response').innerHTML =
        `Error: ${xhr.status}, el recurso no se ha encontrado.`;
    }
  });

  xhr.open('GET', 'http://localhost:3000/user');
  xhr.responseType = 'json';
  xhr.send();
}

//Metodo que busca complir la solicitud get el cual muestra todos los datos que se encuentren en la tabla de la DB
function get() {
  let identificador = sessionStorage.getItem('carnet');
  // Seteo de una tabla de contenidos en el HTML
  const tabla = document.getElementById('response');
  const tag = '<table id="myTable" class="display"></table>';
  tabla.innerHTML = tag;

  $("#myTable").append('<thead>' + '<tr>' +

    '<th style="width: 150px">Carnet</th>' +
    '<th style="width: 150px">Nombre</th>' +
    '<th style="width: 150px">Fecha</th>' +
    '<th style="width: 80px">Hora Entrada</th>' +
    '<th style="width: 80px">Hora Salida</th>' +
    '<th style="width: 80px">Cantidad Realizada</th>' +
    '<th style="width: 300px">Descripción</th>' +
    '<th style="width: 300px">Funcion</th>' + '</tr>' + '</thead>' + '<tbody>');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {

      const respuesta = xhr.response; // Cambio aquí
      respuesta.forEach(e => {
        if (e.carnet == identificador) {
          $('#myTable').append('<tr>' +

            '<td>' + e.carnet + '</td>' +
            '<td>' + e.name + '</td>' +
            '<td>' + e.date + '</td>' +
            '<td>' + e.eTime + '</td>' +
            '<td>' + e.dTime + '</td>' +
            '<td>' + e.cantHor + '</td>' +
            '<td>' + e.description + '</td>' +
            `<td><button class="btn btn-danger" onclick="deleteRH('${e._id}','${e.carnet}','${e.cantHor}')">Eliminar</button></td>` + // Agregamos el botón de eliminar y llamamos a una función eliminar() pasando el id del elemento
            '</tr>');


        }
        $('#myTable').append('</tbody>');
      });
      $(document).ready(function () {
        $('#myTable').DataTable({
          responsive: true,
          lengthMenu: [10, 25, 50, 100, 1000], // Agrega 1000 a las opciones
          pageLength: 10 // Puedes establecer la longitud de página predeterminada aquí si lo deseas
        });
      });
      tabla.innerHTML += `<div id="cont"><button id="imprimir" onclick="generarPDF('REGISTRO')">PDF</button><button id="expExcel" onclick="exportarExcel('REGISTRO')">Excel</button></div>`;

      seguimientoHoras();
    } else {
      document.getElementById('response').innerHTML =
        `Error: ${xhr.status}, el recurso no se ha encontrado.`;
    }
  });

  xhr.open('GET', 'http://localhost:3000/students');
  xhr.responseType = 'json';
  xhr.send();
}

function getAll() {
  let identificador = sessionStorage.getItem('carnet');
  // Seteo de una tabla de contenidos en el HTML
  const tabla = document.getElementById('response');
  const tag = '<table id="myTable" class="display"></table>';
  tabla.innerHTML = tag;

  $("#myTable").append('<thead>' + '<tr>' +
    '<th style="width: 80px">Id</th>' +
    '<th style="width: 150px">Carnet</th>' +
    '<th style="width: 150px">Nombre</th>' +
    '<th style="width: 150px">Fecha</th>' +
    '<th style="width: 80px">Hora Entrada</th>' +
    '<th style="width: 80px">Hora Salida</th>' +
    '<th style="width: 80px">Cantidad Realizada</th>' +
    '<th style="width: 300px">Descripción</th>' +
    '<th style="width: 300px">Funcion</th>' + '</tr>' + '</thead>' + '<tbody>');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response; // Cambio aquí
      respuesta.forEach(e => {

        $('#myTable').append('<tr>' +
          '<td>' + e._id + '</td>' +
          '<td>' + e.carnet + '</td>' +
          '<td>' + e.name + '</td>' +
          '<td>' + e.date + '</td>' +
          '<td>' + e.eTime + '</td>' +
          '<td>' + e.dTime + '</td>' +
          '<td>' + e.cantHor + '</td>' +
          '<td>' + e.description + '</td>' +
          `<td><button class="btn btn-danger" onclick="deleteRH('${e._id}','${e.carnet}','${e.cantHor}')">Eliminar</button></td>` + // Agregamos el botón de eliminar y llamamos a una función eliminar() pasando el id del elemento
          '</tr>');

        $('#myTable').append('</tbody>');
      });
      $(document).ready(function () {
        $('#myTable').DataTable({
          responsive: true,
          lengthMenu: [10, 25, 50, 100, 1000], // Agrega 1000 a las opciones
          pageLength: 10 // Puedes establecer la longitud de página predeterminada aquí si lo deseas
        });
      });
      tabla.innerHTML += `<div id="cont"><button id="imprimir" onclick="generarPDF('REGISTROS')">PDF</button><button id="expExcel" onclick="exportarExcel('REGISTROS')">Excel</button></div>`;
      seguimientoHoras();
    } else {
      document.getElementById('response').innerHTML =
        `Error: ${xhr.status}, el recurso no se ha encontrado.`;
    }
  });

  xhr.open('GET', 'http://localhost:3000/students');
  xhr.responseType = 'json';
  xhr.send();
}

function generarPDF() {
  const doc = new jsPDF();

  // Título "USUARIO" en la parte superior del PDF
  doc.setFontSize(18);
  doc.text("USUARIO", 105, 20, { align: "center" });

  // Tabla que deseas imprimir en el PDF
  const table = document.getElementById('myTable');

  // Opciones para el formato del PDF
  const options = {
    theme: 'grid'
  };

  // Generar el PDF con la tabla
  doc.autoTable({ html: table, options });

  // Guardar el PDF o abrirlo en una nueva pestaña
  doc.save('tabla_usuarios.pdf');
}

function exportarExcel(nombre) {
  // Tabla que deseas exportar a Excel
  const table = document.getElementById('myTable');

  // Exportar la tabla a Excel
  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const excelFileName = 'tabla_' + nombre + '.xlsx';
  const excelLink = document.createElement('a');
  excelLink.href = URL.createObjectURL(data);
  excelLink.download = excelFileName;
  excelLink.click();
}


