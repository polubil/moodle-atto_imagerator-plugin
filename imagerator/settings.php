<?php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $ADMIN->add('editoratto', new admin_category('atto_imagerator', new lang_string('pluginname', 'atto_imagerator')));

    $settings = new admin_settingpage('atto_imagerator_settings', new lang_string('settings', 'atto_imagerator'));

    $name = new lang_string('server_url', 'atto_imagerator');
    $desc = new lang_string('server_url_desc', 'atto_imagerator');
    $default = '127.0.0.1';
    $paramtype = 'url';
    $size = 50;

    $setting = new admin_setting_configtext('atto_imagerator/server_url',
                                              $name,
                                              $desc,
                                              $default,
                                              $paramtype,
                                              $size
                                            );

    $settings->add($setting);

    $name = new lang_string('width', 'atto_imagerator');
    $desc = new lang_string('width_desc', 'atto_imagerator');
    $default = '512';
    $paramtype = 'int';

    $setting = new admin_setting_configtext('atto_imagerator/width',
                                              $name,
                                              $desc,
                                              $default,
                                              $paramtype,
                                            );

    $settings->add($setting);


    $name = new lang_string('height', 'atto_imagerator');
    $desc = new lang_string('height_desc', 'atto_imagerator');
    $default = '512';
    $paramtype = 'int';

    $setting = new admin_setting_configtext('atto_imagerator/height',
                                              $name,
                                              $desc,
                                              $default,
                                              $paramtype,
                                            );

    $settings->add($setting);

    
    $name = new lang_string('steps', 'atto_imagerator');
    $desc = new lang_string('steps_desc', 'atto_imagerator');
    $default = '2';
    $paramtype = 'int';

    $setting = new admin_setting_configtext('atto_imagerator/steps',
                                              $name,
                                              $desc,
                                              $default,
                                              $paramtype,
                                            );

    $settings->add($setting);
}

