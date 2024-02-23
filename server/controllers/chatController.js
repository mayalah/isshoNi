import { getAllFriendsService , getMessagesService, addMessageService} from "../services/chatService.js";

export const getAllFriends = async (request, reply) => {
    const email = request.body.email;
    const [res, friendList] = await getAllFriendsService(email);
    if (res === "success") {
        reply.status(200).send(friendList);
    } else {
        reply.status(500).send({ message: "fail" });
    }
}
export const getMessages = async (request, reply) => {
    const email = request.body.userEmail;
    const friendEmail = request.body.friendEmail;
    const [res, messages] = await getMessagesService(email, friendEmail);
    if (res === "success") {
        reply.status(200).send(messages);
    } else {
        reply.status(500).send({ message: "fail" });
    }
}
export const addMessage = async (request, reply) => {  
    const sender = request.body.sender;
    const receiver = request.body.receiver;
    const message = request.body.message;
    const [res, messages] = await addMessageService(sender, receiver, message);
    if (res === "success") {
        reply.status(200).send(messages);
    } else {
        reply.status(500).send({ message: "fail" });
    }
}
