<?php

function ninja_forms_mp_get_pages( $form_id = '' ){
	global $ninja_forms_loading, $ninja_forms_processing;
	
	$field_results = ninja_forms_get_fields_by_form_id( $form_id );

	$pages = array();
	$x = 0;
	$y = 0;
	$last_field = '';
	foreach( $field_results as $field ){

		// if ( isset ( $ninja_forms_loading ) ) {
		// 	$field = $ninja_forms_loading->get_field_settings( $field_id );
		// } else {
		// 	$field = $ninja_forms_processing->get_field_settings( $field_id );
		// }

		if( $field['type'] == '_page_divider' ){
			$x++;
			$y = 0;
			$pages[$x]['id'] = $field['id'];
			$pages[$x]['page_title'] = $field['data']['page_name'];
		} else {
			if ( $y == 0 ) {
				$pages[$x]['first_field'] = $field['id'];
				$y++;
			}
		}

		$pages[$x]['fields'][] = $field;
	
		if ( isset ( $ninja_forms_loading ) ) {
			$ninja_forms_loading->update_field_setting( $field['id'], 'page', $x );
		} else {
			$ninja_forms_processing->update_field_setting( $field['id'], 'page', $x );
		}
	}

	foreach ( $pages as $num => $vars ) {
		$last_field = end( $vars['fields'] );
		$pages[$num]['last_field'] = $last_field['id'];
	}

	return $pages;
}

function ninja_forms_mp_get_divider_by_page( $form_id, $current_page ){
	global $ninja_forms_loading, $ninja_forms_processing;

	if ( isset ( $ninja_forms_loading ) ) {
		$pages = $ninja_forms_loading->get_form_setting( 'mp_pages' );
	} else {
		$pages = $ninja_forms_processing->get_form_setting( 'mp_pages' );
	}

	$divider_id = $pages[$current_page]['id'];

	return $divider_id;
}

function ninja_forms_mp_get_page_by_divider( $form_id, $field_id ){
	global $ninja_forms_loading, $ninja_forms_processing;

	if ( isset ( $ninja_forms_loading ) ) {
		$pages = $ninja_forms_loading->get_form_setting( 'mp_pages' );
	} else {
		$pages = $ninja_forms_processing->get_form_setting( 'mp_pages' );
	}

	$x = 1;
	foreach ( $pages as $num => $vars ) {
		if ( $vars['id'] == $field_id ) {
			$page_num = $x;
			break;
		}
		$x++;
	}

	return $page_num;
}

function ninja_forms_mp_get_page_by_field_id( $field_id ) {
	global $ninja_forms_loading, $ninja_forms_processing;

	if ( isset ( $ninja_forms_loading ) ) {
		$page = $ninja_forms_loading->get_field_setting( $field_id, 'page' );
	} else {
		$page = $ninja_forms_processing->get_field_setting( $field_id, 'page' );
	}

	return $page;
}

/*
 *
 * Function that loops through our pages and adds an array with the pages information to our loading/processing classes.
 *
 * @since 2.4
 * @return void
 */

function ninja_forms_mp_set_page_array( $form_id ) {
	global $ninja_forms_loading, $ninja_forms_processing;

	if ( isset ( $ninja_forms_loading ) ) {
		$form_id = $ninja_forms_loading->get_form_ID();
	} else {
		$form_id = $ninja_forms_processing->get_form_ID();
	}

	$pages = ninja_forms_mp_get_pages( $form_id );

	if ( isset ( $ninja_forms_loading ) ) {
		$ninja_forms_loading->update_form_setting( 'mp_pages', $pages );
	} else {
		$ninja_forms_processing->update_form_setting( 'mp_pages', $pages );
	}
}

add_action( 'ninja_forms_display_init', 'ninja_forms_mp_set_page_array' );
add_action( 'ninja_forms_before_pre_process', 'ninja_forms_mp_set_page_array' );
add_action( 'ninja_forms_edit_sub_pre_process', 'ninja_forms_mp_set_page_array', 3 );