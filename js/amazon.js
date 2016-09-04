function AmazonUtils (){

	this.getLinks = function(data, callback){
		
		// API call with callback
		// add links as amazonLink property to each game in data
		
		$.each(data, function(index, item){
			item.amazonLink = "http://www.amazon.com"; // placeholder
		});
		console.log('getLinks run. data count = ' + data.length);
		callback(data);
	};
}