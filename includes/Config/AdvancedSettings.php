<?php

return array(

    'multi_part' => array(
        'mp_validate'       => array(
            'name'          => 'mp_validate',
            'type'          => 'toggle',
            'label'         => __( 'Validate each part', 'ninja-forms-multi-part' ),
            'width'         => 'full',
            'group'         => 'primary',
        ),

        'mp_breadcrumb'       => array(
            'name'          => 'mp_breadcrumb',
            'type'          => 'toggle',
            'label'         => __( 'Show Breadcrumbs', 'ninja-forms-multi-part' ),
            'width'         => 'full',
            'group'         => 'primary',
            'value'			=> 1,
        ),

        'mp_progress_bar'       => array(
            'name'          => 'mp_progress_bar',
            'type'          => 'toggle',
            'label'         => __( 'Show Progress Bar ', 'ninja-forms-multi-part' ),
            'width'         => 'full',
            'group'         => 'primary',
            'value'         => 1,
        ),

        'mp_display_titles'       => array(
            'name'          => 'mp_display_titles',
            'type'          => 'toggle',
            'label'         => __( 'Show Part Titles ', 'ninja-forms-multi-part' ),
            'width'         => 'full',
            'group'         => 'primary',
            'value'         => 0,
        ),
    )
);
