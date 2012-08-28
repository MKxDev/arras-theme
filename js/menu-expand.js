;(function($) {
	var btnExpand = 'btn-expand'
	  , btnWrap = 'btn-wrap'
	  , shadowClass = 'box-shadow';
	  
	var methods = {
		getMenuWidth: function(menu) {
			var width = 0;
			$(menu).children('li').each(function(inx, elt) {
				$(elt).children('a').css('white-space', 'nowrap');
				
				width += $(elt).width();
			});
			
			return width;
		}
		, getFirstHidden: function(menu) {
			var li = null;
			
			$(menu).children('li').each(function(inx, elt) {
				var offsetDiff = $(menu).parent().offset().left - $(elt).offset().left;
				
				if (offsetDiff <= $(elt).width()) {
					li = elt;
					return false;
				}
			});
			
			return li;
		}
		, getLastHidden: function(menu) {
			var li = null;
			
			$(menu).children('li').each(function(inx, elt) {
				var childOffset = $(elt).offset().left - $(menu).parent().offset().left;
				
				if (childOffset + $(elt).width() > $(menu).parent().width()) {
					li = elt;
					return false;
				}
			});
			
			return li;
		}
		, getHiddenElements: function(menu) {
			var elts = [];
			
			$(menu).children('li').each(function() {
				var liLeft = $(this).position().left;
				var liTop = $(this).position().top;
				var liWidth = $(this).width();
				var parentWidth = $(this).parent().width();
				
				if (liLeft + liWidth > parentWidth || liTop > 0) {
					elts.push(this);
				}
			});
			
			return elts;
		}
	};
	
	$.fn.menuExpand = function() {
	  	var buttonWidth = 30
	  	  , margin = 10
  	      , animating = false
  	      , expanded = false
  	      , menuBGColor = '#322C2C';
		
		var menu = $(this).children('ul');
		var wrapWidth = $(this).width();
		var menuWidth = methods.getMenuWidth(menu);
		var menuHeight = $(this).height();
		
		if (menuWidth > wrapWidth) {
			var _this = this;
			
			// Set wrapper dimensions to make space for expand button
			$(this)
				.width(wrapWidth - buttonWidth - margin)
				.css('margin-right', margin + 'px')
				.css('overflow', 'hidden');
			wrapWidth = $(this).width();
			
			// Set menu dimensions
			$(menu)
				.width(wrapWidth)
				.height(menuHeight)
				.css('position', 'relative');
				
			// Make sure hidden elts do not overflow
			var hiddenLIs = methods.getHiddenElements(menu);
			$(hiddenLIs).css('visibility', 'hidden');
			
			$(this).css('overflow', 'visible');
			
			// insert and style button wrapper
			$(this).after('<div class="' + btnWrap + '"></div>');
			var btnWrpElt = $(this).parent().children('.' + btnWrap);
			btnWrpElt
				.css('float', 'left')
				.addClass('clearfix');
			
			// insert expand button
			btnWrpElt.append('<a href="javascript:// Show All" class="' + btnExpand + '">&gt;&gt;</a>');
			
			// style new button
			btnWrpElt.children('a')
				.css('display', 'block')
				.css('position', 'absolute')
				.css('top', '0')
				.css('right', '0')
				.css('z-index', 101)
				.css('width', buttonWidth + 'px')
				.css('height', $(this).height() + 'px')
				.css('line-height', $(this).height() + 'px')
				.css('color', '#FFF')
				.css('text-align', 'center');
			
			// Set button click event
			$(btnWrpElt).children('.' + btnExpand).click(function() {
				if (animating) return;
				
				if (!expanded) {
					// Hide wrap and menu overflow
					$([_this, menu]).css('overflow', 'hidden');
					
					// Set menu styles
					$(menu)
						.css('background-color', menuBGColor).css('z-index', 100)
						.css('padding-right', (margin + buttonWidth) + 'px');
					
					// Save new menu height
					$(menu).height('auto');
					var tempMenuHeight = $(menu).height();
					
					// Set more menu styles
					$(menu)
						.height(menuHeight)
						.css('position', 'absolute')
						.css('left', 0)
						.css('top', 0)
						.addClass(shadowClass);
					
					// Display wrap overflow
					$(_this).css('overflow', 'visible');
					
					// Display hidden elts
					$(hiddenLIs).css('visibility', 'visible');
					
					// Expand Menu height to it's size
					animating = true;
					$(menu).animate({
						height: tempMenuHeight
					}, function() {
						animating = false;
						expanded = true;
						
						// Display menu overflow
						$(menu)
							.css('overflow', 'visible');
					});
				}
				else {
					// Expand Menu height to it's size
					animating = true;
					$(menu).animate({
						height: menuHeight
					}, function() {
						animating = false;
						expanded = false;
						
						// Display menu overflow
						$(menu)
							.css('background', 'none')
							.css('position', 'relative')
							.removeClass(shadowClass);
							
						// Hide hidden elts
						$(hiddenLIs).css('visibility', 'hidden');
					});
				}
			});
		}
	};
})(jQuery);
