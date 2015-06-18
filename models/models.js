var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// USar BDD SQLite
var sequelize = new Sequelize(null, null, null,
					{
						dialect: "sqlite",
						storage: "quiz.sqlite"
					});

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// exportar la definicion de la tabla Quiz
exports.Quiz = Quiz;

// sincroniza la BD con el modelo definido
sequelize.sync().success(function(){
	// count() devuelve el numero de filas de la tabla. Si es 0 inicializamos la tabla con una entrada
	Quiz.count().success(function(count){
		if(count === 0){
			// crea la primera pregunta en la tabla
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			}).success(function(){
				console.log('Base de datos inicializada');
			});
		}
	});
 });