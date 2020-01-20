var globalCurWidth = $(window).width();
var isTouch = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? true : false;

// IS VALID EMAIL
function isValidEmail (email, strict)
{
	if (!strict) email = email.replace(/^\s+|\s+$/g, '');
	var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
	
	return pattern.test(email);
}

// IS VALID PHONE
function isValidPhone(phoneFieldElem)
{
	if (device.android())
	{
		var patternTel = /^[\d|\+][\d|\(|\)|\ |-]{4,20}\d$/;

		if ( patternTel.test(phoneFieldElem.val()) === false) 
		{
			return false;
		}
	}
	else
	{
		if (phoneFieldElem.inputmask("isComplete") === false)
		{
			return false;
		}
	}
	
	return true;
}

// IS RESIZE WINDOW
function windowResizeWidth()
{
	setTimeout(function()
	{
		var window_w = $(window).width();
	
		if (globalCurWidth != window_w)
		{
			globalCurWidth = window_w;
			$(document).trigger("isWindowResizeWidth");
		}
	}, 50);
}

// GET SCROLL WIDTH
function getScrollWidth()
{
	var div = $('<div>').css({
		position: "absolute",
		top: "0px",
		left: "0px",
		width: "100px",
		height: "100px",
		visibility: "hidden",
		overflow: "scroll"
	});
	
	$('body').eq(0).append(div);
	
	var width = div.get(0).offsetWidth - div.get(0).clientWidth;
	
	div.remove();
	
	if ($(window).height() >= $("html").height())
		width = 0;
	
	return width;
}

// OPEN POPUP
function openPopup(popupItem)
{
	var show_popup_item = popupItem;
	
	if (show_popup_item.length === 0)
		return false;
	
	var min_vertical_indent = $(window).width() > 768 ? 20 : 0,
		popup_item_height = $(show_popup_item).innerHeight(),
		result_top_pos = $(window).scrollTop() + ($(window).height() - popup_item_height) / 2;
	
	if (popup_item_height + min_vertical_indent*2 > $(window).height()){
		result_top_pos = $(window).scrollTop() + min_vertical_indent;
		$(show_popup_item).css("top", result_top_pos).addClass("popup_big-height");
	}
	
	if ($(".popup.is-show").length)
		$(".popup.is-show").removeClass("popup_big-height is-show").hide();
	
	$(show_popup_item).show();

	if ($(show_popup_item).find(".slick-slider").length)
		$(show_popup_item).find(".slick-slider").slick('setPosition').resize();
	
	setTimeout(function(){
		$("#global-overlay").addClass("is-show");
		$(show_popup_item).addClass("is-show");

	},100);
}


// SHOW FILTER RESULT POINTER
var filterResultPointerTimeout;

function showFilterResultPointer(elementForShow)
{
	clearTimeout(filterResultPointerTimeout);	

	var filter_result_pointer = $("#filter-result-pointer"),
			left_position = elementForShow.offset().left + elementForShow.innerWidth(),
			top_position = elementForShow.offset().top + elementForShow.innerHeight()/2 - filter_result_pointer.innerHeight()/2;

	filter_result_pointer.css({"left": left_position, "top" : top_position}).addClass("is-show");

	filterResultPointerTimeout = setTimeout(function(){
		filter_result_pointer.removeClass("is-show");
	}, 5000);
}


$(window).resize(function()
{
	windowResizeWidth();
});

$(document).ready(function()
{
	/* //////////////////////////////////////////// GENERAL ///////////////////////////////////////////// */

		styledInputTextElements();
		initStyledSelect();
		initStyledScrollBarY();
		initPhoneMask();
		initStretchyTextarea();
		initStyledUploadFile();
		showPopup();
		closePopup();
		fixedTopPanel();
		showSearch();
		showMenu();
		switchAuthorizationForms();
		initHowToGetSlider();
		choiceCount();
	

	/* //////////////////////////////////////////// INDEX ///////////////////////////////////////////// */
		
		initPromoSlider();
		initShortArticleSlider();
		initProductSlider();
		showSpecProductsMenuCategories();


	/* //////////////////////////////////////////// CATALOG ///////////////////////////////////////////// */
		
		showFilterSection();
		changeFilterElem();
		initFilterRangeSlider();



	/* //////////////////////////////////////////// DETAIL ///////////////////////////////////////////// */

		initPoductPhotogallerySlider();
		closeProductDetailWatchingNow();
		initStickProductDetailInfo();
		purchaseProduct();



	/* //////////////////////////////////////////// CART ///////////////////////////////////////////// */

		switchOrderingTypes();
		choiceOrderingDelivery();
		showOrderingDeliveryDescription();
		selectDeliveryShop();



	/* //////////////////////////////////////////// VACANCY ///////////////////////////////////////////// */
	
		showVacancy();

});




