# Proyecto Final

El diseño de la arquitectura es HTML ON WIRE (en progreso). Algunos controladores mantienen todavía DATA ON WIRE.

## Inicialización del servidor

Ejecutar `npm start` encender el servidor. Los variables de entorno necesarias se especifican en el archivo envSample.txt

## Rutas

Todas las rutas que empiezan con `"/api"` son las que se encargan de hacer los procesos del modelo de negocio con la base de datos.

### Vistas

`"/"` Esta ruta principal muestra el página index.ejs que se encarga de:

1. Si el usuario esta autenticado (passport local). Si esta autenticado accede al Dao de usuarios para obtener mediante ID el ususario y poder mostrar la información. Además obtiene el carrito asociado al ususario
2. Si el ususario es administrador va a poder tener acceso al panel de administrador donde allí puede gestionar ususarios y productos. En este caso, no busca un carrito asociado al administrador.
3. Si no esta autenticado accede a los productos mediante el dao de productos y lo muestra en pantalla. Si se quiere agregar un producto al carrito en este caso se lo redirecciona a la pantalla de login.

`"/login-register"` Aca el usuario puede generar tanto un login como un registrarse en el sitio. El registro hace uso del controlador `"/api/user/auth/register"` enviando los datos al Dao de ususario.

`"/admin-panel/:action"` Esta ruta tiene acceso solo si el ususario es administrador. Si lo es lo devuelve a la ruta principal `"/"`. El params action representa en que se va a trabajar ya sea ususarios o productos. Las dos posibilidades son "users" y "products".

- Action === "users" hace uso de Dao de usuarios para obtener todos los ususarios. Por el momento desde esta vista se puede solo borrar un usuario mediante su api `"/api/user/delete"`
- Action === "products" hace uso de Dao de productos para obtener todos los productos. Por el momento desde esta vista solo se puede borrar un producto mediante su api `"/api/products/delete"`.

### APIs

#### Productos

**Base URL** `"/api/productos"`

**GET** `"/"` Obtiene todos los productos. Su respuesta es en formato JSON

**GET** `"/:id"` Recibe el id del producto en la url como parámetro y devuelve el producto. Su respuesta es en formato JSON.

**POST** `/` Agrega un producto a la base de datos. Los campos obligatorios son:

- "name"
- "price"
- "image : URL a una imagen" // No esta implementada la subida de un archivo en este caso
- "description"

Como opcional puede recibir:

- "onSale: default en false"
- "stock: default en 0"
  Su respuesta es en formato JSON

  **PUT** `"/:id"` Recibe el ID y actualiza el producto recibido mediante el body.
  Su respuesta es en formato JSON

  **DELETE** `/delete` Recibe mediante el body el id o algun filtro para encontrar un producto y eliminarlo. Se recomienda usar el ID. Redirecciona a alguna vista por que ya esta implementado dentro del modelo HTML ON WIRE

#### Usuarios

**Base URL** `"/api/user"`

**DELETE** `"/delete"` Elimina un usuario de la base de datos. Recibe el ID mediante el body de la petición. Redirecciona a la página desde la que se lo llamo por que ya esta implementado dentro del modelo HTML ON WIRE.

**POST** `"/auth/register"` Registra un usuario en la base de datos. Los campos obligatorios son:

- "name"
- "lastname"
- "age"
- "username" && unique
- "email" && unique
- "address"
- "phone"
- "password"

  Los campos opcionales:

- "photo": default imagen genérica de usuario.

Como respuesta redirecciona a la página `"/login-register"` para que el ususario se autentique. Esta implementado en HTML ON WIRE.

**POST** `"/auth/login"` Autentica el ususario en la app. Usa como dependencia passport local. Recibe en el body "username" y "password". Como respuesta redirecciona a la página principal `"/"`.

**POST** `"/auth/logout"` Des-loggea al ususario. De hacer esto se encarga passport local.

#### Carrito

Todas las rutas excepto `"/:id/purchase"` devuelven JSON por que todavia no fueron implementadas en HTML ON WIRE.

Base URL `"/api/carrito"`

**POST** `"/"` Crea un carrito. Se le debe pasar por el body un parámetro \_id con el valor de id del usuario por que el carrito creado es asociado a un usuario. Los valores del carrito son creados por el servidor.

**POST** `"/:id/productos/idProducto"` Agrega un producto al carrito de compras.

**POST** `"/:id/purchase"` :id del carrito. Como respuesta en caso de ir bien redirecciona a la página principal. Se encarga de vaciar el carrito, enviar notificacion mediante nodemailer y mensaje de whatsapp con twilio.

**GET** `"/:id/productos"` :id del carrito. Obtiene todos los productos del carrito.

**DELETE** `"/:id"` :id del carrito. Elimina el carrito entero.

**DELETE** `"/:id/productos/:idProducto"` Elimina un producto de un carrito.

## Variables de entorno.

En el archivo envSample.txt se pueden ver las necesarias para que la aplicación funcione como se espera.

## Prueba con artillery

Se hizo pruebas en modo cluster y fork con el usuario ya autenticado sobre la ruta principal `"/"` de vistas por que ese controlador es quien se encarga de hacer una petición a la base de datos para traer todos los productos. Los resultados estan en sus respectivos txt result_cluster.txt y result_fork.txt. Se puede ver ahi que la media de respuesta en modo cluster es mucho mas alta.
