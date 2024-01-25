<?php
defined('MOODLE_INTERNAL') || die();

function atto_imagerator_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('server_url', 'width', 'height', 'steps'), 'atto_helloconsole');
}

function atto_imagerator_params_for_js($elementid, $options, $fpoptions) {
    
    $params = array(
        'server_url' => get_config('atto_imagerator', 'server_url'),
        'width' => get_config('atto_imagerator', 'width'),
        'height' => get_config('atto_imagerator', 'height'),
        'steps' => get_config('atto_imagerator', 'steps')
    );
    return $params;
}