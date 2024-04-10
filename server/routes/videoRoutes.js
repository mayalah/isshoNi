import { videoRetrieval, uploadVideo } from "../controllers/videoController.js";

async function videoRoutes(fastify, options) {
  fastify.get("/videoRetrieval/:link", (request, reply) =>
    videoRetrieval(request, reply)
  );
  fastify.post("/uploadVideo/:fileName", (request, reply) =>
    uploadVideo(request, reply)
  );
}
export default videoRoutes;