/* //////////////////////////////////////////// GENERAL ///////////////////////////////////////////// */
	
	// STYLED INPUT TEXT ELEMENTS
	function styledInputTextElements()
	{
		/* focus on input text, textarea */
		$('input[type="text"], input[type="tel"], input[type="password"], input[type="email"], textarea, .inp-text, .textar').on("focus", function()
		{
			$(this).parents(".form-field").addClass("is-focus").removeClass("is-error-field is-ok-field");
			
			if ($(this).val().length > 0)
				$(this).parents(".form-field").removeClass("is-filled");
		});
		
		$('input[type="text"], input[type="tel"], input[type="password"], input[type="email"], textarea, .inp-text, .textar').on("blur", function()
		{
			var elem = $(this);
			
			setTimeout(function(){
				if (elem.val().length > 0)
					elem.parents(".form-field").addClass("is-filled");
				else
					elem.parents(".form-field").removeClass("is-filled is-focus");
			}, 50);
		});
	}
	
	
	// INIT STYLED SELECT
	function initStyledSelect()
	{
		$(".js-styled-select").each(function()
		{
			var select = $(this);
			var dropdownParent = $(document.body);
    	
    	if (select.parents('.select-spec-type').length !== 0)
      	dropdownParent = select.parents('.select-spec-type');

			select.select2({
				minimumResultsForSearch: Infinity,
				dropdownAutoWidth: true,
				dropdownParent: dropdownParent
			});
		});
	}


	// INIT STYLED SCROLL BAR Y
	function initStyledScrollBarY()
	{
		$(".js-styled-scroll-bar-y").mCustomScrollbar({
			axis: 'y',
			scrollbarPosition: "outside",
			mouseWheel:{deltaFactor: 50}
		});
	}


	// INIT PHONE MASK
	function initPhoneMask()
	{
		if ($(".js-phone-mask").length)
		{
			if (device.android())
				return false;
			
			$(".js-phone-mask").inputmask({
				"mask": "+7 (999) 999-99-99", 
				"clearIncomplete": false, 
				"autoUnmask": true,
				"showMaskOnHover": false,
			});
		}
	}


	// INIT STRETCHY TEXTAREA
	function initStretchyTextarea()
	{
		if ($(".js-stretchy-textarea").length === 0)
			return false;

		autosize($('.js-stretchy-textarea'));
	}
		
	
	// INIT STYLED UPLOAD FILE
	function initStyledUploadFile()
	{
		$(document).on('change','.js-upload-file', function () 
		{
			var $this = $(this);
			var filename = $this.val().split('\\');
			var load_file_block = $this.parents(".load-file");
			filename = filename[filename.length - 1];
			load_file_block.addClass('is-uploaded');
			load_file_block.find('.load-file__uploaded-name-val').html(filename);
			//load_file_block.find('.load-file__uploaded-info').text(fileSize(this.files[0].size));
			
			load_file_block.parents(".form-field").removeClass("is-error-field");
		});

		$(document).on('click', '.js-cancel-upload-file', function (e) 
		{
			var load_file_block = $(this).parents(".load-file");
			clearLoadFileItem(load_file_block);	
		});
		
		function clearLoadFileItem(loadFileItemBlock)
		{
			loadFileItemBlock.find(".js-upload-file").val('');
			loadFileItemBlock.removeClass("is-uploaded");
			loadFileItemBlock.find('.load-file__uploaded-name-val').html('');
			loadFileItemBlock.find('.load-file__uploaded-info').text('');
		}
		
		function fileSize(bytes) 
		{
			var thresh = 1024;
			
			if (Math.abs(bytes) < thresh) {
				return bytes + ' B';
			}
			
			var units = ['Кб', 'Мб', 'Гб', 'Тб', 'Пб'];
			var u = -1;
			do {
				bytes /= thresh;
				++u;
			} while (Math.abs(bytes) >= thresh && u < units.length - 1);
			
			return bytes.toFixed(1) + ' ' + units[u];
		}
	}

	// SHOW POPUP
	function showPopup()
	{
		$("body").on("click", ".js-show-popup", function()
		{
			var show_popup_item = $(this).data("popup");
			
			openPopup(show_popup_item);
		});
	}


	// CLOSE POPUP
	function closePopup()
	{
		$("body").on("click", ".js-close-popup", function()
		{
			$("#global-overlay").removeClass("is-show");
			
			var active_popup = $(".popup.is-show");
			active_popup.removeClass("popup_big-height is-show");
			
			setTimeout(function()
			{
				active_popup.hide();

				if (active_popup.is("#popup-authorization")){
					$(".authorization__form-item.is-active").removeClass("is-active");
					$("#authorization-login").addClass("is-active");
				}
			}, 450);
		});
	}


	// FIXED TOP PANEL
	function fixedTopPanel()
	{
		configureHeader();

		$(window).on("scroll", function()
		{
			 configureHeader();
		});

		function configureHeader()
		{
			var fixed_point = $(".header__part-1").innerHeight();

			if ($(window).scrollTop() >= fixed_point)
				$("html").addClass("is-fixed-header");
			else
				$("html").removeClass("is-fixed-header");
		}
	}


	// SHOW SEARCH
	function showSearch()
	{
		$(".js-show-search").on("click", function()
		{
			$(this).parents(".header__search").toggleClass("is-show");
		});

		$(".js-close-search").on("click", function()
		{
			$(this).parents(".header__search").removeClass("is-show");
		});

		$(document).on("click", function(event)
		{
			if ($(event.target).closest(".header__search").length)
				return;
			
			$(".header__search.is-show").removeClass("is-show");
		});
	}


	// SHOW MENU
	function showMenu()
	{
		$(".js-show-menu").on("click", function()
		{
			var top_menu = $("#top-menu");

			if (top_menu.is(".is-show"))
			{
				$(this).removeClass("is-show");
				$("#top-menu").removeClass("is-show");	
				$(".top-menu__item.is-show-submenu").removeClass("is-show-submenu");
			}
			else
			{
				$(this).addClass("is-show");
				$("#top-menu").addClass("is-show");
			}
		});

		$(".js-show-submenu").on("click", function(){
			$(this).parents(".top-menu__item").addClass("is-show-submenu");
		});

		$(".js-back-menu").on("click", function(){
			$(this).parents(".top-menu__item").removeClass("is-show-submenu");
		});
	}


	// SWITCH AUTHORIZATION FORMS
	function switchAuthorizationForms()
	{
		$(".js-show-login-form").on("click", function()
		{
			$(".authorization__form-item.is-active").removeClass("is-active");
			$("#authorization-login").addClass("is-active");
		});

		$(".js-show-registration-form").on("click", function()
		{
			$(".authorization__form-item.is-active").removeClass("is-active");
			$("#authorization-registration").addClass("is-active");
		});

		$(".js-show-forgot-password-form").on("click", function()
		{
			$(".authorization__form-item.is-active").removeClass("is-active");
			$("#authorization-forgot-password").addClass("is-active");
		});
	}
	

	// INIT HOW TO GET SLIDER
	function initHowToGetSlider()
	{
		if ($(".js-how-to-get-slider").length === 0)
			return false;
		
		$(".js-how-to-get-slider").slick({
			slidesToShow: 2,
			slidesToScroll: 1,
			dots: true,
			touchMove: false,
			responsive: [
				{
					breakpoint: 376,
					settings: {
						slidesToShow: 1,
					}
				}
			]
		});
	}


	// CHOICE COUNT
	function choiceCount()
	{
		$(".js-count-field").inputmask({ "mask": "9", "repeat": 6, "placeholder": ""});
		
		$(document).on("click", ".js-count-minus", function()
		{
			var count_field = $(this).parents(".choice-count").find(".js-count-field"),
				cur_value = parseInt(count_field.val());
				
			if (cur_value > 1)
				count_field.val(cur_value - 1);
		});
		
		$(document).on("click", ".js-count-plus", function()
		{
			var count_field = $(this).parents(".choice-count").find(".js-count-field"),
				cur_value = parseInt(count_field.val());

			count_field.val(cur_value + 1);
		});
	}
	

	

