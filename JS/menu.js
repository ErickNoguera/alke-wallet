/*
 * menu.js — Menú principal: muestra el saldo y redirige a cada pantalla
 * mostrando antes una leyenda "Redirigiendo a …".
 */
$(function () {
  "use strict";

  var RW = window.RappiWallet;
  RW.seedData();
  RW.requireSesion();

  // Saldo actualizado desde Local Storage.
  $("#saldo").text(RW.formatoMoneda(RW.getSaldo()));

  var DESTINOS = {
    "btn-depositar": { nombre: "Depositar", url: "deposit.html" },
    "btn-enviar": { nombre: "Enviar dinero", url: "sendmoney.html" },
    "btn-movimientos": { nombre: "Últimos movimientos", url: "transactions.html" }
  };

  $("#btn-depositar, #btn-enviar, #btn-movimientos").on("click", function () {
    var destino = DESTINOS[this.id];
    $("#leyenda").text("Redirigiendo a " + destino.nombre + "…");
    setTimeout(function () {
      window.location.href = destino.url;
    }, 800);
  });

  $("#btn-cerrar-sesion").on("click", function () {
    RW.cerrarSesion();
    window.location.href = "login.html";
  });
});
