import {
  login,
  loginWithGoogle,
  logOut,
} from "../controllers/loginController.js";
import { signUp, signUpWithGoogle } from "../controllers/signUpController.js";
import { verifyEmail } from "../controllers/mailController.js";
import {
  forgotPassword,
  changePassword,
} from "../controllers/forgotResetPWController.js";

async function userRoutes(fastify, options) {
  fastify.post("/login", (request, reply) => login(fastify, request, reply));
  fastify.post("/signUp", (request, reply) => signUp(fastify, request, reply));
  fastify.get("/verify/:id", (request, reply) =>
    verifyEmail(fastify, request, reply)
  );
  fastify.post("/logOut", { onRequest: [fastify.authenticate] }, logOut);
  fastify.post(
    "/forgotPassword",
    // { onRequest: [fastify.authenticate] },
    (request, reply) => forgotPassword(fastify, request, reply)
  );
  fastify.post(
    "/changePassword",
    // { onRequest: [fastify.authenticate] },
    changePassword
  );
  fastify.post("/loginWithGoogle", (request, reply) =>
    loginWithGoogle(fastify, request, reply)
  );
  fastify.post("/signUpWithGoogle", (request, reply) =>
    signUpWithGoogle(fastify, request, reply)
  );
}
export default userRoutes;
