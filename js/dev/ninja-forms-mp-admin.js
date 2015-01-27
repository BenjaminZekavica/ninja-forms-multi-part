// Setup our page data models to track which pages exist and what fields are on them.
// Model to hold our page settings.
var nfPage = Backbone.Model.extend( {
	duplicate: function() {
		console.log( 'hi' );
	}
} );
// Collection to hold our fields.
var nfPages = Backbone.Collection.extend({
	model: nfPage,
	enable: function() {
		console.log( 'hello' );
	}
});

// Instantiate our fields collection.
var nfPages = new nfPages();

jQuery(document).ready(function($) {

	nfPages.current_page = 1;
	nfPages.count = 1;
	// Loop through our MP pages JSON that is already on the page and populate our collection with it.
	if( 'undefined' !== typeof nf_mp.pages ) {
		var x = 1;
		_.each( nf_mp.pages, function( page ) {
			nfPages.add( { id: x, divider_id: page.id, page_title: page.page_title, fields: page.fields } );
			x++;
		} );
		nfPages.count = x - 1;
	}

	/**
	 * Function that makes an ajax call to add a divider to the beginning and end of our form.
	 *
	 */

	$( document ).on( 'click', '#nf_mp_enable', function( e ) {
		// Hide our "enable multi-part" button.
		$( this ).fadeOut();
		// Get our current form ID.
		var form_id = ninja_forms_settings.form_id;

		// Post to our PHP handler.
		$.post( ajaxurl, { form_id: form_id, action: 'nf_mp_enable', nf_ajax_nonce:ninja_forms_settings.nf_ajax_nonce }, function( response ) {

			// Add our newly created page dividers to the field list.
			_.each( response.new_parts, function( part ) {
				// Add our newly created pages to our part model.
				nfPages.add( { id: part.num, divider_id: part.id, page_title: '', fields: part.fields } );				
				// Add our field to our backbone data model.
				nfFields.add( { id: part.id, metabox_state: 0 } );
			} );

			// Set our page count to 2.
			nfPages.count = 2;

			// Update our multi-part pagination UL HTML.
			$( '#ninja_forms_mp_pagination' ).html( response.new_nav );
			// Update our field list HTML.
			$( '#ninja_forms_slide' ).html( response.new_slide );
			// Make our newly added field lists sortable.
			$( '.ninja-forms-field-list' ).sortable({
				handle: '.menu-item-handle',
				items: "li:not(.not-sortable)",
				connectWith: '.ninja-forms-field-list',
				//cursorAt: {left: -10, top: -1},
				start: function(e, ui){
					var wp_editor_count = $(ui.item).find('.wp-editor-wrap').length;
					if(wp_editor_count > 0){
						$(ui.item).find('.wp-editor-wrap').each(function(){
							var ed_id = this.id.replace('wp-', '');
							ed_id = ed_id.replace('-wrap', '');
							tinyMCE.execCommand( 'mceRemoveControl', false, ed_id );
						});
					}
				},
				stop: function(e,ui) {
					var wp_editor_count = $(ui.item).find('.wp-editor-wrap').length;
					if( wp_editor_count > 0 ){
						$( ui.item ).find( '.wp-editor-wrap' ).each( function() {
							var ed_id = this.id.replace( 'wp-', '' );
							ed_id = ed_id.replace( '-wrap', '' );
							tinyMCE.execCommand( 'mceAddControl', true, ed_id );
						});
					}
					$( this ).sortable( 'refresh' );
				}
			} );
			// Show our newly added multi-part pagination.
			$( '#ninja_forms_mp_pagination' ).fadeIn();

		} );
	} );

	$(document).on( 'click', '.mp-page-nav', function(e){
		var page_number = $( this ).data( 'page' );
		var current_page = nfPages.current_page;

		if( page_number != current_page ) {
			nf_mp_change_page( page_number );
		}
	});

	$( document ).on( 'click', '.mp-remove-page', function( e ) {
    	var answer = confirm( nf_mp.remove_page_text );

    	if( answer ) {
			var form_id = ninja_forms_settings.form_id;
	    	var current_page = nfPages.current_page;
	    	var page_count = nfPages.count;

	    	if(page_count > 1){
	    		$("#ninja_forms_field_list_" + current_page).find("._page_divider-li").removeClass("not-sortable");
	    	}

	    	var fields = nfPages.get( current_page ).get( 'fields' );

	    	if( fields.length > 0 ){
	    		// Show our MP spinner
	    		$( '.mp-spinner' ).show();

				if ( current_page > 1 ) {
		    		move_to_page = current_page - 1;
		    	}else{
		    		move_to_page = 1;
		    	}

				$.post( ajaxurl, { form_id: form_id, fields: fields, move_to_page: move_to_page, action: 'nf_mp_delete_page', nf_ajax_nonce:ninja_forms_settings.nf_ajax_nonce }, function(response){
					// Hide our MP spinner
					$( '.mp-spinner' ).hide();

					if( page_count == 2 ){
						nf_mp_change_page( 1 );
						$( '._page_divider-li' ).remove();
						$( '#ninja_forms_mp_pagination' ).fadeOut();
						$( '#nf_mp_enable' ).fadeIn();
					}else{
						var part = nfPages.get( current_page );

						// Remove our part nav button
				    	$( '#mp-page-list' ).find( '[data-page="' + current_page + '"]' ).remove();

				    	// Remove our part UL
				    	$( '#ninja_forms_slide' ).find( '[data-page="' + current_page + '"]' ).remove();

				    	// Remove our current page from the nfPages collection
				    	nfPages.remove( part );

				    	// Recalculate our part numbers
				    	var x = 1;
				    	_.each( nfPages.models, function( part ) {
				    		part.set( 'id', x );
				    		var tmp = x++;
				    		$( '#mp-page-list' ).find( '[data-page="' + tmp + '"]' ).html( tmp );
				    		x++;
				    	} );

				    	// Move to our previous/next page.
				    	nf_mp_change_page( move_to_page );
					}

					nfPages.count--;

			    });
			}
		}
    });


	// Filter our order variable before we save fields.
	$( document ).on( 'nfAdminSaveFields.mpFilter', function( e ) {
		//event.preventDefault();
		$("._page_divider-li").removeClass("not-sortable");
		$(".ninja-forms-field-list").sortable("refresh");
		var current_order = '';
		$(".ninja-forms-field-list").each(function(){
			if(current_order != ''){
				current_order = current_order + ",";
			}
			current_order = current_order + $(this).sortable('toArray');
		});
		current_order = current_order.split( ',' );
		var order = {};
		for ( var i = 0; i < current_order.length; i++ ) {
			order[i] = current_order[i];
		};
		order = JSON.stringify( order );

		$( document ).data( 'field_order', order );

	} );

	// Remove our default addField behaviour
	$( document ).off( 'addField.default' );

	// Add our custom addField behaviour
	$( document ).on( 'addField.mpAdd', function( e, response ) {
		var current_page = nfPages.current_page;

		jQuery("#ninja_forms_field_list_" + current_page).append(response.new_html);
		if ( response.new_type == 'List' ) {
			//Make List Options sortable
			jQuery(".ninja-forms-field-list-options").sortable({
				helper: 'clone',
				handle: '.ninja-forms-drag',
				items: 'div',
				placeholder: "ui-state-highlight",
			});
		}
		if ( typeof nf_ajax_rte_editors !== 'undefined' ) {
			for (var x = nf_ajax_rte_editors.length - 1; x >= 0; x--) {
				var editor_id = nf_ajax_rte_editors[x];
				tinyMCE.init( tinyMCEPreInit.mceInit[ editor_id ] );
				try { quicktags( tinyMCEPreInit.qtInit[ editor_id ] ); } catch(e){}
			};
		}

		// Add our field to our backbone data model.
		nfFields.add( { id: response.new_id, metabox_state: 1 } );

		// Add our field to this page.
		var page = nfPages.get( current_page );
		var page_fields = page.get( 'fields' );
		page_fields.push( response.new_id.toString() );
		page.set( 'fields', page_fields );
	} );

	// Add our custom removeField behaviour
	// This function removes the field id from its page model when the field is removed.
	$( document ).on( 'removeField', function( e, field_id ) {
		var page = nfPages.get( nfPages.current_page );
		var page_fields = page.get( 'fields' );
		page_fields = nf_mp_remove_array_value( page_fields, field_id );
		page.set( 'fields', page_fields );
	} );

	// When a user clicks the "copy mp page" link, copy the page and add it to the editor.
	$( document ).on( 'click', '.mp-copy-page', function( e ) {
		e.preventDefault();
		var form_id = ninja_forms_settings.form_id;
		var page = nfPages.get( nfPages.current_page );
		nf_update_all_fields();
		var field_data = JSON.stringify( nfFields.toJSON() );

		// Show our MP spinner
		$( '.mp-spinner' ).show();

		$.post( ajaxurl, { form_id: form_id, field_ids: page.get( 'fields' ), field_data: field_data, action: 'nf_mp_copy_page', nf_ajax_nonce:ninja_forms_settings.nf_ajax_nonce }, function(response){
			// Hide our MP spinner
			$( '.mp-spinner' ).hide();
					
			// Update our part navigation
			$( '#ninja_forms_mp_pagination' ).html( response.new_nav );
			// Update our field list HTML.
			$( '#ninja_forms_slide' ).html( response.new_slide );

			// Update our page and field data models
			// Update our page data model.
			nfPages.add( { id: response.new_part.num, divider_id: response.new_part.id, page_title: response.new_part.page_title, fields: response.new_part.fields } );
			// Increase our page count.
			nfPages.count++;
			// Add our new fields to the fields data model.
			_.each( response.new_part.fields, function( field_id ) {
				// Add our field to our backbone data model.
				nfFields.add( { id: field_id, metabox_state: 0 } );
			} );

			// Make our newly added field lists sortable.
			$( '.ninja-forms-field-list' ).sortable({
				handle: '.menu-item-handle',
				items: "li:not(.not-sortable)",
				connectWith: '.ninja-forms-field-list',
				//cursorAt: {left: -10, top: -1},
				start: function(e, ui){
					var wp_editor_count = $(ui.item).find('.wp-editor-wrap').length;
					if(wp_editor_count > 0){
						$(ui.item).find('.wp-editor-wrap').each(function(){
							var ed_id = this.id.replace('wp-', '');
							ed_id = ed_id.replace('-wrap', '');
							tinyMCE.execCommand( 'mceRemoveControl', false, ed_id );
						});
					}
				},
				stop: function(e,ui) {
					var wp_editor_count = $(ui.item).find('.wp-editor-wrap').length;
					if(wp_editor_count > 0){
						$(ui.item).find('.wp-editor-wrap').each(function(){
							var ed_id = this.id.replace('wp-', '');
							ed_id = ed_id.replace('-wrap', '');
							tinyMCE.execCommand( 'mceAddControl', true, ed_id );
						});
					}
					$(this).sortable('refresh');
				}
			});

			// Move to our current page.
			nf_mp_change_page( response.new_part.num );

		} );
		
	} );

} ); // Main document.ready

