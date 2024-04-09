import { liveblocksAuth, resolveUsers } from "../controllers/liveblockController.js";
async function liveblockAuthRoutes(fastify, options){
    fastify.post("/auth", liveblocksAuth)
    fastify.post("/resolveUsers", resolveUsers)
}
export default liveblockAuthRoutes;
