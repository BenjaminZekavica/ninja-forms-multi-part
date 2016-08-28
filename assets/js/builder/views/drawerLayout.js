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

		},

		onShow: function() {
			this.viewport.show( new DrawerCollectionView( { collection: this.collection } ) );
		}
	});

	return view;
} );