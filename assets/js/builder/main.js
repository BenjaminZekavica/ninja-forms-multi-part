var nfRadio = Backbone.Radio;

require( [ 'controllers/loadControllers', 'controllers/filters' ], function( LoadControllers, LoadFilters ) {

	var NFMultiPart = Marionette.Application.extend( {

		initialize: function( options ) {
			this.listenTo( nfRadio.channel( 'app' ), 'after:appStart', this.afterStart );
		},

		onStart: function() {
			new LoadFilters();
			new LoadControllers();
		}
	} );

	var nfMultiPart = new NFMultiPart();
	nfMultiPart.start();
} );