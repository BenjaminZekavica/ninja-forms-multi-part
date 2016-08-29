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
	} );

	return view;
} );