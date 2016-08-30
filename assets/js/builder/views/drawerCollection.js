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
		reorderOnSort: true,
		
		initialize: function( options ) {
			this.drawerLayoutView = options.drawerLayoutView;

			/*
			 * When we resize our window, maybe show/hide pagination.
			 */
			jQuery( window ).on( 'resize', { context: this }, this.resizeEvent );
		},

		resizeEvent: function( e ) {
			e.data.context.showHidePagination( e.data.context );
		},

		childViewOptions: function( model, index ){
			var that = this;
			return {
				collectionView: that
			}
		},

		onShow: function() {
			var that = this;
			jQuery( this.el ).sortable( {
				items: 'li:not(.no-sort)',
				helper: 'clone',

				update: function( e, ui ) {
					nfRadio.channel( 'mp' ).trigger( 'update:partSortable', e, ui, that.collection, that );
				},

				start: function( e, ui ) {
					nfRadio.channel( 'mp' ).trigger( 'start:partSortable', e, ui, that.collection, that );
				},

				stop: function( e, ui ) {
					nfRadio.channel( 'mp' ).trigger( 'stop:partSortable', e, ui, that.collection, that );
				}
			} );
		},

		/**
		 * Set our UL width when we attach the html to the dom.
		 *
		 * @since  3.0
		 * @return void
		 */
		onAttach: function() {
			this.setULWidth( this.el );

			/*
			 * When load, hide the pagination arrows if they aren't needed.
			 */
			this.showHidePagination();
		},

		/**
		 * Set the width of our UL based upon the size of its items.
		 * 
		 * @since 3.0
		 * @return void
		 */
		setULWidth: function( el ) {
			if ( 0 == jQuery( el ).find( 'li' ).length ) return;

			var ulWidth = 0;
			jQuery( el ).find( 'li' ).each( function() {
				var marginLeft = parseInt( jQuery( this ).css( 'marginLeft' ).replace( 'px', '' ) );
				ulWidth += ( jQuery( this ).outerWidth() + marginLeft + 2 );
			} );

			jQuery( el ).width( ulWidth );			
		},

		onRemoveChild: function() {
			/* 
			 * Change the size of our collection UL
			 */
			this.setULWidth( this.el );
		},

		onAddChild: function() {
			/* 
			 * Change the size of our collection UL
			 */
			this.setULWidth( this.el );
		},

		onBeforeAddChild: function( childView ) {
			jQuery( this.el ).css( 'width', '+=100' );
		},

		showHidePagination: function( context ) {
			context = context || this;
			if ( jQuery( context.el ).width() >= ( jQuery( context.el ).parent().parent().width() - 120 ) ) {
				jQuery( context.drawerLayoutView.el ).find( '.nf-mp-drawer-scroll' ).show();
			} else {
				jQuery( context.drawerLayoutView.el ).find( '.nf-mp-drawer-scroll' ).hide();
			}
		}

	} );

	return view;
} );