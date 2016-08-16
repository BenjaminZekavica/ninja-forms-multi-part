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
					var parts = that.collection.invoke( 'pick', [ 'title', 'errors' ] )
					return template( { parts: parts, currentIndex: that.collection.indexOf( that.model ) } );
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