function nf_mp_change_page( page_number, callback ){
	if(!callback){
		var callback = '';
	}
	nfPages.current_page = page_number;
	jQuery(".mp-page-nav").removeClass("active");
	jQuery("#ninja_forms_mp_page_" + page_number).addClass("active");
	var new_page = jQuery("#ninja_forms_field_list_" + page_number).position().left;
	jQuery("#ninja_forms_slide").animate({left: -new_page},"300", callback);
}


	/**
	 * Deprecated functionailty required for compatibility with Ninja Forms versions before 2.9.
	 *
	 */
jQuery(document).ready(function($) {

	$("#mp-page-list").sortable({
		 //placeholder: "drop-hover",
		 helper: "clone",
		 tolerance: "pointer",
		 update: function( event, ui ) {

		 	$("#mp-page-list li").each(function(index){
		 		var page = index + 1;
		 		$( "#ninja_forms_field_list_" + $(this).prop("title") ).data("order", page);
		 		//if( $("#_current_page").val() == $(this).prop("title") ) {
		 			//$("#_current_page").val(page);
		 		//}
		 		$(this).prop("title", page);
		 		$(this).prop("id", "ninja_forms_mp_page_" + page );
		 		$(this).html(page);
		 		//console.log( $( "#ninja_forms_field_list_" + $(this).prop( "title" ) ).data( "order") );
		 	});

		 	var div = $('#ninja-forms-slide');
		 	
		    uls = div.children('ul');

		    uls.detach().sort(function(a,b) {
		        return $(a).data('order') - $(b).data('order');  
		    });

		    uls.each(function(index){
		    	var page = index + 1;
		    	$(this).prop("id", "ninja_forms_field_list_" + page );
		    });

		    div.append(uls);
		    if ( $( ui.item ).hasClass( 'active' ) ) {
		    	$("#_current_page").val( $( ui.item ).prop("title"));
		    }
		    var current_page = $("#_current_page").val();
			ninja_forms_mp_change_page(current_page);
		 }
	});
	$("#mp-page-list").disableSelection();

	$(".mp-page").droppable({
        accept: ".ninja-forms-field-list li",
        hoverClass: "drop-hover",
        tolerance: "pointer",
		drop: function( event, ui ) {
			$(".spinner").show();
			var page_number = this.title;
       
			ui.draggable.hide( "slow", function() {
                $( this ).appendTo( "#ninja_forms_field_list_" + page_number ).show( "slow" );
                $(".spinner").hide();
				//ninja_forms_mp_change_page( page_number );   
            });
		}
    });

    $(".mp-add").click(function(){
    	var type = "_page_divider";
		var form_id = $("#_form_id").val();
		$(".spinner").show();
		
		$.post( ajaxurl, { type: type, form_id: form_id, action:"ninja_forms_new_field", nf_ajax_nonce:ninja_forms_settings.nf_ajax_nonce }, ninja_forms_mp_add_page );
    });

    $(".mp-add").droppable({
        accept: ".ninja-forms-field-list li",
        hoverClass: "drop-hover",
        tolerance: "pointer",
		drop: function( event, ui ) {
			var type = "_page_divider";
			var form_id = $("#_form_id").val();
			$(".spinner").show();
			$.post( ajaxurl, { type: type, form_id: form_id, action:"ninja_forms_new_field", nf_ajax_nonce:ninja_forms_settings.nf_ajax_nonce }, function(response){
				ninja_forms_mp_add_page(response);
				var page_number = jQuery(".mp-page").length;
				//var page_number = this.title;
				       
				ui.draggable.hide( "slow", function() {
	                $( this ).appendTo( "#ninja_forms_field_list_" + page_number ).show( "slow" );
					//ninja_forms_mp_change_page( page_number, ninja_forms_mp_hide_spinner );   
	            });
			});
			
		}
    });

    $(".mp-subtract").click(function(){
    	var answer = confirm("Really delete this page? All fields will be removed.");
    	if(answer){
			var form_id = $("#_form_id").val();
	    	var current_page = $(".mp-page.active").attr("title");
	    	var page_count = $(".mp-page").length;

	    	if(page_count > 1){
	    		$("#ninja_forms_field_list_" + current_page).find(".page-divider").removeClass("not-sortable");
	    	}

	    	var fields = $("#ninja_forms_field_list_" + current_page).sortable("toArray");

	    	if(fields != ''){
	    		$(".spinner").show();

				$.post( ajaxurl, { form_id: form_id, fields: fields, action:"ninja_forms_mp_delete_page", nf_ajax_nonce:ninja_forms_settings.nf_ajax_nonce }, function(response){

					if(page_count == 1){
						for (var i = fields.length - 1; i >= 0; i--) {
							$("#" + fields[i] ).remove();
						};
					}else{
						if(current_page > 1){
				    		move_to_page = current_page - 1;
				    	}else{
				    		move_to_page = 1;
				    	}
									    	
				    	$("#ninja_forms_field_list_" + current_page).remove();
				    	$("#ninja_forms_mp_page_" + current_page).remove();

				    	
				    	var i = 1;
				    	$(".mp-page").each(function(){
				    		$(this).prop("id", "ninja_forms_mp_page_" + i);
				    		$(this).prop("innerHTML", i);
				    		$(this).attr("title", i);
				    		i++;
				    	});
						/*
				    	var i = 1;
				    	$(".ninja-forms-style-sortable").each(function(){
				    		$(this).prop("id", "ninja_forms_style_list_" + i);
				    		i++;
				    	});

				    	console.log(move_to_page);

				    	ninja_forms_mp_change_page(move_to_page, ninja_forms_mp_hide_spinner);
				    	*/

				    	var div = $('#ninja-forms-slide');
		 	
					    uls = div.children('ul');

					    uls.detach().sort(function(a,b) {
					        return $(a).data('order') - $(b).data('order');  
					    });

					    uls.each(function(index){
					    	var page = index + 1;
					    	$(this).prop("id", "ninja_forms_field_list_" + page );
					    });

					    div.append(uls);
						ninja_forms_mp_change_page(move_to_page, ninja_forms_mp_hide_spinner);
					}
			    });
			}
		}
    });

	// Expand our page divider field when the edit button is clicked.
	$( document ).on( 'click', '.page-divider-toggle', function( e ) {
		e.preventDefault();
		$( this ).parent().parent().parent().parent().find( '.inside' ).toggle();
	});

	$(".ninja-forms-save-data").click(function(event){
		//event.preventDefault();
		$(".page-divider").removeClass("not-sortable");
		$(".ninja-forms-field-list").sortable("refresh");
		var order = '';
		$(".ninja-forms-field-list").each(function(){
			if(order != ''){
				order = order + ",";
			}
			order = order + $(this).sortable('toArray');
		})
		$("#ninja_forms_field_order").val(order);
	});


	$(document).on( 'click', '.ninja-forms-mp-copy-page', function(e){
		e.preventDefault();
		var form_id = $("#_form_id").val();
    	var current_page = $(".mp-page.active").attr("title");
    	var page_count = $(".mp-page").length;
    	var field_data = {};

    	// if(page_count > 1){
    		$("#ninja_forms_field_list_" + current_page).find(".page-divider").removeClass("not-sortable");
    	// }

    	$( "#ninja_forms_field_list_" + current_page ).sortable( "refresh" );
    	var fields = $( "#ninja_forms_field_list_" + current_page ).sortable( "toArray" );
    	
    	if(fields != ''){
    		for (var i = fields.length - 1; i >= 0; i--) {
				var field_id = fields[i].replace("ninja_forms_field_", "");
				field_data[i] = ninja_forms_mp_serialize_data( field_id );
    		};
    		$(".spinner").show();

			$.post( ajaxurl, { form_id: form_id, field_data: field_data, action:"ninja_forms_mp_copy_page", nf_ajax_nonce:ninja_forms_settings.nf_ajax_nonce }, ninja_forms_mp_add_page);

		}
	});


});

