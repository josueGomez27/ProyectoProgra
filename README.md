Aquí tienes el `README.md` completo listo para copiar y pegar:

# Proyecto Turismo Local

![CI](https://github.com/josueGomez27/ProyectoProgra/actions/workflows/ci.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=josueGomez27_ProyectoProgra\&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=josueGomez27_ProyectoProgra)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=josueGomez27_ProyectoProgra\&metric=coverage)](https://sonarcloud.io/summary/new_code?id=josueGomez27_ProyectoProgra)
[![Duplications](https://sonarcloud.io/api/project_badges/measure?project=josueGomez27_ProyectoProgra\&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=josueGomez27_ProyectoProgra)
![License](https://img.shields.io/badge/license-MIT-green)

## Descripción del proyecto

Proyecto Turismo Local es un sistema web desarrollado para mostrar y administrar lugares turísticos de diferentes pueblos.
El sistema permite visualizar lugares en una lista y en un mapa interactivo, filtrar información, iniciar sesión con Google, administrar lugares, subir imágenes, generar códigos QR y revisar la calidad del código mediante SonarCloud.

El proyecto fue desarrollado como parte del curso de Programación, utilizando una arquitectura separada entre frontend, backend y base de datos.

---

## Tecnologías utilizadas

### Frontend

* React
* Vite
* React Router
* Axios
* Bootstrap / CSS
* React Leaflet
* i18next

### Backend

* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security OAuth2
* Maven
* MySQL Driver
* Lombok
* Validation
* JaCoCo
* SonarCloud

### Base de datos

* MySQL
* Railway Database

### Servicios externos

* Google OAuth 2.0
* Cloudinary
* GitHub Actions
* SonarCloud
* Railway
* Vercel

---

## Funcionalidades principales

* Visualización de lugares turísticos por pueblo.
* Vista en lista y vista en mapa interactivo.
* Marcadores personalizados por categoría.
* Búsqueda dinámica por nombre, dirección, descripción o categoría.
* Filtro por categoría.
* Ordenamiento por nombre, categoría o fecha de creación.
* Conteo dinámico de resultados visibles.
* Persistencia de filtros mediante query params.
* Login con Google OAuth 2.0.
* Panel administrativo.
* Gestión de pueblos.
* Gestión de lugares turísticos.
* Gestión de usuarios y roles.
* Generación de códigos QR por pueblo.
* Carga de imágenes con Cloudinary.
* Auditoría mínima con fecha de creación, fecha de modificación y autor.
* Pipeline CI/CD con GitHub Actions.
* Análisis de calidad con SonarCloud.

---

## Estructura del proyecto

```text
ProyectoProgra/
│
├── turismo-local-frontend/       # Frontend desarrollado con React + Vite
│
├── turismolocal/                 # Backend desarrollado con Spring Boot
│
├── .github/
│   └── workflows/
│       └── ci.yml                # Pipeline CI/CD
│
├── sonar-project.properties      # Configuración de SonarCloud
│
└── README.md
```

---

## Frontend

El frontend fue desarrollado con React y Vite.
Se encarga de mostrar la interfaz del usuario, consumir los endpoints del backend y permitir la navegación dentro del sistema.

Entre sus responsabilidades están:

* Mostrar los pueblos disponibles.
* Mostrar los lugares turísticos de cada pueblo.
* Permitir cambiar entre vista lista y vista mapa.
* Aplicar búsqueda, filtros y ordenamiento.
* Mostrar los marcadores en el mapa.
* Enviar imágenes al backend para subirlas a Cloudinary.
* Administrar lugares, pueblos y usuarios desde el panel administrativo.

---

## Backend

El backend fue desarrollado con Spring Boot.
Se encarga de manejar la lógica del sistema, la conexión con la base de datos, la seguridad, los códigos QR, la carga de imágenes y los endpoints REST.

Entre sus responsabilidades están:

* Gestionar pueblos.
* Gestionar lugares turísticos.
* Gestionar categorías.
* Gestionar usuarios.
* Generar códigos QR.
* Recibir imágenes y subirlas a Cloudinary.
* Manejar autenticación con Google OAuth 2.0.
* Guardar datos de auditoría.
* Exponer la API REST para el frontend.

---

## Base de datos

El sistema utiliza MySQL como base de datos principal.

Tablas principales:

* `users`
* `towns`
* `places`
* `categories`
* `place_images`
* `qr_codes`

La base de datos almacena la información de los pueblos, lugares turísticos, categorías, usuarios, imágenes y códigos QR.

---

## Cloudinary

Cloudinary se utiliza para almacenar imágenes en la nube.

Flujo implementado:

1. El administrador selecciona una imagen en el frontend.
2. React envía la imagen al backend usando `FormData`.
3. Spring Boot recibe el archivo como `MultipartFile`.
4. El backend sube la imagen a Cloudinary.
5. Cloudinary devuelve una URL segura.
6. La URL se guarda en el campo `imageUrl`.
7. MySQL almacena solo el enlace de la imagen, no el archivo completo.

---

## Auditoría mínima

El sistema guarda información básica de auditoría en los registros principales.

Campos implementados:

* `createdAt`: fecha de creación.
* `updatedAt`: fecha de última modificación.
* `createdBy`: usuario que creó el registro.

Esta información permite conocer quién creó un registro y cuándo fue creado o modificado.

---

## CI/CD con GitHub Actions

El proyecto cuenta con un pipeline de integración continua mediante GitHub Actions.

El pipeline se ejecuta cuando hay un `push` o `pull request` hacia las ramas:

* `main`
* `master`
* `develop`

El pipeline realiza las siguientes tareas:

### Frontend

* Descarga el repositorio.
* Configura Node.js.
* Instala dependencias con `npm ci`.
* Ejecuta el linter con `npm run lint`.
* Construye el frontend con `npm run build`.

### Backend

* Descarga el repositorio.
* Configura Java.
* Ejecuta pruebas con `mvn clean verify`.
* Genera reporte de cobertura con JaCoCo.
* Envía el análisis a SonarCloud.

---

## SonarCloud

SonarCloud se integró para analizar automáticamente la calidad del código.

El archivo `sonar-project.properties` define:

* La clave del proyecto.
* La organización de SonarCloud.
* Las carpetas del frontend y backend.
* La ubicación de las pruebas.
* La ubicación del reporte de cobertura generado por JaCoCo.
* Exclusiones de carpetas como `node_modules`, `target` y `dist`.

SonarCloud permite revisar:

* Quality Gate.
* Cobertura.
* Duplicación de código.
* Seguridad.
* Confiabilidad.
* Mantenibilidad.

---

## Ejecución del frontend

Para ejecutar el frontend en modo desarrollo:

```bash
cd turismo-local-frontend
npm install
npm run dev
```

---

## Ejecución del backend

Para ejecutar el backend:

```bash
cd turismolocal
mvn spring-boot:run
```

---

## Pruebas del backend

Para ejecutar las pruebas y generar cobertura:

```bash
cd turismolocal
mvn clean verify
```

---

## Despliegue

El proyecto fue desplegado utilizando:

* Vercel para el frontend.
* Railway para el backend.
* Railway MySQL para la base de datos.

---

## Variables de entorno principales

### Backend

```text
DB_URL
DB_USER
DB_PASSWORD
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Frontend

```text
VITE_API_URL
```

### GitHub Actions

```text
SONAR_TOKEN
```

---

## Integrantes

* Josue Gómez
* Tammy Rosales
* Melany Rosales
* Adrian

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.
