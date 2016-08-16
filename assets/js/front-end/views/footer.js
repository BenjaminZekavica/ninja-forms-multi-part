define( [], function() {
	var view = Marionette.ItemView.extend( {
		template: "#nf-tmpl-mp-footer",
 		
		initialize: function( options ) {
			this.listenTo( this.collection, 'change:part', this.reRender );
		},

		reRender: function() {
			this.model = this.collection.getElement();
			this.render();
		},

		templateHelpers: function() {
			var that = this;
			return {
				renderNextPrevious: function() {
					var template = _.template( jQuery( '#nf-tmpl-mp-next-previous' ).html() );
					var showNext = false;
					var showPrevious = false;
					/*
					 * If our collection pointer isn't on the last item, show Next navigation.
					 */
					if ( that.collection.indexOf( that.model ) != that.collection.length -1 ) {
						showNext = true;
					}

					/*
					 * If our collection pointer isn't on the first item, show Previous navigation.
					 */
					if ( that.collection.indexOf( that.model ) != 0 ) {
						showPrevious = true;
					}
					
					return template( { showNext: showNext, showPrevious: showPrevious } );
				}
			}
		}

	} );

	return view;
} );