/*
 * login.js — Maneja el formulario de inicio de sesión con jQuery.
 * Credencial demo fija y alertas de Bootstrap para el feedback.
 */
$(function () {
  "use strict";

  var RW = window.RappiWallet;
  RW.seedData();

  var CREDENCIAL = { email: "demo@wallet.com", password: "1234" };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /** Inserta una alerta de Bootstrap en #alert-container (reemplaza la anterior). */
  function mostrarAlerta(tipo, mensaje) {
    var $alerta = $(
      '<div class="alert alert-' + tipo + ' alert-dismissible fade show" role="alert">' +
        '<span></span>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>' +
      "</div>"
    );
    $alerta.find("span").text(mensaje);
    $("#alert-container").empty().append($alerta);
  }

  $("#loginForm").submit(function (e) {
    e.preventDefault();

    var email = $("#email").val().trim();
    var password = $("#password").val();

    if (email === "" || password === "") {
      mostrarAlerta("danger", "Completá el correo y la contraseña.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      mostrarAlerta("danger", "El formato del correo no es válido.");
      return;
    }
    if (email !== CREDENCIAL.email || password !== CREDENCIAL.password) {
      mostrarAlerta("danger", "Credenciales incorrectas. Probá con demo@wallet.com / 1234.");
      return;
    }

    RW.iniciarSesion();
    mostrarAlerta("success", "¡Bienvenido! Redirigiendo al menú principal…");
    setTimeout(function () {
      window.location.href = "menu.html";
    }, 1200);
  });
});
