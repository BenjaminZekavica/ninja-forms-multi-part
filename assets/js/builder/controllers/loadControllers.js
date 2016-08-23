/*
 * Load our builder controllers
 */
define( 
	[
		'controllers/data',
		'controllers/filters',
		'controllers/clickControls',
		'controllers/gutterDroppables'
	], 
	function
	(
		Data,
		Filters,
		ClickControls,
		GutterDroppables
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new Data();
			new Filters();
			new ClickControls();
			new GutterDroppables();
		}

	});

	return controller;
} );