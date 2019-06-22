const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
	accessKeyId: 'AKIAJN4WQ6GZ4CPUYFKA',
	secretAccessKey: '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'
	//region: 'asia'
});

const s3 = new AWS.S3({});
const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'footballkik5',
		acl: 'public-read',
		// metadata(req,file,cb){
		// 	cb(null, {fieldName: file.fieldName});
		// },
		key(req,file,cb){
			cb(null, file.originalname);
		},
		rename(fieldName,fileName){
			return fileName.replace(/\W+/g, '-');
		}
	})
});

exports.Upload = upload;