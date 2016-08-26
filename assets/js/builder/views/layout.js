/**
 * Main layout view
 *
 * Regions:
 * mainContent
 * drawer
 * 
 * @package Ninja Forms builder
 * @subpackage App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [ 'views/drawerCollection' ], function( DrawerCollectionView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		template: '#nf-tmpl-mp-layout',

		regions: {
			mainContent: '#nf-mp-main-content',
			drawer: '#nf-mp-drawer'
		},

		initialize: function() {
			this.listenTo( this.collection, 'change:part', this.changePart );
		},

		onShow: function() {
			this.drawer.show( new DrawerCollectionView( { collection: this.collection } ) );


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
				this.collection.add( {}, { silent: true } );
			}

			this.mainContent.show(  new this.formContentView( { collection: this.collection.getFormContentData() } ) );

		},

		changePart: function() {
			var currentIndex = this.collection.indexOf( this.collection.getElement() );
			var previousIndex = this.collection.indexOf( this.collection.previousElement );

			if ( currentIndex > previousIndex ) {
				var hideDir = 'left';
				var showDir = 'right';
			} else {
				var hideDir = 'right';
				var showDir = 'left';
			}

			var that = this;
			/*
			 * Start our current part sliding out.
			 */
			jQuery( this.mainContent.el ).hide( 'slide', { direction: hideDir }, 300, function() {
				that.mainContent.empty();
				that.mainContent.show( new that.formContentView( { collection: that.collection.getFormContentData() } ) );
			} );

			jQuery( that.mainContent.el ).show( 'slide', { direction: showDir }, 200 );
		}
	});

	return view;
} );