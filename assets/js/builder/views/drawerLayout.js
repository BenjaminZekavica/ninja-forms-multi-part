/**
 * Main layout view
 *
 * Regions:
 * mainContent
 * drawer
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'views/drawerCollection' ], function( DrawerCollectionView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#nf-tmpl-mp-drawer-layout',
		regions: {
			viewport: '#nf-mp-drawer-viewport',
		},

		initialize: function() {
			/*
			 * Make sure that our drawer resizes to match our screen upon resize or drawer open/close.
			 */
			jQuery( window ).on( 'resize', { context: this }, this.resizeEvent );
			this.listenTo( nfRadio.channel( 'drawer' ), 'before:open', this.beforeDrawerOpen );
			this.listenTo( nfRadio.channel( 'drawer' ), 'before:close', this.beforeDrawerClose );
		},

		onBeforeDestroy: function() {
			jQuery( window ).off( 'resize', this.resizeViewport );
		},

		onShow: function() {
			var that = this;
			this.viewport.show( new DrawerCollectionView( { collection: this.collection } ) );

			/*
			 * When we hover over our arrows, scroll our part collection UL
			 */
			jQuery( this.el ).find( '.nf-mp-drawer-scroll-previous' ).click( function( e ) {
				jQuery( that.viewport.el ).animate( {
					scrollLeft: '-=400'
				}, 'slow' );
			} );

			jQuery( this.el ).find( '.nf-mp-drawer-scroll-next' ).click( function( e ) {
				jQuery( that.viewport.el ).animate( {
					scrollLeft: '+=400'
				}, 'slow' );
			} );
		},

		onAttach: function() {
			var ulWidth = 157;
			jQuery( this.viewport.el ).find( 'li' ).each( function() {
				ulWidth += jQuery( this ).outerWidth();
			} );

			jQuery( this.viewport.el ).find( 'ul' ).width( ulWidth );
			this.resizeViewport( this.viewport.el );
		},

		resizeEvent: function( e ) {
			e.data.context.resizeViewport( e.data.context.viewport.el );
		},

		beforeDrawerClose: function() {
			var targetWidth = jQuery( window ).width() - 140;
			jQuery( this.viewport.el ).animate( {
				width: targetWidth
			}, 500 );
		},

		beforeDrawerOpen: function() {
			var drawerEl = nfRadio.channel( 'app' ).request( 'get:drawerEl' );
			var targetWidth = jQuery( drawerEl ).width() - 60;
			jQuery( this.viewport.el ).animate( {
				width: targetWidth
			}, 300 );
		},

		resizeViewport: function( viewportEl, targetWidth ) {
			targetWidth = targetWidth || jQuery( window ).width() - 140;
			jQuery( viewportEl ).width( targetWidth );
		}
	});

	return view;
} );