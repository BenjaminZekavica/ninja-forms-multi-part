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

        'mp_breadcrumbs'       => array(
            'name'          => 'mp_breadcrumbs',
            'type'          => 'toggle',
            'label'         => __( 'Show Breadcrumbs', 'ninja-forms-multi-part' ),
            'width'         => 'full',
            'group'         => 'primary',
            'value'			=> 1,
        ),

        'mp_progressbar'       => array(
            'name'          => 'mp_progressbar',
            'type'          => 'toggle',
            'label'         => __( 'Show Progress Bar ', 'ninja-forms-multi-part' ),
            'width'         => 'full',
            'group'         => 'primary',
            'value'         => 1,
        ),
    )
);
