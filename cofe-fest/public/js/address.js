var placemarkList = [];

var pinImg = 'images/pin.png',
		pinImgSelected = 'images/pin-selected.png';

function initAddress(addressMapData)
{
	ymaps.ready(function () {
		var addressList = addressMapData;

		var addressMap = new ymaps.Map('address-map', {
			center: [55.765555, 37.575555],
			zoom: 10,
			controls: ['zoomControl']
		});

		addressMap.behaviors.disable('scrollZoom'); 

		var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="map-point-content">$[properties.iconContent]</div>'
		),

		MyIconContentLayoutSelected = ymaps.templateLayoutFactory.createClass(
			'<div class="map-point-content _selected">$[properties.iconContent]</div>'
		);

		addressList.forEach(function(item, index){
			var placemark;

			if (item.isActive)
			{
				placemark = new ymaps.Placemark([item.x, item.y], {
					iconContent: index + 1,
					id: item.id
				}, {
					iconLayout: 'default#imageWithContent',
					iconImageHref: pinImgSelected,
					iconImageSize: [45, 45],
					iconImageOffset: [-22, -40],
					iconContentLayout: MyIconContentLayoutSelected
				});
			}
			else
			{
				placemark = new ymaps.Placemark([item.x, item.y], {
					iconContent: index + 1,
					id: item.id
				}, {
					iconLayout: 'default#imageWithContent',
					iconImageHref: pinImg,
					iconImageSize: [29, 34],
					iconImageOffset: [-15, -34],
					iconContentLayout: MyIconContentLayout
				});
			}

			placemarkList.push(placemark);

			placemark.events.add('click', function (e){
				placemarkList.forEach(function(item, i, arr) {
					item.options
						.set('iconImageHref', pinImg)
						.set('iconImageSize', [29, 34])
						.set('iconImageOffset', [-15, -34])
						.set('iconContentLayout', MyIconContentLayout);
				});

				e.get('target').options
					.set('iconImageHref', pinImgSelected)
					.set('iconImageSize', [45, 45])
					.set('iconImageOffset', [-22, -40])
					.set('iconContentLayout', MyIconContentLayoutSelected);

				showAddressItem(e.get('target').properties.get('id'));
			});

			addressMap.geoObjects.add(placemark);

			// SHOW ADDRESS INFO
			$(".js-show-address-info").on("click", function()
			{
				var new_address_number = $(this).attr("data-address");

				$(this).parents(".address-text").removeClass("is-show");
				showAddressItem(new_address_number);

				placemarkList.forEach(function(placemarkItem, i, arr) {
					if (placemarkItem.properties.get('id') === new_address_number)
					{
						placemarkItem.options
							.set('iconImageHref', pinImgSelected)
							.set('iconImageSize', [45, 45])
							.set('iconImageOffset', [-22, -40])
							.set('iconContentLayout', MyIconContentLayoutSelected);
					}
					else
					{
						placemarkItem.options
							.set('iconImageHref', pinImg)
							.set('iconImageSize', [29, 34])
							.set('iconImageOffset', [-15, -34])
							.set('iconContentLayout', MyIconContentLayout);
					}
				});
			});
		});
	});
}


// SHOW ADDRESS ITEM

var isAnimateAddress = false;

function showAddressItem(item)
{
	if (isAnimateAddress)
		return false;

	isAnimate = true;

	$(".address-item.is-show").hide().removeClass("is-show");

	var new_address_item = $('.address-item[data-address="'+item+'"]');

	new_address_item.fadeIn(500, function()
	{
		$(this).addClass("is-show");
		
		isAnimate = false;
	});

	setTimeout(function(){
		if (new_address_item.find(".js-short-article-slider").length)
			$(".js-short-article-slider").slick('setPosition').resize();
	}, 100);
	
}


$(document).ready(function()
{
	// SHOW ADDRESS TEXT LIST
	$(".js-show-address-text-list").on("click", function()
	{
		$(this).parents(".address-text").toggleClass("is-show");
	});

	$(document).on("click", function(event)
	{
		if ($(event.target).closest(".address-text").length)
			return;
		
		$(".address-text").removeClass("is-show");
	});
});

