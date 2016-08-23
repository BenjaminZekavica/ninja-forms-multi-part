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
				accept: '.nf-field-type-draggable, .nf-field-wrap, .nf-stage',

				drop: function( e, ui ) {
					nfRadio.channel( 'fields' ).request( 'sort:fields', null, null, false );
					nfRadio.channel( 'app' ).request( 'out:fieldsSortable', ui );
					var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', jQuery( ui.draggable ).data( 'id' ) );
					/*
					 * Add the dragged field to the previous part.
					 */
					that.model.collection.getFormContentData().trigger( 'remove:field', fieldModel );
					that.model.get( 'formContentData' ).trigger( 'append:field', fieldModel );
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
		}
	});

	return view;
} );