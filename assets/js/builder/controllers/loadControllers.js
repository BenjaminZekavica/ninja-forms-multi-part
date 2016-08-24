/*
 * Load our builder controllers
 */
define( 
	[
		'controllers/data',
		'controllers/clickControls',
		'controllers/gutterDroppables'
	], 
	function
	(
		Data,
		ClickControls,
		GutterDroppables
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new Data();
			new ClickControls();
			new GutterDroppables();
		}

	});

	return controller;
} );