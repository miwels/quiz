var path = require('path');

// Definimos un esquema "general" que nos permitira obtener los valores de la variable de entorno DATABASE_URL situada en el fichero .env
// De este modo no nos tenemos que preoucpar de definir dos esquemas diferentes para local y remoto (Heroku)
// Cuando el programa se ejecute en Heroku, la variable DATABASE_URL contendra los valores postgres
// Cuando el programa se ejecute en local, la variable DATABASE_URL contendra la referencia a SQLite

// NOTA: A partir de ahora tenemos que ejecutar el programa mediante foreman start y no mediante node o npm start
// NOTA2: hay que recordar que tenemos que mover la dependencia sqlite del fichero package.json a "devDependencies"
// NOTA3: foreman se ejecuta en el puerto 5000

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite 	DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user 	= (url[2] || null);
var pwd 	= (url[3] || null);
var protocol= (url[1] || null);
var dialect = (url[1] || null);
var port 	= (url[5] || null);
var host 	= (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Reemplazamos la definicion de SQLite por nuestro modelo dinamico
var sequelize = new Sequelize(DB_name, user, pwd, {
	dialect : protocol,
	protocol: protocol,
	port 	: port,
	host 	: host,
	storage : storage, 	// solo SQLite (.env)
	omitNull: true 		// definido solo para Heroku PostgreSQL
});


// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// exportar la definicion de la tabla Quiz
exports.Quiz = Quiz;

// sincroniza la BD con el modelo definido
sequelize.sync().then(function(){
	// count() devuelve el numero de filas de la tabla. Si es 0 inicializamos la tabla con una entrada
	Quiz.count().success(function(count){
		if(count === 0){
			// crea la primera pregunta en la tabla
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'otro'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'otro'
			}).then(function(){
				console.log('Base de datos inicializada');
			});
		}
	});
 });