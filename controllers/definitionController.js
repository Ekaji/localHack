const Definition = require('../models/definition');

exports.createDefinition = (req, res) => {
    const definition = new Definition({
        user: req.body.user,
        word: req.body.word,
        defined: req.body.defined
    });

    definition
        .save()
        .exec()
        .then((result) => {
            res.status(200).json({
                result,
                message: 'Definition created successfully'
            });
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.getDefinitionById = (req, res) => {
    Definition
        .findById(req.params.id)
        .populate('User', '-password')
        .populate('Word')
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: 'Definition does not exist'
                });
            } else {
                res.status(200).json(result);
            }
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.getWordDefinition = (req, res) => {
    Definition
        .find()
        .where('word', req.params.id)
        .populate('User', '-password')
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

exports.getUserDefinition = (req, res) => {
    Definition
        .find()
        .where('user', req.params.id)
        .populate('Word')
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.updateDefinition = (req, res) => {
    let options = req.body;
    const updates = {};

    for (const option of Object.keys(options)) {
        updates[option] = options[option]
    }

    Definition
        .findByIdAndUpdate(
            req.params.id, {
                $set: updates
            }, {
                new: true,
                contex: 'query'
            }
        )
        .populate('User', '-password')
        .populate('Word')
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: 'Word Definition does not exist'
                });
            } else {
                res.status(200).json({
                    result,
                    message: 'Definition updated successfully'
                });
            }
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.deleteDefinition = (req, res) => {
    Definition
        .findByIdAndDelete(req.params.id)
        .exec()
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: 'Definition does not exist'
                });
            } else {
                res.status(200).json({
                    message: 'Definition deleted'
                });
            }
        }).catch((err) => {
            res.status(500).json(err);
        });
}