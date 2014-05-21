module.exports = function Users(db)
{
	var self = this;
	this.db = db;
	
	this.add = function(username, password, callback) 
	{
		console.log('[Users] adding '+username+':'+password);
		self.db.query('SELECT user_id FROM users WHERE username = \''+username+'\'', function(err, result) {
			if (err) return callback(result, err);
			if (result.length > 0) callback(0);
			self.db.query('INSERT INTO users SET ?', {nickname: username, username: username, password: password, score: 0}, function(err, result) {
				if (err) return callback(result, err);
				var user_id = result.insertId;
				console.log('[Users] successfully added '+username+':'+password+" as #"+user_id);
				callback(user_id);
			});
			
		});
		
	};

}
