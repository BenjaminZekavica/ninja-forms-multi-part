jQuery(document).ready(function(jQuery){

	jQuery(".ninja-forms-form").each(function(){
		var form_id = this.id.replace("ninja_forms_form_", "");
		ninja_forms_register_response_function( form_id, 'ninja_forms_error_change_page' );
		ninja_forms_register_before_submit_function( form_id, 'ninja_forms_before_submit_update_progressbar' );
	});

	jQuery(".ninja-forms-mp-nav").click(function(e){
		var form_id = ninja_forms_get_form_id(this);
		var settings = window['ninja_forms_form_' + form_id + '_settings'];
		var mp_settings = window['ninja_forms_form_' + form_id + '_mp_settings'];
		ajax = settings.ajax;
		if( ajax == 1 ){
			e.preventDefault();
			var current_page = jQuery("[name='_current_page']").val();
			current_page = parseInt(current_page);
			var page_count = mp_settings.page_count;
			var effect = mp_settings.effect;
			
			if( this.name == '_next' ){
				var new_page = current_page + 1;
			}else if( this.name == '_prev' ){
				var new_page = current_page - 1;
			}else{
				var new_page = jQuery(this).attr("rel");
			}

			if( current_page != new_page ){
				ninja_forms_mp_change_page( form_id, current_page, new_page, effect );
				ninja_forms_update_progressbar( form_id, new_page );				
			}
		}
	});
});

function ninja_forms_error_change_page(response){

	var form_id = response.form_id;
	var errors = response.errors;
	if( errors != false ){
		var mp_settings = window['ninja_forms_form_' + form_id + '_mp_settings'];
		var extras = response.extras;
		var error_page = extras["_current_page"];
		var current_page = jQuery("[name='_current_page']").val();
		current_page = parseInt(current_page);
		var page_count = mp_settings.page_count;
		var effect = mp_settings.effect;

		if( error_page != page_count  ){
			ninja_forms_mp_change_page( form_id, current_page, error_page, effect );
		}
		ninja_forms_update_progressbar( form_id, error_page );
	}
}

function ninja_forms_mp_change_page( form_id, current_page, new_page, effect ){
	var mp_settings = window['ninja_forms_form_' + form_id + '_mp_settings'];
	var effect_direction = mp_settings.direction;
	var page_count = mp_settings.page_count;

	if( current_page > new_page ){
		direction = 'prev';
	}else{
		direction = 'next';
	}

	if( effect_direction == 'ltr' ){
		if( direction == 'next' ){
			var direction_in = 'left';
			var direction_out = 'right';			
		}else{
			var direction_in = 'right';
			var direction_out = 'left';	
		}
	}else if( effect_direction == 'rtl' ){
		if( direction == 'next' ){
			var direction_in = 'right';
			var direction_out = 'left';			
		}else{
			var direction_in = 'left';
			var direction_out = 'right';	
		}
	}else if( effect_direction == 'ttb' ){
		if( direction == 'next' ){
			var direction_in = 'up';
			var direction_out = 'down';			
		}else{
			var direction_in = 'down';
			var direction_out = 'up';	
		}
	}else if( effect_direction == 'btt' ){
		if( direction == 'next' ){
			var direction_in = 'down';
			var direction_out = 'up';			
		}else{
			var direction_in = 'up';
			var direction_out = 'down';	
		}
	}

   	// run the effect
	jQuery("#ninja_forms_form_" + form_id + "_mp_page_" + current_page).hide( effect, { direction: direction_out }, 300, function(){
		jQuery("#ninja_forms_form_" + form_id + "_mp_page_" + new_page).show( effect, { direction: direction_in }, 200 );
	});
	
	jQuery("[name='_current_page']").val(new_page);

	if( new_page == 1 ){
		jQuery("#ninja_forms_form_" + form_id + "_mp_prev").hide();
		jQuery("#ninja_forms_form_" + form_id + "_mp_next").show();
	}else if( new_page < page_count ){
		jQuery("#ninja_forms_form_" + form_id + "_mp_prev").show();
		jQuery("#ninja_forms_form_" + form_id + "_mp_next").show();
	}else{
		jQuery("#ninja_forms_form_" + form_id + "_mp_prev").show();
		jQuery("#ninja_forms_form_" + form_id + "_mp_next").hide();
	}


	jQuery(".ninja-forms-mp-breadcrumb-active").addClass("ninja-forms-mp-breadcrumb-inactive");
	jQuery(".ninja-forms-mp-breadcrumb-active").removeClass("ninja-forms-mp-breadcrumb-active");
	jQuery("[name='_mp_page_" + new_page + "']").addClass("ninja-forms-mp-breadcrumb-active");
	jQuery("[name='_mp_page_" + new_page + "']").removeClass("ninja-forms-mp-breadcrumb-inactive");
}

function ninja_forms_before_submit_update_progressbar(formData, jqForm, options){
	var form_id = formData[1].value;
	var current_page = jQuery("[name='_current_page']").val();
	current_page = parseInt(current_page);
	current_page++;
	ninja_forms_update_progressbar( form_id, current_page );
}

function ninja_forms_update_progressbar( form_id, current_page ){
	var mp_settings = window['ninja_forms_form_' + form_id + '_mp_settings'];
	var page_count = mp_settings.page_count;
	if( current_page == 1 ){
		var percent = 0;
	}else if( current_page == ( page_count + 1 ) ){
		percent = 100;
	}else{
		current_page--;
		var percent = current_page / page_count;
		percent = Math.ceil( percent * 100 );		
	}

	jQuery("#ninja_forms_form_" + form_id + "_progress_bar").find("span").css( "width", percent + "%" );
}