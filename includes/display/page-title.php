<?php
/**
 * Outputs the HTML for the Multi-Part Form Page Title.
 *
**/

function ninja_forms_mp_check_page_title( $form_id ){
	global $ninja_forms_processing;
	$form_row = ninja_forms_get_form_by_id( $form_id );
	$form_data = $form_row['data'];
	if( isset( $form_data['mp_display_titles'] ) AND $form_data['mp_display_titles'] == 1 ){
		if( isset( $form_data['ajax'] ) ){
			$ajax = $form_data['ajax'];
		}else{
			$ajax = 0;
		}
		if( $ajax == 1 ){
			add_action( 'ninja_forms_display_mp_page_before_fields', 'ninja_forms_mp_display_page_title', 10, 2 );
			remove_action( 'ninja_forms_display_before_fields', 'ninja_forms_display_req_items', 12 );
			add_action( 'ninja_forms_display_mp_page_before_fields', 'ninja_forms_mp_display_page_req_items', 10, 2 );
		}else{
			ninja_forms_mp_display_page_title( $form_id );
		}
	}
}

function ninja_forms_mp_display_page_title( $form_id, $page = '' ){
	global $ninja_forms_processing;
	if( ( isset( $ninja_forms_processing ) AND $ninja_forms_processing->get_form_setting( 'processing_complete' ) != 1 ) OR !isset ( $ninja_forms_processing ) ){
		if( $page != '' ){
			$current_page = $page;
		}else{
			if( is_object( $ninja_forms_processing ) ){
				$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );
			}else{
				$current_page = 1;
			}
		}

		$all_fields = ninja_forms_get_fields_by_form_id( $form_id );

		if( is_array( $all_fields ) AND !empty( $all_fields ) ){
			$pages = array();
			$this_page = array();
			$x = 0;
			foreach( $all_fields as $field ){
				if( $field['type'] == '_page_divider' ){
					$x++;
					if ( isset( $field['data']['page_name'] ) ) {
						$page_name = $field['data']['page_name'];
					} else {
						$page_name = '';
					}
					$pages[$x]['page_title'] = $page_name;
				}
			}
		}

		if( isset( $pages[$current_page]['page_title'] ) ){
			$page_title = $pages[$current_page]['page_title'];
		}else{
			$page_title = '';
		}
		$title = '<h4>'.$page_title.'</h4>';
		$title = apply_filters( 'ninja_forms_display_mp_page_title', $title, $form_id, $current_page );
		echo $title;	
	}
}

add_action( 'ninja_forms_display_before_fields', 'ninja_forms_mp_check_page_title', 9 );

function ninja_forms_mp_display_page_req_items( $form_id, $page ){

	$all_fields = ninja_forms_get_fields_by_form_id( $form_id );

	if( is_array( $all_fields ) AND !empty( $all_fields ) ){
		$pages = array();
		$x = 0;
		foreach( $all_fields as $field ){
			if( $field['type'] == '_page_divider' ){
				$x++;
			}else{
				$pages[$x][] = $field;
			}
		}
	}

	$found = false;
	foreach( $pages[$page] as $fields ){
		if( isset( $fields['data']['req'] ) AND $fields['data']['req'] == 1 ){
			$found = true;
			break;
		}
	}

	if( $found ){
		ninja_forms_display_req_items( $form_id );
	}
}