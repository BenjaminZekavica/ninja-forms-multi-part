<?php
add_action( 'init', 'ninja_forms_register_field_page_divider' );

function ninja_forms_register_field_page_divider( $form_id = '' ){
	global $ninja_forms_processing;

	if( isset( $_REQUEST['form_id'] ) ){
		$form_id = $_REQUEST['form_id'];
	}
	

	if( is_object( $ninja_forms_processing ) ){
		$form_id = $ninja_forms_processing->get_form_ID();
	}

	if( $form_id != '' AND $form_id != 'new' AND $form_id != 'all' OR ( is_admin() AND isset( $_REQUEST['page'] ) AND $_REQUEST['page'] == 'ninja-forms-subs' )  ){
		$form_row = ninja_forms_get_form_by_id( $form_id );
		$form_data = $form_row['data'];
		if( isset( $form_data['multi_part'] ) ){
			$multi_part = $form_data['multi_part'];
		}else{
			$multi_part = 0;
		}
		
		if( $multi_part == 1 OR ( is_admin() AND isset( $_REQUEST['page'] ) AND $_REQUEST['page'] == 'ninja-forms-subs' ) ){
			$args = array(
				'name' => 'Page Divider',
				'sidebar' => '',
				'edit_function' => 'ninja_forms_field_page_divider_edit',
				'display_function' => '',
				'save_function' => '',
				'group' => '',
				'edit_label' => false,
				'edit_label_pos' => false,
				'edit_req' => false,
				'edit_custom_class' => false,
				'edit_help' => false,
				'edit_meta' => false,
				'edit_conditional' => false,
				'process_field' => false,
				'use_li' => false,
			);
			if( function_exists( 'ninja_forms_register_field' ) ){
				ninja_forms_register_field( '_page_divider', $args );
			}
		}
	}
}

function ninja_forms_field_page_divider_edit( $field_id, $data ){
	if( isset( $data['page_name'] ) ){
		$page_name = $data['page_name'];
	}else{
		$page_name = '';
	}

	?>
	<li id="ninja_forms_field_<?php echo $field_id;?>" class="not-sortable page-divider menu-item-settings">
		Page Title: <input type="text" id="ninja_forms_field_<?php echo $field_id;?>_page_name" name="ninja_forms_field_<?php echo $field_id;?>[page_name]" value="<?php echo $page_name;?>" class="mp-page-name"> 
	</li>		
	<?php
}

function ninja_forms_field_page_divider_display( $field_id, $data ){
	global $ninja_forms_processing;
	$form_row = ninja_forms_get_form_by_field_id( $field_id );
	$form_data = $form_row['data'];

	if( isset( $data['page_name'] ) ){
		$page_name = $data['page_name'];
	}else{
		$page_name = '';
	}
	if( isset( $form_data['mp_display_titles'] ) AND $form_data['mp_display_titles'] == 1 ){
		?>
		<h4><?php echo $page_name;?></h4>
		<?php
	}
}