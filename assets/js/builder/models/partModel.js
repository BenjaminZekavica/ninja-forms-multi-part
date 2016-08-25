/**
 * Model that represents part information.
 * 
 * @package Ninja Forms Multi-Part
 * @subpackage Fields
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var model = Backbone.Model.extend( {
		defaults: {
			formContentData: [],
			order: 0,
			type: 'part'
		},

		initialize: function() {
			/*
			 * If we don't have a part title, set a default one.
			 */
			if ( ! this.get( 'title' ) ) {
				this.set( 'title', 'Part Title' );
			}

			this.filterFormContentData();
		
			this.listenTo( this.get( 'formContentData' ), 'change:order', this.sortFormContentData );
			/*
			 * When we remove a field from our field collection, remove it from this part if it exists there.
			 */
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			this.listenTo( fieldCollection, 'remove', this.triggerRemove );
		},

		sortFormContentData: function() {
			this.get( 'formContentData' ).sort();
		},

		triggerRemove: function( fieldModel ) {
			if ( jQuery.isArray( this.get( 'formContentData' ) ) ) {
				this.filterFormContentData();
			}
			this.get( 'formContentData' ).trigger( 'remove:field', fieldModel );
		},

		filterFormContentData: function() {
			/*
			 * Update our formContentData by running it through our fromContentData filter
			 */
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
			/* 
			* Get our second filter, this will be the one with the highest priority after MP Forms.
			*/
			var sortedArray = _.without( formContentLoadFilters, undefined );
			var callback = sortedArray[ 1 ];

			this.set( 'formContentData', callback( this.get( 'formContentData' ) ) );
		}

	} );

	return model;
} );
