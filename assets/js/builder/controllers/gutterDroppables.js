/**
 * Listen for drag events on our arrows.
 * 
 * @package Ninja Forms Multi-Part
 * @subpackage Fields
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define(	[],	function () {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'mp' ), 'over:gutter', this.over );
			this.listenTo( nfRadio.channel( 'mp' ), 'out:gutter', this.out );
			this.listenTo( nfRadio.channel( 'mp' ), 'drop:rightGutter', this.dropRight );
		},

		over: function( ui, gutterView ) {
			/*
			 * Remove any other draggable placeholders.
			 */
			jQuery( '#nf-main' ).find( '.nf-fields-sortable-placeholder' ).addClass( 'nf-sortable-removed' ).removeClass( 'nf-fields-sortable-placeholder' );

			// Trigger Ninja Forms default handler for being over a field sortable.
			ui.item = ui.draggable;
			nfRadio.channel( 'app' ).request( 'over:fieldsSortable', ui );
			
			/*
			 * If we hover over our droppable for more than x seconds, change the part.
			 */
			// setTimeout( that.changePart, 1000, that );
		},

		out: function( ui, gutterView ) {
			/*
			 * Re-add any draggable placeholders that we removed.
			 */
			jQuery( '#nf-main' ).find( '.nf-sortable-removed' ).addClass( 'nf-fields-sortable-placeholder' );
			
			// Trigger Ninja Forms default handler for being out of a field sortable.
			ui.item = ui.draggable;
			nfRadio.channel( 'app' ).request( 'out:fieldsSortable', ui );

			/*
			 * If we hover over our droppable for more than x seconds, change the part.
			 */
			// clearTimeout( that.changePart );
		},

		drop: function( ui, gutterView ) {
			ui.draggable.dropping = true;
		},

		dropRight: function( ui, gutterView ) {
				this.drop( ui, gutterView );
				/*
				 * If we're dealing with a field that already exists on our form, handle moving it.
				 */
				if ( jQuery( ui.draggable ).hasClass( 'nf-field-wrap' ) ) {
					console.log( 'drop existing field' );
					var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', jQuery( ui.draggable ).data( 'id' ) );
					/*
					 * Check to see if we have a next part.
					 */
					if ( that.collection.hasNext() ) {
						/*
						 * Add the dragged field to the next part.
						 */
						that.collection.getElement().get( 'formContentData' ).trigger( 'remove:field', fieldModel );
						that.collection.at( that.collection.indexOf( that.collection.getElement() ) + 1 ).get( 'formContentData' ).trigger( 'append:field', fieldModel );
					} else {
						/*
						 * Add the dragged field to a new part.
						 */
						that.collection.getElement().get( 'formContentData' ).trigger( 'remove:field', fieldModel );
						that.collection.add( { formContentData: [ fieldModel.get( 'key' ) ] } );
					}						
				} else if ( jQuery( ui.draggable ).hasClass( 'nf-field-type-draggable' ) ) {
					console.log( 'new field type' );
				} else {
					console.log( 'staging' );
				}


				/*
				 * If we hover over our droppable for more than x seconds, change the part.
				 */
				// clearTimeout( that.changePart );
		}

	});

	return controller;
} );