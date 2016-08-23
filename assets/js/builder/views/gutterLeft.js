/**
 * Main content left gutter
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		template: '#nf-tmpl-mp-gutter-left',

		events: {
			'click .fa': 'clickPrevious'
		},

		initialize: function() {
			this.collection = nfRadio.channel( 'mp' ).request( 'get:collection' );
			this.listenTo( this.collection, 'change:part', this.render );
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
					nfRadio.channel( 'mp' ).trigger( 'over:gutter', ui, this );
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
					nfRadio.channel( 'mp' ).trigger( 'out:gutter', ui, this );
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
					/*
					 * Check to see if we have a next part.
					 */
					if ( that.collection.hasPrevious() ) {
						/*
						 * Add the dragged field to the next part.
						 */
						var fieldModel = nfRadio.channel( 'fields' ).request( 'get:field', jQuery( ui.draggable ).data( 'id' ) );
						that.collection.getElement().get( 'formContentData' ).trigger( 'remove:field', fieldModel );
						that.collection.at( that.collection.indexOf( that.collection.getElement() ) - 1 ).get( 'formContentData' ).trigger( 'append:field', fieldModel );
					}

					/*
					 * If we hover over our droppable for more than x seconds, change the part.
					 */
					// clearTimeout( that.changePart );
				}
			} );
		},

		clickPrevious: function( e ) {
			nfRadio.channel( 'mp' ).trigger( 'click:previous', e );
		},

		templateHelpers: function() {
			var that = this;
			return {
				hasPrevious: function() {
					return that.collection.hasPrevious();
				}
			}
		},

		changePart: function( context ) {
			context.collection.previous();
		}
	});

	return view;
} );