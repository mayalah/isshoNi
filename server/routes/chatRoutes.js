import { getAllFriends, getMessages, addMessage} from "../controllers/chatController.js";


async function chatRoutes(fastify, options){
    fastify.post("/getAllFriends", getAllFriends)
    fastify.post("/getMessages", getMessages)
    fastify.post("/addMessage", addMessage)
}
export default chatRoutes;