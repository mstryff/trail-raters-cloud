var express = require('express');
var router = express.Router();

var getUsers = function(req, res, next) {
	console.log("getUsers");
	var params = { TableName: "users" };

	res.app.get('docClient').scan(params, function(err, data) {
		if(err)
		{
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var postUser = function(req, res) {
	var name = req.query.name;
	var password = req.query.password;
	console.log(name + " " + password);
	var date = Date.now();

	var id = date.toString();

	var params = {
		TableName: "users",
		Item:{
			"id": Number(id),
			"name": name,
			"password": password
		}
	};

	res.app.get('docClient').put(params, function(err, data) {
		if(err)
		{
			console.log(JSON.stringify(err, null, 2));
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var getUserById = function(req, res, next) {
	var id = req.params.id;
	var params = {
		TableName: "users",
		Key: {
			"id": Number(id)
		}
	};

	res.app.get('docClient').get(params, function(err, data) {
		if(err)
		{
			console.log(JSON.stringify(err, null, 2));
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var addFriend = function(req, res, next) {
	var friendId = Number(req.body.friendId);
	var id = Number(req.params.id);

	var params = {
		TableName: "users",
		Key: {
			"id": id
		},
		UpdateExpression: "SET friends = friends + :friendId",
		ExpressionAttributeValues: {
			":friendId": { "NS": [String(friendId)] }
		},
		ReturnValues: "UPDATED_NEW"
	};

	res.app.get('docClient').update(params, function(err, data) {
		if(err)
		{
			console.log(JSON.stringify(err, null, 2));
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var removeFriend = function(req, res, next) {
	var friendId = Number(req.body.friendId);
	var id = Number(req.params.id);

	var params = {
		TableName: "users",
		Key: {
			"id": id
		},
		UpdateExpression: "remove friends :friendId",
		ExpressionAttributeValues: {
			":friendId": [friendId]
		},
		ReturnValues: "UPDATED_NEW"
	};

	res.app.get('docClient').update(params, function(err, data) {
		if(err)
		{
			console.log(JSON.stringify(err, null, 2));
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var getReports = function(req, res, next) {
	console.log("get reports");
	var params = { TableName: "reports" };

	res.app.get('docClient').scan(params, function(err, data) {
		if(err)
		{
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var postReport = function(req, res, next) {
	var userId = req.query.userId;
	var trail = req.query.trail;
	var latitude = req.query.latitude;
	var longitude = req.query.longitude;
	var text = req.query.text;
	var date = Date.now();
	var rating = req.query.rating;
	var username = req.query.username;

	var id = date.toString();

	var params = {
		TableName: "reports",
		Item: {
			"id": Number(id),
			"user_id": Number(userId),
			"trail": trail,
			"latitude": latitude,
			"longitude": longitude,
			"date": date,
			"text": text,
			"rating": rating,
			"username": username
		}
	};

	res.app.get('docClient').put(params, function(err, data) {
		if(err)
		{
			console.log(JSON.stringify(err, null, 2));
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var getReportById = function(req, res, next) {
	var id = req.params.id;
	var params = {
		TableName: "reports",
		Key: {
			"id": Number(id)
		}
	};

	res.app.get('docClient').get(params, function(err, data) {
		if(err)
		{
			console.log(JSON.stringify(err, null, 2));
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var editReport = function(req, res, next) {
	var id = req.params.id;
	var trail = req.query.trail;
	var latitude = req.query.latitude;
	var longitude = req.query.longitude;
	var text = req.query.text;
	var rating = req.query.rating;

	var params = {
		TableName: "reports",
		Key: {
			"id": Number(id)
		},
		UpdateExpression: "SET trail = :trail, latitude = :latitude, longitude = :longitude, #t = :text, rating = :rating",
		ExpressionAttributeNames: {
			"#t": "text"
		},
		ExpressionAttributeValues: {
			":trail": trail,
			":latitude": latitude,
			":longitude": longitude,
			":text": text,
			":rating": rating
		},
		ReturnValues: "UPDATED_NEW"
	};

	res.app.get('docClient').update(params, function(err, data) {
		if(err)
		{
			console.log(JSON.stringify(err, null, 2));
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

var deleteReport = function(req, res, next) {
	var id = req.params.id;

	var params = {
		TableName: "reports",
		Key: {
			"id": Number(id)
		}
	};

	res.app.get('docClient').delete(params, function(err, data) {
		if(err)
		{
			console.log(JSON.stringify(err, null, 2));
			res.json(500, err);
		}
		else
		{
			res.json(200, data);
		}
	});
};

router.get('/user', getUsers);
router.post('/user', postUser);

router.get('/user/:id', getUserById);
router.put('/user/:id', addFriend);
router.delete('/user/:id', removeFriend);

router.get('/report', getReports);
router.post('/report', postReport);

router.get('/report/:id', getReportById);
router.put('/report/:id', editReport);
router.delete('/report/:id', deleteReport);

module.exports = router;
