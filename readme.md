Creando mi primera API siguiendo el curso de Mastermind "Desde 0 hasta maestro - Creando el backend con Node JS". [Certificado de haber finalizado el curso](https://www.mastermind.ac/certificates/7irenrnmlp).

# Despliegue
Para desplegar el sistema en local es necesario crear un archivo `.env` en el que se declaren las siguientes constantes:
- NODE_ENV. Esta determinará el entorno en el que nos encontramos y el nombre de la base de datos a la que se conecta (para las pruebas es "test")
- JWT_SECRET_KEY. Clave necesaria para el cifrado y descifrado de los tokens
- DB_USER_NAME. Nombre del usuario de la base de datos
- DB_USER_PASSWORD. Nombre del usuario de la base de datos
- DB_CLUSTER. Identificador del cluster de la base de datos de Mongo Atlas

Es decir, es necesario crear una base de datos a través de la plataforma Mongo Atlas, o bien modificar el archivo de configuración `database.js` para que la conexión sea local.

# Scripts
`npm run start` Despliega el servidor en el puerto 3000 de la máquina.

`npm run start-dev` Despliega el servidor en el puerto 3000, pero se emplea nodemon para no tener que parar y arrancar el servidor de nuevo con cada cambio.

`npm run test` Se lanzan todos los test de integración desarrollados siguiendo la metodología TDD.

# Objetivo
Definir una API para gestionar nuestro equipo Pokémon

# Acciones
- Identificarnos
- Consultar la información de nuestro equipo
- Añadir pokémon a nuestro equipo
- Eliminar pokémon de nuestro equipo
- Intercambiar el orden de nuestros pokemons

# REST Design
- Consultar equipo: GET /team
- Añadir pokemon: POST /team/pokemons
- Eliminar pokemon: DELETE /team/pokemons/:id
- Intercambiar orden: PUT /team
- Credenciales