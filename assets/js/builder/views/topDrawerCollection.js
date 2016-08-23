/**
 * Top drawer collection view.
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [ 'views/topDrawerItem' ], function( TopDrawerItemView ) {
	var view = Marionette.CollectionView.extend({
		tagName: 'ul',
		childView: TopDrawerItemView
	});

	return view;
} );