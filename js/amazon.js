function AmazonUtils (){
	this.myAssociateID = ''; // ENTER YOUR ASSOCIATE ID HERE

	this.getItemInfo = function(data, callback){

		var remaining_callbacks = data.length;

		$.each(data, function(index, game){
			// item.amazonLink = "http://www.amazon.com"; // placeholder

			var amazonFeedURL = generateAmazonFeedURL(game.contentTitle);
			console.log(amazonFeedURL);
			$.getJSON(amazonFeedURL,function(amazonData){

				console.dir(amazonData);

				if(amazonData.hasOwnProperty('error')){

					// Error instead of results. As an alternative, we can provide an I'm Feeling Lucky link
					var feelingLuckyLink ='https://www.google.com/search?q=' + encodeURIComponent(game.contentTitle) + '&btnI';

					game.DetailPageURL = feelingLuckyLink;
					game.ASIN = '';
					game.LowestPrice = 'search for price';
					game.Description = '<p>See more information at link above</p>';

				}else{

					var topAmazonResult = amazonData.res[0];

					// adds the Amazon properties to the game objects in the games array 
					game.DetailPageURL = topAmazonResult.DetailPageURL[0];
					game.ASIN = topAmazonResult.ASIN[0];
					game.LowestPrice = topAmazonResult.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
					game.Description = arrayToPs(topAmazonResult.ItemAttributes[0].Feature);
					
				}

				remaining_callbacks--;  // decrease the counter (represents n times to fetch Amazon data)
				
				if(remaining_callbacks <= 0){
					//	when the counter hits 0, the games' properties are completely populated
					//  so now we can write the HTML
					callback(data);
				}	

			});
		});
	};

	generateAmazonFeedURL = function(gameName){
		const baseURL = 'https://marzloffmedia.com:8000/amz/';
    	// inserts the game name into the url used to search Amazon
    	gameName = gameName.replace(/[^a-zA-Z 0-9]+/g,'');

		return baseURL + encodeURIComponent(gameName) + '?&callback=?';
	};

	arrayToPs= function(arr){
		var str = "";
		for (i=0; i<arr.length; i++){
			str += '<p>' + arr[i] + "</p>\n";
		}
		return str;
	}
}