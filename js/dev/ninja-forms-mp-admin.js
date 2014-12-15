jQuery(document).ready(function($) {

	/* * * Begin Multi-Part Forms Settings JS * * */

	$(document).on( 'click', '.mp-page', function(e){
		var page_number = this.title;
		var current_page = $(".mp-page.active").attr("title");
		if(page_number != current_page){
			ninja_forms_mp_change_page( page_number );
		}
	});

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

	$(document).on( 'click', '.mp-copy-page', function(e){
		e.preventDefault();
		var form_id = $("#_form_id").val();
    	var current_page = $(".mp-page.active").attr("title");
    	var page_count = $(".mp-page").length;

    	$("#ninja_forms_field_list_" + current_page).find(".page-divider").removeClass("not-sortable");

    	$( "#ninja_forms_field_list_" + current_page ).sortable( "refresh" );
    	var fields = $( "#ninja_forms_field_list_" + current_page ).sortable( "toArray" );
    	var field_ids = {};
    	if( fields != '' ){
    		for (var i = fields.length - 1; i >= 0; i--) {
    			// TODO:
    			// Grabbing the ID isn't enough if the metabox is open. Need to check the data model to see if it is open, and if it is,
    			// get the current data from the fields. This means some fields will be passed as IDs and some will have data if the metabox is open when the page is copied.
				field_ids[i] = fields[i].replace("ninja_forms_field_", "");
			}
    		$('.mp-spinner').show();

			$.post( ajaxurl, { form_id: form_id, field_data: field_data, action: 'nf_mp_copy_page', nf_ajax_nonce:ninja_forms_settings.nf_ajax_nonce }, ninja_forms_mp_add_page);

		}
	});

	// Filter our order variable before we save fields.
	$( document ).on( 'nfAdminSaveFields', function( e ) {
		//event.preventDefault();
		$(".page-divider").removeClass("not-sortable");
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

	// Expand our page divider field when the edit button is clicked.
	$( document ).on( 'click', '.page-divider-toggle', function( e ) {
		e.preventDefault();
		$( this ).parent().parent().parent().parent().find( '.inside' ).toggle();
	});


	/* * * End Multi-Part Forms Settings JS * * */


	/**
	 * Deprecated functionailty required for compatibility with Ninja Forms versions before 2.9.
	 *
	 */

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

	/**
	 * End Deprecated ready statements
	 */

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
	fields.add( { id: response.new_id, metabox_state: 1 } );

	// Fire our custom jQuery addField event.
	jQuery( document ).trigger('addField', [ response ]);

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
	fields.add( { id: response.new_id, metabox_state: 1 } );
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