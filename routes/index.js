const express = require("express");
const auth = require("../config/authUser")
const router = express.Router();

const user = require('../controllers/userController');
const words = require('../controllers/wordsController');
const definition = require('../controllers/definitionController');
const votes = require('../controllers/votesController');

router.get('/', (req, res) => {
    res.send({message: 'Wee did it'})
});

//User router list
router.post('/user', user.createUser);
router.post('/login', user.loginUser);
router.get('/user/:id', auth, user.getUserById);
router.put('/user/:id', auth, user.updateUser);
router.delete('/user/:id', auth, user.deleteUser);

//Words router
router.post('/word', auth, words.createWord);
router.get('/word', words.getWords);
router.get('/word/user/:id', words.getWordsByUser);
router.get('/word/:id', words.getWordById);
router.put('/word/:id', auth, words.updateWord);
router.delete('/word/:id', auth, words.deleteWord);

// Definition routes
router.post('/definition', auth, definition.createDefinition);
router.get('/definition/word/:id', definition.getWordDefinition);
router.get('/definition/user/:id', definition.getUserDefinition);
router.get('/definition/:id', definition.getDefinitionById);
router.put('/definition/:id', auth, definition.updateDefinition);
router.delete('/definition/:id', auth, definition.deleteDefinition);

//Votes routes
router.post('/vote', auth, votes.createVote);
router.get('/vote/user/:id', votes.getVotesByUser);
router.get('/vote/yes/:id', votes.getVotesCountYesByContent);
router.get('/vote/no/:id', votes.getVotesCountNoByContent);
router.delete('/vote/:id/:defId/:vote', auth, votes.deleteVote);

module.exports = router;