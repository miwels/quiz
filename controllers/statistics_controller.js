var models = require('../models/models.js');

var stats = {
	quizes: 0,
	comments: 0,
	quizesComments: 0,
	unpublishedComments: 0
};
var errors = [];

exports.get = function(req, res, next)
{

	// hay que verlo como una cadena, cada "then" recoge el valor del metodo anterior (Quiz.count() y luego los diferentes returns) y lo pasa por paramentro
	// a la funcion then
	// No es lo mas eficiente dado que los metros no dependen unos de otros. La mejor forma de llamar a todos los eventos en paralelo es mediante un
	// Promise.all
	models.Quiz.count()
	.then(function(quizes){
		stats.quizes = quizes;
		return models.Comment.count();
	})
	.then(function(comments){
		stats.comments = comments;
		return models.Comment.countQuizesWithComments();
	})
	.then(function(quizesComments){
		stats.quizesComments = quizesComments;
		return models.Comment.countUnpublishedComments();
	})
	.then(function(unpublishedComments){
		console.log(unpublishedComments);
		stats.unpublishedComments = unpublishedComments;
	})
	.catch(function(error){
		errors.push(error);
	})
	.finally(function(){
		res.render('quizes/statistics', {
			statistics: stats,
			errors: errors
		});
	});
};
