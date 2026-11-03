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
- Pestañas de información, actividades, entregables y desarrollo.
- Búsqueda por temporadas y capítulos.
- Quince escenas de Figma convertidas a HTML y CSS, con animaciones.
- Reproducir/pausar, saltos de diez segundos, avance, subtítulos y pantalla completa.
- Acceso a las actividades de cada escena, capítulos completados y opción de continuar.
- Diseño adaptable y soporte para reducir movimiento desde la configuración del sistema.
- Imágenes, vectores y tipografía incluidos localmente; sin recursos temporales de Figma en ejecución.

## Cómo funciona la reproducción

Figma contiene diseños de reproductor e ilustraciones, no archivos de video. Por eso cada capítulo se implementa como una **escena interactiva animada de 60 segundos**, con actividades que se destacan durante el recorrido. No incluye narración ni pistas de audio. Los controles operan sobre esas escenas.

El acceso es por perfiles locales, como en el diseño. No es un sistema de autenticación con contraseña. No hay servidor de usuarios ni base de datos. El progreso y las actividades marcadas se guardan en `localStorage`, separados por perfil. No se envían datos a servicios externos.

## Editar el proyecto

| Archivo | Contenido |
| --- | --- |
| `index.html` | Documento de entrada y archivos de la aplicación |
| `styles.css` | Diseño adaptable, componentes, estados y animaciones |
| `app.js` | Rutas, búsqueda, perfiles, pestañas, reproducción y progreso |
| `content.js` | Textos y actividades de los quince capítulos; referencias a los nodos de Figma |
| `metadata.js` | Temporadas, colores, recursos y carta de misión |
| `scenes.js` | Estructuras HTML de las escenas originales |
| `previews.js` | Estructuras HTML de las vistas previas originales |
| `scenes.css` | Estilos de las composiciones de Figma |
| `assets/` | Recursos locales del proyecto |
| `server.js` | Servidor opcional para desarrollo local con Node.js |

Los textos principales se conservaron del diseño. Las pestañas sin contenido específico final en Figma se organizan a partir de las actividades disponibles de cada capítulo. Puedes definir `deliverables` (lista) y `development` (texto) en cada episodio de `content.js` para personalizarlas.

Las ilustraciones mantienen el lienzo 1920 × 1080 de Figma y se escalan conservando sus proporciones. En pantallas pequeñas, la información y las actividades también se muestran debajo de la escena para facilitar la lectura.

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
