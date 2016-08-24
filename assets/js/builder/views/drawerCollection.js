/**
 * Drawer collection view.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [ 'views/drawerItem' ], function( DrawerItemView ) {
	var view = Marionette.CollectionView.extend( {
		tagName: 'ul',
		childView: DrawerItemView,

		initialize: function() {
			var template = _.template( jQuery( '#nf-tmpl-mp-drawer-pagination-left' ).html() );
			this.leftPagination = '<li class="no-sort">' + template() + '</li>';

			template = _.template( jQuery( '#nf-tmpl-mp-drawer-pagination-right' ).html() );
			this.rightPagination = '<li class="no-sort">' + template() + '</li>';

			this.listenTo( this.collection, 'change:part', this.render );
		},

		onShow: function() {
			var that = this;
			jQuery( this.el ).sortable( {
				items: 'li:not(.no-sort)',
				helper: 'clone',

				update: function( e, ui ) {
					var order = jQuery( this ).sortable( 'toArray' );
					_.each( order, function( cid, index ) {
						that.collection.get( { cid: cid } ).set( 'order', index );
					}, this );
					that.collection.sort();
				},

				start: function( e, ui ) {
					// If we aren't dragging an item in from types or staging, update our change log.
					if( ! jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) && ! jQuery( ui.item ).hasClass( 'nf-stage' ) ) { 
						jQuery( ui.item ).css( 'opacity', '0.5' ).show();
						jQuery( ui.helper ).css( 'opacity', '0.95' );
					}
				},

				stop: function( e, ui ) {
					// If we aren't dragging an item in from types or staging, update our change log.
					if( ! jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) && ! jQuery( ui.item ).hasClass( 'nf-stage' ) ) { 
						jQuery( ui.item ).css( 'opacity', '' );
					}
				}
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
					jQuery( collectionView.el ).find( '.no-sort' ).remove();
					collectionView._insertAfter(childView);
					/*
					 * Add our pagination LIs
					 */
					jQuery( collectionView.el ).prepend( this.leftPagination );
					jQuery( collectionView.el ).append( this.rightPagination );
				}
			}
		},

		// Called after all children have been appended into the elBuffer
		attachBuffer: function(collectionView, buffer) {
			collectionView.$el.find( '.no-sort' ).remove();
			collectionView.$el.prepend( this.leftPagination );
			collectionView.$el.append( buffer );
			collectionView.$el.append( this.rightPagination );
		},
	} );

	return view;
} );