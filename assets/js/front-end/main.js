var nfRadio = Backbone.Radio;

require( [ 'controllers/loadControllers' ], function( LoadControllers ) {

	var NFMultiPart = Marionette.Application.extend( {

		initialize: function( options ) {
			this.listenTo( nfRadio.channel( 'form' ), 'after:loaded', this.loadControllers );
		},

		loadControllers: function( formModel ) {
			new LoadControllers();
		},

		onStart: function() {
		}
	} );

	var nfMultiPart = new NFMultiPart();
	nfMultiPart.start();
} );