function ninja_forms_mp_change_page( page_number, callback ){
	if(!callback){
		var callback = '';
	}
	jQuery("#_current_page").val(page_number);
	jQuery(".mp-page").removeClass("active");
	jQuery("#ninja_forms_mp_page_" + page_number).addClass("active");
	var new_page = jQuery("#ninja_forms_field_list_" + page_number).position().left;
	jQuery("#ninja-forms-slide").animate({left: -new_page},"300", callback);
}

function ninja_forms_new_field_response( response ){

	var current_page = jQuery(".mp-page.active").attr("title");

	jQuery("#ninja_forms_field_list_" + current_page).append(response.new_html);
	if ( response.new_type == 'List' ) {
		//Make List Options sortable
		jQuery(".ninja-forms-field-list-options").sortable({
			helper: 'clone',
			handle: '.ninja-forms-drag',
			items: 'div',
			placeholder: "ui-state-highlight",
		});
	}
	if ( typeof nf_ajax_rte_editors !== 'undefined' ) {
		for (var x = nf_ajax_rte_editors.length - 1; x >= 0; x--) {
			var editor_id = nf_ajax_rte_editors[x];
			tinyMCE.init( tinyMCEPreInit.mceInit[ editor_id ] );
			try { quicktags( tinyMCEPreInit.qtInit[ editor_id ] ); } catch(e){}
		};
	}

	jQuery(".ninja-forms-field-conditional-cr-field").each(function(){
		jQuery(this).append('<option value="' + response.new_id + '">' + response.new_type + '</option>');
	});

	// Add our field to our backbone data model.
	nfFields.add( { id: response.new_id, metabox_state: 1 } );

	// Fire our custom jQuery addField event.
	jQuery( document ).trigger( 'addField', [ response ] );

}

