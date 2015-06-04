exports.question = function(req, res){
	res.render('question', {pregunta: 'Capital de Italia'});
}

exports.answer = function(req, res){
	if(req.query.respuesta === 'Roma'){
		res.render('answer', {respuesta: 'Correcto'});
	}
	else{
		res.render('answer', {respuesta: 'Incorrecto'});
	}
}