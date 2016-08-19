/*
 * Load our builder controllers
 */
define( 
	[
		'controllers/filters'
	], 
	function
	(
		Filters
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			new Filters();
		}

	});

	return controller;
} );