<?php
/*
 *
 * Function used to delete a page from the Field Settings tab. It is called via ajax.
 *
 * @since 1.3
 * @returns void
 */

function nf_mp_delete_page(){
	global $wpdb, $ninja_forms_fields;
	$fields = $_REQUEST['fields'];
	$form_id = $_REQUEST['form_id'];

	if( is_array( $fields ) AND !empty( $fields ) ){
		foreach( $fields as $field ){
			$field_id = str_replace( 'ninja_forms_field_', '', $field );
			ninja_forms_delete_field( $field_id );
		}
	}

	$page_count = nf_mp_get_page_count( $form_id );
	if ( $page_count <= 1 ) {
		nf_mp_delete_dividers( $form_id );
	}

	die();
}

add_action('wp_ajax_nf_mp_delete_page', 'nf_mp_delete_page');

/*
 *
 * Function used to copy a page from the Field Settings tab. It is called via ajax.
 *
 * @since 1.0.3
 * @returns void
 */

function nf_mp_copy_page(){
	$form_id = $_REQUEST['form_id'];
	$field_ids = $_REQUEST['field_ids'];
	$field_data = $_REQUEST['field_data'];
	print_r( $field_data );
	die();
	$new_ids = array();

	$order = 999;

	


	foreach ( $field_ids as $field_id ) {

	}


	
	foreach( $fields[0] as $f => $data ){
		$data = serialize( $data );
		$args = array( 'type' => '_page_divider', 'data' => $data, 'order' => $order, 'fav_id' => 0, 'def_id' => 0 );
		$new_divider = ninja_forms_insert_field( $form_id, $args );
		$new_html = ninja_forms_return_echo( 'ninja_forms_edit_field', $new_divider );
		$new_ids[] = $new_divider;
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

	var_dump( $new_ids );
	die();

	header("Content-type: application/json");
	$array = array( 'new_html' => $new_html, 'new_ids' => $new_ids );
	echo json_encode( $array );
	die();
}

add_action( 'wp_ajax_nf_mp_copy_page', 'nf_mp_copy_page' );

/**
 * Enable multi-part forms by adding a new page. 
 * This adds a divider with an order of 0 and another divider at the end of all the fields.
 *
 * @since 1.3
 * @return void
 */
function nf_mp_enable() {
	$form_id = $_REQUEST['form_id'];
	// Bail if we aren't in the admin
	if ( ! is_admin() )
		return false;

	check_ajax_referer( 'nf_ajax', 'nf_ajax_nonce' );

	// Add a page to the beginning of the form.
	$args = array( 'type' => '_page_divider', 'order' => 0, 'fav_id' => 0, 'def_id' => 0 );
	$new_id = ninja_forms_insert_field( $form_id, $args );

	// Add a page to the end of the form.
	$args = array( 'type' => '_page_divider', 'order' => 999, 'fav_id' => 0, 'def_id' => 0 );
	$new_id = ninja_forms_insert_field( $form_id, $args );

	$new_nav = ninja_forms_return_echo('nf_mp_admin_page_nav', $form_id );
	$new_slide = ninja_forms_return_echo('nf_mp_edit_field_output_ul', $form_id );
	header("Content-type: application/json");
	$array = array ( 'new_nav' => $new_nav, 'new_slide' => $new_slide );
	echo json_encode($array);

	die();
}

add_action( 'wp_ajax_nf_mp_enable', 'nf_mp_enable' );
