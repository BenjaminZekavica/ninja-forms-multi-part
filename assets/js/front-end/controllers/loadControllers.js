define( 
	[
		'controllers/conditionalLogic',
		'controllers/renderRecaptcha'
	], 
	function
	(
		ConditionalLogic,
		RenderRecaptcha
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new ConditionalLogic();
			new RenderRecaptcha();
		}

	});

	return controller;
} );