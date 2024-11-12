
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
  let registros = 0;

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;
      respuesta.forEach(e => {

        registros = e._id + 1;
        sessionStorage.setItem('registros', registros);
        callback(registros);
      });


    }
  });
  xhr.open('GET', 'https://sistemahoras.herokuapp.com/students');//ruta de conexion
  xhr.responseType = 'json';
  xhr.send();
}
///////////////////Metodo Agregar registro de horas
//Metodo encargado de la insercion de los datos ingresados por parametros hacia la base de datos por medio del JSON con la estructura correspondiente
function postData(date, eTime, dTime, hoursReal, description) {
  if (date == "" || eTime == "" || dTime == "" || hoursReal == "" || description == "") {
    mostrarError("No puede dejar campos vacios :D", "a")
  } else {
    const carnet = sessionStorage.getItem('carnet');//mantener el usuario
    sessionStorage.setItem('hr', hoursReal);
    //Metodo que consulta las horas realizadas
    consultarHoras(carnet);

    //Metodo AI
    cantRegs(function (registros) {

      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro guardado exitosamente!!!',
          showConfirmButton: false,
          timer: 1500
        })
      });

      const obj = {
        _id: registros,
        carnet: carnet,
        date: date,
        eTime: eTime,
        dTime: dTime,
        cantHor: hoursReal,
        description: description
      };



      xhr.open('POST', 'https://sistemahoras.herokuapp.com/students');
      xhr.setRequestHeader('Content-Type', 'application/json');
      let json = JSON.stringify(obj);
      xhr.send(json);
    });
  }
}


///////// Consulta la cantidad de horas que tenga realizadas dentro de la BD
function consultarHoras(carnet) {

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response;
      //se crea una variable de sesion para mantener el dato de la cantidad de horas
      sessionStorage.setItem('horC', respuesta.hoursReal);
      actualizarHorasReal(carnet);
    }
  });
  xhr.open('GET', 'https://sistemahoras.herokuapp.com/user/' + carnet);//acceso al user en cuestion con la concatenacion del id
  xhr.responseType = 'json';
  xhr.send();
}

function validarLogueo(carnet, pass) {

  if (sessionStorage.getItem('carnet') == null) {
    window.location.href = 'index.html';
    console.log("entró el hpta")
  }
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


//cambia la marca/nombre desde la primer interfaz por medio de los datos ingresados por parametros
function actualizarHorasReal(carnet) {

  let horaEntrante = parseInt(sessionStorage.getItem('hr'));//nueva cantidad de horas
  let horaAlmacenada = parseInt(sessionStorage.getItem('horC'));//nueva cantidad de horas

  let nueva = 0;
  nueva = horaEntrante + horaAlmacenada;

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      //llamado a metodos ejecutables
    }
  });
  //consulta PATCH por medio de la ruta "http://127.0.0.1:3000/api" para setear los nuevos valores (stock)
  xhr.open('PATCH', 'https://sistemahoras.herokuapp.com/user/' + carnet);
  xhr.setRequestHeader('Content-Type', 'application/json');
  let json = `{"_id":"${carnet}","hoursReal":"${nueva}"}`
  xhr.send(json);
}

function postUsuario(id, name, secondName, assignedHours, passw) {
  let defect = 0;
  if (id == 0 || name == "" || secondName == "" || assignedHours == "" || passw == "") {
    mostrarError("No puede dehar campos vacios >:(", "s");
  } else {
    let check = document.querySelector('input[id="flexSwitchCheckDefault"]:checked');
    let rol = 0;
    if (check) {
      rol = 1;
    }

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
      hoursReal: defect,//////
      rol: rol,
      password: passw
    };

    xhr.open('POST', 'https://sistemahoras.herokuapp.com/user');
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
  xhr.open('GET', 'https://sistemahoras.herokuapp.com/user/' + carnet);
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
  xhr.open('GET', 'https://sistemahoras.herokuapp.com/user/' + carnet);
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
      if (e.carnet == id){
        limpiarRegsUsuario(e._id)}
           });
    } else {
      mostrarError("Error al realizar la solicitud");
    }
});
  xhr.open('GET', 'https://sistemahoras.herokuapp.com/students');
  xhr.responseType = 'json';
  xhr.send();

}

function limpiarRegsUsuario(id) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {

    }
  });
  //consulta DELETE por medio de la ruta "http://127.0.0.1:3000/api" y concatenando el 'id' para setear los nuevos valores (stock)
  xhr.open('DELETE', 'https://sistemahoras.herokuapp.com/students/' + id);
  xhr.send();
}

//Metodo encargado de eliminar un Usuario especifico ubicandolo por el id ingresado en parametros
function deleteU(id) {
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
          extraerids(id);
          mostrarUsuarios();
        }
      });
      //consulta DELETE por medio de la ruta "http://127.0.0.1:3000/api" y concatenando el 'id' para setear los nuevos valores (stock)
      xhr.open('DELETE', 'https://sistemahoras.herokuapp.com/user/' + id);
      xhr.send();
    }
  });
}

function deleteRH(id, carnet, cantidad) {

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
          get();
        });
      });

      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
          // La solicitud DELETE se realizó correctamente
        }
      });
      // consulta DELETE por medio de la ruta "http://127.0.0.1:3000/api" y concatenando el 'id' para setear los nuevos valores (stock)
      xhr.open('DELETE', 'https://sistemahoras.herokuapp.com/students/' + id);
      xhr.send();
    }
  });
}

function getHorasRTotales(id, callback) {
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
  xhr.open('GET', 'https://sistemahoras.herokuapp.com/user/' + id);
  xhr.responseType = 'json';
  xhr.send();
}

function resteoHoras(carnet, cantidad, horasConsulta, callback) {
  const total = parseInt(horasConsulta) - cantidad;
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      callback();
    }
  });
  xhr.open('PATCH', 'https://sistemahoras.herokuapp.com/user/' + carnet);
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
    '<th style="width: 80px">Horas Relaizadas</th>' +
    '<th style="width: 120px">Horas Asignadas</th>' +
    '<th style="width: 120px">Horas Asignadas</th>' + '</thead>' + '<tbody>');

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      const respuesta = xhr.response; // Cambio aquí
      respuesta.forEach(e => {
        $("#myTable").append('<tr>' +
          '<td>' + e._id + '</td>' +
          '<td>' + e.name + '</td>' +
          '<td>' + e.secondName + '</td>' +
          '<td>' + e.hoursReal + '</td>' +
          '<td>' + e.assignedHours + '</td>' +
          '<td>' + `<button class="btn btn-danger" onclick="deleteU('${e._id}')">Eliminar</button></td>` + '</td>' +
          '</tr>');

      });
      $('#myTable').append('</tbody>');
      $(document).ready(function () {
        $('#myTable').DataTable({
          responsive: true
        });
      });
    } else {
      document.getElementById('response').innerHTML =
        `Error: ${xhr.status}, el recurso no se ha encontrado.`;
    }
  });

  xhr.open('GET', 'https://sistemahoras.herokuapp.com/user/');
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
          responsive: true
        });
      });
    } else {
      document.getElementById('response').innerHTML =
        `Error: ${xhr.status}, el recurso no se ha encontrado.`;
    }
  });

  xhr.open('GET', 'https://sistemahoras.herokuapp.com/students');
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
          responsive: true
        });
      });
    } else {
      document.getElementById('response').innerHTML =
        `Error: ${xhr.status}, el recurso no se ha encontrado.`;
    }
  });

  xhr.open('GET', 'https://sistemahoras.herokuapp.com/students');
  xhr.responseType = 'json';
  xhr.send();
}
