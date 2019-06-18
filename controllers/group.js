
module.exports = function(Users,async){
	return{
		SetRouting: function(router){
			router.get('/group/:name',this.groupPage);
			router.post('/group/:name', this.groupPostPage);
		},

		groupPage: function(req,res){
			const name = req.params.name;
			console.log(name);
			async.parallel([
				function(callback){
					Users.findOne({'username': req.user.username})
						.populate('request.userId')
						.exec((err,result) =>{
							callback(err,result);
						});
				}
			],(err,results) =>{
				const result1 = results[0];
				res.render('groupchat/group', {title : 'Footballkik - Group', user:req.user, groupName : name, data:result1});
			});

			
		},

		groupPostPage: function(req,res){
			// This function is to send friend request
			async.parallel([
				function(callback){
					if(req.body.receiverName){
						Users.update({
							'username': req.body.receiverName,
							'request.userId': {$ne: req.user._id},
							'friendsList.friendId': {$ne: req.user._id}
						}, 
						{
							$push: {request: {
								userId: req.user._id,
								username: req.user.username
							}},
							$inc: {totalRequest: 1}
						},(err, count) =>{
							callback(err,count);
						});
					}
				},
				function(callback){
					if(req.body.receiverName){
						Users.update({
							'username': req.user.username,
							'sentRequest.username': {$ne: req.body.receiverName}
						},
						{
							$push: {sentRequest:{
								username: req.body.receiverName
							}}
						},(err,count) =>{
							callback(err,count);
						});
					}
				}
			],(err,results) =>{
				res.redirect('/group/'+req.params.name);

			});

			// This async function is to accept or cancel friend request

			async.parallel([
				//This function is updated for receiver
				function(callback){
					if(req.body.senderId){
						Users.update({
							'_id': req.user._id,
							'friendsList.friendId': {$ne: req.body.senderId}
						},{
							$push: {friendsList:{
								friendId: req.body.senderId,
								friendName: req.body.senderName
							}},
							$pull: {request:{
								userId: req.body.senderId,
								username: req.body.senderName
							}},
							$inc: {totalRequest: -1}
						},(err,count) =>{
							callback(err,count);
						});
					}
				},
				//This function is updated for sender when request is accepted by receiver
				function(callback){
					if(req.body.senderId){
						Users.update({
							'_id': req.body.senderId,
							'friendsList.friendId': {$ne: req.user._id}
						},{
							$push: {friendsList:{
								friendId: req.user._id,
								friendName: req.user.username
							}},
							$pull: {sentRequest:{
								username: req.user.username
							}},
						},(err,count) =>{
							callback(err,count);
						});
					}
				},

				function(callback){
					if(req.body.user_Id){
						Users.update({
							'_id': req.body.user_Id,
							'request.userId': {$eq: req.body.user_Id}
						},{
							$pull: {request:{
								userId: req.body.user_Id
							}},
							$inc: {totalRequest: -1}
						},(err,count) =>{
							callback(err,count);
						});
					}
				},

				function(callback){
					if(req.body.user_Id){
						Users.update({
							'_id': req.body.user_Id,
							'sentRequest.username': {$eq: req.user.username}
						},{
							$pull: {sentRequest:{
								username: req.user.username
							}},
						},(err,count) =>{
							callback(err,count);
						});
					}
				}
			],(err,results) =>{
				res.render('/group/'+req.params.name);
			});
		}
	}
}