define(
	[
		'views/gutterLeft',
		'views/gutterRight',
		'models/partCollection'
	],
	function (
		GutterLeftView,
		GutterRightView,
		PartCollection
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'app' ), 'after:loadControllers', this.addFilters );
		},

		addFilters: function() {
			nfRadio.channel( 'formContentGutters' ).request( 'add:leftFilter', this.getLeftView, 1, this );
			nfRadio.channel( 'formContentGutters' ).request( 'add:rightFilter', this.getRightView, 1, this );
		
			// nfRadio.channel( 'formContent' ).request( 'add:viewFilter', this.getFormContentView, 1 );
			// nfRadio.channel( 'formContent' ).request( 'add:saveFilter', this.formContentSave, 1 );
			nfRadio.channel( 'formContent' ).request( 'add:loadFilter', this.formContentLoad, 1 );
		
		},

		getLeftView: function() {
			return GutterLeftView;
		},

		getRightView: function() {
			return GutterRightView;
		},

		formContentLoad: function( formContentData ) {
			var partCollection = new PartCollection( formContentData );
			console.log( partCollection );
			return nfRadio.channel( 'fields' ).request( 'get:collection' );
		}

	});

	return controller;
} );