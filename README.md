# UXFLIX · De la idea a la experiencia

Sitio estático construido a partir de la página **Políticas** de E.-Netflix, secciones INICIO, PESTAÑAS, Section 2 y Section 1.

## Probar en Visual Studio Code

1. Extrae **todo** el ZIP en una carpeta. No ejecutes el proyecto dentro del archivo comprimido.
2. En VS Code, selecciona **Archivo → Abrir carpeta** y abre `uxflix`.
3. Abre `index.html` con la extensión **Live Server** (clic derecho → Open with Live Server).
4. Selecciona un perfil, acepta la carta y comienza el recorrido.

También puedes abrir `index.html` directamente con Chrome o Edge. Para conservar el progreso de forma estable, usa siempre el mismo navegador y la misma dirección de Live Server.

### Alternativa con Node.js

No hay paquetes que instalar. Desde la terminal, dentro de `uxflix`:

```sh
npm start
```

Abre `http://localhost:5173`. Para detenerlo usa `Ctrl+C`.

## Incluye

- Introducción animada y selección de perfiles; creación de perfiles locales.
- Carta de misión con los nueve protocolos.
- Inicio y seis temporadas con sus quince capítulos.
- Información y entregables de las seis fases, organizados por capítulo.
- Modales compactos con vista previa, actividades, entregables y consejo de Wiri.
- Descarga local de una guía PDF para cada uno de los quince episodios.
- Quince portadas locales, incluidas las de los tres capítulos de la temporada 1, utilizadas en los listados y en sus ventanas.
- Búsqueda por temporadas y capítulos.
- Quince capítulos animados basados en las 60 políticas del texto de la metodología.
- Reproducir/pausar, saltos de diez segundos, avance, subtítulos y pantalla completa.
- Acceso a las actividades de cada escena, capítulos completados y opción de continuar.
- Diseño adaptable y soporte para reducir movimiento desde la configuración del sistema.
- Imágenes, vectores y tipografía incluidos localmente; sin recursos temporales de Figma en ejecución.

## Cómo funciona la reproducción

Cada capítulo es una **escena interactiva animada**: presenta la pregunta del paso, recorre sus cuatro políticas y cierra con un consejo de Wiri. La duración se calcula según la extensión de los textos para dar tiempo a leerlos. Las tarjetas y los subtítulos se sincronizan con el avance, y cada política permite saltar a su segmento. No incluye narración ni pistas de audio.

El acceso es por perfiles locales, como en el diseño. No es un sistema de autenticación con contraseña. No hay servidor de usuarios ni base de datos. El progreso y las actividades marcadas se guardan en `localStorage`, separados por perfil. No se envían datos a servicios externos.

## Editar el proyecto

| Archivo | Contenido |
| --- | --- |
| `index.html` | Documento de entrada y archivos de la aplicación |
| `styles.css` | Diseño adaptable, componentes, estados y animaciones |
| `app.js` | Rutas, búsqueda, perfiles, pestañas, reproducción y progreso |
| `content.js` | Políticas y reglas de la fuente; objetivos, actividades, entregables y consejos de los quince capítulos |
| `metadata.js` | Información y criterios de salida de las seis fases, colores, recursos y carta de misión |
| `methodology-source.txt` | Texto de referencia de la metodología compartido por el usuario |
| `episode-scenes.js` | Escenas generadas a partir del contenido de cada capítulo |
| `episode-scenes.css` | Diseño y animaciones de los capítulos |
| `compact-previews.js` | Ilustraciones locales de los cinco modales compactos de Figma |
| `compact-motion.css` | Animaciones de Figma de las vistas previas, con soporte para reducir movimiento |
| `assets/pdf/` | Guías descargables de los quince episodios |
| `assets/covers/` | Portadas de los quince episodios |
| `scripts/build-pdfs.py` | Regenera las guías a partir del contenido actual |
| `scripts/build-covers.cjs` | Regenera las portadas locales |
| `scripts/cover-template.js` y `scripts/cover-template.css` | Composición de las portadas; conserva las ilustraciones de Figma de los episodios 4–8 |
| `assets/` | Recursos locales del proyecto |
| `server.js` | Servidor opcional para desarrollo local con Node.js |

Las políticas y las reglas de negocio de `content.js` conservan los códigos y el texto de `methodology-source.txt`. Los objetivos, las actividades, los entregables y los criterios de salida se derivan de esa fuente. Los consejos de Wiri explican las reglas sin mostrar paneles RN. El primer tramo dura de 2 a 4 días; el plazo de 2 a 4 días del SOW solo corresponde al paso 11.

Al seleccionar un episodio se abre su modal compacto. Las pestañas **Acerca del capítulo**, **Actividades** y **Entregables** permiten consultar la información en la misma ventana; **Descargar PDF** guarda su guía. Los enlaces `#episodio/4` abren ese modal. Las direcciones antiguas de detalle redirigen al modal compacto.

Para regenerar las guías después de editar el contenido, instala `reportlab` en tu entorno de Python y ejecuta `python scripts/build-pdfs.py`. Esta dependencia solo se usa al generar los archivos; el sitio sigue funcionando sin instalar paquetes.

Las portadas se indican en el campo `cover` de cada capítulo. Para regenerarlas, inicia el sitio y ejecuta `node scripts/build-covers.cjs` en un entorno de autoría con Playwright y Chrome. El script admite `UXFLIX_PLAYWRIGHT_MODULE`, `UXFLIX_CHROME_EXECUTABLE` y `UXFLIX_BASE_URL` para configurar ese entorno. Las imágenes generadas funcionan sin estas herramientas al abrir el proyecto.

Las escenas usan un lienzo de 1920 × 1080 y se escalan conservando sus proporciones. Las políticas completas, la información del capítulo y sus entregables también se muestran debajo del reproductor para facilitar la lectura en pantallas pequeñas. Los archivos `scenes.js`, `previews.js` y `scenes.css` se conservan como referencia del diseño anterior y ya no se cargan en la aplicación.

## Atajos del reproductor

- **Espacio:** reproducir/pausar.
- **← / →:** retroceder/adelantar diez segundos.
- **C:** mostrar/ocultar subtítulos.
- **F:** pantalla completa.
- **Esc:** salir de pantalla completa o cerrar un diálogo.

La pantalla completa depende del soporte del navegador. El borrado de los datos del sitio elimina el progreso local.

## Origen

[Figma · E.-Netflix · Políticas](https://www.figma.com/design/evO80o2PubzgJmFQPUWt0e/E.-Netflix?node-id=0-1)

Proyecto preparado para ejecutar y editar localmente. No requiere React, Tailwind, Java ni un proceso de compilación.
