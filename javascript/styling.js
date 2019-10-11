
// General Game Variables
var instructionsToggle = true;

$(document).ready(function(){
  // Side screen toggling
  $('#half-circle-instructions').click(function(){
    if(instructionsToggle) {
      $("#instructions").animate({left:'-100%'}, 600);
      $("#scoreboard").animate({right:'-100%'}, 600);
      $("#highdiv").animate({right:'-100%'}, 600);
      $("#half-circle-instructions").animate({marginLeft:'0%'},300);
      $("#side-arrow-instructions").removeClass("fa-rotate-90");
      $("#side-arrow-instructions").addClass("fa-rotate-270");
      var width = Math.round(window.screen.width * 0.70);
      var height = Math.round(window.screen.height * 0.70);
      $("#game-board").animate({right:'2%', width:width, height:height, marginTop:'-2vh'}, 600);
      $("#lives, #pause, #score").animate({left:'1%'}, 600);
      instructionsToggle = false;
    } else {
      $("#instructions").animate({left:'0%'}, 400);
      $("#scoreboard").animate({right:'0%'}, 400);
      $("#highdiv").animate({right:'0%'}, 400);
      $("#half-circle-instructions").animate({marginLeft:'15%'},500);
      $("#side-arrow-instructions").removeClass("fa-rotate-270");
      $("#side-arrow-instructions").addClass("fa-rotate-90");
      $("#game-board").animate({right:'15%', width:'720', height:'480', marginTop:'0vh'}, 400);
      $("#lives, #pause, #score").animate({left:'15%'}, 400);
      instructionsToggle = true;
    }
  });

});


/*

Plan Move canvas over; Display lives and score in div that resizes to new window

*/
