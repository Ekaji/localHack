const Votes = require('../models/votes');

exports.createVote = (req, res) => {
    const vote = new Votes({
        definition: req.body.definition,
        voter: req.body.voter,
        vote: req.body.vote
    });

    vote
        .save()
        .exec()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
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
        .count()
        .where('definition', req.params.id)
        .where('vote', 1)
        .then((result) => {
            res.status(200).send(result);
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
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
}

exports.deleteVote = (req, res) => {
    Votes
        .findByIdAndDelete(req.params.id)
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