function ninja_forms_mp_add_page( response ){
	console.log( response );
	return false;
	var last_page = jQuery(".mp-page").length;
	var new_page = last_page + 1;
	var ul_html = '<ul class="menu ninja-forms-field-list" id="ninja_forms_field_list_' + new_page + '" data-order="' + new_page + '"></ul>';
	var li_html = '<li class="active mp-page" title="' + new_page + '" id="ninja_forms_mp_page_' + new_page + '">' + new_page + '</li>';
	jQuery("#mp-page-list").append(li_html);

	jQuery(".mp-page").droppable({
        accept: ".ninja-forms-field-list li",
        hoverClass: "drop-hover",
        tolerance: "pointer",
		drop: function( event, ui ) {
			var page_number = this.title;
       
			ui.draggable.hide( "slow", function() {
                jQuery( this ).appendTo( "#ninja_forms_field_list_" + page_number ).show( "slow" );
				//ninja_forms_mp_change_page( page_number );   
            });
		}
    });

	jQuery("#ninja-forms-slide").append(ul_html);

	jQuery("#ninja_forms_field_list_" + new_page).append(response.new_html);
	ninja_forms_mp_change_page( new_page, ninja_forms_mp_page_added );

	// Add our field to our backbone data model.
	nfFields.add( { id: response.new_id, metabox_state: 1 } );
}

