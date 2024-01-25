YUI.add('moodle-atto_imagerator-button', function (Y, NAME) {

/**
 * @module moodle-atto_imagerator-button
 */
var COMPONENTNAME = "atto_imagerator",
    IMAGETEMPLATE = '' +
        '<img src="{{url}}" alt="{{alt}}" ' +
            '{{#if width}}width="{{width}}" {{/if}}' +
            '{{#if height}}height="{{height}}" {{/if}}' +
            '{{#if presentation}}role="presentation" {{/if}}' +
            '{{#if customstyle}}style="{{customstyle}}" {{/if}}' +
            '{{#if classlist}}class="{{classlist}}" {{/if}}' +
            '{{#if id}}id="{{id}}" {{/if}}' +
        '/>';


Y.namespace('M.atto_imagerator').Button = Y.Base.create(
    'button', 
    Y.M.editor_atto.EditorPlugin, 
    [], {

    initializer: function() {
        this.addButton({
            icon: "e/insert_edit_image",
            title: "imagerator",
            callback: this._generateImage
        });
    },

    _generateImage: function() {
        let text = this._getSelectedText();
        if (!text) {
            alert("Текст не выделен. Сначала выделите текст, на основании которого будет сгенерирована иллюстрация.");
        } else if (text.length < 15) {
            alert("Описание слишком короткое. Пожалуйста, введите описание не короче 15 символов (чем больше, тем лучше, но не более 100 символов)");
        } else if (text.length > 100) {
            alert("Описание слишком длинное. Пожалуйста, введите описание не длиннее 100 символов");
        }
        else {
            const baseUrl = this.get("server_url");
            const headers = new Headers({
                "User-Agent"   : "atto_imagerator/0.0.1"
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
                    return response.blob();
                })
                .then(blob => {
                    const image = new File([blob], "file_name.png");
                    this._uploadImage(image);
                })
                .catch(error => {
                    console.error('Fetch Error:', error); // Обработка ошибок запроса
                });
        }
    },

    _getSelectedText: function() {
        if (window.getSelection) {  // IE 9 
            let range = window.getSelection ();
            return range.toString();
        } 
        else {
            if (document.selection.createRange) { // IE 
                let range = document.selection.createRange ();
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
