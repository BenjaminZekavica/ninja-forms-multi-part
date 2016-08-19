var nfRadio = Backbone.Radio;

require( [ 'controllers/loadControllers' ], function( LoadControllers ) {

	var NFMultiPart = Marionette.Application.extend( {

		initialize: function( options ) {
			this.listenTo( nfRadio.channel( 'app' ), 'after:appStart', this.afterStart );
		},

		onStart: function() {
			new LoadControllers();
		}
	} );

	var nfMultiPart = new NFMultiPart();
	nfMultiPart.start();
} );