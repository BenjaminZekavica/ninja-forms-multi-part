/**
 * Main layout view
 *
 * Regions:
 * mainContent
 * topDrawer
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [], function() {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#nf-tmpl-mp-layout',

		regions: {
			mainContent: '#nf-mp-main-content',
			topDrawer: '#nf-mp-top-drawer'
		},

		initialize: function() {
			this.listenTo( this.collection, 'change:part', this.changePart );
		},

		onShow: function() {
			/*
			 * Check our fieldContentViewsFilter to see if we have any defined.
			 * If we do, overwrite our default with the view returned from the filter.
			 */
			var formContentViewFilters = nfRadio.channel( 'formContent' ).request( 'get:viewFilters' );
			
			/* 
			* Get our first filter, this will be the one with the highest priority.
			*/
			var sortedArray = _.without( formContentViewFilters, undefined );
			var callback = sortedArray[1];
			this.formContentView = callback();

			/*
			 * Before we display anything, if we don't have any parts, create a new, empty part
			 */
			if ( 0 == this.collection.length ) {
				this.collection.add({});
			}

			this.mainContent.show(  new this.formContentView( { collection: this.collection.getElement().get( 'formContentData' ) } ) );
		},

		changePart: function() {
			this.mainContent.empty();
			this.mainContent.show(  new this.formContentView( { collection: this.collection.getElement().get( 'formContentData' ) } ) );
		}
	});

	return view;
} );