/**
 * Handles events for our bottom drawer part title sortable
 * 
 * @package Ninja Forms Multi-Part
 * @subpackage Fields
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define(	[],	function () {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'mp' ), 'start:partSortable', this.start );
			this.listenTo( nfRadio.channel( 'mp' ), 'stop:partSortable', this.stop );
			this.listenTo( nfRadio.channel( 'mp' ), 'update:partSortable', this.update );
		},

		start: function( e, ui, collection, collectionView ) {
			// If we aren't dragging an item in from types or staging, update our change log.
			if( ! jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) && ! jQuery( ui.item ).hasClass( 'nf-stage' ) ) { 
				jQuery( ui.item ).css( 'opacity', '0.5' ).show();
				jQuery( ui.helper ).css( 'opacity', '0.75' );
			}
		},

		stop: function( e, ui, collection, collectionView ) {
			// If we aren't dragging an item in from types or staging, update our change log.
			if( ! jQuery( ui.item ).hasClass( 'nf-field-type-draggable' ) && ! jQuery( ui.item ).hasClass( 'nf-stage' ) ) { 
				jQuery( ui.item ).css( 'opacity', '' );
			}
		},

		update: function( e, ui, collection, collectionView ) {
			jQuery( ui.item ).css( 'opacity', '' );
			var order = _.without( jQuery( collectionView.el ).sortable( 'toArray' ), '' );
			_.each( order, function( cid, index ) {
				collection.get( { cid: cid } ).set( 'order', index );
			}, this );
			collection.sort();
		},

	});

	return controller;
} );