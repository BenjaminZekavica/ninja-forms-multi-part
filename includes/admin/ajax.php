<?php
add_action('wp_ajax_ninja_forms_mp_delete_page', 'ninja_forms_mp_delete_page');
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