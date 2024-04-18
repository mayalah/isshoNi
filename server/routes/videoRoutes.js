import {
  videoRetrieval,
  uploadVideo,
  addRoomID,
  checkIfYTRoomExist,
  checkIfRoomExist,
} from "../controllers/videoController.js";

async function videoRoutes(fastify, options) {
  fastify.get("/videoRetrieval/:link", (request, reply) =>
    videoRetrieval(request, reply)
  );
  fastify.post("/uploadVideo/:fileName", (request, reply) =>
    uploadVideo(request, reply)
  );
  fastify.post("/addRoomID", (request, reply) => addRoomID(request, reply));
  fastify.get("/checkIfYTRoomExist/:date/:ytID", (request, reply) =>
    checkIfYTRoomExist(request, reply)
  );
  fastify.get("/checkIfRoomExist/:roomID", (request, reply) =>
    checkIfRoomExist(request, reply)
  );
}
export default videoRoutes;
