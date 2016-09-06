define( [], function() {
	var view = Marionette.ItemView.extend( {
		template: "#tmpl-nf-mp-footer",

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
					var template = Backbone.Radio.channel( 'app' ).request( 'get:template', '#tmpl-nf-mp-next-previous' );
					var showNext = false;
					var showPrevious = false;
					var visibleParts = that.collection.where( { visible: true } );
					
					/*
					 * If our collection pointer isn't on the last visible part, show Next navigation.
					 */
					if ( visibleParts.indexOf( that.model ) != visibleParts.length - 1 ) {
						showNext = true;
					}

					/*
					 * If our collection pointer isn't on the first visible part, show Previous navigation.
					 */
					if ( visibleParts.indexOf( that.model ) != 0 ) {
						showPrevious = true;
					}

					if ( ! showNext && ! showPrevious ) return '';

					return template( { showNext: showNext, showPrevious: showPrevious } );
				}
			}
		}

	} );

	return view;
} );
