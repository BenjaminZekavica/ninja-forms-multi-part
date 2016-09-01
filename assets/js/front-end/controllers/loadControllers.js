define( 
	[
		'controllers/filters',
		'controllers/conditionalLogic'
	], 
	function
	(
		Filters,
		ConditionalLogic
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new Filters();
			new ConditionalLogic();
		}

	});

	return controller;
} );