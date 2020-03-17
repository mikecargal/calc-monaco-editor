const CalcTokensProvider = require('../../main-generated/javascript/CalcTokensProvider.js');
const ParserFacade = require('../../main-generated/javascript/ParserFacade.js');
const Navigation = require('../../main-generated/javascript/Navigation.js');
const autocomplete = require('autocompleter');
//const hparser = require('html2hscript');
//const createElement = require('virtual-dom/create-element');
//const h = require("virtual-dom/h");
//const diff = require('virtual-dom/diff');
//const patch = require('virtual-dom/patch');
const dm = require('../../main-generated/javascript/datamodel.js');
const r = require('../../main-generated/javascript/renderer.js');
//const hyperHTML = require('hyperhtml');
var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/class').default, // makes it easy to toggle classes
    require('snabbdom/modules/props').default, // for setting properties on DOM elements
    require('snabbdom/modules/style').default, // handles styling on elements with support for animations
    require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes
var toVNode = require('snabbdom/tovnode').default;

if (typeof window === 'undefined') {

} else {
    window.CalcTokensProvider = CalcTokensProvider;
}

$( document ).ready(function() {
    window.symbolTable = {};

    window.datamodel = {types:[]};

    window.updater = function() {
        $("#inputs .input").each(function () {
            let name = $(this).find(".name").text();
            let value = parseInt($(this).find("input").val());
            window.symbolTable[name] = value;
        });
        $("#calculations .calculation").each(function () {
            let name = $(this).find(".name").text();
            let code = window.editors[name].getValue();
            let value = ParserFacade.evaluateExpressionCode(code, window.symbolTable);
            window.symbolTable[name] = value;
            $(this).find(".result").text("result is " + value);
        });
    };


    $("#inputs .input input").change(function(){
        window.updater();
    });

    $(".collapsible").click(function() {
        $(this).siblings(".section-content").toggleClass("expanded");
    });

    function d(item) {
        return hyperHTML.wire($("#types")[0], `:node-${item.uuid}`) `<div class='type-definition'>
        <input class='keyword' value='type'> 
        <input class='editable' value='My type' required> 
        <input class='keyword' value='{'/>
        <div class='fields'
            <span class='message'>no fields</span>
            <br>
            <div class='fields-container'></div></div><input class='keyword' value='}'>
        </div>`;
    }

    function placeholderKeydown(adder) {
        return function(e) {
            console.log(`placeholderKeydown ${e.key}`);
            switch (e.key) {
                case "Enter":
                    console.log("adding");
                    adder(e);
                    break;
            }
            e.preventDefault();
            return true;
        };
    }

    function updateTypes() {
        console.log("[update types]");
        let children = [];
        if (window.datamodel.types.length == 0) {
            children.push(h('input.placeholder',
                {
                    props: {value: '<no types>'},
                    on: {keydown: placeholderKeydown(addType)}
                }, []))
        } else {
            $(window.datamodel.types).each(function () {
            // <div class='type-definition'><input class='keyword' value='type'> <input class='editable' value='My type' required> <input class='keyword' value='{'/>"
            //     //     +"<div class='fields'><span class='message'>no fields</span><br><div class='fields-container'></div></div><input class='keyword' value='}'></div>");
                children.push(h('div.type-definition', {}, [
                    h('div.line', {}, [
                        h('input.keyword', {props: {value:'type'}}),
                        h('input.editable', {props: {value:'My type', required: true}}),
                        h('input.keyword', {props: {value:'{'}}),
                    ]),
                    h('div.line', {}, [

                    ])
                ]));
            });
        }
        let vnode = h('div#types', {}, children);
        // Patch into empty DOM element – this modifies the DOM as a side effect

        if (window.typesvnode == undefined) {
            window.typesvnode = toVNode($("#types")[0]);
        }

        window.typesvnode = patch(window.typesvnode, vnode);


        prepareInputs();
        //var html = "<div id='types'>";
        //var typesLeftToRender = window.datamodel.types.length;
        // let typeRenderCb = function(hscript){
        //     console.log("typeRenderCb called");
        //     typesLeftToRender--;
        //     console.log(hscript);
        //     //hscript = h("div");
        //     let updatedDomForType = createElement(hscript, {warn:function(msg, vnode){
        //             console.warn("ISSUE IN CREATE ELEMENT: " + msg);
        //             console.warn("  node with issue: " + vnode);
        //         }});
        //     console.log("updatedDomForType");
        //     console.log(updatedDomForType);
        //     html += updatedDomForType;
        //     if (typesLeftToRender == 0) {
        //         html += "</div>";
        //         console.log("UPDATE TYPES");
        //         console.log(html);
        //     }
        // };
        // var hmodel = h('div', {}, [h("span")]);
        // var newDom = createElement(hmodel);
        // console.log("new dom:");
        // console.log(newDom);
        // let currentDom = $("#types")[0];
        // console.log("current dom:");
        // console.log(currentDom);
        // //$("#types").replaceWith(newDom);
        // var patches = diff(currentDom, newDom);
        // window.patches = patches;
        // console.log("patches");
        // console.log(patches);
        // patch(newDom, patches)
        // $(window.datamodel.types).each(function () {
        //     console.log("[rendering a type]");
        //     //let updatedDomModel = r.render(this, typeRenderCb);
        //     //let updatedDomForType = createElement(updatedDomModel);
        //     //console.log(updatedDomForType);
        //     //html += updatedDomForType;
        // });
    }

    function addType() {
        //$("#types").siblings(".empty-message").hide();
        window.datamodel.types.push(new dm.Type());
        // $(window.datamodel.types).each(function () {
        //     console.log("[rendering a type]");
        //     let updatedDom = r.render(this);
        // });
        updateTypes();
        // $("#types").append("<div class='type-definition'><input class='keyword' value='type'> <input class='editable' value='My type' required> <input class='keyword' value='{'/>"
        //     +"<div class='fields'><span class='message'>no fields</span><br><div class='fields-container'></div></div><input class='keyword' value='}'></div>");
        // prepareInputs();
        // $(".add-field-button").click(function () {
        //     $(this).siblings(".message").hide();
        //     console.log("add field");
        // });
    }

    $("#add-type-button").click(function () {
        addType();
    });


    $.fn.textWidth = function(_text, _font){
        var textToConsider = _text || this.val();
        if (textToConsider == "") {
            textToConsider = this[0].placeholder;
        }
        var fakeEl = $('<span>').hide().appendTo(document.body).text(textToConsider).css({font: _font || this.css('font'), whiteSpace: "pre"}),
            width = fakeEl.width();
        fakeEl.remove();
        return width;
    };

    $.fn.inputWidthUpdate = function(options) {
        options = $.extend({padding:10,minWidth:0,maxWidth:10000}, options||{});
        $(this).css('width', Math.min(options.maxWidth,Math.max(options.minWidth,$(this).textWidth() + options.padding)));
    };

    $.fn.autoresize = function(options){//resizes elements based on content size.  usage: $('input').autoresize({padding:10,minWidth:0,maxWidth:100});
        $(this).on('input', function() {
            $(this).inputWidthUpdate(options);
        }).trigger('input');
        return this;
    };

    let myAutoresizeOptions = {padding:2,minWidth:10,maxWidth:300};

    function installAutoresize() {
        $("input").autoresize(myAutoresizeOptions);
    }

    function keyword(text) {
        return "<input class='keyword' value='" + text + "'>";
    }

    function editCell(text) {
        return "<input class='editable' value='" + text + "'>";
    }

    function resolvable(text, role) {
        return "<input class='resolvable' placeholder='" + text + "' value='' role='" + role + "'>";
    }

    function addField(t) {
        $(t).siblings(".fields").find(".message").hide();
        $(t).siblings(".fields").append(`<div class='field'>${keyword('field')}${editCell('myField')}${keyword('of type')}${resolvable('myType', 'type')}</div>`)
        prepareInputs();
    }

    function tryToAdd(t) {
        console.log("ADDING");
        addField(t);
    }

    function prepareInputs() {
        installAutoresize();
        // $("input.keyword").unbind('keydown');
        // $("input.placeholder").on('keydown', function (e) {
        //     if (e.key == "ArrowRight") {
        //         console.log("->");
        //         e.preventDefault();
        //         Navigation.moveToNextElement(this);
        //         return true;
        //     } else if (e.key == "ArrowLeft") {
        //         e.preventDefault();
        //         Navigation.moveToPrevElement(this);
        //         return true;
        //     } else if (e.key == "Enter") {
        //         console.log("enter");
        //         e.preventDefault();
        //         tryToAdd(this);
        //         return true;
        //     }
        //     return false;
        // });
        // $("input.keyword").on('keydown', function (e) {
        //     if (e.key == "ArrowRight") {
        //         e.preventDefault();
        //         Navigation.moveToNextElement(this);
        //         return true;
        //     } else if (e.key == "ArrowLeft") {
        //         e.preventDefault();
        //         Navigation.moveToPrevElement(this);
        //         return true;
        //     } else if (e.key == "Enter") {
        //         e.preventDefault();
        //         tryToAdd(this);
        //         return true;
        //     }
        //     return false;
        // });
        // $("input.editable").unbind('keydown');
        // $("input.editable").on('keydown', function (e) {
        //     if (e.key == "ArrowRight") {
        //         if (this.selectionStart == $(this).val().length) {
        //             e.preventDefault();
        //             Navigation.moveToNextElement(this);
        //             return true;
        //         }
        //     } else if (e.key == "ArrowLeft") {
        //         if (this.selectionStart == 0) {
        //             e.preventDefault();
        //             Navigation.moveToPrevElement(this);
        //             return true;
        //         }
        //     } else if (e.key == "Enter") {
        //         e.preventDefault();
        //         tryToAdd(this);
        //         return true;
        //     } else {
        //         //console.log("K " + e.key);
        //     }
        // });
        // console.log("prepareInputs");
        // $("input.resolvable").each(function () {
        //     console.log("install autocomplete");
        //     installAutocomplete(this, valuesProvider);
        // });
    }

    function autocompleteTriggered(input, item) {
        if (item.transformation != undefined) {
            item.transformation(input, item);
        } else {
            input.value = item.label;
            $(input).inputWidthUpdate(myAutoresizeOptions);
            $(input).attr("selected-id", item.id);
        }
    }

    let replaceWithSequence = function (input, item) {
        console.log("replaceWithSequence");
        let group = document.createElement("span");
        group.className = 'group';
        // $(group).append(keyword("sequence of ("));
        // let r = document.createElement("input");
        //
        $(group).append(`${keyword("sequence of (")}${resolvable('myType', 'type')}${keyword(")")}`);
        $(input).replaceWith(group);
        $(group).find("input[role='type']").first().focus();
        //$(input).replaceWith(`<span class="group">${keyword("sequence of (")}${resolvable('myType', 'type')}${keyword(")")}<span>`);
        prepareInputs();
    };

    function valuesProvider(input) {
        let role = $(input).attr("role");
        console.log('values provider, role=' + role+", matched? "+ (role=='type'));
        window.vp = input;
        if (role == 'type') {
            return [
                { label: 'string', value: 'string', id: 'string'},
                { label: 'boolean', value: 'boolean', id: 'boolean'},
                { label: 'integer', value: 'integer', id: 'integer'},
                { label: 'decimal', value: 'decimal', id: 'decimal'},
                { label: 'sequence', value: 'sequence', id: 'sequence', transformation: replaceWithSequence},
            ];
        };
        return [
            { label: 'United Kingdom', value: 'UK', id: 'UK' },
            { label: 'United States', value: 'US', id: 'US' }
        ];
    }

    function installAutocomplete(input, valuesProvider) {
        $(input).keyup(function(){
            console.log("keyup autocomplete");
            let text = input.value.toLowerCase();
            console.log("VALUES " + valuesProvider(input));
            let matched = valuesProvider(input).filter(n => n.label.toLowerCase() == text);
            console.log("TEXT "+text+" MATCHED " + matched);
            if (matched.length == 1) {
                autocompleteTriggered(input, matched[0]);
            } else {
                $(input).attr("selected-id", null);
                //$(input).removeClass("selection-done");
            }
        });
        autocomplete({
            input: input,
            minLength: 0,
            fetch: function (text, update) {
                text = text.toLowerCase();
                //var suggestions = ["A", "B", "C", "doo", "foo"];
                var suggestions = valuesProvider(input).filter(n => n.label.toLowerCase().startsWith(text));
                update(suggestions);
            },
            onSelect: function (item) {
                autocompleteTriggered(input, item);
            }
        });
    }

    updateTypes();

});