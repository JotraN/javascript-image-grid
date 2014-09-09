$(document).ready(function(){
	var ctx = $("#grid")[0].getContext("2d");
	// Set canvas to window size.
	$("#grid").attr("width", $(window).width());
	$("#grid").attr("height", $(window).height());

	var numRows = 2;
	// Fill items, length needs to be evenly divisible by numRows to ensure equal rows, 
	var items = [
		new Item("office.png", ctx),
		new Item("office.png", ctx),
		new Item("office.png", ctx),
		new Item("office.png", ctx),
		new Item("office.png", ctx),
		new Item("office.png", ctx),
		new Item("office.png", ctx),
		new Item("office.png", ctx),
		new Item("office.png", ctx),
		new Item("office.png", ctx),
	];
	// one more item needs to be added to stretch canvas.
	items.push(new Item("office.png", ctx)),

	setup(items, ctx, numRows);

	$("#list").on('click', 'div', function(){
		alert($(this).attr("src"));
	});

	// Adjust image sizes on resize.
	$(window).resize(function(){
		$("#grid").attr("width", $(window).width());
		$("#grid").attr("height", $(window).height());
		ctx.clearRect(0, 0, $(window).width(), $(window).height());
		setup(items, ctx);
	});
});

function setup(items, ctx, numRows){
	// Calculate image aspect ratio to use.
	if($(window).width() > $(window).height())
		var ratio = ($(window).width()/$(window).height());
	else
		var ratio = ($(window).height()/$(window).width());
	var thumbHeight = $(window).height()/numRows;
	var thumbWidth = $(window).width()/((items.length-1)/numRows);
	var x = 0;
	var y = 0;
	var rowEnd = Math.floor((items.length)/numRows);
	$.each(items, function(i, item){
		var image = new Image();
		image.src = item.image;
		// Create div for image and add it's src to use for when clicked.
		$("#list").append("<div class='frame' src='" + item.image.src + "'><div>");

		// Save the item position to use when image is loaded.
		item.x = x;
		item.y = y;
		image.onload = function(){
			var cropWidth = this.width;
			var cropHeight = this.height;
			// If landscape mode, adjust height, assumes image height and width are the same.
			if(thumbWidth > thumbHeight){
				ratio = thumbWidth/thumbHeight;
				cropHeight = cropHeight/ratio;
			} else{
				// adjust width if portrait
				ratio = thumbHeight/thumbWidth;
				cropWidth = cropWidth/ratio;
			}
			// ctx.drawImage(this, 0, 0, cropWidth, cropHeight, item.x, item.y, thumbWidth, thumbHeight);
			ctx.drawImage(this, 0, 0, cropWidth, cropHeight, item.x, item.y, thumbWidth, thumbHeight);
		}
		// Draw borders
		ctx.fillRect(x, 0, 1, $(window).height());
		ctx.fillRect(0, y, $(window).width(), 1);

		x += thumbWidth;
		if((i+1) % rowEnd == 0){ 
			x = 0; 
			y += thumbHeight;
		}
	});
	// Prevent from overflowing to next line subtradting 0.01 for the border.
	$(".frame").width(thumbWidth);
	$(".frame").height(thumbHeight);
}

function Item(image, ctx){
	this.image = image;
}

