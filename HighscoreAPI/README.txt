=====================================================================
  _    _ _       _                                       _____ _____ 
 | |  | (_)     | |                                /\   |  __ \_   _|
 | |__| |_  __ _| |__  ___  ___ ___  _ __ ___     /  \  | |__) || |  
 |  __  | |/ _` | '_ \/ __|/ __/ _ \| '__/ _ \   / /\ \ |  ___/ | |  
 | |  | | | (_| | | | \__ \ (_| (_) | | |  __/  / ____ \| |    _| |_ 
 |_|  |_|_|\__, |_| |_|___/\___\___/|_|  \___| /_/    \_\_|   |_____|
            __/ |                                                    
           |___/                                                     
=====================================================================

========================================================
   _____ _                   _          _    _          
  / ____| |                 | |        | |  | |         
 | (___ | |_ ___ _ __  ___  | |_ ___   | |  | |___  ___ 
  \___ \| __/ _ \ '_ \/ __| | __/ _ \  | |  | / __|/ _ \
  ____) | ||  __/ |_) \__ \ | || (_) | | |__| \__ \  __/
 |_____/ \__\___| .__/|___/  \__\___/   \____/|___/\___|
                | |                                     
                |_|                                     
========================================================

Step 0: Make sure you have an HTML and Javascript game and that you are including JQuery.


Step 1: Make sure your main HTML file is named index.HTML.


Step 2: Insert the following HTML into index.HTML to display the highscore table:

		<div id="highdiv">
			<table id="hightable">
				<tr>
					<th>User</th>
					<th>Score</th>
				</tr>

			</table>
			<table id="myhightable">
				<tr>
					<th colspan="2">Your High Score</th>
				</tr>
				<tr id="myhighscore">
					<td colspan="2">You don't have one yet!</td>
				</tr>
			</table>
		</div>


Step 3: Copy highscore.css into your game folder and add the following line into Index.HTML:

		<link rel="stylesheet" href="highscore.css">

Step 3.1: If you want, you can edit highscore.css to change the style of the highscore table.


Step 4: Copy HighscoreAPI.js into your game folder and add the following line into Index.HTML after you include JQuery:

	<script type="text/javascript" src="HighscoreAPI.js"></script>


Step 5: Call the function update_scores() once when your game is loaded.


Step 6: Call the function highscore(score) when your game ends to submit a score. Make sure to pass a score as an argument for the function.


Step 7: Add an image file named thumbnail into your game folder. It can be a png, jpg, bmp, or gif. This image will show up on the webpage for your game.


Step 8: zip your game folder. The max size that can be uploaded is 10MB. For your game to work properly on the site all the previous steps must be completed, and the top level directory of your game must contain:

		1. A file called index.html
		2. (Optional) An image named thumbnail that is a png, jpg, bmp, gif. A default image will be displayed if this is not present.

	WARNING: If you are on windows, you must follow one of these two options If you do not follow these steps for zipping your game on windows, you will receive an error message:
		
		1. (Recommended) Use 7-zip to zip your folder
		2. Put your game folder inside of another folder, and zip the outer folder by right clicking on it and selecting compress

		 

		 
===================
     _    ____ ___ 
    / \  |  _ \_ _|
   / _ \ | |_) | | 
  / ___ \|  __/| | 
 /_/   \_\_|  |___|
===================

The API makes it very user friendly to get and save high scores. The competition ID and game ID are sent in the URL when a user clicks on a specific game. Then, these values are loaded immediately in the api javscript file, and saved. All the user has to do is call two functions (specified above) in the appropriate place.

All requests are GET.

=============================================================================================
GET HIGH SCORES:
	http://connect.mines.edu/gameapi/gethighscores/{competiton_id}/{game_id}

	Return:
		1)	Array of the player's current score and top 10 high score objects with names and scores, with the name value associated with 'name' and the score value associated with 'score'.

			If there are less than 10 high scores, the array will only contain however many high scores were found.

		2)	If there are NO highscores and NO player highscore, the return will be an empty array

		Example:
			highscores[0] = ['name'=>'First Last', 'score'=>100]
			highscores[1] = ['name'=>'First Last 2', 'score'=>50]

=============================================================================================

=============================================================================================
SUBMIT A SCORE:
	http://connect.mines.edu/gameapi/submitscore/{competiton_id}/{game_id}/{score}

	Return:
		1)	Score saved successfully => "success"
		
		2)	Competition is in the past, future, or inactive => "competition-inactive

=============================================================================================

