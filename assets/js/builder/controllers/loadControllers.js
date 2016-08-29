/*
 * Load our builder controllers
 */
define( 
	[
		'controllers/data',
		'controllers/clickControls',
		'controllers/gutterDroppables',
		'controllers/partSettings',
		'controllers/partDroppable'
	], 
	function
	(
		Data,
		ClickControls,
		GutterDroppables,
		PartSettings,
		PartDroppable
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new Data();
			new ClickControls();
			new GutterDroppables();
			new PartSettings();
			new PartDroppable();
		}

	});

	return controller;
} );