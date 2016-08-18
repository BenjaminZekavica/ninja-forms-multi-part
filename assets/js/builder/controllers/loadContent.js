define( [ 'views/gutterLeft', 'views/gutterRight' ],function ( GutterLeftView, GutterRightView )	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'app' ), 'after:loadControllers', this.loadControllers );
			
		},

		loadControllers: function() {
			// new LoadControllers();
			// Add our view filters.
			this.addFilters();
		},

		addFilters: function() {
			nfRadio.channel( 'formContentGutters' ).request( 'add:leftFilter', this.getLeftView, 1, this );
			nfRadio.channel( 'formContentGutters' ).request( 'add:rightFilter', this.getRightView, 1, this );
		},

		getLeftView: function() {
			console.log( 'return left view' );
			return GutterLeftView;
		},

		getRightView: function() {
			return GutterRightView;
		}

	});

	return controller;
} );