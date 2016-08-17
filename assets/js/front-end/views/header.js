define( [], function() {
	var view = Marionette.ItemView.extend( {
		template: "#nf-tmpl-mp-header",
 		
 		initialize: function( options ) {
			this.listenTo( this.collection, 'change:part', this.reRender );
			this.listenTo( this.collection, 'change:errors', this.reRender );
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
					return template( { parts: parts, currentIndex: that.collection.indexOf( that.model ) } );
				},

				renderProgressBar: function() {
					var template = _.template( jQuery( '#nf-tmpl-mp-progress-bar' ).html() );
					var currentIndex = that.collection.getVisibleParts().indexOf( that.model );
					var percent = currentIndex / that.collection.getVisibleParts().length * 100;
					return template( { percent: percent } );
				}
			}
		},

		events: {
			'click .nf-breadcrumb': 'clickBreadcrumb'
		},

		clickBreadcrumb: function( e ) {
			e.preventDefault();
			this.collection.setElement( this.collection.at( jQuery( e.target ).data( 'index' ) ) );
		},

		test: function() {
			console.log( 'RESET ERRORS!' );
		}
	} );

	return view;
} );