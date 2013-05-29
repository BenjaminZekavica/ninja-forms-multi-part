<?php

add_action( 'init', 'ninja_forms_register_mp_remove_save' );
function ninja_forms_register_mp_remove_save(){
	global $ninja_forms_processing;
	if( is_object( $ninja_forms_processing ) AND $ninja_forms_processing->get_form_setting( 'ajax' ) != 1 ){
		add_action( 'ninja_forms_before_pre_process', 'ninja_forms_mp_remove_save', 9 );
	}
}

function ninja_forms_mp_remove_save(){
	global $ninja_forms_processing, $ninja_forms_fields;

	if( is_object( $ninja_forms_processing ) AND $ninja_forms_processing->get_form_setting( 'multi_part' ) == 1 ){
		$nav = '';
		$form_id = $ninja_forms_processing->get_form_ID();
		$all_extras = $ninja_forms_processing->get_all_extras();
		if( is_array( $all_extras ) AND !empty( $all_extras ) ){
			foreach( $all_extras as $key => $val ){
				if( strpos( $key, '_mp_page_' ) !== false ){
					$nav = str_replace( '_mp_page_', '', $key );
					if( !$ninja_forms_processing->get_all_errors() ){
						$ninja_forms_processing->update_extra_value( '_current_page', $nav );	
					}
				}
			}
		}

		if( $ninja_forms_processing->get_extra_value( '_prev' ) ){
			$nav = 'prev';
		}

		if( $ninja_forms_processing->get_extra_value( '_next' ) ){
			$nav = 'next';
		}

		if( $nav != '' ){
			remove_action( 'ninja_forms_pre_process', 'ninja_forms_req_fields_process', 13 );
			$ninja_forms_processing->set_action( 'mp_save' );
			remove_action( 'ninja_forms_post_process', 'ninja_forms_save_sub' );
		}
	}
	
}

add_action( 'init', 'ninja_forms_mp_register_save_page' );
function ninja_forms_mp_register_save_page(){
	global $ninja_forms_processing;

	if( is_object( $ninja_forms_processing ) AND $ninja_forms_processing->get_form_setting( 'ajax' ) != 1 ){
		add_action( 'ninja_forms_pre_process', 'ninja_forms_mp_save_page', 12 );
		add_action( 'ninja_forms_edit_sub_pre_process', 'ninja_forms_mp_save_page', 1001 );		
	}
	add_action( 'ninja_forms_pre_process', 'ninja_forms_mp_error_change_page', 20 );
}

function ninja_forms_mp_error_change_page(){
	global $ninja_forms_processing;
	//print_r( $ninja_forms_processing->get_all_fields() );
	if( $ninja_forms_processing->get_action() == 'submit'AND $ninja_forms_processing->get_form_setting( 'multi_part' ) == 1 ){
		
		if( $ninja_forms_processing->get_all_errors() ){
			$form_id = $ninja_forms_processing->get_form_ID();
			$all_fields = ninja_forms_get_fields_by_form_id( $form_id );

			if( is_array( $all_fields ) AND !empty( $all_fields ) ){
				$pages = array();
				$this_page = array();
				$x = 0;
				foreach( $all_fields as $field ){
					if( $field['type'] == '_page_divider' ){
						$x++;
					}
					$pages[$x][] = $field['id'];
				}
			}
			
			$error_page = '';
			foreach( $all_fields as $field ){
				$field_id = $field['id'];
				if( $ninja_forms_processing->get_errors_by_location( $field_id ) ){
					for ($x=1; $x <= count( $pages ); $x++) { 
						if( in_array( $field_id, $pages[$x] ) ){
							if( $error_page == '' ){
								$error_page = $x;
							}
						}
					}
				}
			}
		$ninja_forms_processing->update_extra_value( '_current_page', $error_page );
		}
	}
}

