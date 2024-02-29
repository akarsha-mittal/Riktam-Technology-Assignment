const express = require('express');
const router = express.Router();
const group_controller = require('../controllers/group_controller');
const { verifyUser } = require('../middleware/verify_login');
router.use(verifyUser);
router.get('/', group_controller.index);
router.get('/add', group_controller.addGroup);
router.post('/add', group_controller.saveGroup);
router.put('/edit/:id', group_controller.updateGroup);
router.delete('/delete/:id', group_controller.deleteGroup);
router.get('/view_members/:id', group_controller.viewMembers);
router.delete('/delete_member/:id/:group_id', group_controller.deleteMember);
router.post('/add_members/:group_id', group_controller.addMembers);
router.get('/get_messages/:group_id', group_controller.getMessagesBasedOnGroup);
router.post('/send_messages/:group_id', group_controller.sendMessagesBasedOnGroup);
router.get('/like_message/:message_id', group_controller.LikeMessage);
router.get('/dislike_message/:message_id', group_controller.DislikeMessage);

module.exports = router;