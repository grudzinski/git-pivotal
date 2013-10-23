#!/usr/local/bin/node

var childProcess = require('child_process');
var request = require('request');

var exec = childProcess.exec;

exec('git log -1 HEAD', function(err, input, output) {
	if (err) {
		console.log(err);
		return;
	}
	var result = input.toString().split(/\n/g).slice(-2)[0].match(/:(\d+)/);
	if (result === null) {
		return;
	}
	var env = process.env;
	var token = env['PIVOTAL_TOKEN'];
	if (token === undefined) {
		console.log('PIVOTAL_TOKEN is not defined');
		return;
	}
	var projectId = env['PIVOTAL_PROJECT_ID'];
	if (projectId === undefined) {
		console.log('PIVOTAL_PROJECT_ID is not defined');
		return;
	}
	var storyId = result[1];
	var urlPattern = "https://www.pivotaltracker.com/services/v5/projects/{projectId}/stories/{storyId}";
	var url = urlPattern.replace('{projectId}', projectId).replace('{storyId}', storyId);
	console.log('Try to finish story');
	request({ method: 'PUT', url: url, headers: { 'X-TrackerToken': token }, json: { current_state: 'finished' } }, function(err, res, body) {
		if (err) {
			console.log(err);
			return;
		}
		err = body.error;
		if (err) {
			console.log(err);
			return;
		}
		console.log('Story has finished');
	});
})

// 940014
// export PIVOTAL_TOKEN=32f34847696903bba06adef424f60601 && export PIVOTAL_PROJECT_ID=940014
