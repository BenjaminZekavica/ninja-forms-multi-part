var nfRadio = Backbone.Radio;

require( [ 'controllers/loadContent' ], function( LoadContent ) {

	var NFMultiPart = Marionette.Application.extend( {

		initialize: function( options ) {
			this.listenTo( nfRadio.channel( 'app' ), 'after:appStart', this.afterStart );
		},

		onStart: function() {
			new LoadContent();
		}
	} );

	var nfMultiPart = new NFMultiPart();
	nfMultiPart.start();
} );