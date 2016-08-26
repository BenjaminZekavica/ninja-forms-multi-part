/*
 * Load our builder controllers
 */
define( 
	[
		'controllers/data',
		'controllers/clickControls',
		'controllers/gutterDroppables',
		'controllers/partSettings'
	], 
	function
	(
		Data,
		ClickControls,
		GutterDroppables,
		PartSettings
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new Data();
			new ClickControls();
			new GutterDroppables();
			new PartSettings();
		}

	});

	return controller;
} );