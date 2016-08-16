/**
 * Interprets formContent data when a form is loaded.
 * Also returns our MP Layout View to use in place of the standard form layout view.
 * 
 * @package Ninja Forms Front-End
 * @subpackage Main App
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( [ 'views/formContent', 'models/partCollection' ], function( FormContentView, PartCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'formContent' ).request( 'add:viewFilter', this.getformContentView, 1 );
			nfRadio.channel( 'formContent' ).request( 'add:loadFilter', this.formContentLoad, 1 );
		},

		/**
		 * Return the MP Content View
		 * 
		 * @since  3.0
		 * @param  {Backbon.Collection} collection formContentData
		 * @return {Backbone.View}            Our MP Content View
		 */
		getformContentView: function( formContentData ) {
			return FormContentView;
		},

		/**
		 * When we load our front-end view, we filter the formContentData.
		 * This turns the saved object into a Backbone Collection.
		 * 
		 * @since  3.0
		 * @param  array formContentData current value of our formContentData.
		 * @return Backbone.Collection
		 */
		formContentLoad: function( partData, formModel ) {
			var partCollection = new PartCollection();
			_.each( partData, function( part ) {
				var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
				/* 
				* Get our second filter, this will be the one with the highest priority after MP Forms.
				*/
				var sortedArray = _.without( formContentLoadFilters, undefined );
				var callback = sortedArray[ 1 ];
				part.formContentData = callback( part.formContentData, formModel, this );
			} );

			partCollection.add( partData );

			return partCollection;
		}
	});

	return controller;
} );