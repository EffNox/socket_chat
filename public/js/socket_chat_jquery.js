var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
function rendedirzarUsuarios(personas) {
    console.log(personas);
    var html = '';
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';
    for (let i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '   <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += ' </li>';
    }
    divUsuarios.html(html);
}
divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});
function renderizarMensajes(mensaje, yo) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.toLocaleString('en-PE', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') adminClass = 'danger';

    if (yo) {
        html += '<li class="reverse">'
        html += '    <div class="chat-content">'
        html += '        <h5>' + mensaje.nombre + '</h5>'
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>'
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += ' <li class="animated fadeInLeft">';
        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />';
        }
        html += '     </div>';
        html += '     <div class="chat-content">';
        html += '         <h5>' + mensaje.nombre + '</h5>';
        html += '         <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '     </div>';
        html += '     <div class="chat-time">' + hora + '</div>';
        html += ' </li>';
    }

    divChatbox.append(html);
}


function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');
    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


formEnviar.on('submit', function (e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) return;
    socket.emit('crearMensaje', {
        nombre,
        mensaje: txtMensaje.val(),
    }, (rs) => {
        txtMensaje.val('').focus();
        renderizarMensajes(rs, true);
        scrollBottom();
    });

})
