function XboxProxyAPI (){
	this.baseURL = 'https://marzloffmedia.com:8000/profile';
	this.userProfile = {};

	this.fetch = function(method,param,callback){
	    var targetURL = this.baseURL + '/' + method + '/' + param + '?callback=?';
		
		$.getJSON(targetURL,function(result){
			callback(result);
		});
	};

	this.filterRecentGames = function(xuid, callback){ 
	
		this.fetch('activity', xuid, function(result){

			// result format is a JSON string which you need to parse
			var unfilteredActivities = JSON.parse(result.res).activityItems;
			var gamesOnlyActivities = [];
			var maxResultsToReturn = 5;

			$.each(unfilteredActivities,function(index,item){

				if(gamesOnlyActivities.length < maxResultsToReturn){

					if(item.contentType == "Game"){
						// Filter only unique Games
						var unique = true;
						for(i=0; i<gamesOnlyActivities.length; i++){
							if(gamesOnlyActivities[i].contentTitle === item.contentTitle){
								unique = false;
								break;
							}
						}
						if(unique){
							//save game's title (contentTitle), thumbnail (contentImageUri), last played (startTime)
							gamesOnlyActivities.push({
								contentTitle: item.contentTitle,
								contentImageUri : item.contentImageUri,
								lastPlayed : item.startTime
							});
						}
					}
				}
				
			});

			callback(gamesOnlyActivities); // send games array back to caller (gamerFeed.js)

		});
	}; 
}

