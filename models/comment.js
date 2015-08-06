module.exports = function(sequelize, DataTypes)
{
	return sequelize.define(
		'Comment', {
			texto: {
				type: DataTypes.STRING,
				validate: { notEmpty : {msg: "-> Falta comentario"}}
			},
			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, // sequelize nos permite definir nuestros metodos para los modelos
		{
			classMethods: {
				// contamos los quizes con comentarios (aunque parezca raro lo definimos en Comments y no en Quiz ya que Comments nos dice)
				// cuantos comentarios estan asociados a una pregunta
				countQuizesWithComments: function(){
					return this.aggregate('QuizId', 'count', {distinct: true}); // devolvemos una promesa, en nuestro controller tendremos que hacer un .then()
				},
				countUnpublishedComments: function(){
					return this.aggregate('QuizId', 'count', {
						where: {
							'publicado': false
						}
					});
				}
			}
		}
	);
}