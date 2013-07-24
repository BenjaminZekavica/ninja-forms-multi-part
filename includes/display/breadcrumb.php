<?php
/**
 * Outputs the HTML for the Multi-Part Form Breadcrumb Navigation.
 *
**/
add_action( 'init', 'ninja_forms_register_mp_display_breadcrumb' );
function ninja_forms_register_mp_display_breadcrumb(){
	if( !is_admin() ){
		add_action( 'ninja_forms_display_before_fields', 'ninja_forms_mp_display_breadcrumb', 8 );
	}
}

function ninja_forms_mp_display_breadcrumb( $form_id ){
	global $ninja_forms_processing;
	$form_row = ninja_forms_get_form_by_id( $form_id );
	$form_data = $form_row['data'];

	$display = 1;

	$display = apply_filters( 'ninja_forms_mp_display_breadcrumbs_visbility', $display, $form_id );

	if( $display == 1 ){
		$display = '';
	}else{
		$display = 'display:none;';
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
				$pages[$x]['id'] = $field['id'];
			}
		}
	}

	$page_count = count($pages);

	if( is_object( $ninja_forms_processing ) ){
		$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );
	}else{
		$current_page = 1;
	}
	if( isset( $form_data['mp_breadcrumb'] ) AND $form_data['mp_breadcrumb'] == 1 ){
		?>
		<ul id="ninja_forms_form_<?php echo $form_id;?>_mp_breadcrumbs" class="ninja-forms-mp-breadcrumbs" style="<?php echo $display;?>">
			<?php
			if( is_array( $pages ) AND !empty( $pages ) ){
				foreach( $pages as $number => $page ){
					$show = ninja_forms_mp_check_page_conditional( $form_id, $number );
					if( $show ){
						$style = '';
					}else{
						$style = 'display:none;';
					}
					if( $number == $current_page ){
						$class = 'ninja-forms-mp-breadcrumb-active ninja-forms-form-'.$form_id.'-mp-breadcrumb-active';
					}else{
						$class = 'ninja-forms-mp-breadcrumb-inactive ninja-forms-form-'.$form_id.'-mp-breadcrumb-inactive';
					}
					?>
					<li>
						<input type="submit" id="ninja_forms_field_<?php echo $page['id'];?>_breadcrumb" name="_mp_page_<?php echo $number;?>" value="<?php echo $page['page_title'];?>" class="<?php echo $class;?> ninja-forms-mp-nav" rel="<?php echo $number;?>" style="<?php echo $style;?>">
					</li>
					<?php
				}
			}
			?>
		</ul>
		<?php
	}

	?>
	<ul style="display:none;">
	<?php
	if( is_array( $pages ) AND !empty( $pages ) ){
		foreach( $pages as $page => $fields ){
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

			$field_id = $fields['id'];
			
			if( $page == $current_page ){
				$class = 'ninja-forms-form-'.$form_id.'-mp-page-list-active';
			}else{
				$class = 'ninja-forms-form-'.$form_id.'-mp-page-list-inactive';
			}

			?>
			<li>
				<input type="hidden" id="ninja_forms_field_<?php echo $field_id;?>" value="<?php echo $show;?>" rel="<?php echo $page;?>" class="<?php echo $class;?> ninja-forms-form-<?php echo $form_id;?>-mp-page-show">
			</li>
			<?php

		}
	}
	?>
	</ul>
	<?php
}