/* //////////////////////////////////////////// INDEX ///////////////////////////////////////////// */
	
	// INIT PROMO SLIDER
	function initPromoSlider()
	{
		if ($(".js-promo-slider").length === 0)
			return false;
		
		$(".js-promo-slider").slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: true,
			touchMove: false,
			fade: true,
			autoplay: true,
			autoplaySpeed: 10000,
			responsive: [
				{
					breakpoint: 1025,
					settings: {
						fade: false,
						autoplay: false,
					}
				}
			]
		});
	}


	// INIT SHORT ARTICLE SLIDER
	function initShortArticleSlider()
	{
		if ($(".js-short-article-slider").length === 0)
			return false;
		
		$(".js-short-article-slider").slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: true,
			touchMove: false,
			fade: true,
			responsive: [
				{
					breakpoint: 1025,
					settings: {
						fade: false,
					}
				}
			]
		});
	}


	// INIT PRODUCT SLIDER
	function initProductSlider()
	{
		if ($(".js-product-slider").length === 0)
			return false;
		
		$(".js-product-slider").each(function()
		{
			var product_slider = $(this);

			product_slider.slick({
				slidesToShow: product_slider.attr("data-size-type") === '4' ? 4 : 3,
				slidesToScroll: 1,
				dots: true,
				touchMove: false,
				responsive: [
					{
						breakpoint: 1025,
						settings: {
							slidesToShow: product_slider.attr("data-size-type") === '4' ? 3 : 3,
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
						}
					},
					{
						breakpoint: 481,
						settings: {
							slidesToShow: 1,
						}
					}
				]
			});
		});		
	}


	// SHOW SPEC PRODUCTS MENU CATEGORIES
	function showSpecProductsMenuCategories()
	{
		if ($(".spec-products-menu__categories").length === 0)
			return false;

		$(".js-show-spec-products-menu-categories").on("click", function()
		{
			var categories_list_block = $(this).parents(".spec-products-menu__categories").find(".spec-products-menu__categories-list");

			if (categories_list_block.is(".is-show"))
				categories_list_block.removeClass("is-show");
			else
				categories_list_block.addClass("is-show");
		});

		$(".spec-products-menu__categories-item-field").on("change", function()
		{
			var category_item_field = $(this);
			var categories_block = category_item_field.parents(".spec-products-menu__categories");
			var select_item_text = category_item_field.parents(".spec-products-menu__categories-item").find(".spec-products-menu__categories-item-btn").text();

			categories_block.find(".spec-products-menu__categories-cur").text(select_item_text);
			category_item_field.parents(".spec-products-menu__categories-list").removeClass("is-show");
		});

		$(document).on("click", function(event)
		{
			if ($(event.target).closest(".js-show-spec-products-menu-categories").length)
				return;
			
			$(".spec-products-menu__categories-list.is-show").removeClass("is-show");
		});
	}