function ninja_forms_mp_page_added(){
	var current_page = jQuery(".mp-page:last").attr("title");
	var new_id = jQuery(".mp-page-name:last").prop("id");
	new_id = new_id.replace("ninja_forms_field_", "");
	new_id = new_id.replace("_page_name", "");
	jQuery("#ninja_forms_field_" + new_id + "_page_name").focus();

	jQuery("#ninja_forms_field_list_" + current_page).sortable({
		handle: '.menu-item-handle',
		items: "li:not(.not-sortable)",
		connectWith: ".ninja-forms-field-list",
		//cursorAt: {left: -10, top: -1},
		start: function(e, ui){
			var wp_editor_count = jQuery(ui.item).find(".wp-editor-wrap").length;
			if(wp_editor_count > 0){
				jQuery(ui.item).find(".wp-editor-wrap").each(function(){
					var ed_id = this.id.replace("wp-", "");
					ed_id = ed_id.replace("-wrap", "");
					tinyMCE.execCommand( 'mceRemoveControl', false, ed_id );
				});
			}
		},
		stop: function(e,ui) {
			var wp_editor_count = jQuery(ui.item).find(".wp-editor-wrap").length;
			if(wp_editor_count > 0){
				jQuery(ui.item).find(".wp-editor-wrap").each(function(){
					var ed_id = this.id.replace("wp-", "");
					ed_id = ed_id.replace("-wrap", "");
					tinyMCE.execCommand( 'mceAddControl', true, ed_id );
				});
			}
			jQuery(this).sortable("refresh");
		}
	});
	jQuery(".spinner").hide();
}

function ninja_forms_mp_hide_spinner(){
	jQuery(".spinner").hide();
}

function ninja_forms_mp_serialize_data( field_id ){
	var data = jQuery("#ninja_forms_field_" + field_id).find(":input[name^=ninja_forms_field_" + field_id + "]");
	var field_data = jQuery(data).serializeFullArray();
	return field_data;
}

function nf_mp_remove_array_value( arr ) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}