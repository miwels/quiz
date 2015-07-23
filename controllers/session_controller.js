
// GET /login 	-- formulario de login
exports.new = function(req, res)
{
	var errors = req.session.errors || {};
	req.session.errors = {};

	// renderizamos el formulario de login
	res.render('sessions/new', {errors: errors});
}

// POST /login 	-- Crear la sesion
exports.create = function(req, res)
{
	var login = req.body.login;
	var password = req.body.password;

	// importamos el controlador de usuarios (es un miniconrolador que nos permite gestionar usuarios dentro de nuestro session_controller)
	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){

		// si hay algun error retornamos mensaje de error de sesion
		if(error)
		{
			req.session.errors = [{"message" : "Se ha producido un error: " + error}];
			res.redirect('/login');
			return;
		}

		// Crear req.session.user y guardar campos id y username
		// La sesion se define por la existencia de: req.session.user
		req.session.user = {
			id: user.id,
			username: user.username
		};

		// en app.js hemos guardado la pagina desde la que se ha hecho login. Si el usuario se autentica correctamente lo mandamos a esa pagina
		// NOTA: es posible que si alguien carga el formulario de login directamente, este valor sea undefined por lo que la conversion a string
		// fallara y nos dara un error. Si este es el caso mandamos al usuario a la pagina inicial
		if(req.session.redir === undefined)
		{
			req.session.redir = "/";
		}
		res.redirect(req.session.redir.toString());
	});
}

// DELETE /logout 	-- Destruimos la sesion y redirigimos al usuario a la pagina anterior
exports.destroy = function(req, res)
{
	delete req.session.user;
	if(req.session.redir === undefined)
	{
		req.session.redir = "/";
	}
	res.redirect(req.session.redir.toString());
}