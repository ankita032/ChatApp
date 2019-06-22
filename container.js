const dependable = require('dependable');
const path = require('path');

const container = dependable.container();
const simpleDependencies = [
	['_','lodash'],
	['passport','passport'],
	['formidable','formidable'],
	['Club','./models/club'],
	['aws','./helpers/AWSUpload'],
	['async','async'],
	['Users','./models/user'],
	['Message','./models/message']
];

simpleDependencies.forEach(function(val){
	container.register(val[0],function(){
		return require(val[1]);
	})
});

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container',function(){
	return container;
})

module.exports = container;