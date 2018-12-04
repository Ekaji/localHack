const Votes = require('../models/votes');

exports.createVote = (req, res) => {
    const vote = new Votes({
        definition: req.body.definition,
        voter: req.body.voter,
        vote: req.body.vote
    });

    Votes
        .findOne()
        .where('voter', req.body.voter)
        .where('definition', req.body.definition)
        .where('vote', req.body.vote)
        .then(r => {
            if (!r) {
                vote
                    .save()
                    .then((result) => {
                        res.status(200).json(result);
                    }).catch((err) => {
                        res.status(500).json(err);
                    });
            } else {
                res.status(409).send({
                    message: "Vote already casted"
                });
            }
        })
}

exports.getVotesByUser = (req, res) => {
    Votes
        .find()
        .where('voter', req.params.id)
        .populate('Definition')
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.getVotesCountYesByContent = (req, res) => {
    Votes
        .countDocuments()
        .where('definition', req.params.id)
        .where('vote', 1)
        .then((result) => {
            res.status(200).json({
                result
            });
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.getVotesCountNoByContent = (req, res) => {
    Votes
        .count()
        .where('definition', req.params.id)
        .where('vote', 0)
        .then((result) => {
            res.status(200).send({
                result
            });
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.checkUserVotes = (req, res) => {
    Votes
        .findOne()
        .where('voter', req.params.userId)
        .where('definition', req.params.defId)
        .then((result) => {
            if (!result) {
                res.status(200).send(false);
            } else {
                res.status(200).send(true);
            }
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.deleteVote = (req, res) => {
    Votes
        .findOneAndDelete()
        .where('voter', req.params.id)
        .where('definition', req.params.defId)
        .where('vote', req.params.vote)
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: 'No vote to delete'
                });
            } else {
                res.status(200).json({
                    message: 'Vote removed successfully'
                });
            }
        }).catch((err) => {
            res.status(500).json(err);
        });
}