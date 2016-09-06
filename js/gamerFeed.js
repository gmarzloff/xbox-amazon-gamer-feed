$(document).ready(function(){

	// Collect data from xbox api
	var xbox = new XboxProxyAPI();
	var amazon = new AmazonUtils();
	var gamerTagInput = prompt('Please type desired Xbox GamerTag','ricketycrikett');
	// var gamerTagInput = 'ricketycrikett';

	var user = {
		XUID: "",
		gamerProfile : {},
		recentGames : []
	};

	searchForGames();

	$('#gamerTag').html(gamerTagInput);

	$('#searchUserButton').click(function(){
		gamerTagInput = prompt('Please type desired Xbox GamerTag',gamerTagInput);
		searchForGames();
		$('#gamerTag').html(gamerTagInput);
	});

	function searchForGames(){
		if (gamerTagInput != null){
			// Exchange gamerTag for XUID
			xbox.fetch('xuid',gamerTagInput, function(data){

				// check if error object was returned
				if(data.res.error_message == null){
					user.XUID = data.res;

					//For my next trick, get gamerProfile.
					// Method invoked within prior fetch callback to ensure XUID exists
					xbox.fetch('profile', user.XUID, function(data){

						user.gamerProfile = data.res;
						// get customized recent games list
						xbox.filterRecentGames(user.XUID, function(filterdata){

							user.recentGames = filterdata;

							// search Amazon stuff & get links
							amazon.getItemInfo(filterdata, function(gamesWithAmazonDetails){
								console.dir(gamesWithAmazonDetails);
								$('#gamesContainer').html(generateGamesHTML(gamesWithAmazonDetails));
							});

						});
					});

				}else{
					console.log(data.res.error_message);
					$('#gamesContainer').html('<div class="error">' + data.res.error_message + '<br />Try a different Gamertag. </div>');
				}

			});

		}else{
			alert('No GamerTag entered.');
		}
	}

	function generateGamesHTML(games){
		var myHTML = '';
		for(i=0;i<games.length;i++){
			var game = games[i];
			var prettyDate = moment(game.lastPlayed).format('MMMM Do YYYY, h:mm:ss a'); // using moment.js library

			myHTML += '<div class="clearfix"><div class="thumbContainer"><img src="' + unescape(game.contentImageUri) + '" /></div>' +
					game.contentTitle + '<br />Last played: ' + prettyDate + 
					'<br /><div class="amazon">Amazon Price: <a class="amazonLink" target="amazon" href="' + game.DetailPageURL + "&AssociateTag=" + amazon.myAssociateID + '">' + game.LowestPrice + "</a>\n" +
			 				  game.Description + "</div>\n</div></div>";
		}
		return myHTML;
	}


	function advanceProgressBar(){
		// add a tick each time api calls complete
	}

});