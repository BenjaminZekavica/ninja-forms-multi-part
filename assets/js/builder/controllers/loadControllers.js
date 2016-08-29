/*
 * Load our builder controllers
 */
define( 
	[
		'controllers/data',
		'controllers/clickControls',
		'controllers/gutterDroppables',
		'controllers/partSettings',
		'controllers/partDroppable',
		'controllers/partSortable'
	], 
	function
	(
		Data,
		ClickControls,
		GutterDroppables,
		PartSettings,
		PartDroppable,
		PartSortable
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new Data();
			new ClickControls();
			new GutterDroppables();
			new PartSettings();
			new PartDroppable();
			new PartSortable();
		}

	});

	return controller;
} );