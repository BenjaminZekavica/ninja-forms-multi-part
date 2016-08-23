/**
 * Top drawer collection view.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [ 'views/topDrawerItem' ], function( TopDrawerItemView ) {
	var view = Marionette.CollectionView.extend( {
		tagName: 'ul',
		childView: TopDrawerItemView,

		initialize: function() {
			var template = _.template( jQuery( '#nf-tmpl-mp-top-drawer-pagination-left' ).html() );
			this.leftPagination = '<li class="no-sort">' + template() + '</li>';

			template = _.template( jQuery( '#nf-tmpl-mp-top-drawer-pagination-right' ).html() );
			this.rightPagination = '<li class="no-sort">' + template() + '</li>';
		},

		onShow: function() {
			jQuery( this.el ).sortable( {
				items: 'li:not(.no-sort)'
			} );
		},

		// The default implementation:
		attachHtml: function(collectionView, childView, index){
			if (collectionView.isBuffering) {
				// buffering happens on reset events and initial renders
				// in order to reduce the number of inserts into the
				// document, which are expensive.
				collectionView._bufferedChildren.splice( index, 0, childView );
			} else {
				// If we've already rendered the main collection, append
				// the new child into the correct order if we need to. Otherwise
				// append to the end.
				if ( ! collectionView._insertBefore( childView, index ) ) {
					/*
					 * Remove our last item (right pagination)
					 */
					jQuery( collectionView.el ).find( 'li:last' ).remove();
					collectionView._insertAfter(childView);
					/*
					 * Add our last item (right pagination)
					 */
					jQuery( collectionView.el ).append( this.rightPagination );
				}
			}
		},

		// Called after all children have been appended into the elBuffer
		attachBuffer: function(collectionView, buffer) {
			collectionView.$el.prepend( this.leftPagination );
			collectionView.$el.append( buffer );
			collectionView.$el.append( this.rightPagination );
		},
	} );

	return view;
} );