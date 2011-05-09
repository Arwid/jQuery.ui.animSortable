/*!
 * jQuery.ui.animSortable
 *
 * Copyright 2011 Arwid Bancewicz
 * Licensed under the MIT lice
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * @date 9 May 2011
 * @author Arwid Bancewicz http://arwid.ca
 * @version 0.1
 */

 (function($) {

    $.widget("ui.animSortable", $.extend({},
    $.ui.sortable.prototype, {

        options: {
          indentSize: 20
        },

        _triggerOrig: $.ui.sortable.prototype._trigger,

        /* Override _trigger so we can call some custom functions */
        _trigger: function() {
            if (arguments[0] == "change") {
                this._animChange(arguments[1], arguments[2]);
            } else if (arguments[0] == "start") {
                this._animStart(arguments[1], arguments[2]);
            } else if (arguments[0] == "stop") {
                this._animStop(arguments[1], arguments[2]);
            }
            this._triggerOrig(arguments);
        },

        _animStart: function(e, ui) {
            var placeholder = $(ui.placeholder);
            var helper = $(ui.helper);
            var item = $(ui.item);
            item.find("li").addClass("removed");

            var depth = placeholder.parents("ol").size() - 1;
            helper.find(".todo-item:first").css("padding-left", depth * this.options.indentSize + "px");

            helper.height(helper.find(".todo-item:first").outerHeight(true));
            var height = helper.children(".todo-item:first").outerHeight(true);
            placeholder.animate({
                height: height
            }, 250, 'easeOutCubic', $.proxy(function() { this.refreshPositions(); },this));

            var numRand = Math.floor(Math.random() * 101);
            this.element.attr("id", numRand);

            var count = helper.find("li").size();
            if (count > 0) {
                var content = helper.find(".todo-content").first();
                content.prepend("<span class='drag-info'>(+" + count + " more)</span>");
            }

            helper.find("ol").slideUp(250, 'easeOutCubic');
            helper.css("z-index", 999);
            helper.css("position", "absolute");
            this.refreshPositions();
        },
        
        _animStop: function(e, ui) {
            var placeholder = $(ui.placeholder);
            var item = $(ui.item);
            item.find("li").removeClass("removed");

            var depth = placeholder.parents("ol").size() - 1;
            item.find(".todo-item:first").css("padding-left", depth * this.options.indentSize + "px");
            item.find("ol").slideUp(0).slideDown(150);
        },

        _animChange: function(e, ui) {
            var placeholder = $(ui.placeholder);
            var helper = $(ui.helper);
            var This = placeholder.closest(".todos:first");
            var ptop = placeholder.offset().top;
            var pbottom = ptop + placeholder.outerHeight(true);
            var half = ptop + (pbottom - ptop) / 2;

            var depth = placeholder.parents("ol").size() - 1;
            helper.find(".todo-item:first").stop().animate({
                "padding-left": depth * this.options.indentSize
            }, 250, 'easeOutCubic');
            
            this.containerElement = placeholder.closest(this.options.connectWith);
            if (this.direction == "up") {
                var above = this._above(placeholder);

                if (above.get(0) == $(ui.helper).get(0)) {
                    return true;
                }
                if (this._upClone) this._upClone.stop().remove();
                if (this._upEl) this._upEl.find(".todo-item:first").css("visibility", "visible");

                var aboveClone = above.clone();
                this._upClone = aboveClone;
                this._upEl = above;
                aboveClone.children("ol").remove();
                aboveClone.attr("id", "aClone");
                aboveClone.css("position", "absolute").css("left", "0").css("right", "0");

                var depth = above.parents("ol").size() - 1;
                aboveClone.find(".todo-item:first").css("padding-left", depth * this.options.indentSize + "px");

                this.containerElement.append(aboveClone);

                This.append(aboveClone);
                above.find(".todo-item:first").css("visibility", "hidden");
                aboveClone.css("top", placeholder.position().top + this.containerElement.get(0).scrollTop + "px").animate({
                    top: placeholder.position().top + this.containerElement.get(0).scrollTop - placeholder.outerHeight(true)
                },
                150, 'easeOutCubic',
                function() {
                    above.find(".todo-item:first").css("visibility", "visible");
                    $(this).remove();
                });
            } else {
                var above = this._below(placeholder);

                if (above.get(0) == $(ui.helper).get(0)) {
                    return true;
                }
                if (this._downClone) this._downClone.stop().remove();
                if (this._downEl) this._downEl.find(".todo-item:first").css("visibility", "visible");
                
                var aboveClone = above.clone();
                this._downClone = aboveClone;
                this._downEl = above;
                aboveClone.children("ol").remove();
                aboveClone.attr("id", "aClone");
                aboveClone.css("position", "absolute").css("left", "0").css("right", "0");

                var depth = above.parents("ol").size() - 1;
                aboveClone.find(".todo-item:first").css("padding-left", depth * this.options.indentSize + "px");

                this.containerElement.append(aboveClone);
                var aCloneDepth = above.parents("ol").size() - 1;

                This.append(aboveClone);
                above.find(".todo-item:first").css("visibility", "hidden");
                aboveClone.css("top", placeholder.position().top + this.containerElement.get(0).scrollTop + "px").animate({
                    top: placeholder.position().top + this.containerElement.get(0).scrollTop + placeholder.outerHeight(true)
                },
                150, 'easeOutCubic',
                function() {
                    above.find(".todo-item:first").css("visibility", "visible");
                    $(this).remove();
                });
            }
        }

    }));

    $.ui.animSortable.prototype.options = $.extend({},
    $.ui.sortable.prototype.options, $.ui.animSortable.prototype.options);

})(jQuery);