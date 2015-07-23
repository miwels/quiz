var users = {
	admin: {
		id: 1,
		username: "admin",
		password: "1234"
	},
	pepe: {
		id: 2,
		username: "pepe",
		password: "5678"
	}
};

exports.autenticar = function(login, password, callback)
{
	// si el usuario existe en nuestro objeto
	if(users[login])
	{
		// comprobamos el password, si todo va bien llamamos a nuestro callback
		if(password === users[login].password)
		{
			callback(null, users[login]);
		}
		else // en caso contrario mostramos un error
		{
			callback(new Error('Password erroneo'));
		}
	}
	else
	{
		callback(new Error('No existe el usuario'));
	}
}