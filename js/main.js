var DEMO = [];
DEMO.particularQuantity = 150;
DEMO.mouseOverSize = 100;
DEMO.dataActiveSize = 20;
DEMO.dataCircleGathered = true;

var COLORS = 
  [ {"background":"#F2F3F4","particular":"#E5E7E9","theme":"#777777","translucent":"rgba(119,119,119,0.85)"},
    {"background":"#FEF5E7","particular":"#FAD7A0","theme":"#F39C12","translucent":"rgba(243,156,18,0.85)"},
    {"background":"#FDEDEC","particular":"#F5B7B1","theme":"#E74C3C","translucent":"rgba(231,76,60,0.85)"},
    {"background":"#F4ECF7","particular":"#D2B4DE","theme":"#8E44AD","translucent":"rgba(142,68,173,0.85)"},
    {"background":"#EBF5FB","particular":"#AED6F1","theme":"#3498DB","translucent":"rgba(52,152,219,0.85)"},
    {"background":"#E8F8F5","particular":"#A3E4D7","theme":"#1ABC9C","translucent":"rgba(26,188,156,0.85)"}
  ];

$(document).ready(function(){
  DEMO.clickToChangeBackground();
  DEMO.init();
  DEMO.closeActiveWindow();
  DEMO.playVideo();
  DEMO.closeVideo();
  DEMO.centerVideo();
});

$(window).resize(function(){
  DEMO.centerVideo();
});

DEMO.init = function(){
  $.getJSON("data/data.json", function(data) {
    var mainContainer = d3.selectAll(".main-container")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");
    DEMO.createParticular(mainContainer);
    DEMO.createDataCircle(data, mainContainer);
  });
  setTimeout(function(){
    setInterval(function(){
      DEMO.dataCircleGathered = !DEMO.dataCircleGathered;
      DEMO.dataGroupPosition = Math.floor(Math.random() * 5);
    }, 4000);
  }, 2000);
};

DEMO.centerVideo = function(){
  var windowW = window.innerWidth;
  var windowH = window.innerHeight;
  var videoH = 720;
  if (windowW < 1280/0.9){
    videoH = windowW*0.9/1280*720;
  }
  $("#video-active").css("margin-top", (windowH-videoH)/2);
};

DEMO.createParticular = function(container) {
  for(i = 0; i < DEMO.particularQuantity; i++){
    (function (i){
      container.append("circle")
        .attr("class", "circle-bg")
        .attr("id", "circle-bg-" + i)
        .attr("cx", Math.random()*90 + 5 + "%")
        .attr("cy", Math.random()*90 + 5 + "%")
        .attr("r", Math.random()*5)
        .style("fill", COLORS[0].particular);
    })(i);
  }
  DEMO.initiateParticularAnimation();
};

DEMO.createDataCircle = function(data, container) {
  $.each(data, function(index, value){
    var themeColor = COLORS[parseInt(value.category.split("_")[1])].theme;
    container.append("circle")
      .attr("class", "circle-data" + " circle-" + value.category)
      .attr("id", "circle-data-" + index)
      .attr("cx", Math.random()*90 + 5 + "%")
      .attr("cy", Math.random()*90 + 5 + "%")
      .attr("r", Math.random()*10 + 5)
      .attr("data-category", value.category)
      .attr("data-title", value.title)
      .attr("data-video", value.video)
      .attr("cursor", "pointer")
      .style("background-color", COLORS[0].background)
      .style("fill", themeColor)
      .on("click", function(){
        DEMO.dataClick("#" + this.id);
      })
      .on("mouseover", function () {
        DEMO.dataMouseOver("#" + this.id, container);
      })
      .on("mouseout", function () {
        DEMO.dataMouseOut("#" + this.id, container);
      })
      .each(function(){
        DEMO.initiateDataAnimation("#" + this.id);
      });
  });
};

DEMO.initiateParticularAnimation = function() {
  for(i = 0; i < DEMO.particularQuantity; i++){
    (function (i){
      DEMO.randomMoveAnimation("#circle-bg-" + i, 6000, 0, Math.random()*5);
    })(i);
  }
};

DEMO.initiateDataAnimation = function(id) {
  setInterval(function(){
    DEMO.dataMoveAnimation(id, 4000, Math.random()*10 + 5);
  }, 4000);
};

DEMO.dataMouseOver = function(id, container){
  d3.select(id).transition().duration(400)
    .attr("r", DEMO.mouseOverSize)
    .each("end", function (){
      container.append("text")
        .attr("opacity", 0)
        .attr("x", this.getAttribute("cx"))
        .attr("y", this.getAttribute("cy"))
        .attr("id", "current-title")
        .attr("text-anchor", "middle")
        .attr("font-size", 40)
        .attr("font-family", "Shadows Into Light")
        .attr("cursor", "pointer")
        .style("fill", "#FFFFFF")
        .text(this.getAttribute("data-title"))
        .on("click", function(){
          DEMO.dataClick(id);
        })
        .transition().duration(400)
        .attr("opacity", 1);
    });
};

