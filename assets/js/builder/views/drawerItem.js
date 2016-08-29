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
		template: '#nf-tmpl-mp-drawer-item',

		initialize: function() {
			this.listenTo( this.model, 'change:title', this.render );
			this.listenTo( this.model.collection, 'change:part', this.maybeChangeActive );
		},

		maybeChangeActive: function() {
			jQuery( this.el ).removeClass( 'active' );
			if ( this.model == this.model.collection.getElement() ) {
				jQuery( this.el ).addClass( 'active' );
			}
		},

		attributes: function() {
			return {
				id: this.model.cid
			}
		},

		onShow: function() {
			var that = this;
			jQuery( this.el ).droppable( {
				activeClass: 'mp-drag-active',
				hoverClass: 'mp-drag-hover',
				accept: '.nf-field-type-draggable, .nf-field-wrap, .nf-stage',
				tolerance: 'pointer',

				over: function( e, ui ) {
					/*
					 * Remove any other draggable placeholders.
					 */
					jQuery( '#nf-main' ).find( '.nf-fields-sortable-placeholder' ).addClass( 'nf-sortable-removed' ).removeClass( 'nf-fields-sortable-placeholder' );

					// Trigger Ninja Forms default handler for being over a field sortable.
					ui.item = ui.draggable;

					if ( jQuery( ui.draggable ).hasClass( 'nf-field-type-draggable' ) || jQuery( ui.draggable ).hasClass( 'nf-stage' ) ) {
						nfRadio.channel( 'app' ).request( 'over:fieldsSortable', ui );
					} else {
						jQuery( ui.helper ).css( { 'width': '300px', 'height': '50px', 'opacity': '0.7' } );
					}
				},

				out: function( e, ui ) {
					/*
					 * Re-add any draggable placeholders that we removed.
					 */
					jQuery( '#nf-main' ).find( '.nf-sortable-removed' ).addClass( 'nf-fields-sortable-placeholder' );

					// Trigger Ninja Forms default handler for being out of a field sortable.
					ui.item = ui.draggable;
					if ( jQuery( ui.draggable ).hasClass( 'nf-field-type-draggable' ) || jQuery( ui.draggable ).hasClass( 'nf-stage' ) ) {
						nfRadio.channel( 'app' ).request( 'out:fieldsSortable', ui );
					} else {
						// Get our sortable element.
						var sortableEl = nfRadio.channel( 'fields' ).request( 'get:sortableEl' );
						// Get our fieldwidth.
						var fieldWidth = jQuery( sortableEl ).width();
						var fieldHeight = jQuery( sortableEl ).height();

						jQuery( ui.helper ).css( { 'width': fieldWidth, 'height': '', 'opacity': '' } );
					}
				},

				drop: function( e, ui ) {
					ui.draggable.dropping = true;
					// Trigger Ninja Forms default handler for being out of a field sortable.
					ui.item = ui.draggable;
					nfRadio.channel( 'app' ).request( 'out:fieldsSortable', ui );

					jQuery( ui.draggable ).effect( 'transfer', { to: jQuery( that.el ) }, 500 );

					if ( jQuery( ui.draggable ).hasClass( 'nf-field-wrap' ) ) { // Dropping a field that already exists
						that.dropField( e, ui );
					} else if ( jQuery( ui.draggable ).hasClass( 'nf-field-type-draggable' ) ) { // Dropping a new field
						that.dropNewField( e, ui );
					} else if ( jQuery( ui.draggable ).hasClass( 'nf-stage' ) ) { // Dropping the staging area
						that.dropStaging( e, ui );
					}
				}
			} );

			this.maybeChangeActive();
		},

		events: {
			'click': 'click'
		},

		click: function( e ) {
			/*
			 * Because our items are stacked, we have to do a bit of investigation to see what the user actually clicked on.
			 */
			if ( jQuery( e.target ).hasClass( 'nf-edit' ) ) {
				var settingGroupCollection = nfRadio.channel( 'mp' ).request( 'get:settingGroupCollection' );
				nfRadio.channel( 'app' ).request( 'open:drawer', 'editSettings', { model: this.model, groupCollection: settingGroupCollection } );
			} else if ( jQuery( e.target ).hasClass( 'nf-duplicate' ) ) {
				var partClone = nfRadio.channel( 'app' ).request( 'clone:modelDeep', this.model );
				this.model.collection.add( partClone );
				partClone.set( 'order', this.model.get( 'order' ) );
				this.model.collection.updateOrder();
				this.model.collection.setElement( partClone );
			} else if ( jQuery( e.target ).hasClass( 'nf-delete' ) ) {
				this.model.collection.remove( this.model );
			} else {
				if ( this.model != this.model.collection.getElement() ) {
					this.model.collection.setElement( this.model );
				}				
			}
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

		dropStaging: function( e, ui ) {
			/*
			 * We are dropping a stage
			 */
			
			// Make sure that our staged fields are sorted properly.	
			nfRadio.channel( 'fields' ).request( 'sort:staging' );
			// Grab our staged fields.
			var stagedFields = nfRadio.channel( 'fields' ).request( 'get:staging' );

			_.each( stagedFields.models, function( field, index ) {
				// Add our field.
				var fieldModel = this.addField( field.get( 'slug' ), this.model.collection );
				this.model.get( 'formContentData' ).trigger( 'append:field', fieldModel );
			}, this );

			// Clear our staging
			nfRadio.channel( 'fields' ).request( 'clear:staging' );
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