const express = require('express');
const router = express.Router();
const UsersController = require('../api/controllers/users');
const listplaces=require('../api/controllers/listplaces')
const reedemcards=require('../api/controllers/reedemcode')
const listreedem=require('../api/controllers/listreedem')
router.post('/signup',UsersController.user_signup);
router.post('/login',UsersController.user_login);
router.post('/reset_password',UsersController.reset_password);
router.delete('/:userID',UsersController.user_delete);
router.get('/placesdetail',listplaces.listqrcode)
router.post('/getreedempoints',reedemcards.getreedempoints)
router.get('/getreedemlist',listreedem.reedemcode)
router.post('/logout',UsersController.logout)
router.post('/getscanreedempoints',reedemcards.scanreedempoints)
router.get('/getmyranking',reedemcards.getmyranking)
router.post('/gethuntcategory',reedemcards.getuserhuntcategory)
router.post('/loginactive',UsersController.loginactive)
router.post('/update_signup',UsersController.update)
router.post('/deleteaccount',UsersController.deleteaccount)
router.post('/homedetail',UsersController.homedetail)

module.exports = router;
