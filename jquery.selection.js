/*!
 * Note: category selection plugin
 *
 * jQuery Selection Library v1.0.1
 * http://www.madcoder.cn/
 *
 * Copyright 2014, Gcaufy
 *
 * Date Fri Aug 08 2014 11:02:25 GMT+0800
 */
(function ($){
	var selection = function (container, i, c) {
		if (!$(container).hasClass('nav-container'))
			container.addClass('nav-container');
		this._container = container;
		this.index = i;
		this.files = [];
		this.state = {multi: false, unfold: false, narrowed: false};
		this.config = $.selection.defaults;
		this.options(c);
		//this.init();
	}
	selection.fn = selection.prototype = {
		init: function () {
			var container = this._container, group = null, self = this, c = self.config, data = c.dataSource.data,
				key = null, i = 0, p = 0, lenp = 0, tmp = null, len = data.length, 
				category = null, item = null, itemp = null, more = null, multiple = null, topbar = '',
				multipleButtons = null, multipleConfirm = null, multipleCancel = null;
			if (c.breadcrumb !== false) {
				topbar = $('<div class="nav-topbar nav-category-group clearfix"><a class="nav-switch" href="javascript:void(0);" title="' + c.navShow.foldText + '"><i class="icon icon-arrow-up-gray" trace="navHideButton"></i></a><div class="nav-topbar-content"><ul><li class="has-arrow">' + c.breadcrumb.root.title + '</li><li class="nav-arrow"><span class="nav-topbar-arror icon icon-arrow-right-gray"></span></li></ul></div><div class="nav-category-panel"></div></div>');
				topbar.find('.nav-switch').click(function () {
					var icon = $(this).find('i');
					if (self.state.narrowed) {
						container.removeClass('state-narrowed');
						icon.removeClass('icon-arrow-down-gray').addClass('icon-arrow-up-gray');
						self.state.narrowed = false;
						$(this).attr('title', c.navShow.foldText);
					} else {
						container.addClass('state-narrowed');
						icon.removeClass('icon-arrow-up-gray').addClass('icon-arrow-down-gray');
						self.state.narrowed = true;
						$(this).attr('title', c.navShow.unfoldText);
					}
				});
				container.append(topbar);
			}

			container.append('<div class="nav-content"><div class="nav-category-group type-line"></div></div>');
			group = container.find('.nav-content .nav-category-group');
			for(i = 0; i < len; i++) {
				category = data[i].category;
				item = $('<div class="nav-category" data-category="' + category.value + '"></div>');
				
				group.append(item);
				item.append('<h4>' + category.title + '<span>：</span></h4>');
				more = $('<a href="javascript:void(0)" class="nav-more"><span>' + c.iconMore.unfoldText + '</span><span class="icon icon-more icon-arrow-down-gray1"></span></a>');
				item.append(more);
				if (category.multiple) {
					multiple = $('<a href="javascript:void(0)" class="multi-choice">' + c.iconMultiple.text + '</a>');
					item.append(multiple);
				}
				item.append('<div class="nav-category-wrap"><ul class="nav-category-content"></ul></div>');
				
				// Add confirm button
				multipleButtons = $('<div class="nav-btn-container"></div>');
				multipleConfirm = $('<a href="javascript:void(0);" class="btn-submit">确定</a>');
				multipleCancel = $('<a href="javascript:void(0);" class="btn-cancel">取消</a>');
				multipleButtons.append(multipleConfirm).append(multipleCancel);
				item.append(multipleButtons);

				multipleCancel.click(function () {
					self.state.multi = false;
					self.state.unfold = false;
					$(this).parent().parent().removeClass('state-multi').removeClass('state-unfold');
					return false;
				});
				multipleConfirm.click(function () {
					var categroys = self.getSelected();

					if (typeof(c.onSelected) === 'function') {
						if (c.onSelected.call(self, categroys, null, this) === false)
							return false;
					}
					self.updateBreadCrumb(categroys);
					self.state.multi = false;
					self.state.unfold = false;
					$(this).parent().parent().removeClass('state-multi').removeClass('state-unfold');
					return false;
				});


				lenp = category.items.length;
				tmp = item.find('ul');
				for(p = 0; p < lenp; p++) {
					itemp = category.items[p];
					tmp.append('<li class=""><a data-cateogry="' + i + '" data-item="' + p + '" class="nav-category-item' +
					(itemp.selected ? ' selected' : '') +
					 '" title="' + itemp.title + '" data-value="' + itemp.value + '" data-traceclick=""><div class="icon icon-btn-check-small icon-chk-unchecked2"></div>' + itemp.title + '</a></li>');
				}
				tmp.find('a').click(function () {
					var tmpi = $(this).attr('data-cateogry'), 
						tmpp = $(this).attr('data-item'), 
						categoryDom = null,
						category = data[tmpi].category, 
						categoryIndex = 0,
						itemIndex = 0,
						item = category.items[tmpp];
					if (typeof(c.onClick) === 'function') {
						if (c.onClick.call(self, category, item, this) === false)
							return false;
					}
					categoryDom = $(this).parents('.nav-category');
					categoryIndex = container.find('.nav-category').index(categoryDom);
					itemIndex = categoryDom.find('a.nav-category-item').index(this);
					if (self.state.multi) {
						self.selecteItemsByIndex(categoryIndex, itemIndex, true);

					} else {
						self.clearSelected(category.value);
						self.selecteItemsByIndex(categoryIndex, itemIndex);
						if (typeof(c.onSelected) === 'function') {
							if (c.onSelected.call(self, category, item, this) === false)
								return false;
						}
						self.updateBreadCrumb();
					}
					return false;
				});

				more = item.find('.nav-more');
				if (item.height() * 2 < item.find('.nav-category-wrap').height())
					more.addClass('show');
				more.click(function () {
					var parent = $(this).parent();
					if (self.state.unfold) {
						parent.removeClass('state-unfold');
						self.state.unfold = false;
						$(this).find('.icon').removeClass('icon-arrow-up-gray1').addClass('icon-arrow-down-gray1');
						$(this).find('span').eq(0).html(c.iconMore.unfoldText);
					} else {
						parent.addClass('state-unfold');
						self.state.unfold = true;
						$(this).find('.icon').removeClass('icon-arrow-down-gray1').addClass('icon-arrow-up-gray1');
						$(this).find('span').eq(0).html(c.iconMore.foldText);
					}
				});
				if (multiple) {
					multiple.click(function () {
						var parent = $(this).parent();
						self.state.multi = true;
						self.state.unfold = true;
						parent.addClass('state-unfold');
						parent.addClass('state-multi');
					});
				}
			}
			return self.checkStatus().updateBreadCrumb();
		},
		_addlist: function (categoryValue, categoryTitle, itemValue, itemTitle, hasArrow, level) {
			var li = null, oldLi, arrow = null, self = this, container = this._container, c = this.config, realTitle;

			oldLi = container.find('li.nav-pill[data-category="' + categoryValue + '"]');
			realTitle = itemTitle;
			if (c.breadcrumb.maxLength > 0)
				itemTitle = itemTitle.substr(0, 7) + '...';
			li = $('<li class="nav-pill" data-category="' + categoryValue + '"></li>');
			li.append('<a class="icon-tag" href="javascript:void(0)" title="' + categoryTitle + ':' + realTitle + '">' +
				'<h5>' + categoryTitle + '：</h5>' +
				'<span class="nav-pill-text">' + itemTitle + '</span>' + 
				'<span class="nav-pill-cancle icon icon-cancel-gray"></span>' +
				'</a>'
			);

			arrow = container.find('.nav-topbar-content li.nav-arrow').eq(level);
			if (arrow.length === 0) {
				arrow = $('<li class="nav-arrow"><span class="nav-topbar-arror icon icon-arrow-right-gray"></span></li>');
				container.find('.nav-topbar ul').append(arrow);
			}
			if (oldLi.length > 0)
				oldLi.replaceWith(li);
			else 
				arrow.before(li);

			li.click(function () {
				self.clearSelected(categoryValue);
				if ($(this).prev().hasClass('nav-arrow') && $(this).next().hasClass('nav-arrow'))
					$(this).prev().remove();
				$(this).remove();
			});
			return this;
		},
		selecteItemsByValue: function (categoryValue, itemValue) {
			var selectedCategory = null, container = this._container, 
				items = (typeof(itemValue) === 'string') ? itemValue.split(',') : [itemValue], 
				key = null;
			//this.clearSelected();
			selectedCategory = container.find('.nav-category[data-category="' + categoryValue +'"]').addClass('selected');
			for (key in items) {
				selectedCategory.find('.nav-category-item[data-value="' + items[key] + '"]').addClass('selected');
			}
			/*if (selectedCategory.find('ul a.nav-category-item.selected').length === 0) {
				selectedCategory.removeClass('selected').removeClass('half-selected').removeClass('full-selected');
			} else if (selectedCategory.find('ul a.nav-category-item.selected').length === selectedCategory.find('ul a.nav-category-item').length) {
				selectedCategory.addClass('selected').removeClass('half-selected').addClass('full-selected');
			} else {
				selectedCategory.addClass('selected').addClass('half-selected').removeClass('full-selected');
			}*/
			return this;
		},
		selecteItemsByIndex: function (categoryIndex, itemIndex, toggle) {
			var selectedCategory = null, selectedItem = null, container = this._container, 
				items = (typeof(itemIndex) === 'string') ? itemIndex.split(',') : [itemIndex],
				key = null;
			selectedCategory = container.find('.nav-category:eq(' + categoryIndex + ')').addClass('selected');
			for (key in items) {
				selectedItem = selectedCategory.find('.nav-category-item:eq(' + items[key] + ')');
				if (selectedItem.hasClass('selected')) {
					if (toggle)
						selectedItem.removeClass('selected');
				} else {
					selectedItem.addClass('selected');
				}
			}
			if (toggle) {
				this.checkStatus(selectedCategory);
			}
		},
		checkStatus: function (category) {
			var selectedCategory = null;
			category = category ? category : this._container.find('.nav-category');
			category.each(function () {
				selectedCategory = $(this);
				if (selectedCategory.find('ul a.nav-category-item.selected').length === 0) {
					selectedCategory.removeClass('selected').removeClass('half-selected').removeClass('full-selected');
				} else if (selectedCategory.find('ul a.nav-category-item.selected').length === selectedCategory.find('ul a.nav-category-item').length) {
					selectedCategory.addClass('selected').removeClass('half-selected').addClass('full-selected');
				} else {
					selectedCategory.addClass('selected').addClass('half-selected').removeClass('full-selected');
				}
			});
			return this;
		},
		clearSelected: function (categoryValue) {
			var target = !categoryValue ? 
				this._container : 
				this._container.find('.nav-category[data-category="' + categoryValue +'"]');
			target.removeClass('selected').removeClass('half-selected').removeClass('full-selected');
			target.find('.selected').removeClass('selected');
			return this;
		},
		updateBreadCrumb: function (category, item) {
			var self = this, c = this.config, container = this._container, li = '', 
				i = 0, len = 0, p = 0, lenp = 0,
				obj = {}, tmp = null,
				categoryValue, itemValue, categoryTitle = '', itemTitle = '', hasArrow = false;
			if (category === undefined)
				category = self.getSelected();
			
			if (c.breadcrumb === false)
				return this;
			len = category.length;
			container.find('.nav-pill').each(function () {
				categoryValue = $(this).attr('data-category');
				obj[categoryValue] = 0;
			});
			if (len !== undefined) {
 				for (i = 0; i < len; i++) {
 					if (i === len - 1)
 						hasArrow = true;
 					categoryTitle = category[i].title;
 					categoryValue = category[i].value;
 					obj[categoryValue] = 1;
 					lenp = category[i].items.length;
 					itemTitle = '';
 					itemValue = '';
 					for (p = 0; p < lenp; p++) {
 						itemTitle += category[i].items[p].title + ', ';
 						itemValue += category[i].items[p].value + ',';
 					}
 					if (itemTitle.length > 0) {
 						itemTitle = itemTitle.substr(0, itemTitle.length - 2);
 						itemValue = itemValue.substr(0, itemValue.length - 1);
 					}
					this._addlist(categoryValue, categoryTitle, itemValue, itemTitle, hasArrow, 1);
 				}
				for (tmp in obj) {
					if (obj[tmp] === 0)
						container.find('.nav-pill[data-category="' + tmp + '"]').remove();
				}
			} else {
				prods = item.title;
				//obj[category.value] = 1;
				this._addlist(category.value, category.title, item.value, item.title, true, 1);
			}
			return this;
		},
		options: function (c) {
			this.config = $.extend(true, {}, this.config, c);
			return this;
		},
		getSelected: function () {
			var container = this._container, self = this, selected = [], data = this.config.dataSource.data, 
				selectedCategory = null, category = null, item = null, tmp = [], parent = null;

			container.find('.nav-category.selected').each(function (i) {
				parent = this;
				category = data[container.find('.nav-category').index(this)].category
				selectedCategory = $.extend(true, {}, category);
				tmp = [];
				$(this).find('ul a.nav-category-item.selected').each(function (p) {
					tmp.push(category.items[$(parent).find('ul a.nav-category-item').index(this)]);
				});
				selectedCategory.items = tmp;
				selected.push(selectedCategory);
			});
			return selected;
		},
		// It's a call back from the server,
		error: function (rst) { 
			var c = this.config;
			alert(rst);
			if (typeof(c.error) === 'function') {
				c.error.call(this, rst);
			}
			if (typeof(c.afterUpload) === 'function') {
				c.afterUpload.call(this, rst);
			}
		}
	};

	selection.list = [];
	selection.count = 0;
	selection.defaults = {
		// The form id
		dataSource: {},	
		iconMore: {
			foldText: '收起',
			unfoldText: '更多',
		},
		navShow: {
			foldText: '收起导航',
			unfoldText: '展开导航',
		},
		iconMultiple: {
			text: '多选',
		},
		onSelected: null,
		onClick: null,
		breadcrumb: {
			root: {
				title: '所有分类'
			},
			maxLength: 7
		}
	};
	$.fn.selection = function (config) {
		var idx = selection.count, id = $(this).attr('id'), tmp = null;
        if (!id) {
        	id = 'ju_' + idx;
        	$(this).attr('id', id);
        }
        config = config ? config : {}
        if (typeof(config) === 'string' && selection.fn[config]) {
            return selection.fn[config].apply(selection.list[id], Array.prototype.slice.call(arguments, 1));
        } else if (typeof(config) === 'object') {
        	if (selection.list[id]) {
        		selection.list[id].options(config);
        	} else {
            	selection.list[id] = new selection(this, idx, config);
            	selection.count++;
        	}
            return selection.list[id];
        } else {
            $.error(config + ' does not exist on jQuery.selection');
            return false;
        }
	}
	$.selection = selection;
})(jQuery);