const Words = require('../models/words');

exports.createWord = (req, res) => {
    const word = new Words({
        word: req.body.word,
        user: req.body.user
    })

    word
        .save()
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
}

exports.getWords = (req, res) => {
    Words
        .find({})
        .populate('user', '-password')
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.getWordById = (req, res) => {
    Words
        .findById(req.params.id)
        .populate('User', '-password')
        .exec()
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: 'Word does not exist'
                });
            } else {
                res.status(200).json(result);
            }
        }).catch((err) => {
            res.status(500).send(err);
        });
}

exports.getWordsByUser = (req, res) => {
    Words
        .find()
        .where('user', req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.updateWord = (req, res) => {
    let options = req.body;
    const updates = {};

    for (const option of Object.keys(options)) {
        updates[option] = options[option]
    }

    Words
        .findByIdAndUpdate(
            req.params.id, {
                $set: updates
            }, {
                new: true,
                contex: 'query'
            }
        )
        .populate('User', '-password')
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: 'Could not find content'
                });
            } else {
                res.status(200).json({
                    result,
                    message: 'Content was updated successfully'
                });
            }
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.deleteWord = (req, res) => {
    Words
        .findByIdAndDelete(req.params.id)
        .exec()
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: 'Could not find content to delete'
                });
            } else {
                res.status(200).json({
                    message: 'Content delete successfully'
                });
            }
        }).catch((err) => {
            res.status(500).json(err);
        });
}