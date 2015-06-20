var models = require('../models/models.js');

// para el index, hacemos un findAll y devolvemos todas las preguntas
// que hay en la base de datos
exports.index = function(req, res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index', {quizes: quizes});
	});
};

// muestra la pregunta
// obtenemos el id que se nos pasa por get mediante req.params.quizId
// debido al cambio en la API, hemos de usar promesas, por eso usamos .then()
// para ejecutar una funcion cuando la busqueda en la base de datos ha concluido
// el resultado del query se guarda en el parametro 'quiz' del callback
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: quiz});
	});
};

// del mismo modo capturamos la respuesta y la comparamos con el elemento de la base
// de datos cuyo id coincide con el de la pregunta
exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer', {
				quiz 	 : quiz,
				respuesta: "Correcto"
			});
		}
		else{
			res.render('quizes/answer', {
				quiz 	  : quiz,
				respuesta : "Incorrecto"
			})
		}
	});
}

/*
exports.question = function(req, res){
	// res.render('quizes/question', {pregunta: 'Capital de Italia'});

	// findAll devuelve un array con el contenido de la BDD que se almacena en el parametro quiz del callback
	models.Quiz.findAll().success(function(quiz){
		res.render('quizes/question', {
			pregunta: quiz[0].pregunta
		});
	});
}

exports.answer = function(req, res){
	/*if(req.query.respuesta === 'Roma'){
		res.render('quizes/answer', {respuesta: 'Correcto'});
	}
	else{
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}*/
	/*
	models.Quiz.findAll().success(function(quiz){
		if(req.query.respuesta === quiz[0].respuesta){
			res.render('quizes/answer', {respuesta: 'Correcto'});
		}
		else{
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
		}
	});
}
*/