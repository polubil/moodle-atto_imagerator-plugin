YUI.add('moodle-atto_helloconsole-button', function (Y, NAME) {

/**
 * @module moodle-atto_helloconsole-button
 */
var COMPONENTNAME = "atto_helloconsole",
    TEMPLATE = '' +
        '<form class="atto_form">' +
            // Add the repository browser button.
            '<div style="display:none" role="alert" class="alert alert-warning mb-1 {{CSS.IMAGEURLWARNING}}">' +
                '<label for="{{elementid}}_{{CSS.INPUTURL}}">' +
                '{{get_string "imageurlrequired" component}}' +
                '</label>' +
            '</div>' +
            '{{#if showFilepicker}}' +
                '<div class="mb-1">' +
                    '<label for="{{elementid}}_{{CSS.INPUTURL}}">{{get_string "enterurl" component}}</label>' +
                    '<div class="input-group input-append w-100">' +
                        '<input name="{{FORMNAMES.URL}}" class="form-control {{CSS.INPUTURL}}" type="url" ' +
                        'id="{{elementid}}_{{CSS.INPUTURL}}" size="32"/>' +
                        '<span class="input-group-append">' +
                            '<button class="btn btn-secondary {{CSS.IMAGEBROWSER}}" type="button">' +
                            '{{get_string "browserepositories" component}}</button>' +
                        '</span>' +
                    '</div>' +
                '</div>' +
            '{{else}}' +
                '<div class="mb-1">' +
                    '<label for="{{elementid}}_{{CSS.INPUTURL}}">{{get_string "enterurl" component}}</label>' +
                    '<input name="{{FORMNAMES.URL}}" class="form-control fullwidth {{CSS.INPUTURL}}" type="url" ' +
                    'id="{{elementid}}_{{CSS.INPUTURL}}" size="32"/>' +
                '</div>' +
            '{{/if}}' +

            '<div style="display:none" role="alert" class="alert alert-warning mb-1 {{CSS.IMAGEALTWARNING}}">' +
                '<label for="{{elementid}}_{{CSS.INPUTALT}}">' +
                '{{get_string "presentationoraltrequired" component}}' +
                '</label>' +
            '</div>' +
            // Add the Alt box.
            '<div class="mb-1">' +
            '<label for="{{elementid}}_{{CSS.INPUTALT}}">{{get_string "enteralt" component}}</label>' +
            '<textarea class="form-control fullwidth {{CSS.INPUTALT}}" ' +
            'id="{{elementid}}_{{CSS.INPUTALT}}" name="{{FORMNAMES.ALT}}" maxlength="125"></textarea>' +

            // Add the character count.
            '<div id="the-count" class="d-flex justify-content-end small">' +
            '<span id="currentcount">0</span>' +
            '<span id="maximumcount"> / 125</span>' +
            '</div>' +

            // Add the presentation select box.
            '<div class="form-check">' +
            '<input type="checkbox" class="form-check-input {{CSS.IMAGEPRESENTATION}}" ' +
                'id="{{elementid}}_{{CSS.IMAGEPRESENTATION}}"/>' +
            '<label class="form-check-label" for="{{elementid}}_{{CSS.IMAGEPRESENTATION}}">' +
                '{{get_string "presentation" component}}' +
            '</label>' +
            '</div>' +
            '</div>' +

            // Add the size entry boxes.
            '<div class="mb-1">' +
            '<label class="" for="{{elementid}}_{{CSS.INPUTSIZE}}">{{get_string "size" component}}</label>' +
            '<div id="{{elementid}}_{{CSS.INPUTSIZE}}" class="form-inline {{CSS.INPUTSIZE}}">' +
            '<label class="accesshide" for="{{elementid}}_{{CSS.INPUTWIDTH}}">{{get_string "width" component}}</label>' +
            '<input type="text" class="form-control mr-1 input-mini {{CSS.INPUTWIDTH}}" ' +
            'id="{{elementid}}_{{CSS.INPUTWIDTH}}" size="4"/> x' +

            // Add the height entry box.
            '<label class="accesshide" for="{{elementid}}_{{CSS.INPUTHEIGHT}}">{{get_string "height" component}}</label>' +
            '<input type="text" class="form-control ml-1 input-mini {{CSS.INPUTHEIGHT}}" ' +
            'id="{{elementid}}_{{CSS.INPUTHEIGHT}}" size="4"/>' +

            // Add the constrain checkbox.
            '<div class="form-check ml-2">' +
            '<input type="checkbox" class="form-check-input {{CSS.INPUTCONSTRAIN}}" ' +
            'id="{{elementid}}_{{CSS.INPUTCONSTRAIN}}"/>' +
            '<label class="form-check-label" for="{{elementid}}_{{CSS.INPUTCONSTRAIN}}">' +
            '{{get_string "constrain" component}}</label>' +
            '</div>' +
            '</div>' +
            '</div>' +

            // Add the alignment selector.
            '<div class="form-inline mb-1">' +
            '<label class="for="{{elementid}}_{{CSS.INPUTALIGNMENT}}">{{get_string "alignment" component}}</label>' +
            '<select class="custom-select {{CSS.INPUTALIGNMENT}}" id="{{elementid}}_{{CSS.INPUTALIGNMENT}}">' +
                '{{#each alignments}}' +
                    '<option value="{{value}}">{{get_string str ../component}}</option>' +
                '{{/each}}' +
            '</select>' +
            '</div>' +
            // Hidden input to store custom styles.
            '<input type="hidden" class="{{CSS.INPUTCUSTOMSTYLE}}"/>' +
            '<br/>' +

            // Add the image preview.
            '<div class="mdl-align">' +
            '<div class="{{CSS.IMAGEPREVIEWBOX}}">' +
                '<img class="{{CSS.IMAGEPREVIEW}}" alt="" style="display: none;"/>' +
            '</div>' +

            // Add the submit button and close the form.
            '<button class="btn btn-secondary {{CSS.INPUTSUBMIT}}" type="submit">' + '' +
                '{{get_string "saveimage" component}}</button>' +
            '</div>' +
        '</form>',

        IMAGETEMPLATE = '' +
            '<img src="{{url}}" alt="{{alt}}" ' +
                '{{#if width}}width="{{width}}" {{/if}}' +
                '{{#if height}}height="{{height}}" {{/if}}' +
                '{{#if presentation}}role="presentation" {{/if}}' +
                '{{#if customstyle}}style="{{customstyle}}" {{/if}}' +
                '{{#if classlist}}class="{{classlist}}" {{/if}}' +
                '{{#if id}}id="{{id}}" {{/if}}' +
            '/>';


Y.namespace('M.atto_helloconsole').Button = Y.Base.create(
    'button', 
    Y.M.editor_atto.EditorPlugin, 
    [], {

    initializer: function() {
        console.log("Привет");
        this.addButton({
            icon: "e/insert_edit_image",
            title: "helloconsole",
            callback: this._generateImage
        });
    },

    _generateImage: function() {
        let text = this._getSelectedText();
        if (!text) {
            alert("Текст не выбран.");
        } else if (text.length < 15) {
            alert("Описание слишком короткое. Пожалуйста, введите описание не короче 15 символов (чем больше, тем лучше, но не более 100 символов)");
        } else if (text.length > 100) {
            alert("Описание слишком длинное. Пожалуйста, введите описание не длинее 100 символов");
        }
        else {
            const baseUrl = this.get("server_url");
            const headers = new Headers({
                "User-Agent"   : "MoodlePluginAPI"
            });
            const params = {
                prompt: text,
                width: this.get("width"),
                height: this.get("height"),
                steps: this.get("steps")
            };
            const url = new URL(baseUrl);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            fetch(url, {headers: headers})
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    };
                    console.log(response)
                    return response.blob();
                })
                .then(blob => {
                    const image = new File([blob], "file_name.png");
                    this._uploadImage(image);
                })
                .catch(error => {
                    console.error('Fetch Error:', error); // Обработка ошибок запроса
                });

            console.log(params, url);
        }
    },

    _getSelectedText: function() {
        if (window.getSelection) {  // IE 9 
            var range = window.getSelection ();
            return range.toString();
        } 
        else {
            if (document.selection.createRange) { // IE 
                var range = document.selection.createRange ();
                return range.text;
            }
        }
    },

    _uploadImage: function(fileToSave) {

        var self = this,
            host = this.get('host'),
            template = Y.Handlebars.compile(IMAGETEMPLATE);

        host.saveSelection();

        // Trigger form upload start events.
        require(['core_form/events'], function(FormEvent) {
            FormEvent.notifyUploadStarted(self.editor.get('id'));
        });

        var options = host.get('filepickeroptions').image,
            savepath = (options.savepath === undefined) ? '/' : options.savepath,
            formData = new FormData(),
            timestamp = 0,
            uploadid = "",
            xhr = new XMLHttpRequest(),
            imagehtml = "",
            keys = Object.keys(options.repositories);

        formData.append('repo_upload_file', fileToSave);
        formData.append('itemid', options.itemid);

        // List of repositories is an object rather than an array.  This makes iteration more awkward.
        for (var i = 0; i < keys.length; i++) {
            if (options.repositories[keys[i]].type === 'upload') {
                formData.append('repo_id', options.repositories[keys[i]].id);
                break;
            }
        }
        formData.append('env', options.env);
        formData.append('sesskey', M.cfg.sesskey);
        formData.append('client_id', options.client_id);
        formData.append('savepath', savepath);
        formData.append('ctx_id', options.context.id);

        // Insert spinner as a placeholder.
        timestamp = new Date().getTime();
        uploadid = 'moodleimage_' + Math.round(Math.random() * 100000) + '-' + timestamp;
        host.focus();
        host.restoreSelection();
        imagehtml = template({
            url: M.util.image_url("i/loading_small", 'moodle'),
            alt: M.util.get_string('uploading', COMPONENTNAME),
            id: uploadid
        });
        host.insertContentAtFocusPoint(imagehtml);
        self.markUpdated();

        // Kick off a XMLHttpRequest.
        xhr.onreadystatechange = function() {
            var placeholder = self.editor.one('#' + uploadid),
                result,
                file,
                newhtml,
                newimage;

            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    result = JSON.parse(xhr.responseText);
                    if (result) {
                        if (result.error) {
                            if (placeholder) {
                                placeholder.remove(true);
                            }
                            // Trigger form upload complete events.
                            require(['core_form/events'], function(FormEvent) {
                                FormEvent.notifyUploadCompleted(self.editor.get('id'));
                            });
                            throw new M.core.ajaxException(result);
                        }

                        file = result;
                        if (result.event && result.event === 'fileexists') {
                            // A file with this name is already in use here - rename to avoid conflict.
                            // Chances are, it's a different image (stored in a different folder on the user's computer).
                            // If the user wants to reuse an existing image, they can copy/paste it within the editor.
                            file = result.newfile;
                        }

                        // Replace placeholder with actual image.
                        newhtml = template({
                            url: file.url,
                            presentation: true,
                            classlist: CSS.RESPONSIVE
                        });
                        newimage = Y.Node.create(newhtml);
                        if (placeholder) {
                            placeholder.replace(newimage);
                        } else {
                            self.editor.appendChild(newimage);
                        }
                        self.markUpdated();
                    }
                } else {
                    Y.use('moodle-core-notification-alert', function() {
                        // Trigger form upload complete events.
                        require(['core_form/events'], function(FormEvent) {
                            FormEvent.notifyUploadCompleted(self.editor.get('id'));
                        });
                        new M.core.alert({message: M.util.get_string('servererror', 'moodle')});
                    });
                    if (placeholder) {
                        placeholder.remove(true);
                    }
                }
                // Trigger form upload complete events.
                require(['core_form/events'], function(FormEvent) {
                    FormEvent.notifyUploadCompleted(self.editor.get('id'));
                });
            }
        };
        xhr.open("POST", M.cfg.wwwroot + '/repository/repository_ajax.php?action=upload', true);
        xhr.send(formData);
    },
}, {
    ATTRS: {
        /**
         * How many groups to show when collapsed.
         *
         * @attribute showgroups
         * @type Number
         * @default 3
         */
        server_url: {
            value: 0
        },
        width: {
            value: 0
        },
        height: {
            value: 0
        },
        steps: {
            value: 0
        },
    }
});

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
