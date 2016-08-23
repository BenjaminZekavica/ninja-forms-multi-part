/**
 * Top drawer part view
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'li',
		template: '#nf-tmpl-mp-top-drawer-item',
		attributes: function() {
			return {
				id: this.model.cid
			}
		},

		onShow: function() {
			var that = this;
			jQuery( this.el ).droppable( {
				activeClass: '',
				hoverClass: '',
				accept: '.nf-field-type-draggable, .nf-field-wrap, .nf-stage',

				over: function( e, ui ) {
					// Trigger Ninja Forms default handler for being over a field sortable.
					ui.item = ui.draggable;
					nfRadio.channel( 'app' ).request( 'over:fieldsSortable', ui );
				},

				out: function( e, ui ) {
					// Trigger Ninja Forms default handler for being out of a field sortable.
					ui.item = ui.draggable;
					nfRadio.channel( 'app' ).request( 'out:fieldsSortable', ui );
				},

				drop: function( e, ui ) {
					// Trigger Ninja Forms default handler for being out of a field sortable.
					ui.item = ui.draggable;
					nfRadio.channel( 'app' ).request( 'out:fieldsSortable', ui );

					if ( jQuery( ui.draggable ).hasClass( 'nf-field-wrap' ) ) { // Dropping a field that already exists
						that.dropField( e, ui );
					} else if ( jQuery( ui.draggable ).hasClass( 'nf-field-type-draggable' ) ) { // Dropping a new field
						that.dropNewField( e, ui );
					} else if ( jQuery( ui.draggable ).hasClass( 'nf-stage' ) ) { // Dropping the staging area
						that.dropStaging( e, ui );
					}
				}
			} );
		},

		events: {
			'click': 'click'
		},

		click: function( e ) {
			this.model.collection.setElement( this.model );
		},

		templateHelpers: function() {
			var that = this;
			return {
				getIndex: function() {
					return that.model.collection.indexOf( that.model ) + 1;
				}
			}
		},

		dropField: function( e, ui ) {
			/*
			 * If we are dropping a field that exists on our form already:
			 * Remove it from the current part.
			 * Add it to the new part.
			 */
			nfRadio.channel( 'fields' ).request( 'sort:fields', null, null, false );
			nfRadio.channel( 'app' ).request( 'out:fieldsSortable', ui );
			var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', jQuery( ui.draggable ).data( 'id' ) );
			/*
			 * Add the dragged field to the previous part.
			 */
			this.model.collection.getFormContentData().trigger( 'remove:field', fieldModel );
			this.model.get( 'formContentData' ).trigger( 'append:field', fieldModel );
		},

		dropNewField: function( e, ui ) {
			var type = jQuery( ui.draggable ).data( 'id' );
			var fieldModel = this.addField( type, this.model.collection );
			/*
			 * We have a previous part. Add the new field to it.
			 */
			this.model.get( 'formContentData' ).trigger( 'append:field', fieldModel );
		},

		addField: function( type, collection ) {
			var fieldType = nfRadio.channel( 'fields' ).request( 'get:type', type ); 
			// Add our field
			var fieldModel = nfRadio.channel( 'fields' ).request( 'add', {
				label: fieldType.get( 'nicename' ),
				type: type
			} );

			collection.getFormContentData().trigger( 'remove:field', fieldModel );
			return fieldModel;
		}
	});

	return view;
} );