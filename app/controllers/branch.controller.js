const Branch = require('../models/branch.model');
const Img = require('../models/img-branch.model');
const imageUploader = require('imgur-uploader');
require('express-fileupload');

exports.read = (req, res) => {
	Branch.find()
		.then((branch) => {
			res.send(branch);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving notes.'
			});
		});
};
//input in query: id branch	as id
exports.getOne = (req, res) => {
	const idbranch = req.query.id || '';
	Branch.findById(idbranch)
		.then((branch) => {
			res.send(branch);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving notes.'
			});
		});
};
exports.create = (req, res) => {
	// Validate request
	if (!req.files) {
		return res.status(400).send({
			message: 'File was not found'
		});
	}

	let img = req.files.img;
	if (!img.match('.(jpg|jpeg|png|gif)')) {
		return res.status(400).send({
			message: 'Image not format'
		});
	}
	if (!req.body.name || !req.body.address || !req.body.status) {
		return res.status(400).send({
			message: 'Data can not be empty'
		});
	}
	imageUploader(img)
		.then((img) => {
			const branch = new Branch({
				name: req.body.name,
				address: req.body.address,
				status: req.body.status,
				img: img.link
			});

			// Save Note in the database
			branch
				.save()
				.then((data) => {
					const img = new Img({
						idbranch: data._id,
						name: data.img
					});
					img.save().catch((err) =>
						res.status(500).send({
							message: err.message || 'Some error occurred while creating the Note.'
						})
					);
					res.send({ data, img });
				})
				.catch((err) => {
					res.status(500).send({
						message: err.message || 'Some error occurred while creating the Note.'
					});
				});
		})
		.catch((err) =>
			res.status(400).send({
				message: 'Error occured while load image'
			})
		);
};

//input in query: id branch	as id
// NOT update img
exports.update = async (req, res) => {
	const idbranch = req.query.id;
	if (!req.body.name || !req.body.address || !req.body.status) {
		return res.status(400).send({
			message: 'Data can not be empty'
		});
	}

	await Branch.updateOne({ _id: idbranch }, {
		name: req.body.name,
		address: req.body.address
	}, (err, result) => {
		if (err) {
			res.status(400).send({
				isSuccess: false
			})
		} else {
			res.status(200).send({
				isSuccess: true,
				result
			})
		}
	})
};
//input query: id branch as id
exports.delete = async (req, res) => {
	const idbranch = req.query.id || '';

	await Branch.updateOne({ _id: idbranch }, {
		status: false
	}, (err) => {
		if (err) {
			res.status(400).send({
				isSuccess: false
			})
		} else {
			res.status(200).send({
				isSuccess: true
			})
		}
	})

}