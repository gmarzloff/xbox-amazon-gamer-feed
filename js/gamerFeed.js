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
							amazon.getLinks(filterdata, function(gamesWithAmazonLinks){

								$('#gamesContainer').html(generateGamesHTML(gamesWithAmazonLinks));
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

	function advanceProgressBar(){
		// add a tick each time api calls complete
	}

	function generateGamesHTML(games){
		var myHTML = '';
		for(i=0;i<games.length;i++){
			var prettyDate = moment(games[i].lastPlayed).format('MMMM Do YYYY, h:mm:ss a'); // uses moment.js library

			myHTML += '<div class="clearfix"><div class="thumbContainer"><img src="' + unescape(games[i].contentImageUri) + '" /></div>' +
					games[i].contentTitle + '<br />Last played: ' + prettyDate + 
					'<br /><a href="' + games[i].amazonLink + '">Amazon Link</a></div>';
		}
		return myHTML;
	}
});