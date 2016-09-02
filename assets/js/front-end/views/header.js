define( [], function() {
	var view = Marionette.ItemView.extend( {
		template: "#nf-tmpl-mp-header",
 		fullProgressBar: false,

 		initialize: function( options ) {
			this.listenTo( this.collection, 'change:part', this.reRender );
			this.listenTo( this.collection, 'change:errors', this.reRender );

			this.listenTo( nfRadio.channel( 'forms' ), 'before:submit', this.fillProgressBar );
		},

		reRender: function() {
			this.model = this.collection.getElement();
			this.render();
		},

		templateHelpers: function() {
			var that = this;
			return {
				renderBreadcrumbs: function() {
					var template = _.template( jQuery( '#nf-tmpl-mp-breadcrumbs' ).html() );
					var parts = _.invoke( that.collection.getVisibleParts(), 'pick', [ 'title', 'errors', 'visible' ] )
					if ( 1 < parts.length ) {
						return template( { parts: parts, currentIndex: that.collection.getVisibleParts().indexOf( that.model ) } );
					} else {
						return ''; 
					}
				},

				renderProgressBar: function() {
					var template = _.template( jQuery( '#nf-tmpl-mp-progress-bar' ).html() );
					var currentIndex = that.collection.getVisibleParts().indexOf( that.model );
					var percent = ( that.fullProgressBar ) ? 100 : currentIndex / that.collection.getVisibleParts().length * 100;
					if ( 1 < that.collection.getVisibleParts().length ) {
						return template( { percent: percent } );
					} else {
						return '';
					}
				}
			}
		},

		events: {
			'click .nf-breadcrumb': 'clickBreadcrumb'
		},

		clickBreadcrumb: function( e ) {
			e.preventDefault();
			this.collection.setElement( this.collection.getVisibleParts()[ jQuery( e.target ).data( 'index' ) ] );
		},

		fillProgressBar: function( formModel ) {
			this.fullProgressBar = true;
			this.render();
			this.fullProgressBar = false;
		}
	} );

	return view;
} );