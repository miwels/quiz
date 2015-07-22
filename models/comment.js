module.exports = function(sequelize, DataTypes)
{
	return sequelize.define(
		'Comment', {
			texto: {
				type: DataTypes.STRING,
				validate: { noEmpty : {msg: "-> Falta comentario"}}
			}
		}
	);
}