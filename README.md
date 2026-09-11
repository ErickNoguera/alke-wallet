# RappiWallet

Billetera digital básica desarrollada como práctica para el Bootcamp de Talento Digital.
Da dinamismo a las pantallas de inicio de sesión, menú principal, depósito, enviar dinero
y últimos movimientos usando **jQuery**, **Bootstrap 5** y **Local Storage** para persistir
el estado (saldo, transacciones y contactos).

## Pantallas

| Archivo | Descripción |
|---|---|
| `HTML/index.html` | Landing con acceso a iniciar sesión. |
| `HTML/login.html` | Formulario de login manejado con jQuery (`$('#loginForm').submit`), validación y alertas de Bootstrap. |
| `HTML/menu.html` | Muestra el saldo actual y redirige a cada pantalla con una leyenda "Redirigiendo a …". |
| `HTML/deposit.html` | Muestra el saldo, procesa el depósito, deja una leyenda con el monto, alerta de Bootstrap y vuelve al menú tras 2 s. |
| `HTML/sendmoney.html` | Agenda de contactos: alta con validación de CBU, búsqueda por nombre/alias, selección resaltada y confirmación de envío. |
| `HTML/transactions.html` | Lista de movimientos desde Local Storage con filtro por tipo (compra, depósito, transferencia recibida, envío). |

## Estructura

```
HTML/   páginas
CSS/    styles.css (tema propio sobre Bootstrap)
JS/     storage.js (módulo compartido) + un script por pantalla
```

`JS/storage.js` centraliza el acceso a Local Storage y expone `window.RappiWallet`
con helpers: `seedData`, `getSaldo` / `setSaldo`, `getTransacciones` / `addTransaccion`,
`getContactos` / `addContacto`, `requireSesion`, `formatoMoneda`, `getTipoTransaccion`.

## Cómo ejecutar

No requiere instalar nada: es HTML/CSS/JS puro.

- Abrir `HTML/index.html` directamente con doble clic (o "Abrir con" → tu navegador).
- O, si preferís recarga automática al guardar, usar la extensión **Live Server**
  de VS Code haciendo clic derecho sobre `HTML/index.html` → "Open with Live Server".

## Credencial de prueba

- **Usuario:** `demo@wallet.com`
- **Contraseña:** `1234`

Al primer uso se cargan datos de ejemplo: saldo `$10.000`, 3 contactos y 6 movimientos.
Para reiniciar todo, borrar el Local Storage del sitio desde las DevTools del navegador.

## Stack

HTML5 · CSS3 · Bootstrap 5.3 · jQuery 3.7 · Local Storage
