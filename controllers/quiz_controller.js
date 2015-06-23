var models = require('../models/models.js');

// definimos un middleware 'load'. Este middleware se instala en el router
// mediante router.param() y cada vez que el router encuentre dicho
// parametro en la URL, ejecutara este middleware. De este modo podemos
// factorizar el codigo y meter todos los accesos a la BDD en una misma funcion

// El modo en que function es, obtenemos el id que se nos pasa por get mediante req.params.quizId
// debido al cambio en la API, hemos de usar promesas, por eso usamos .then()
// para ejecutar una funcion cuando la busqueda en la base de datos ha concluido
// el resultado del query se guarda en el parametro 'quiz' del callback
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(function(quiz){
		// si encontramos un valor que coincida con ese id, lo metemos en la
		// respuesta mediante req.quiz y pasamos el control al siguiente
		// middleware
		if(quiz){
			req.quiz = quiz;
			next();
		}
		else{
			next(new Error('No existe quizId=' + quizId));
		}
	}).catch(function(error){ // si hay algun error, pasamos el control al siguiente middleware de error
		next(error);
	});
}

// para el index, hacemos un findAll y devolvemos todas las preguntas
// que hay en la base de datos
exports.index = function(req, res, next){

	// definimos un objeto vacio en caso de que el usuario no haga
	// una busqueda y queramos mostrar todos los resultados
	var query = {};

	// si el usuario realiza una busqueda, componemos el query
	if(req.query.search)
	{
		var search = req.query.search;
		search = search.split(" ").join('%');
		search = '%' + search + '%';

		query = {
			where : ["lower(pregunta) like lower(?)", search],
			order : "pregunta ASC"
		};
	}

	models.Quiz.findAll(query).then(function(quizes){
		res.render('quizes/index', {quizes: quizes});
	}).catch(function(error){
		next(error);
	});
};

exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz});
};

exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
}