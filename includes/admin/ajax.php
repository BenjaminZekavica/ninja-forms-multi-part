<?php
/*
 *
 * Function used to delete a page from the Field Settings tab. It is called via ajax.
 *
 * @since 1.0
 * @returns void
 */

function ninja_forms_mp_delete_page(){
	global $wpdb, $ninja_forms_fields;
	$fields = $_REQUEST['fields'];

	if( is_array( $fields ) AND !empty( $fields ) ){
		foreach( $fields as $field ){
			$field_id = str_replace( 'ninja_forms_field_', '', $field );
			ninja_forms_delete_field( $field_id );
		}
	}
	die();
}

add_action('wp_ajax_ninja_forms_mp_delete_page', 'ninja_forms_mp_delete_page');

/*
 *
 * Function used to copy a page from the Field Settings tab. It is called via ajax.
 *
 * @since 1.0.3
 * @returns void
 */

function ninja_forms_mp_copy_page(){
	$form_id = $_REQUEST['form_id'];
	$fields = $_REQUEST['field_data'];

	$order = 999;
	foreach( $fields[0] as $f => $data ){
		$data = serialize( $data );
		$args = array( 'type' => '_page_divider', 'data' => $data, 'order' => $order, 'fav_id' => 0, 'def_id' => 0 );
		$new_divider = ninja_forms_insert_field( $form_id, $args );
		$new_html = ninja_forms_return_echo( 'ninja_forms_edit_field', $new_divider );		
	}

	unset( $fields[0] );

	$new_fields = array();

	foreach( $fields as $field ){
		foreach( $field as $f => $data ){
			$field_id = str_replace( 'ninja_forms_field_', '', $f );
			$field_row = ninja_forms_get_field_by_id( $field_id );
			$field_type = $field_row['type'];
			if( isset( $field_row['fav_id'] ) ){
				$fav_id = $field_row['fav_id'];
			}else{
				$fav_id = 0;
			}
			if( isset( $field_row['def_id'] ) ){
				$def_id = $field_row['def_id'];
			}else{
				$def_id = 0;
			}
			$data = serialize( $data );
			$args = array( 'type' => $field_type, 'data' => $data, 'order' => $order, 'fav_id' => $fav_id, 'def_id' => $def_id );
			$new_id = ninja_forms_insert_field( $form_id, $args );
			$new_fields[ $field_id ] = $new_id;
		}
	}
	
	do_action( 'nf_mp_copy_page', $new_fields );	

	foreach( $new_fields as $field_id ){
		$new_html .= ninja_forms_return_echo( 'ninja_forms_edit_field', $field_id );
	}

	header("Content-type: application/json");
	$array = array( 'new_html' => $new_html );
	echo json_encode( $array );
	die();
}


add_action( 'wp_ajax_ninja_forms_mp_copy_page', 'ninja_forms_mp_copy_page' );
