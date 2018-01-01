$(document).ready(function(){
	var totalbookmarks = [],
		$bookmarks = $("#boomarks");

	var showLi = function(mark){
		var htm = `<ul><li>`;

		var children = mark.children;
		var file = "", childhtm = "";
		if(children){
			file = `<div class="name"><span>+</span>file:`+ mark.title +`</div>`;
		}else{
			file = `<div class="list"><span class="delete">x</span><a id="`+mark.id+`"  href="`+mark.url+`">`+mark.title+`</a></div>`
		}

		if(children){
			childhtm += `<ul>`;
			children.forEach(function(child){
				childhtm += `<li><div class="list"><span class="delete">x</span><a id="`+mark.id+`"  href="`+child.url+`">`+child.title+`</a></div></li>`
			})
			childhtm += `</ul>`;
		}

		htm += (file + childhtm + `</li></ul>`);

		return htm;
	}

	var showMarks = function(bookmarks){
		var html = "";
		if(!bookmarks[0])
			return;
		var children = bookmarks[0].children;

		if(!children[0])
			return;

		children[0].children.forEach(function(mark){
			html += showLi(mark);
		});
		$bookmarks.html(html);
	}

	var init = function(){
		chrome.bookmarks.getTree(function(bookmarks) {
	      	showMarks(bookmarks);
	      	totalbookmarks = bookmarks;
	    });


	    $("#boomarks").on('click','.name', function(){
	    	var $ul = $(this).siblings('ul');
	    	if($ul.is(":hidden")){
	    		$ul.show();
	    	}else{
	    		$ul.hide();
	    	}
	    });

	    $("#boomarks").on('click','a', function(){
	    	var url = $(this).attr('href');
	    	chrome.tabs.create({url: url});
	    });

	    $("#boomarks").on('mouseover','.list', function(){
	    	var $span = $(this).children('.delete');
	    	$span.show();
	    });

	    $("#boomarks").on('mouseout','.list', function(){
	    	var $span = $(this).children('.delete');
	    	$span.hide();
	    });

	    $("#boomarks").on('click','.delete', function(){
	    	var id = $(this).siblings('a').attr('id');
	    	chrome.bookmarks.remove(String(id));
	    	showMarks(totalbookmarks);
	    });

	    $(".search").keydown(function(e){
	    	if(e.keyCode == 13){
	    		var key = $(this).val();
	    		if(key){
		    		chrome.bookmarks.search(key, function(bookmarks){
		    			var html = "";
						bookmarks.forEach(function(mark){
							html += showLi(mark);
						});
						$bookmarks.html(html);
		    		})
		    	}else{
		    		showMarks(totalbookmarks);
		    	}
	    	}
	    	return;
	    });
	}

	init();
})