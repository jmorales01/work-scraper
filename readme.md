# Web scraping para y bot de discord 🤖

Este proyecto combina web scraping y un bot de Discord utilizando DiscordJS y Puppeteer. El bot puede interactuar con los usuarios en un servidor de Discord y realizar tareas automatizadas en la web, como extraer información de sitios web y proporcionar respuestas basadas en esos datos.

## Estadísticas del Repositorio 📊

![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![GitHub stars](https://img.shields.io/github/stars/jmorales01/hackaton-devs-404)
![GitHub PRs](https://img.shields.io/github/issues-pr/jmorales01/hackaton-devs-404)
![GitHub forks](https://img.shields.io/github/forks/jmorales01/hackaton-devs-404)
![GitHub issues](https://img.shields.io/github/issues/jmorales01/hackaton-devs-404)


## Tecnologías Utilizadas 💻

- **MySQL** (v8.0.27) [![MySQL](https://img.icons8.com/color/48/000000/mysql.png)](https://www.mysql.com/)
- **Node.js** (v14.17.5) [![Node.js](https://img.icons8.com/color/48/000000/nodejs.png)](https://nodejs.org/)
- **npm** (v7.24.0) [![npm](https://img.icons8.com/color/48/000000/npm.png)](https://www.npmjs.com/)
- **Docker** (v20.10.8) [![Docker](https://img.icons8.com/color/48/000000/docker.png)](https://www.docker.com/)
- **DiscordJS** (v14.15.3) [![DiscordJS](https://img.icons8.com/color/48/000000/discord-logo.png)](https://discord.js.org/)
- **Puppeteer** (v22.11.0) [![Puppeteer](https://img.icons8.com/color/48/000000/chrome.png)](https://pptr.dev/)


## Instalación y Configuración 🛠️

Siga los siguientes pasos para configurar el proyecto localmente:


1. **Instalar Node.js y npm**: Si aún no tienes Node.js y npm instalados en tu máquina, puedes descargarlos e instalarlos desde [nodejs.org](https://nodejs.org/).
2. Clone el repositorio:
   ```bash
   https://github.com/jmorales01/work-scraper.git
   ```
3. Navegue al directorio del proyecto:
4. Instale las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Ejecute el proyecto:
   ```bash
   npm start
   ```

¡Ahora deberías tener el proyecto en funcionamiento en tu máquina local! 🚀


## Puppeteer

- **Selección de elementos HTML:**
   - Seleccionar por ID `page.$('#idDelElemento');`
   - Seleccionar por clase `page.$('.claseDelElemento');`
   - Seleccionar por etiqueta `page.$('p');`
   - Seleccionar por atributo `page.$('[data-test="example"]');`
   - Otras comvinaciones
   ```
      'button[data-action="submit"]'
   ```

- **Funciones de puppeteer:**
   - Capturar pantalla `page.screenshot({path: 'turuta.png'});`
   - Escribir en un campo de entrada `page.type('.campoDeEntrada', 'Texto de ejemplo');`
   - Click a un boton  `page.click('button[aria-label="Next page"]');`
   - Navegar a una URL  `page.goto('https://example.com');`
   - Esperar a que un selector esté disponible `page.waitForSelector('#id');`
   - Capturar un PDF de la página `page.pdf({ path: 'page.pdf', format: 'A4' });`
   - Manejar eventos del teclado `page.keyboard.press('Enter');`


## Licencia 📄

Este proyecto está bajo la licencia MIT. Consulte el archivo [LICENSE](LICENSE) para más detalles.

## Donaciones 💰

Si te gusta mi trabajo y quieres apoyarme, ¡considera hacer una donación! Tu apoyo es muy apreciado. 🙏

[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue?style=for-the-badge&logo=paypal)](https://paypal.me/jmoralesv24?country.x=PE&locale.x=es_XC)

Gracias por tu generosidad y por apoyar mi trabajo. 🎉




   




---

## ¡Gracias por visitar mi repositorio! 🌟🧑‍💻

---
<div align="center">
  <img src="./public/img/image-build.png">
  <img src="./public/img/message-discord.png">
</div>