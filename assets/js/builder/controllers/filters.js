/**
 * Add our view and content load filters.
 * 
 * @package Ninja Forms Multi-Part
 * @subpackage Fields
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define(
	[
		'views/layout',
		'views/gutterLeft',
		'views/gutterRight',
		'models/partCollection',
	],
	function (
		LayoutView,
		GutterLeftView,
		GutterRightView,
		PartCollection
	)
	{
	var controller = Marionette.Object.extend( {
		initialize: function() {
			this.listenTo( nfRadio.channel( 'app' ), 'after:loadControllers', this.addFilters );
		},

		addFilters: function() {
			nfRadio.channel( 'formContentGutters' ).request( 'add:leftFilter', this.getLeftView, 1, this );
			nfRadio.channel( 'formContentGutters' ).request( 'add:rightFilter', this.getRightView, 1, this );
		
			nfRadio.channel( 'formContent' ).request( 'add:viewFilter', this.getContentView, 1 );
			nfRadio.channel( 'formContent' ).request( 'add:saveFilter', this.formContentSave, 1 );
			nfRadio.channel( 'formContent' ).request( 'add:loadFilter', this.formContentLoad, 1 );
		
		},

		getLeftView: function() {
			return GutterLeftView;
		},

		getRightView: function() {
			return GutterRightView;
		},

		formContentLoad: function( formContentData ) {
			var partCollection = new PartCollection( formContentData );
			nfRadio.channel( 'mp' ).request( 'init:partCollection', partCollection );
			return partCollection;
		},

		getContentView: function() {
			return LayoutView;
		},

		formContentSave: function( partCollection ) {
			/*
			 * For each of our part models, call the next save filter for its formContentData
			 */
			var collectionClone = nfRadio.channel( 'app' ).request( 'clone:collectionDeep', partCollection );
			
			/*
			 * If we don't have a filter for our formContentData, default to fieldCollection.
			 */
			var formContentSaveFilters = nfRadio.channel( 'formContent' ).request( 'get:saveFilters' );
			
			collectionClone.each( function( partModel ) {
				/* 
				 * Get our first filter, this will be the one with the highest priority.
				 */
				var sortedArray = _.without( formContentSaveFilters, undefined );
				var callback = sortedArray[1];
				partModel.set( 'formContentData', callback( partModel.get( 'formContentData' ) ) );
			} );

			return collectionClone.toJSON();
		}

	});

	return controller;
} );