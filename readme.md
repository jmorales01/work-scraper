# WEB SCRAPING DE LA BOLSA DE TRABAJO UTP




### Selección de elementos HTML
Seleccionar por ID
`page.$('#idDelElemento');`
Seleccionar por clase
`page.$('.claseDelElemento');`
Seleccionar por etiqueta
`page.$('p');`
Seleccionar por atributo
`page.$('[data-test="example"]');`
Otras comvinaciones
```
    'button[data-action="submit"]'
```

### Funciones de puppeteer

Capturar pantalla
`page.screenshot({path: 'turuta.png'});`
Escribir en un campo de entrada
`page.type('.campoDeEntrada', 'Texto de ejemplo');`
Click a un boton 
`page.click('button[aria-label="Next page"]');`
Navegar a una URL 
`page.goto('https://example.com');`
Esperar a que un selector esté disponible
`page.waitForSelector('#id');`
Capturar un PDF de la página
`page.pdf({ path: 'page.pdf', format: 'A4' });`
Manejar eventos del teclado
`page.keyboard.press('Enter');`