/* //////////////////////////////////////////// CATALOG ///////////////////////////////////////////// */
	
	// SHOW FILTER SECTION
	function showFilterSection()
	{
		$(".js-show-filter-section").on("click", function()
		{
			var filter_section = $(this).parents(".filter__section");

			if (filter_section.is(".is-show"))
			{
				filter_section.find(".filter__section-content").slideUp(300, function(){
					filter_section.removeClass("is-show");
				});				
			}		
			else
			{
				filter_section.find(".filter__section-content").slideDown(300, function(){
					filter_section.addClass("is-show");
				});
			}
		});

		$(".js-mobile-show-filter-section").on("click", function()
		{
			var filter_section = $(this).parents(".filter__section");
			filter_section.find(".filter__section-content").addClass("is-mobile-show");
			$("#filter-mobile-overlay").addClass("is-show");				
		});

		$(".js-mobile-close-filter-section").on("click", function()
		{
			$(".filter__section-content.is-mobile-show").removeClass("is-mobile-show");		
			$("#filter-mobile-overlay").removeClass("is-show");
			$(".filter__mobile-controls").removeClass("is-show");
		});		
	}


	// CHANGE FILTER ELEM
	function changeFilterElem()
	{
		$(".js-filter-elem").on("change", function(){
			var filter_item = $(this).parents(".filter__item");
			showFilterResultPointer(filter_item);

			$(this).parents(".filter__section").find(".filter__mobile-controls").addClass("is-show");
		});
	}


	// INIT FILTER RANGE SLIDER
	function initFilterRangeSlider()
	{
		$(".js-filter-range").each(function()
		{
			var filter_range = $(this),
				filter_range_slider = filter_range.find(".filter-range__slider")[0],
				filter_range_field_min = filter_range.find(".filter-range__field-min"),
				filter_range_field_max = filter_range.find(".filter-range__field-max");

			var slider_start_val = parseFloat(filter_range.data("range-start")),
				slider_end_val = parseFloat(filter_range.data("range-end"));
			
			noUiSlider.create(filter_range_slider, {
				start: [slider_start_val, slider_end_val],
				range: {
					'min': [parseFloat(filter_range.data("range-min"))],
					'max': [parseFloat(filter_range.data("range-max"))]
				},
				step: parseFloat(filter_range.data("range-step")),
				connect: true,
				format: {
					to: function ( value ) {
						return value;
					},
					from: function ( value ) {
						return value;
					}
				}
			});
			
			filter_range_slider.noUiSlider.on('slide', function(){
				changeRangeValue(filter_range_slider.noUiSlider.get()[0], filter_range_slider.noUiSlider.get()[1]);
			});

			filter_range_slider.noUiSlider.on('set', function(){
				changeRangeValue(filter_range_slider.noUiSlider.get()[0], filter_range_slider.noUiSlider.get()[1]);
				
				showFilterPricePointer();
			});

			filter_range_slider.noUiSlider.on('change', function(){
				filter_range_field_min.trigger("keyup");

				showFilterPricePointer();
			});

			changeRangeValue(filter_range_slider.noUiSlider.get()[0], filter_range_slider.noUiSlider.get()[1]);

			function changeRangeValue(curMinValue, curMaxValue)
			{
				filter_range_field_min.val(curMinValue);
				filter_range_field_max.val(curMaxValue);
			}

			filter_range_field_min.on("blur", function()
			{
				filter_range_slider.noUiSlider.set([$(this).val(), filter_range_slider.noUiSlider.get()[1]]);
			});

			filter_range_field_max.on("blur", function()
			{
				filter_range_slider.noUiSlider.set([filter_range_slider.noUiSlider.get()[0], $(this).val()]);
			});

			function showFilterPricePointer()
			{
				if (filter_range.parents(".filter__section").length)
				{
					if (filter_range_field_max.length)
						showFilterResultPointer(filter_range_field_max);
					else
						showFilterResultPointer(filter_range);

					filter_range.parents(".filter__section").find(".filter__mobile-controls").addClass("is-show");
				}
			}
		});
	}




