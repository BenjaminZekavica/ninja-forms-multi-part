define( 
	[
		'controllers/conditionalLogic'
	], 
	function
	(
		ConditionalLogic
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new ConditionalLogic();
		}

	});

	return controller;
} );