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


/*
	Implementacion con Promise.all (queda pendiente de probar)

	var models = require('../models/models.js');
	var Sequelize = require('sequelize');

	 var statsData = {};

	 exports.obtainData = function(req, res, next) {
	 //Se ha usado el método all de Promises (implementado ya en sequelize), ya que
	 //de esta forma se ejecutan las consultas asíncronamente en paralelo y se
	 //continúa cuando han acabado todas.
	    Sequelize.Promise.all([
	        models.Quiz.count(),
	        models.Comment.count(),
	//Se ha añadido nuevos métodos al modelo Comment en models/comment.js
	//Para ello se han seguido las instucciones de la documentación de sequelize:
	//http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
	        models.Comment.countDistinctQuizId(),
	        models.Comment.countPublished()
	    ]).then( function( values ){
	        statsData.quizes=values[0];
	        statsData.comments=values[1];
	        statsData.commentedQuizes=values[2];
	        statsData.publishedComments=values[3];
	    }).catch( function (err) {
	        next(err);
	    }).finally( function() {
	        next();
	    });
	};

	// GET /quizes/statistics
	exports.show = function(req, res) {
	    res.render('statistics', {
	        statsData: statsData,
	        errors: []
	    });
	};
*/