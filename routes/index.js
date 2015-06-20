var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});
/* pagina de creditos */
router.get('/author', function(req, res, next) {
  res.render('author', { fecha: new Date().getFullYear() });
});

// si el router encuentra el parametro :quizId en la URL, ejecuta el autoloader
router.param('quizId', quizController.load);

// definimos 3 rutas extra.
// la primera devuelve la lista de todas las preguntas
// la segunda permite acceder a una pregunta por id (la expresion regular permite solo numberos en el id (\\d+))
// la tercera permite comprobar la respuesta en funcion del id de pregunta
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer)

module.exports = router;