DEMO.dataMouseOut = function(id, container){
  d3.select(id).transition().duration(400)
    .attr("r", Math.random()*10 + 5);
  container.selectAll("text").transition().duration(1000).style("opacity", 0).remove();
};

DEMO.dataClick = function(id){
  d3.select(id).transition().duration(400)
    .attr("r", DEMO.dataActiveSize)
    .attr("cx", "50%")
    .attr("cy", "50%");
  var category = parseInt($(id).data("category").split("_")[1]);
  $(".bottom-bar").fadeOut();
  $(".active-content").css("background-color", COLORS[category].theme);
  $(".active-content").fadeIn();
};

DEMO.randomMoveAnimation = function(id, duration, delay, size) {
  d3.select(id).transition().duration(duration)
    .attr("cx", Math.random()*90 + 5 + "%")
    .attr("cy", Math.random()*90 + 5 + "%")
    .attr("r", size)
    .each("end", function () {
    setTimeout(function(){DEMO.randomMoveAnimation(id, duration, delay, size);}, delay);
  });
};

DEMO.dataMoveAnimation = function(id, duration, size) {
  if(DEMO.dataCircleGathered){
    d3.select(id).transition().duration(duration)
      .attr("cx", Math.random()*90 + 5 + "%")
      .attr("cy", Math.random()*90 + 5 + "%")
      .attr("r", size);
  }
  else{
    category = $(id).attr("class").split("_")[1];
    switch(category){
      case "1":
        d3.select(id).transition().duration(duration)
          .attr("cx", Math.random()*10 + 10 + "%")
          .attr("cy", Math.random()*10 + 15 + "%")
          .attr("r", size);
        break;
      case "2":
        d3.select(id).transition().duration(duration)
          .attr("cx", Math.random()*10 + 10 + "%")
          .attr("cy", Math.random()*10 + 65 + "%")
          .attr("r", size);
        break;
      case "3":
        d3.select(id).transition().duration(duration)
          .attr("cx", Math.random()*10 + 45 + "%")
          .attr("cy", Math.random()*10 + 40 + "%")
          .attr("r", size);
        break;
      case "4":
        d3.select(id).transition().duration(duration)
          .attr("cx", Math.random()*10 + 80 + "%")
          .attr("cy", Math.random()*10 + 15 + "%")
          .attr("r", size);
        break;
      default:
        d3.select(id).transition().duration(duration)
          .attr("cx", Math.random()*10 + 80 + "%")
          .attr("cy", Math.random()*10 + 65 + "%")
          .attr("r", size);
        break;
    }

    
  }
};

DEMO.clickToChangeBackground = function(){
  $(".bottom-bar-item").click(function(){
    DEMO.changeMainBackground(parseInt($(this).attr("id").split("-")[1]));
    $(".category-active").removeClass("category-active");
    $(this).addClass("category-active");
  });
};

DEMO.changeMainBackground = function(category){
  var backgroundColor = COLORS[category].background;
  var particularColor = COLORS[category].particular;
  d3.select(".main-container")
    .transition().duration(400)
    .style("background-color", backgroundColor);
  d3.selectAll(".circle-bg")
    .transition().duration(400)
    .style("fill", particularColor);
  setTimeout(function(){DEMO.initiateParticularAnimation();}, 400);
  DEMO.changeDataVisibility(category);
};

DEMO.changeDataVisibility = function(category){
  if (category === 0){
    d3.selectAll(".circle-data")
    .style("visibility", "visible");
  }else{
    d3.selectAll(".circle-data")
      .style("visibility", "hidden");
    d3.selectAll(".circle-category_" + category)
      .style("visibility", "visible");
  }
};

DEMO.closeActiveWindow = function(){
  $(".active-close-button").click(function(){
    $(".bottom-bar").fadeIn();
    $(".active-content").fadeOut();
  });
};

DEMO.playVideo = function(){
  $(".video-button").click(function(){
    //document.getElementById("background-audio").pause(); 
    $(".active-content").fadeOut();
    $(".video-container").fadeIn();
  });
};

DEMO.closeVideo = function(){
  $(".video-close-button").click(function(){ 
    $(".video-container").fadeOut();
    $(".bottom-bar").fadeIn();
    document.getElementById("video-active").pause(); 
    document.getElementById("video-active").currentTime = 0;
    //document.getElementById("background-audio").play();
  });
};