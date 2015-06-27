(function(){
	
	"use strict";	

	var $menu = $("#menu"),
		$page = $("#page");	
	
	var headerColor = ["#3369E8", "#A52A2A", "#1290FF", "#FFA6C9", "#FF69B4", "#87CEEB", "#FF6961", "#DE3163"];
	//	var menuColor = ["#036", "#800020"];
	
	$("#page > .header").css("background", headerColor[Math.floor(Math.random() * headerColor.length)] );
//	$(".mm-menu").css("background", menuColor[Math.floor(Math.random() * menuColor.length));
	
	var praiseClosure = (function()	{
		
		var _no = 738,
			_title = "감사해요깨닫지못했었는데",
			_img = "http://vespasiani.cdn3.cafe24.com/dure" + _no + ".jpg?v=20141010",
			_lastNo = 853,
			_cloneList = null,
			_initList = null;
		
		var setPraise = (function(no, title)	{
			$("#content > img")
				.attr("src", no? "http://vespasiani.cdn3.cafe24.com/dure" + _no + ".jpg?v=20141010" : _img)
				.attr("data-no", no? no : _no)
				.attr("data-title", title? title : _title);
			
			$("#title").text(_no + "장 " + _title);
		});
		
		var getPraise = function()	{
			return {
				no : _no,
				title : _title,
				img : _img
			}
		}
		
		var changePraise = function(no, title)	{

			if( arguments.length === 2)	{
				_no = no;
				_title = title;
				_img = "http://vespasiani.cdn3.cafe24.com/dure" + _no + ".jpg?v=20141010";
			}
			else	{
				_no = arguments[0].no;
				_title = arguments[0].title;
				_img = "http://vespasiani.cdn3.cafe24.com/dure" + _no + ".jpg?v=20141010";
			}
			
			setPraise();
		};
		
		var getLastNo = function()	{
			return _lastNo;
		};
		
		return {
			setPraise : setPraise,
			getPraise : getPraise,
			changePraise : changePraise,
			getLastNo : getLastNo
		}
	})();
	
	var initSidebar = function()	{
		$menu.css("height", $menu.height() +"px").find("ul > li").addClass("mm-hidden").scrollTop(0);
	};
	
	var getNextPrevPraise = function(pressedBtn)	{
		
		var cPraise = praiseClosure.getPraise(),	// 현재 찬양정보
			cNo = cPraise.no,						// 현재 찬양번호
			isPrev = (pressedBtn === "prev_btn")? true : false,	// 이전장 버튼여부
			lastNo = praiseClosure.getLastNo();						// 마지막장 번호
		
		for(var i=praise.length -1; i>=0; i--)	{
			
			if( praise[i].no === cNo )	{

				cNo = isPrev? --cNo : ++cNo;					
				
				if( cNo === lastNo +1 && !isPrev )	{
					cNo = 1;
				}
				else if( cNo === 0 && isPrev )	{
					cNo = lastNo;
				}
				
				cPraise = praise[cNo -1];
				
				break;
			}
		}
		
		return cPraise; 
	};
	
	var toggleZoomImage = function()	{
		
		var $this = null;
		$page.find("img").each(function(){

			$this = $(this);
			$this.hasClass("on")? $this.removeClass("on").addClass("off") : $this.removeClass("off").addClass("on");
			$this.attr("id") === "zoomInImg" && $this.css("width", parseInt($("#normalImg").css("width")) * 1.5 + "px");
        });
		
		var $btn_area = $page.find("#btn_area");
		if( $btn_area.hasClass("on") )	{
			$btn_area.removeClass("on").addClass("off");
			$page.find("div.header").css("width", "150%").end()
				 .find("#menuBtn").hide().end()
				 .find("#btn_area").hide();      
		}
		else	{
			$btn_area.removeClass("off").addClass("on");
			$page.find("div.header").css("width", "100%").end()
				 .find("#menuBtn").show().end()
				 .find("#btn_area").show();
		}
	};
	
	var changeNormalImg = function()	{
		var $content = $page.find("#content");														// 기본 이미지로 변경
		if( $content.find("#zoomInImg").hasClass("on") )	{
			$content.find("#zoomInImg").removeClass("on").addClass("off").end()
					.find("#normalImg").addClass("on").removeClass("off");
		}
	};			
	var closeSidebar = function()	{
		$menu.trigger("close.mm");
		return false;
	};
	var openSidebar = function()	{
		!$menu.hasClass("mm-opened") && $menu.trigger("open.mm");
		return false;
	};
	
	var showPrevNextBtn = function()	{
		$page.find("#btn_area").show();
	};
	var hidePrevNextBtn = function()	{
		$page.find("#btn_area").hide();
	};
	
	var clearSeachText = function()	{
		$menu.find("div.mm-search > input").val("");
	};
	var showList = function()	{
		$menu.find("ul > li").removeClass("mm-hidden");
	};
		

	$(document.body).ready(function() {
		
		var template = Handlebars.compile( $("#template").text() ),
			list = template({"praise" : praise});
		
		$("#menu").mmenu({

			dragOpen: {
				open: true,
				pageNode: $("#normalImg")
			},	
			header: {
				add: true,
				title: "두레찬양 리뉴얼",
				update: true
			},
			footer: {
				add: true,
				title: "업데이트일 2015.05.06"
	      	},
	      	searchfield: {
	      		add: true,
	      		search: true,
	      		placeholder: "제목이나 번호를 띄어쓰기 없이 입력하세요.",
	      		noResults: "검색한 찬양이 없습니다."
	      	}
		
//		}).on( "closing.mm", function() {
//			return false;
        }).on( "closed.mm", function() {
        	initSidebar();
        	clearSeachText();
        	showPrevNextBtn();
        	return false;
//        }).on( "opened.mm", function() {
//        	return false;
        }).on( "opening.mm", function() {
        	hidePrevNextBtn();
        	return false;
        });
		
		$menu.on("click", "div.mm-search > input", function()	{
			clearSeachText();
			showList();
			return false;
		});
		
		$menu.on("click", "ul > li", function()	{

			var $this = $(this);

			praiseClosure.changePraise( $this.data("no"), $this.data("title") );	// 선택한 찬양으로 변경
			changeNormalImg();														// 기본 이미지로 변경
			closeSidebar();			// 사이드바 닫기
			
			return false;
		});
		
		$page.on("click", "#content > img", function()	{
			toggleZoomImage();
			return false;
		});		
		
		$page.on("click", "#btn_area > a", function()	{
			praiseClosure.changePraise( getNextPrevPraise($(this).attr("id")) );
			return false;
		});
		
		$page.on("click", "#menuBtn", openSidebar );
		
	  	$menu.find("ul").html(list);
		praiseClosure.setPraise(738, "감사해요깨닫지못했었는데");

		FastClick.attach(document.body);
	});	
	
})();	