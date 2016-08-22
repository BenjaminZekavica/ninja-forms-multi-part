/**
 * Main content right gutter
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-mp-gutter-right',
		dropped: false,

		events: {
			'click .next': 'clickNext',
			'click .new': 'clickNew'
		},

		initialize: function() {
			this.collection = nfRadio.channel( 'mp' ).request( 'get:collection' );
			this.listenTo( this.collection, 'change:part', this.render );
			this.listenTo( this.collection, 'add', this.render );
		},

		onRender: function() {
			var that = this;
			jQuery( this.el ).find( '.fa' ).droppable( {
				// Activate by pointer
				tolerance: 'pointer',
				// Class added when we're dragging over
				hoverClass: 'mp-circle-over',
				activeClass: 'mp-circle-active',
				// Which elements do we want to accept?
				accept: '.nf-field-type-draggable, .nf-field-wrap, .nf-stage',

				/**
				 * When we drag over this droppable, trigger a radio event.
				 * 
				 * @since  3.0
				 * @param  object 	e  event
				 * @param  object 	ui jQuery UI element
				 * @return void
				 */
				over: function( e, ui ) {
					this.dropped = false;
					if ( jQuery( ui.helper ).hasClass( 'nf-field-type-draggable' ) ) {
						jQuery( ui.helper ).css( 'width', 300 );
						jQuery( '#nf-main' ).find( '.nf-fields-sortable-placeholder' ).addClass( 'nf-sortable-removed' ).removeClass( 'nf-fields-sortable-placeholder' );
					} else {
						jQuery( '#nf-main' ).find( '.nf-fields-sortable-placeholder' ).addClass( 'nf-sortable-removed' ).removeClass( 'nf-fields-sortable-placeholder' );
					}

					// setTimeout( that.changePart, 1000, that );
				},

				/**
				 * When we drag out of this droppable, trigger a radio event.
				 * 
				 * @since  3.0
				 * @param  object 	e  event
				 * @param  object 	ui jQuery UI element
				 * @return void
				 */
				out: function( e, ui ) {
					if ( jQuery( ui.helper ).hasClass( 'nf-field-type-draggable' ) ) {
						jQuery( '#nf-main' ).find( '.nf-sortable-removed' ).addClass( 'nf-fields-sortable-placeholder' );
					} else {
						jQuery( '#nf-main' ).find( '.nf-sortable-removed' ).addClass( 'nf-fields-sortable-placeholder' );
					}
					ui.cancel = false;
					/*
					 * If we hover over our droppable for more than x seconds, change the part.
					 */
					// clearTimeout( that.changePart );
				},

				/**
				 * When we drop on this droppable, trigger a radio event.
				 * 
				 * @since  3.0
				 * @param  object 	e  event
				 * @param  object 	ui jQuery UI element
				 * @return void
				 */
				drop: function( e, ui ) {
					ui.draggable.dropping = true;
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

					/*
					 * If we hover over our droppable for more than x seconds, change the part.
					 */
					// clearTimeout( that.changePart );
				}
			} );
		},

		clickNext: function( e ) {
			nfRadio.channel( 'mp' ).trigger( 'click:next', e );
		},

		clickNew: function( e ) {
			nfRadio.channel( 'mp' ).trigger( 'click:new', e );
		},

		templateHelpers: function() {
			var that = this;
			return {
				hasNext: function() {
					return that.collection.hasNext();
				}
			}
		},

		changePart: function( context ) {
			context.collection.next();
		}
	});

	return view;
} );