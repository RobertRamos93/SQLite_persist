En la actividad anterior se definieron endpoints para poder realizar operaciones CRUD en nuestro backend desde un cliente. Las operaciones que se realizaban en cada endpoint se guardaban en memoria, lo que hace que los datos sean volátiles.

La presente actividad tiene como objetivo proveer persistencia a los datos de nuestra plataforma de blogging en el backend utilizando SQLite (https://www.sqlite.org/).

Primeramente debemos definir las tablas y las relaciones que deben tener las tablas entre sí. Repasemos los tipos de datos que utilizamos en la plataforma hasta ahora: los usuarios crean publicaciones, las cuales pueden tener comentarios realizados por cualquier persona (no necesariamente usuarios). Recuerda que cada uno de los datos son colecciones en nuestro sistema, por lo que debemos poder identificar cada recurso dentro de cada colección. También debemos poder relacionar recursos de una colección con recursos de otra colección. Por ejemplo, una publicación tiene un id de publicación, pero también tiene un userId que indica el ID del usuario que creó la publicación.

Primera actividad: define el esquema de las tablas que vas a utilizar en el sistema. Si el esquema no es el adecuado vas a tener que refactorizar en el futuro, por lo que es deseable que desde el inicio el esquema sea lo más cercano posible a la versión final.

Segunda actividad: implementa el esquema en SQLite. Crea un script que permita inicializar la base de datos en tu proyecto. Dicho script debe ser llamado solamente al momento de crear la base de datos. El script debe crear las tablas.

Tercera actividad: persistencia de datos. Utiliza la librería de SQLite (https://www.sqlitetutorial.net/sqlite-nodejs/connect/) en cada uno de tus endpoints para almacenar los datos en tu base de datos. Si todo funciona correctamente, cuando se reinicie el proyecto ya no será necesario inicializar la base de datos ni crear nuevamente los datos como anteriormente lo realizábamos.

Provee evidencias de cada una de las actividades. De ser posible, incluye también el repositorio con el proyecto.
