
var headingToggle = true;
var instructionsToggle = true;
var scoreboardToggle = true;

$(document).ready(function(){
  // Side screen toggling
  $('#half-circle-instructions').click(function(){
    if(instructionsToggle) {
      $("#instructions").animate({left:'-100%'}, 600);
      $("#scoreboard").animate({right:'-100%'}, 600);
      $("#half-circle-instructions").animate({marginLeft:'0%'},300);
      $("#side-arrow-instructions").removeClass("fa-rotate-90");
      $("#side-arrow-instructions").addClass("fa-rotate-270");
      instructionsToggle = false;
    } else {
      $("#instructions").animate({left:'0%'}, 400);
      $("#scoreboard").animate({right:'0%'}, 400);
      $("#half-circle-instructions").animate({marginLeft:'15%'},500);
      $("#side-arrow-instructions").removeClass("fa-rotate-270");
      $("#side-arrow-instructions").addClass("fa-rotate-90");
      instructionsToggle = true;
    }
  });
});