function ninja_forms_mp_save_page(){
	global $ninja_forms_processing, $current_user, $ninja_forms_fields;

	if( $ninja_forms_processing->get_form_setting( 'multi_part' ) ){

		$form_id = $ninja_forms_processing->get_form_ID();
		$all_fields = ninja_forms_get_fields_by_form_id( $form_id );

		if( is_array( $all_fields ) AND !empty( $all_fields ) ){
			$pages = array();
			$this_page = array();
			$x = 0;
			foreach( $all_fields as $field ){
				if( $field['type'] == '_page_divider' ){
					$x++;
				}
				$pages[$x][] = $field['id'];
			}
		}

		$page_count = count($pages);
		$ninja_forms_processing->update_extra_value( '_page_count', $page_count );

		//if( !$ninja_forms_processing->get_all_errors() ){

			if( $ninja_forms_processing->get_extra_value( '_current_page' ) ){
				$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );
			}else{
				$current_page = 1;
			}

			$nav = '';
			if( $ninja_forms_processing->get_extra_value( '_prev' ) ){
				$nav = 'prev';
				if( $current_page != 1 ){
					$current_page--;
				}
			}

			if( $ninja_forms_processing->get_extra_value( '_next' ) ){
				$nav = 'next';
				if( $current_page != $page_count ){
					$current_page++;
				}
			}

			if( $nav == 'prev' OR $nav == 'next' ){
				$ninja_forms_processing->update_extra_value( '_current_page', $current_page );
			}
		//}
		
		
		$sub_id = $ninja_forms_processing->get_form_setting('sub_id');
		$user_id = $ninja_forms_processing->get_user_ID();
		$form_id = $ninja_forms_processing->get_form_ID();

		$field_data = $ninja_forms_processing->get_all_fields();

		if( $sub_id != '' ){
			$sub_row = ninja_forms_get_sub_by_id( $sub_id );
			$sub_data = $sub_row['data'];
			$status = $sub_row['status'];
			/*
			if( $ninja_forms_processing->get_action() == 'edit_sub' ){
				$status = $sub_row['status'];
			}else{
				$status = 0;
			}
			*/
		}else{
			$sub_data = array();
			$status = 0;
		}

		if(is_array($field_data) AND !empty($field_data)){
			foreach($field_data as $field_id => $user_value){
				array_push( $sub_data, array( 'field_id' => $field_id, 'user_value' => $user_value ) );
			}
		}

		$sub_data = array_values( $sub_data );

		foreach( $sub_data as $row ){
			$ninja_forms_processing->update_field_value( $row['field_id'], $row['user_value'] );
			if( !$ninja_forms_processing->get_field_settings( $row['field_id'] ) ){
				$field_row = ninja_forms_get_field_by_id( $row['field_id'] );

				$ninja_forms_processing->update_field_settings( $row['field_id'], $field_row );
			}
		}

		$all_fields = ninja_forms_get_fields_by_form_id( $form_id );
		foreach( $all_fields as $field ){
			$field_id = $field['id'];
			$field_type = $field['type'];
			if( isset( $ninja_forms_fields[$field_type] ) AND $ninja_forms_fields[$field_type]['process_field'] ){
				
				if( $ninja_forms_processing->get_field_value( $field_id ) === false ){
					$ninja_forms_processing->update_field_value( $field_id, false );
					$ninja_forms_processing->update_field_settings( $field_id, $field );
				}
			}
		}

		$field_data = $ninja_forms_processing->get_all_fields();
		$sub_data = array();

		if(is_array($field_data) AND !empty($field_data)){
			foreach($field_data as $field_id => $user_value){
				array_push( $sub_data, array( 'field_id' => $field_id, 'user_value' => $user_value ) );
			}
		}

		if( $ninja_forms_processing->get_action() == 'submit' ){
			ninja_forms_req_fields_process();
			unset( $_SESSION['ninja_forms_form_'.$form_id.'_form_settings'] );
		}
		
		if( $ninja_forms_processing->get_action() == 'mp_save' OR $ninja_forms_processing->get_all_errors() ){
		
			if( isset( $_SESSION['ninja_forms_form_'.$form_id.'_form_settings'] ) ){
				foreach( $_SESSION['ninja_forms_form_'.$form_id.'_form_settings'] as $setting => $value ){
					if( $value != '' ){
						$ninja_forms_processing->update_form_setting( $setting, $value );
					}
				}
			}

			$all_form_settings = $ninja_forms_processing->get_all_form_settings();
			$_SESSION['ninja_forms_form_'.$form_id.'_form_settings'] = $all_form_settings;

			$args = array(
				'form_id' => $form_id,
				'user_id' => $user_id,
				'status' => $status,
				'action' => 'mp_save',
				'data' => serialize( $sub_data ),
			);

			if($sub_id != ''){
				$args['sub_id'] = $sub_id;
				ninja_forms_update_sub($args);
			}else{
				$sub_id = ninja_forms_insert_sub($args);
			}

			$ninja_forms_processing->update_form_setting( 'sub_id', $sub_id );

			$ninja_forms_processing->add_error( '_mp_save', '' );
		}
	}
}