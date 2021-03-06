$(document).ready(function(){

	// Collect data from xbox api
	var xbox = new XboxProxyAPI();
	var amazon = new AmazonUtils();

	$('#gamerTag').html('username');
	var gamerTagInput = prompt('Please type desired Xbox GamerTag','ricketycrikett'); // Use any default gamertag here
	// var gamerTagInput = 'ricketycrikett'; // or programmatically define the gamerTagInput here

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
		
	});

	function searchForGames(){
		if (gamerTagInput != null){

			$('#gamerTag').html(gamerTagInput);
			$('#gamerTag').fadeIn("slow");
			$('#gamesContainer').slideUp("fast");	
			$('#loading').fadeIn("slow").removeClass("hidden");

			// Exchange gamerTag for XUID
			xbox.fetch('xuid',gamerTagInput, function(data){

				// check if error object was returned
				if(data.res.error_message == null){
					user.XUID = data.res;

					// Next, get gamerProfile.
					// Method invoked within prior fetch callback to ensure XUID exists
					xbox.fetch('profile', user.XUID, function(data){

						user.gamerProfile = data.res;
						// get customized recent games list
						xbox.filterRecentGames(user.XUID, function(filterdata){
							
							if(filterdata.length==0){

								$('#loading').fadeOut("slow");
								$('#gamesContainer').html('<div class="clearfix"><span class="gameTitle">Sorry, no recent games found.</span></div>');
								$('#gamesContainer').slideDown("fast");

							}else{
								user.recentGames = filterdata;

								// search Amazon stuff & get links
								amazon.getItemInfo(filterdata, function(gamesWithAmazonDetails){
									// console.dir(gamesWithAmazonDetails);
									$('#loading').fadeOut("slow");
									$('#gamesContainer').html(generateGamesHTML(gamesWithAmazonDetails));
									$('#gamesContainer').slideDown("fast");
								});
							}
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
					'<span class="gameTitle">' + game.contentTitle + '</span><br />Last played: ' + prettyDate + 
					'<br /><div class="amazon">Amazon Price: <a class="amazonLink" target="amazon" href="' + game.DetailPageURL + "&AssociateTag=" + amazon.myAssociateID + '">' + game.LowestPrice + "</a>\n" +
			 				  game.Description + "</div>\n</div></div>";
		}
		return myHTML;
	}

});