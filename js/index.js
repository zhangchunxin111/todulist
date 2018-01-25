var swiper = new Swiper('.swiper-container', {
			spaceBetween: 20,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});
		$(".content div").click(function() {
			$(this).addClass("active").siblings().removeClass("active")
		})
		var flag = "plan";
		$(".content_left").click(function() {
			flag = "plan";
			render();
		})
		$(".content_right").click(function() {
			flag = "done";
			render();
		})
		$(".add").click(function() {
			$(".main")
				.css("filter", "blur(5px)")
				.next()
				.show()
		})
		$(".bth").click(function() {
			$(this)
				.parent()
				.parent()
				.hide()
				.prev()
				.css("filter", "none")
		})
		$(".esc").click(function() {
			$(this)
				.parent()
				.parent()
				.hide()
				.prev()
				.css("filter", "none")
		})

		$(".bth").click(function() {
			if($("textarea").val() == "") {
				$(".tip").show().addClass("tipShow");
				$(".tip").html("请输入内容");
				return;
			}
			let contentVal = $("textarea").val();
			$("textarea").val("");
			let date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let days = date.getDate();
			let hours = date.getHours();
			let minutes = date.getMinutes();
			let time = `${year}-${month}-${days} ${hours}:${minutes}`;
			let data = getData();
			data.push({
				val: contentVal,
				time: time,
				isDone: false,
				isStart: false
			});
			saveData(data);
			render();
		})
		//取数据
		function render() {
			let data = getData();
			var str = "";
			data.forEach(function(ele, index) {
				if(ele.isDone == false && flag == "plan") {
					str += `<li id="${index}"><p class="content-more">${ele.val}</p><time>${ele.time}</time>
                      <i>*</i><div class="btn finish">完成</div></li>
`;
				}
				if(ele.isDone == true && flag == "done") {
					str += `<li id="${index}"><p class="content-more">${ele.val}</p><time>${ele.time}</time>
                      <i>*</i><div class="btn del">删除</div></li>
`;
				}
			})
			$(".content-text ul").html(str);
			addEvent()
		}
		render();
		$(".tip").on("animationend", function() {
			$(".tip").hide().removeClass("tipShow");
		})

		function setZero(n) {
			return n < 10 ? "0" + n : n;
		}

		function getData() {
			return localStorage.todo ? JSON.parse(localStorage.todo) : [];
		}

		function saveData(data) {
			localStorage.todo = JSON.stringify(data);
		}

		function addEvent() {
			var max = $(".btn").width()
			$(".content-text ul li").each(function(index, ele) {
				var sx, mx, movex, pos = "start";
				var hammer = new Hammer(ele)
				hammer.on("panstart", function(e) {
					$(ele).css("transition", "none")
					sx = e.center.x
					$(ele).siblings().css("x", 0)
				})
				hammer.on("panmove", function(e) {
					var cx = e.center.x
					mx = cx - sx;
					if(pos === "start" && mx > 0) {
						return;
					}
					if(pos === "end" && mx < 0) {
						return;
					}

					if(pos === "start") {
						movex = mx
					} else if(pos === "end") {
						movex = mx - max
					}
					if(Math.abs(mx) > max) {
						return;
					}
					$(ele).css("x", movex)
				})
				hammer.on("panend", function() {
					$(ele).css("transition", "all 0.5s")
					if(Math.abs(movex) > max / 2) {
						$(ele).css("x", -max)
						pos = "end"
					} else {
						$(ele).css("x", 0)
						pos = "start"
					}
				})
			})
		}
		$(".content-text ul").on("click", ".finish", function() {
			var id = $(this).parent().attr("id");
			var data = getData();
			data[id].isDone = true;
			saveData(data);
			render();
		})
		$(".content-text ul").on("click", ".del", function() {
			var id = $(this).parent().attr("id");
			var data = getData();
			data.splice(id, 1);
			saveData(data);
			render();
		})
		//对文本的修改
		$(".content-text ul").on("click", ".content-more", function() {
			let id = $(this).parent().attr("id");
			let data = getData();
			let text = data[id].val;
			$(".mask2 .alertbox textarea").val(text);
			$(".main").css("filter", "blur(2px)").prev().css("display", "block").children().addClass("textscale");
			$(".submit2").click(function() {
				$(".main").css("filter", "none").prev().css("display", "none").children().removeClass("textscale");
				let xiugai = $(".mask2 .alertbox textarea");
				if(xiugai.val() == "") {
					$(".tip").show().addClass("tipShow");
					$(".tip").html("内容不能为空");
					return;
				}
				let contentValue = xiugai.val();
				let date = new Date();
				let year = date.getFullYear();
				let month = setZero(date.getMonth() + 1);
				let days = setZero(date.getDate());
				let hours = setZero(date.getHours());
				let minutes = setZero(date.getMinutes());
				let time = `${year}-${month}-${days} ${hours}:${minutes}`;
				let data = getData();
				data[id].val = contentValue;
				data[id].time = time;
				saveData(data);
				render();
			})
		})

		$(".close2").click(function() {
			$(".main").css("filter", "none").prev().css("display", "none").children().removeClass("textscale");
		});

		//处理内容向下刷新