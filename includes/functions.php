<?php

function ninja_forms_mp_get_pages( $form_id ){
	$field_results = ninja_forms_get_fields_by_form_id( $form_id );
	$pages = array();
	$x = 0;
	foreach( $field_results as $field ){
		if( $field['type'] == '_page_divider' ){
			$x++;
		}
		$pages[$x][] = $field;
	}

	return $pages;
}

function ninja_forms_mp_get_divider_by_page( $form_id, $page ){
	$field_results = ninja_forms_get_fields_by_form_id( $form_id );
	$pages = array();
	$x = 0;
	foreach( $field_results as $field ){
		if( $field['type'] == '_page_divider' ){
			$x++;
			$pages[$x] = $field['id'];
		}
	}

	return $pages[$page];
}

function ninja_forms_mp_get_page_by_divider( $form_id, $field_id ){
	$field_results = ninja_forms_get_fields_by_form_id( $form_id );
	$pages = array();
	$x = 1;
	foreach( $field_results as $field ){
		if( $field['type'] == '_page_divider' ){
			$page = $x;
		}
		$x++;
	}

	return $page;
}

function ninja_forms_mp_get_page_by_field_id( $field_id ) {
	$field = ninja_forms_get_field_by_id( $field_id );
	$form_id = $field['form_id'];
	$pages = ninja_forms_mp_get_pages( $form_id );
	// Loop through our pages until we find this field.
	if ( is_array ( $pages ) ) {
		foreach ( $pages as $num => $page ) {
			if ( is_array( $page ) ) {
				foreach ( $page as $field ) {
					if ( $field['id'] == $field_id ) {
						$page = $num;
						break 2;
					}
				}
			}
		}
	}
	return $page;
}