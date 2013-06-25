<?php

add_action( 'init', 'ninja_forms_add_mp_divs' );

function ninja_forms_add_mp_divs(){
	add_action( 'ninja_forms_display_before_field', 'ninja_forms_open_mp_div', 10, 2 );
	add_action( 'ninja_forms_display_after_field', 'ninja_forms_close_mp_div', 10, 2 );
}

function ninja_forms_open_mp_div( $field_id, $data ){
	global $ninja_forms_processing;
	$form_row = ninja_forms_get_form_by_field_id( $field_id );
	$form_id = $form_row['id'];
	$field_results = ninja_forms_get_fields_by_form_id( $form_id );
	$form_data = $form_row['data'];
	if( isset( $form_data['ajax'] ) ){
		$ajax = $form_data['ajax'];
	}else{
		$ajax = 0;
	}

	if( isset( $form_data['multi_part'] ) ){
		$multi_part = $form_data['multi_part'];
	}else{
		$multi_part = 0;
	}

	if( $multi_part == 1 ){
		$pages = ninja_forms_mp_get_pages( $form_id );
		foreach( $pages as $page => $fields ){
			// Check to see if our current field is the first field on the page. If it is, output our opening MP div just before it.
			if( $fields[1]['id'] == $field_id ){
				$divider_id = $fields[0]['id'];

				if( is_object( $ninja_forms_processing ) ){
					$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );
				}else{
					$current_page = 1;
				}

				if( $page == 1 OR $page == $current_page ){
					$style = '';
				}else{
					$style = 'display:none;';
				}
				//Figure out if this page should be hidden.
				if( function_exists( 'ninja_forms_mp_check_page_conditional' ) ){
					$show = ninja_forms_mp_check_page_conditional( $form_id, $page );
				}else{
					$show = true;
				}
				
				if( $show ){
					$show = 1;
				}else{
					$show = 0;
				}



				if( $page == $current_page ){
					$class = 'ninja-forms-form-'.$form_id.'-mp-page-list-active';
				}else{
					$class = 'ninja-forms-form-'.$form_id.'-mp-page-list-inactive';
				}

				do_action( 'ninja_forms_display_before_mp_page', $form_id, $page );
				?>	
				<div id="ninja_forms_form_<?php echo $form_id;?>_mp_page_<?php echo $page;?>" class="ninja-forms-form-<?php echo $form_id;?>-mp-page ninja-forms-mp-page" style="<?php echo $style;?>" rel="<?php echo $page;?>">
					<?php
				do_action( 'ninja_forms_display_mp_page_before_fields', $form_id, $page );
			}
		}
	}
}

function ninja_forms_close_mp_div( $field_id, $data ){
	$form_row = ninja_forms_get_form_by_field_id( $field_id );
	$form_id = $form_row['id'];
	$field_results = ninja_forms_get_fields_by_form_id( $form_id );
	$form_data = $form_row['data'];
	if( isset( $form_data['ajax'] ) ){
		$ajax = $form_data['ajax'];
	}else{
		$ajax = 0;
	}

	if( isset( $form_data['multi_part'] ) ){
		$multi_part = $form_data['multi_part'];
	}else{
		$multi_part = 0;
	}

	if( $multi_part == 1){
		$pages = ninja_forms_mp_get_pages( $form_id );
		foreach( $pages as $page => $fields ){
			$count = count( $fields );
			// Check to see if our current field is the last field on the page. If it is, output our closing MP div stuff just after it.
			if( $fields[$count - 1]['id'] == $field_id ){
				do_action( 'ninja_forms_display_mp_page_after_fields', $form_id, $page );
				?>
				</div>
				<?php
				do_action( 'ninja_forms_display_after_mp_page', $form_id, $page );
			}
		}
	}
}