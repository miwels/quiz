var models = require('../models/models.js');

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