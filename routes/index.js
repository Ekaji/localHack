const express = require("express");
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
router.get('/user/:id', user.getUserById);
router.put('/user/:id', user.updateUser);
router.delete('/user/:id', user.deleteUser);

//Words router
router.post('/word', words.createWord);
router.get('/word', words.getWords);
router.get('/word/user/:id', words.getWordsByUser);
router.get('/word/:id', words.getWordById);
router.put('/word/:id', words.updateWord);
router.delete('/word/:id', words.deleteWord);

// Definition routes
router.post('/definition', definition.createDefinition);
router.get('/definition/word/:id', definition.getWordDefinition);
router.get('/definition/user/:id', definition.getUserDefinition);
router.get('/definition/:id', definition.getDefinitionById);
router.put('/definition/:id', definition.updateDefinition);
router.delete('/definition/:id', definition.deleteDefinition);

//Votes routes
router.post('/vote', votes.createVote);
router.get('/vote/user/:id', votes.getVotesByUser);
router.get('/vote/yes/:id', votes.getVotesCountYesByContent);
router.get('/vote/no/:id', votes.getVotesCountNoByContent);
router.delete('/vote/:id', votes.deleteVote);

module.exports = router;