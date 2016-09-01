var nfRadio = Backbone.Radio;

require( [ 'controllers/loadFilters', 'controllers/loadControllers' ], function( LoadFilters, LoadControllers ) {

	var NFMultiPart = Marionette.Application.extend( {

		initialize: function( options ) {
			this.listenTo( nfRadio.channel( 'form' ), 'before:filterData', this.loadFilters );
			this.listenTo( nfRadio.channel( 'form' ), 'after:loaded', this.loadControllers );
		},

		loadFilters: function( formModel ) {
			new LoadFilters();
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