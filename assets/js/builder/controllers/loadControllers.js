/*
 * Load our builder controllers
 */
define( 
	[
		'controllers/data',
		'controllers/filters',
		'controllers/clickControls'
	], 
	function
	(
		Data,
		Filters,
		ClickControls
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new Data();
			new Filters();
			new ClickControls();
		}

	});

	return controller;
} );