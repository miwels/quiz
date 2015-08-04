var models = require('../models/models.js');

// funcion de autoload. Si encontramos un parametro commentId en la URL se ejecutara este middleware.
// De este modo tendremos cargado el commentario cuando se llame a uno de los siguientes middlewares (new, create, etc)
// de modo que primero se ejecutara el load y luego si todo va bien, pasara el control al siguiente middleware mediante next()
exports.load = function(req, res, next, commentId)
{
	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	}).then(function(comment){
		if(comment)
		{
			req.comment = comment;
			next();
		}
		else
		{
			next(new Error('No existe commentId = ' + commentId));
		}
	}).catch(function(error){
		next(error);
	});
};

exports.new = function(req, res)
{
	res.render('comments/new.ejs', {
		quizid: req.params.quizId,
		errors: []
	});
};

exports.create = function(req, res)
{
	var comment = models.Comment.build({
		texto: req.body.comment.texto,
		QuizId: req.params.quizId
		// la relacion belongsTo de Comment a Quiz anade un parametro :quizIs
		// adicional en cada elemento de la tabla Comments que indica el quiz
		// asociado. Se utiliza el nombre :quizId definido en la ruta en
		// routes/index.js
	});

	comment
		.validate()
		.then(
			function(err){
				if(err)
				{
					res.render('comments/new.ejs', {
						quizid: req.params.quizId,
						comment: comment,
						errors: err.errors
					});
				}
				else
				{
					comment
						.save()
						.then(function(){
								res.redirect('/quizes/' + req.params.quizId)
							});
				}
			}
		).catch(function(error){
			next(error);
		});
}

// marca un comentario como publicado
exports.publish = function(req, res)
{
	req.comment.publicado = true;

	req.comment.save({
		fields: ["publicado"]
	}).then(function(){
		res.redirect('/quizes/' + req.params.quizId);
	}).catch(function(error){
		next(error);
	});
}