# SpaceX Launches Dashboard

Mini dashboard desarrollado en React para consultar información de lanzamientos de SpaceX, visualizar detalles, revisar la ubicación en mapa y generar reportes en PDF.

Este proyecto fue realizado como parte de una prueba técnica para la vacante de Desarrollador en Amerisa Logistics.

## Sitio publicado

https://amerisa-spacex-dashboard.vercel.app/

## Funcionalidades

- Consulta de lanzamientos de SpaceX.
- Selector de fuente de datos:
  - JSON local.
  - API pública de SpaceX.
- Tabla con información principal:
  - Nombre.
  - Fecha.
  - Estado.
  - Ubicación.
- Filtro por nombre.
- Filtro por fecha.
- Ordenamiento por columnas.
- Vista de detalle por lanzamiento.
- Visualización de imagen del lanzamiento cuando está disponible.
- Mapa con marcador de la ubicación del sitio de lanzamiento.
- Selección individual de registros.
- Selección masiva de registros visibles.
- Exportación a PDF de uno o varios lanzamientos.
- PDF con resumen, detalle de registros e imágenes cuando el servidor externo permite cargarlas.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- Leaflet
- React Leaflet
- jsPDF
- CSS

## Fuente de datos

La aplicación permite trabajar con dos fuentes de información.

### JSON local

Se incluye un archivo local con datos simplificados de lanzamientos de SpaceX. Esta opción funciona como respaldo y permite consultar la información sin depender de una conexión a la API.

### API SpaceX

También se agregó la opción para consultar lanzamientos desde la API pública de SpaceX.  
Los datos obtenidos desde la API se normalizan para mantener la misma estructura usada por la tabla, la vista de detalle, el mapa y la generación del PDF.

Si ocurre algún error al consultar la API, la aplicación muestra un mensaje y utiliza los datos locales como respaldo.

## Instalación

Clonar el repositorio:

```bash
git https://github.com/legongoraek/amerisa-spacex-dashboard.git
```

## Entrar al proyecto

```bash
cd amerisa-spacex-dashboard
```

## Instalar dependencias

```bash
npm install
```

## Ejecutar en modo desarrollo

```bash
npm run dev
```

## Para generar el build de producción

```bash
npm run build
```

## Para revisar el build localmente

```bash
npm run preview
```

## Componentes principales
- FilterSections

    Contiene los filtros de búsqueda, filtro por fecha y selector de fuente de datos.

- LaunchTable

    Muestra la tabla principal de lanzamientos, permite ordenar, seleccionar registros y abrir/cerrar el detalle.

- LaunchDetail

    Muestra la información extendida del lanzamiento seleccionado, incluyendo imagen, datos principales y opción de exportar a PDF.

- LaunchMap

    Muestra el mapa con la ubicación del lanzamiento usando Leaflet.

- pdfGenerator

    Contiene la lógica para generar el reporte PDF en tamaño carta, evitando cortes de contenido al cambiar de página.

## Consideraciones

El proyecto se enfocó en cubrir los puntos principales solicitados:

- Tabla funcional con filtros y ordenamiento.
- Vista detallada con información adicional.
- Mapa con marcador.
- Exportación a PDF.
- Selección múltiple para exportación.
- Uso de JSON local y API pública.
- README con instrucciones de ejecución.


## Autor

Desarrollado por Luis Enrique Góngora Ek para Amerisa Logistics