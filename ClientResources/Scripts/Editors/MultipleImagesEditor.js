/*
Dojo widget developed by Knowit Oslo.
*/

define([
"dojo/_base/declare",
"dojo/_base/lang",
"dojo/dom-attr",
"dojo/dom-class",
"dojo/dom-construct",
"dojo/dom-style",
"dijit/_CssStateMixin",
"dijit/_Widget",
"dijit/_TemplatedMixin",
"dijit/_WidgetsInTemplateMixin",
"dijit/Dialog",
"epi/epi",
"epi/shell/widget/_ValueRequiredMixin",
"epi/shell/dnd/Source",
"dojo/dnd/Container",
"epi/shell/dnd/Target"],
	function (
	declare,
	lang,
	domAttr,
    domClass,
    domConstruct,
    domStyle,
	_CssStateMixin,
	_Widget,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	Dialog,
	epi,
	_ValueRequiredMixin,
	Source,
	Container,
	Target) {
	    return declare("alloy.editors.MultipleImagesEditor", [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _CssStateMixin, _ValueRequiredMixin], {
	        templateString: "<div class=\"dijitInline epiMultimediaContainer\">\
                                <table data-dojo-type=\"dojo.dnd.Source\" data-dojo-attach-point=\"multimediaEditorItemContainer\" class=\"multimediaEditorItemContainer\"></table>\
							    <div class=\"epi-content-area-editor\" style=\"overflow:hidden;\" >\
							        <div dojoAttachPoint=\"targetDrop\" class=\"epi-content-area-actionscontainer multimediaEditorItemContainer\">Drag and drop images here</div>\
							    </div>\
							</div>",
	        intermediateChanges: false,
	        value: null,
	        jsonObj: [],
	        multiple: true,
	        table: null,
	        onChange: function (value) {
	            // Event         
	        },
	        postCreate: function () {
	            var myself = this;

	            // call base implementation             
	            this.inherited(arguments);

	            this._loadCssFile();
	            this._setupTarget(myself);
	        },
	        startup: function () {
	        },
	        _setupInternalDnD: function (myself) {
	            this.table = new dojo.dnd.Source(this.multimediaEditorItemContainer.node);
	            this._connectOnDrop(myself);
	        },
	        _connectOnDrop: function (myself) {
	            myself.table.on("Drop", function() {
	                myself._updateImageOrder(myself);
	            });
	        },

	        bindEvents: function (myself) {
	            dojo.query(".deleteMultiMediaRow", this.multimediaEditorItemContainer.node).on("click", function (e) {
	                myself._deleteRow(myself, this);
	            });
	            dojo.query(".editMultiMediaRow .descHolder", this.multimediaEditorItemContainer.node).on("click", function () {
	                myself._editRow(myself, this);
	            });
	        },
	        _setupTarget: function (myself) {
	            var target = new Target(myself.targetDrop, {
	                accept: ["link"],
	                createItemOnDrop: false
	            });
	            target.on("DropData", function (dndData, source, nodes, copy) {
	                myself._onDropDataFile(dndData, source, nodes, copy);
	            });
	        },
	        _onDropDataFile: function (dndData, source, nodes, copy) {

	            //Drop item is an array with dragged items. This example just handles the first item.             
	            var dropItem = dndData ? (dndData.length ? dndData[0] : dndData) : null;

	            if (dropItem) {
	                //The data property might be a deffered so we need to call dojo.when just in case.                 
	                dojo.when(dropItem.data, dojo.hitch(this, function (value) {

	                    if (this._isImageAlreadyInTheTable(value, source)) {
	                        this._giveUserFeedback("You have already added this image.");
	                        return;
	                    }
	                    this._updateImageTable(value, source, this);
	                    this.table.sync();
	                }));
	            }
	        },
	        _giveUserFeedback: function (msg) {
	            var myDialog = new Dialog({
	                title: "Message",
	                content: msg,
	                style: "display:inline-block;"
	            });
	            myDialog.show();
	        },
	        _isImageAlreadyInTheTable: function (item, source) {
	            var itemPermanentUrl = item.permanentUrl;

	            for (var i = 0; i < this.jsonObj.length; i++) {
	                if (this.jsonObj[i].permanentUrl == itemPermanentUrl) {
	                    return true;
	                }
	            }

	            return false;
	        },
	        _updateImageTable: function (item, source, myself) {

	            this._updateImageTableDOM(item);
	            this.bindEvents(myself);
	            this.addImageToJsonObject(item, myself);
	        },
	        _updateImageTableDOM: function (item) {

	            var trElement = domConstruct.toDom("<tr class=\"dojoDndItem multimediaRow\"></tr>");
	            var tdMoveElement = domConstruct.toDom("<td class=\"moveMultiMediaRow dojoDndHandle\"><span class=\"icon icon-move\"></span></td>");
	            var tdImgElement = domConstruct.toDom("<td class=\"imgPrev\" data-permanenturl=\"" + item.permanentUrl + "\"><img alt=\"This is a sample image\" src=\"" + item.previewUrl + "\" /></td>");

	            var tdDescElement = "";
	            if (item.desc == undefined || item.desc == "") {
	                tdDescElement = domConstruct.toDom("<td class=\"editMultiMediaRow multiMediaDesc\"><div class=\"descHolder\">Click here to add a description</span></td>");
	            } else {
	                tdDescElement = domConstruct.toDom("<td class=\"editMultiMediaRow multiMediaDesc\"><div class=\"descHolder\">" + item.desc + "</span></td>");
	            }

	            var tdDeleteElement = domConstruct.toDom("<td data-timestamp=\"" + Date.now() + "\" class=\"deleteMultiMediaRow\"><span class=\"icon icon-cancel\"></span></td>");

	            domConstruct.place(tdMoveElement, trElement);
	            domConstruct.place(tdImgElement, trElement);
	            domConstruct.place(tdDescElement, trElement);
	            domConstruct.place(tdDeleteElement, trElement);

	            dojo.place(trElement, this.multimediaEditorItemContainer.node);
	        },
	        _editRow: function (myself, item) {

	            var timestamp = Math.round(new Date().getTime() / 1000);
	            dojo.query(item).addClass("" + timestamp);

	            myself._createTextAreaForAddingImageDesc(timestamp, myself);
	            myself._bindDescButtons(timestamp, myself);
	        },
	        _bindDescButtons: function (timestamp, myself) {

	            dojo.query("." + timestamp + " .okButton").on("click", function (e) {
	                myself._updateImageDesc(this, timestamp, myself);
	                dojo.query(this).closest("." + timestamp).orphan();

	                myself._onImageTableChange(JSON.stringify(myself.jsonObj), myself);
	                e.preventDefault();
	            });

	            dojo.query("." + timestamp + " .cancelButton").on("click", function (e) {
	                dojo.query(this).closest("." + timestamp).orphan();
	                e.preventDefault();
	            });
	        },
	        _createTextAreaForAddingImageDesc: function (timestamp, myself) {

	            var descHolder = dojo.query("." + timestamp)[0];

	            var textarea = "";
	            if (descHolder.textContent == "Click here to add a description") {
	                textarea = domConstruct.toDom("<div class=\"contentEditableDiv\" contenteditable=\"true\"></div>");
	            } else {
	                textarea = domConstruct.toDom("<div class=\"contentEditableDiv\" contenteditable=\"true\">" + descHolder.textContent + "</div>");
	            }

	            var okbutton = domConstruct.toDom("<button class=\"okButton\">Ok</button>");
	            var cancelbutton = domConstruct.toDom("<button class=\"cancelButton\">Cancel</button>");
	            var textareaContainer = domConstruct.toDom("<div class=\"textareaContainer " + timestamp + "\"></div>");

	            domConstruct.place(textarea, textareaContainer);
	            domConstruct.place(okbutton, textareaContainer);
	            domConstruct.place(cancelbutton, textareaContainer);

	            dojo.place(textareaContainer, this.multimediaEditorItemContainer.node, "after");

	            myself._positionTextAreaForAddingImageDesc(timestamp, descHolder);
	        },
	        _positionTextAreaForAddingImageDesc: function (timestamp, descHolder) {
	            var textareaContainer = dojo.query(".textareaContainer." + timestamp)[0];
	            var td = dojo.query(descHolder).closest(".multiMediaDesc")[0];

	            var padding = 5;
	            var marginTop = 10;
	            var buttonHeight = 32;
	            var height = td.scrollHeight - padding - padding - marginTop - buttonHeight;

	            textareaContainer.style.top = td.offsetTop + "px";
	            textareaContainer.style.left = td.offsetLeft + "px";
	            textareaContainer.querySelector(".contentEditableDiv").style.minHeight = height + "px";
	        },
	        _updateImageDesc: function (clickedItem, timestamp, myself) {
	            var button = dojo.query(clickedItem);
	            var descHolder = dojo.query(".descHolder." + timestamp);

	            var imgSrc = descHolder.closest(".multimediaRow").query(".imgPrev")[0].getAttribute("data-permanenturl");
	            var text = button.siblings(".contentEditableDiv")[0].textContent;

	            descHolder[0].textContent = text;

	            for (var i = 0; i < myself.jsonObj.length; i++) {
	                if (myself.jsonObj[i].permanentUrl == imgSrc) {
	                    myself.jsonObj[i].desc = text;

	                    break;
	                }
	            }
	        },
	        _deleteRow: function (myself, item) {
	            //remove from table
	            dojo.query(item).parent().orphan();

	            var tempJsonObj = [];
	            var imgSrc = dojo.query(item).parent().query(".imgPrev")[0].getAttribute("data-permanenturl");

	            //rebuild json string, but do not add the one that is removed 
	            for (var i = 0; i < myself.jsonObj.length; i++) {
	                if (myself.jsonObj[i] == undefined || myself.jsonObj[i] == "") {
	                    continue;
	                }
	                if (myself.jsonObj[i].permanentUrl != imgSrc) {
	                    tempJsonObj.push(myself.jsonObj[i]);
	                }
	            }
	            myself.jsonObj = tempJsonObj;
	            myself._onImageTableChange(JSON.stringify(myself.jsonObj), myself);
	        },
	        _updateImageOrder: function (myself) {
	            var tempJsonObj = [];

	            //rebuild json string with new order of items
	            dojo.query("tr", this.multimediaEditorItemContainer.node).forEach(function (node) {
	                for (var t = 0; t < myself.jsonObj.length; t++) {
	                    if (myself.jsonObj[t].permanentUrl == dojo.query(".imgPrev", node).attr("data-permanenturl")) {
	                        tempJsonObj.push(myself.jsonObj[t]);
	                    }
	                }
	            });

	            myself.jsonObj = tempJsonObj;
	            myself._onImageTableChange(JSON.stringify(myself.jsonObj), myself);
	        },
	        setupJsonObjectHolder: function () {
	            var jsonString = this.value;
	            if (jsonString == null || jsonString == "") {
	                jsonString = "[]";
	            }
	            this.jsonObj = JSON.parse(jsonString);
	        },
	        setupImageTable: function () {
	            for (var i = 0; i < Object.keys(this.jsonObj).length; i++) {
	                this._updateImageTableDOM(this.jsonObj[i]);
	            }
	        },
	        addImageToJsonObject: function (item, myself) {
	            this.jsonObj.push(item);
	            this._onImageTableChange(JSON.stringify(this.jsonObj), myself);
	        },
	        _onImageTableChange: function (value, myself) {
	            myself._setValue(value);
	        },
	        //You can use isValid() or validate() to prevent an invalid form from submitting.  Source: http://dojotoolkit.org/reference-guide/1.9/dijit/form/Form.html#validate
	        isValid: function () {
	            return !this.required || lang.isArray(this.value) && this.value.length > 0 && this.value.join() != "";
	        },

	        // Setter for value property. It runs at startup. 
	        _setValueAttr: function (value) {
	            this._setValue(value);
                
                var myself = this;

	            this.setupJsonObjectHolder();
	            this.setupImageTable();
	            this.bindEvents(myself);
	            this._setupInternalDnD(myself);
	        },
	        _setValue: function (value) {

	            if (this._started && epi.areEqual(this.value, value)) {
	                return;
	            }

	            // set value to this widget (and notify observers)
	            this._set("value", value);

	            if (this._started && this.validate()) {
	                // Trigger change event
	                this.onChange(value);
	            }
	        },
	        _loadCssFile: function () {
	            var $ = document;
	            var cssId = 'MultiMediaList';
	            if (!$.getElementById(cssId)) {
	                var head = $.getElementsByTagName('head')[0];
	                var link = $.createElement('link');
	                link.id = cssId;
	                link.rel = 'stylesheet';
	                link.type = 'text/css';
	                link.href = '/ClientResources/Scripts/Editors/themes/MultipleImagesEditor.css';
	                link.media = 'all';
	                head.appendChild(link);
	            }
	        }
	    });
	});