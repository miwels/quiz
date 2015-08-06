var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller.js');
var sessionController = require('../controllers/session_controller.js');
var statisticsController = require('../controllers/statistics_controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});
/* pagina de creditos */
router.get('/author', function(req, res, next) {
  res.render('author', { fecha: new Date().getFullYear(), errors: [] });
});

// si el router encuentra el parametro :quizId en la URL, ejecuta el autoloader
router.param('quizId', quizController.load);
// lo mismo para comment, ejecuta autoloader para tener el comentario cargado si encuentra el parametro :commentId
router.param('commentId', commentController.load);

// definimos las rutas para las sesiones
router.get('/login',  sessionController.new);		// formulario de login
router.post('/login', sessionController.create);	// crear sesion
router.get('/logout', sessionController.destroy); 	//destruir sesion, se deberia usar un DELETE ya que estamos destruyendo un recurso

// definimos 3 rutas extra.
// la primera devuelve la lista de todas las preguntas
// la segunda permite acceder a una pregunta por id (la expresion regular permite solo numberos en el id (\\d+))
// la tercera permite comprobar la respuesta en funcion del id de pregunta
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new', 					sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 				sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, quizController.destroy);
// para que se haga el put necesitamos el paquete method-override y anadir
// el parametro _method=put a nuestro form action

// rutas para comentarios:
router.get('/quizes/:quizId(\\d+)/comments/new', 	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', 		commentController.create);
// mediante esta ruta podemos publicar comentarios. El parametro :commentId hace referencia a la linea 19 donde definimos el parametro en el router
// para cumplir las reglas de REST esto deberia ser un put
// El primer id :quizId indica a que pregunta hace referencia, :commentId hace referencia al comentario
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

// agregamos una nueva ruta para consultar estadisticas:
router.get('/quizes/statistics', statisticsController.get);

module.exports = router;
