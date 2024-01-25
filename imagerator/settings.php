<?php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $ADMIN->add('editoratto', new admin_category('atto_imagerator', new lang_string('pluginname', 'atto_imagerator')));
    $settings = new admin_settingpage('atto_imagerator_settings', new lang_string('settings', 'atto_imagerator'));

    $add_setting = function ($settings, $name_key, $default, $paramtype, $size = null) {
        $name = new lang_string($name_key, 'atto_imagerator');
        $desc = new lang_string($name_key . '_desc', 'atto_imagerator');

        $setting = new admin_setting_configtext(
            'atto_imagerator/' . $name_key,
            $name,
            $desc,
            $default,
            $paramtype,
            $size
        );

        $settings->add($setting);
    };

    $add_setting($settings, 'server_url', 'http://127.0.0.1/picture/generate', PARAM_URL, 50);
    $add_setting($settings, 'width', '512', PARAM_INT);
    $add_setting($settings, 'height', '512', PARAM_INT);
    $add_setting($settings, 'steps', '2', PARAM_INT);
}