/* //////////////////////////////////////////// DETAIL ///////////////////////////////////////////// */

	// INIT PRODUCT PHOTOGALLERY SLIDER
	function initPoductPhotogallerySlider()
	{
		if ($(".js-product-main-slider").length === 0 || $(".js-product-preview-slider").length === 0 )
			return false;

		var photo_gallery_main_photos = $(".js-product-main-slider").slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				fade: true,
				asNavFor: '.js-product-preview-slider',
				dots: true,
				responsive: [
					{
						breakpoint: 1025,
						settings: {
							fade: false
						}
					}
				]
			});

		var photo_gallery_small_photos = $(".js-product-preview-slider").slick({
				slidesToShow: 7,
				slidesToScroll: 1,
				asNavFor: '.js-product-main-slider',
				focusOnSelect: true,
				responsive: [
					{
						breakpoint: 1025,
						settings: {
							slidesToShow: 6,
						}
					}
				]
			});
	}


	// CLOSE PRODUCT DETAIL WATCHING NOW
	function closeProductDetailWatchingNow()
	{
		if ($(".js-close-product-detail-watching-now").length === 0)
			return false;

		$(".js-close-product-detail-watching-now").on("click", function()
		{
			$(this).parents(".product-detail__watching-now").addClass("_hide");
		});
	}


	// INIT STICK PRODUCT DETAIL INFO
	function initStickProductDetailInfo()
	{
		if ($(".js-sticky-product-detail-info").length === 0)
			return false;
		
		var is_active_sticky_product_detail_info = false;
		
		configureStickProductDetail();
		
		$(window).on("resize", function()
		{
			configureStickProductDetail();
		});
		
		function configureStickProductDetail()
		{
			var point_for_active = 1025;
			
			if ($(window).width() >= point_for_active && is_active_sticky_product_detail_info === false)
			{
				$(".js-sticky-product-detail-info").stick_in_parent({
					parent : ".product-detail",
					offset_top: 80
				});
				is_active_sticky_product_detail_info = true;
			}
			
			if ($(window).width() < point_for_active && is_active_sticky_product_detail_info === true)
			{
				$(".js-sticky-product-detail-info").trigger("sticky_kit:detach");
				is_active_sticky_product_detail_info = false;
			}
		}
	}


	// PURCHASE PRODUCT
	function purchaseProduct()
	{
		if ($(".js-purchase-product").length === 0)
			return false;
		
		$(".js-purchase-product .product-detail__purchase-add-btn").on("click", function(){
			$(this).parents(".js-purchase-product").addClass("is-filled");
		});

		$(".js-purchase-product .product-detail__purchase-plus-btn").on("click", function(){
			var cur_count_block = $(this).parents(".js-purchase-product").find(".product-detail__purchase-cur-count");
			var new_count = parseFloat(cur_count_block.text()) + 1;

			cur_count_block.text(new_count);
		});
	}




