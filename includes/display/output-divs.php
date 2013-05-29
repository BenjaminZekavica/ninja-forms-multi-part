<?php

add_action( 'init', 'ninja_forms_add_mp_divs' );

function ninja_forms_add_mp_divs(){
	add_action( 'ninja_forms_display_before_field', 'ninja_forms_open_mp_div', 10, 2 );
	add_action( 'ninja_forms_display_after_field', 'ninja_forms_close_mp_div', 10, 2 );
}

function ninja_forms_open_mp_div( $field_id, $data ){
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

	if( $ajax == 1 AND $multi_part == 1 ){
		$pages = ninja_forms_mp_get_pages( $form_id );
		foreach( $pages as $page => $fields ){
			// Check to see if our current field is the first field on the page. If it is, output our opening MP div just before it.
			if( $fields[1]['id'] == $field_id ){
				if( $page == 1 ){
					$style = '';
				}else{
					$style = 'display:none;';
				}
				do_action( 'ninja_forms_display_before_mp_page', $form_id, $page );
				?>	
				<div id="ninja_forms_form_<?php echo $form_id;?>_mp_page_<?php echo $page;?>" class="ninja-forms-mp-page" style="<?php echo $style;?>">
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

	if( $ajax == 1 AND $multi_part == 1){
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