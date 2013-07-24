<?php

/*
 *
 * Function that adds a filter to hide the form if the confirm-submit error has been set.
 *
 * @since 1.0.3
 * @return void
 */

function ninja_forms_mp_confirm_page_check_visibility( $form_id ){
	global $ninja_forms_processing;

	if( is_object( $ninja_forms_processing ) ){
		// Hide the form if the confirm-submit error is set.
		if( $ninja_forms_processing->get_error( 'confirm-submit' ) ){ // Check for the confirm error
			// Add a filter to the form display that will hide the form.
			add_filter( 'ninja_forms_display_fields_wrap_visibility', 'ninja_forms_mp_hide_form', 11, 2 );
			// Add a filter to the breadcrumb display that will hide them.
			add_filter( 'ninja_forms_mp_display_breadcrumbs_visbility', 'ninja_forms_mp_hide_form', 11, 2 );
			// Add a filter to the page title display that will hide them.
			add_filter( 'ninja_forms_display_mp_page_title', 'ninja_forms_mp_hide_page_titles', 10, 3 );
			// Display the confirmation page.
			$html = ninja_forms_mp_output_confirm_page( $form_id );
			echo $html;
		}
	}
}

add_action( 'ninja_forms_display_before_fields', 'ninja_forms_mp_confirm_page_check_visibility', 7 );

/*
 *
 * Function that outputs a hidden field to mark that our confirm page has been seen and agreed to. This function will only output if the form is set to submit via ajax.
 *
 * @since 1.0.3 
 * @returns void
 */

function ninja_forms_mp_output_hidden_confirm( $form_id ){
	$form_row = ninja_forms_get_form_by_id( $form_id );
	if ( isset( $form_row['data']['ajax'] ) AND $form_row['data']['ajax'] == 1 ) {
		echo '<input type="hidden" id="ninja_forms_form_'.$form_id.'_mp_confirm" name="_mp_confirm" value="0">';
	}
}

add_action( 'ninja_forms_display_after_fields', 'ninja_forms_mp_output_hidden_confirm' );


/*
 *
 * Function that filters the form visibility and sets it to 0 so that the form will be hidden.
 *
 * @since 1.0.3
 * @return $display
 */

function ninja_forms_mp_hide_form( $display, $form_id ){
	return 0;
}

 /*
  *
  * Function that filters the page title visibility by returning an empty string.
  * 
  * @since 1.0.3
  * @return $title
  */

function ninja_forms_mp_hide_page_titles( $title, $form_id, $current_page ){
 	return '';
}

 /*
  *
  * Function that outputs the HTML of the confirm page.
  *
  * @since 1.0.3
  * @return $output
  */

function ninja_forms_mp_output_confirm_page( $form_id ){
 	global $ninja_forms_processing, $ninja_forms_fields;
 	// Get the pages for the current form.
 	$pages = ninja_forms_mp_get_pages( $form_id );
 	$form_row = ninja_forms_get_form_by_id( $form_id );
	
	if( is_array( $pages ) ){
		if( is_object( $ninja_forms_processing ) ){
			$html = $ninja_forms_processing->get_form_setting( 'mp_confirm_msg' );
		}else{
			$html = '';	
		}

		foreach ( $pages as $num => $page ) {
			if( function_exists( 'ninja_forms_conditionals_field_filter')  ){
				$show = ninja_forms_mp_check_page_conditional( $form_id, $num );
			} else {
				$show = true;
			}
			if ( $show ) {
				foreach ( $page as $field ) {
					$field_id = $field['id'];
					$field_type = $field['type'];
					if ( isset( $ninja_forms_fields[$field_type] ) ) {
						$reg_field = $ninja_forms_fields[$field_type];
						$display_function = $reg_field['display_function'];
						$process_field = $reg_field['process_field'];
					} else {
						$reg_field = '';
						$display_function = '';
						$process_field = false;
					}
					if ( $field_type == '_page_divider' ) {
						$divider_id = $field['id'];
						if ( isset( $field['data']['page_name'] ) ) {
							$page_name = $field['data']['page_name'];
						} else {
							$page_name = '';
						}
						$breadcrumb = '<input type="submit" id="ninja_forms_field_'.$divider_id.'_breadcrumb" name="_mp_page_'.$num.'" value="'.__( 'Edit', 'ninja-forms-mp' ).' '.$page_name.'" class="ninja-forms-mp-confirm-nav" rel="'.$num.'" style="">';
						$page_title = '<h4>'.$page_name.' - '.$breadcrumb.'</h4>';
						$page_title = apply_filters( 'ninja_forms_mp_confirm_page_title', $page_title, $field_id );
						$html .= $page_title;
					} else if ( $field_type == '_submit' ) {
						$submit = ninja_forms_return_echo( $display_function, $field_id, $field['data'] );
					} else {
						$user_value = $ninja_forms_processing->get_field_value( $field_id );
						$user_value = apply_filters( 'ninja_forms_mp_confirm_user_value', $user_value, $field_id );
						$label = $field['data']['label'];
						if ( $display_function != '' AND $process_field ) {
							if( is_array( $user_value ) ){
								$html .= '<p>'.$label.' - <ul>';
								foreach ( $user_value as $value ) {
									$html .= '<li>'.$value.'</li>';
								}
								$html .= '</ul></p>';
							} else {
								$html .= '<p>'.$label.' - '.$user_value.'</p>';
							}
						}					
					}
				}
			}
		}
		$html .= $submit;
		if ( !isset( $form_row['data']['ajax'] ) OR $form_row['data']['ajax'] != 1 ) {
			$html .= '<input type="hidden" name="_mp_confirm" value="1">';
		}
	}
 	return $html;
}