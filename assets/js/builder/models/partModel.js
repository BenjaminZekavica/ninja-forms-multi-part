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
			type: 'part',
			clean: true,
			title: 'Part Title'
		},

		initialize: function() {
			/*
			 * TODO: For some reason, each part model is being initialized when you add a new part.
			 */
			this.on( 'change:title', this.unclean );
			this.filterFormContentData();
			this.listenTo( this.get( 'formContentData' ), 'change:order', this.sortFormContentData );
			/*
			 * When we remove a field from our field collection, remove it from this part if it exists there.
			 */
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			this.listenTo( fieldCollection, 'remove', this.triggerRemove );

			/*
			 * Set a key for part.
			 */
			if ( ! this.get( 'key' ) ) {
				this.set( 'key', Math.random().toString( 36 ).replace( /[^a-z]+/g, '' ).substr( 0, 8 ) );
			}
		},

		unclean: function() {
			this.set( 'clean', false );
		},

		sortFormContentData: function() {
			this.get( 'formContentData' ).sort();
		},

		triggerRemove: function( fieldModel ) {
			if ( _.isArray( this.get( 'formContentData' ) ) ) {
				this.filterFormContentData();
			}
			this.get( 'formContentData' ).trigger( 'remove:field', fieldModel );
		},

		filterFormContentData: function() {
			if ( ! this.get( 'formContentData' ) ) return;

			/*
			 * Update our formContentData by running it through our fromContentData filter
			 */
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
			/* 
			* Get our second filter, this will be the one with the highest priority after MP Forms.
			*/
			var sortedArray = _.without( formContentLoadFilters, undefined );
			var callback = sortedArray[ 1 ];
			/*
			 * If our formContentData is an empty array, we want to pass the "empty" flag as true so that filters know it's purposefully empty.
			 */
			var empty = ( 0 == this.get( 'formContentData' ).length ) ? true : false;
			/*
			 * TODO: This is a bandaid fix to prevent forms with layouts and parts from freaking out of layouts & styles are deactivated.
			 * If Layouts is deactivated, it will send the field keys.
			 */
			if ( 'undefined' == typeof formContentLoadFilters[4] && _.isArray( this.get( 'formContentData' ) ) && 0 != this.get( 'formContentData' ).length && 'undefined' != typeof this.get( 'formContentData' )[0].cells ) {
				this.set( 'formContentData', nfRadio.channel( 'fields' ).request( 'get:collection' ).pluck( 'key' ) );
			}

			this.set( 'formContentData', callback( this.get( 'formContentData' ), empty, this.get( 'formContentData' ) ) );
		}

	} );

	return model;
} );