/* //////////////////////////////////////////// CART ///////////////////////////////////////////// */
	
	// SWITCH ORDERING TYPES
	function switchOrderingTypes()
	{
		if ($("#ordering-main").length === 0 || $("#ordering-fast").length === 0)
			return false;

		$(".js-show-main-ordering").on("click", function(){
			$("#ordering-main").addClass("is-active");
			$("#ordering-fast").removeClass("is-active");

			$(".ordering__type-btn.is-active").removeClass("is-active");
			$(this).addClass("is-active");
		});

		$(".js-show-fast-ordering").on("click", function(){
			$("#ordering-main").removeClass("is-active");
			$("#ordering-fast").addClass("is-active");

			$(".ordering__type-btn.is-active").removeClass("is-active");
			$(this).addClass("is-active");
		});
	}


	// CHOICE ORDERING DELIVERY
	function choiceOrderingDelivery()
	{
		$(".js-choice-ordering-delivery").on("change", function(){
			if ($(this).parents(".ordering__delivery-item").find("#ordering-select-shop").length === 0 && $("#ordering-select-shop").length !== 0)
			{
				$(".ordering__selected-shop").html('');
				$("#ordering-select-shop").removeClass("is-selected-shop");	
			}
		});
	}
	

	// SHOW ORDERING DELIVERY DESCRIPTION
	function showOrderingDeliveryDescription()
	{
		if ($(".js-toogle-ordering-delivery-description").length === 0)
			return false;

		$(".js-toogle-ordering-delivery-description").on("click", function()
		{
			var ordering_delivery_description = $(this).parents(".ordering__delivery-description");

			if (ordering_delivery_description.is(".is-show"))
			{
				ordering_delivery_description.find(".ordering__delivery-description-content").stop().slideUp(300, function(){
					ordering_delivery_description.removeClass("is-show");
				});
			}
			else
			{
				ordering_delivery_description.find(".ordering__delivery-description-content").stop().slideDown(300, function(){
					ordering_delivery_description.addClass("is-show");
				});	
			}
		});
	}


	// SELECT DELIVERY SHOP
	function selectDeliveryShop()
	{
		if ($("#ordering-select-shop").length === 0)
			return false;

		$(".js-show-ordering-shop-list").on("click", function(){
			$(".ordering__shop-list").addClass("is-show");
		});

		$(".js-select-ordering-shop").on("click", function(){
			var selected_shop_info = $(this).find(".ordering__shop-item-content").clone();

			$(".ordering__selected-shop").html(selected_shop_info);
			$("#ordering-select-shop").addClass("is-selected-shop");
		});

		$(document).on("click", function(event)
		{
			if ($(event.target).closest(".js-show-ordering-shop-list").length)
				return;
			
			$(".ordering__shop-list.is-show").removeClass("is-show");
		});
	}



/* //////////////////////////////////////////// VACANCY ///////////////////////////////////////////// */
	
	// SHOW VACANCY
	function showVacancy()
	{
		$(".vacancy-item.is-show .vacancy-item__content").css("display", "block");

		$(".js-show-vacancy").on("click", function()
		{
			var vacancy_list = $(this).parents(".vacancy__list"); 
			var vacancy = $(this).parents(".vacancy-item");
			var vacancy_cur_active = vacancy_list.find(".vacancy-item.is-show");

			if (vacancy.is(".is-show"))
			{
				vacancy.find(".vacancy-item__content").stop().slideUp(300);
				vacancy.removeClass("is-show");	
			}
			else
			{
				if (vacancy_cur_active.length){
					vacancy_cur_active.removeClass("is-show");
					vacancy_cur_active.find(".vacancy-item__content").stop().slideUp(300);
				}

				vacancy.find(".vacancy-item__content").stop().slideDown(300);
				vacancy.addClass("is-show");
			}
		});
	}