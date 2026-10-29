# Prueba técnica – Login + CRUD de usuarios

Aplicación Full Stack con autenticación de usuarios y mantenimiento (CRUD).

| Capa | Tecnología |
|---|---|
| Backend | Java 17 · Spring Boot 3.3 · Spring Security · JPA · JWT |
| Frontend | Angular 21 |
| Base de datos | MySQL 8 |

############# Estructura del repositorio#################

backend/     API REST (Spring Boot)
frontend/    Aplicación Angular
database/    script.sql
README.md


############# Requisitos previos#####################
- JDK 17+ y Maven 3.9+
- Node.js 20+ (probado con 24) y Angular CLI: `npm install -g @angular/cli`
- MySQL 8+

############## Ejecución ########################

------------------ 1. Base de datos -----------------

Ejecuta el script en MySQL (Workbench o consola):

"""""bash""""
mysql -u root -p < database/script.sql
Crea la base `prueba_db` y la tabla `usuarios` (id, username, email, password, estado, fecha_creacion).

o abrir block de notas, click en el nuevoscript y copiar el script luego ejecutar.

Se crea el Schema y la tabla.


VISUAL STUDIO CODE

------------------    2. Backend    -------------------------

Abre "backend/src/main/resources/application.properties" y 

ajusta "spring.datasource.username" y "spring.datasource.password" con tus credenciales de MySQL. <====> usuario y contraseña del Schema (Base de datos) 

>>>>>>>>>>  verificar puerto  <<<<<<<<<<< 

Luego:

terminal bash

cd backend

mvn spring-boot:run



La API queda en `http://localhost:8080`.  NOta : Al arrancar, si la tabla está vacía, crea el usuario inicial:


| Usuario | admin |

| Contraseña | Admin123* |



----------------   3. Frontend   ----------------------


terminal bash (abrir uno nuevo)

     cd frontend

     npm install

     ng serve


Abre http://localhost:4200`.

nota : La URL de la API se configura en `src/app/services/auth.service.ts` (constante `API_URL`).

#################### Endpoints #########################

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | /api/auth/login | No | Devuelve el token JWT |
| POST | /api/users | Sí | Crea usuario (201) |
| GET | /api/users | Sí | Lista usuarios |
| GET | /api/users/{id} | Sí | Obtiene un usuario |
| PUT | /api/users/{id} | Sí | Actualiza (la contraseña es opcional) |
| DELETE | /api/users/{id} | Sí | Elimina (204) |

>>>>>>>>>>>>>>>>> Las rutas protegidas requieren el header `Authorization: Bearer <token>`. <<<<<<<<<<<<<<<<<<<<<<<<<<<<


Ejemplo de login:

bash cmd : 

curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"Admin123*\"}"




## Manejo de errores HTTP
| Código | Caso |
|---|---|
| 400 | Datos inválidos o cuerpo mal formado |
| 401 | Credenciales o token inválido/vencido |
| 403 | Usuario inactivo |
| 404 | Usuario no encontrado |
| 409 | Username o email duplicado |
| 500 | Error interno |

Formato de respuesta: `{ timestamp, status, error, message, details }`.

## Dónde está cada requisito del frontend
Rutas dentro de `frontend/src/app/`:

| Requisito | Archivo |
|---|---|
| Login | `pages/login/login.component.ts` |
| Listado de usuarios | `pages/users/users.component.ts` |
| Crear / Editar usuario | `pages/user-form/user-form.component.ts` |
| Formularios reactivos | `FormBuilder` + `Validators` en login y user-form |
| Guards de rutas protegidas | `guards/auth.guard.ts`, aplicado con `canActivate` en `app.routes.ts` |
| Token en cada petición / cierre de sesión ante 401 | `interceptors/auth.interceptor.ts` |

######################## Cómo verificar el funcionamiento ###########################

1. Inicia sesión con `admin` / `Admin123*`: debe mostrar el listado.
2. Con una contraseña incorrecta: debe mostrar un mensaje de error.
3. Crea un usuario, edítalo (contraseña vacía = se conserva) y elimínalo.
4. Intenta crear otro usuario con el mismo username o email: debe mostrar el error de duplicado.
5. Pulsa *Salir* y escribe `http://localhost:4200/users`: el guard te devuelve al login.

################## Decisiones técnicas ##################
- Contraseñas hasheadas con BCrypt; la API nunca devuelve el hash.
- Autenticación stateless con JWT (1 hora """""esto se puede modificar a pedido"""""""" , configurable en `application.properties`).
- Backend por capas: controller → service → repository, con DTOs, validaciones (`@Valid`) y un manejador global de excepciones.
- CORS limitado al origen del frontend (`http://localhost:4200`).
- Interfaz con la identidad visual de BeConsult (tema azul marino, animaciones sutiles).
- Fuera de alcance: roles, despliegue productivo y tests automatizados (opcionales).
- Para producción, el secreto JWT y las credenciales de la base deberían ir en variables de entorno.
"# Prueba-tecnica" 
