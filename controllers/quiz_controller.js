var models = require('../models/models.js');

// definimos un middleware 'load'. Este middleware se instala en el router
// mediante router.param() y cada vez que el router encuentre dicho
// parametro en la URL, ejecutara este middleware. De este modo podemos
// factorizar el codigo y meter todos los accesos a la BDD en una misma funcion

// El modo en que function es, obtenemos el id que se nos pasa por get mediante req.params.quizId
// debido al cambio en la API, hemos de usar promesas, por eso usamos .then()
// para ejecutar una funcion cuando la busqueda en la base de datos ha concluido
// el resultado del query se guarda en el parametro 'quiz' del callback

// Hemos de modificar esta function de autoload para que incluya tambien comentarios
// asociados a cada quiz es decir, hemos de reemplazar find(quizId) con el find(...) que
// tenemos a continuacion donde definimos el id que se debe buscar y ademas, que ha de incluir
// todos los comentarios asociados a ese modelo. Esto hara que en cada quiz object habra una
// propiedad Comment con todos los comentarios asociados a esa pregunta
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
		where:   { id: Number(quizId)},
		include: [{ model: models.Comment }]
	}).then(function(quiz){
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
		res.render('quizes/index', {
			quizes: quizes,
			errors: []
		});
	}).catch(function(error){
		next(error);
	});
};

exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

exports.answer = function(req, res){
	var resultado = 'Incorrecto';

	if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
		resultado = 'Correcto';
	}

	res.render('quizes/answer', {
		quiz: req.quiz,
		respuesta: resultado,
		errors: []
	});
};

exports.new = function(req, res)
{
	var quiz = models.Quiz.build(
		{
			pregunta:  "Pregunta",
			respuesta: "Respuesta",
			tema: "Tema"
		}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res)
{
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(function(err){
		if(err)
		{
			res.render('quizes/new', {
				quiz: quiz,
				errors: err.errors
			});
		}
		else
		{
			quiz
			.save({fields: ["pregunta", "respuesta", "tema"]})
			.then(function(){
				res.redirect('/quizes');
			});
		}
	});
};

exports.edit = function(req, res){
	var quiz = req.quiz;
	res.render('quizes/edit', {
		quiz: quiz,
		errors: []
	})
};

exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
	.validate()
	.then(function(err){
		if(err)
		{
			res.render('quizes/new', {
				quiz: req.quiz,
				errors: err.errors
			});
		}
		else
		{
			req.quiz
			.save({fields: ["pregunta", "respuesta", "tema"]})
			.then(function(){
				res.redirect('/quizes');
			});
		}
	});
};

exports.destroy = function(req, res)
{
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){
		next(error);
	});
}