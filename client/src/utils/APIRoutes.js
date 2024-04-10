export const host = "http://localhost:8009";
export const loginRoute = `${host}/api/user/login`;
export const signUpRoute = `${host}/api/user/signUp`;
export const signInWithGoogleRoute = `${host}/api/user/loginWithGoogle`;
export const signUpWithGoogleRoute = `${host}/api/user/signUpWithGoogle`;
export const forgotPassword = `${host}/api/user/forgotPassword`;
export const changePassword = `${host}/api/user/changePassword`;
export const logOut = `${host}/api/user/logOut`;

export const getAllFriends = `${host}/api/chat/getAllFriends`;
export const getMessages = `${host}/api/chat/getMessages`;
export const addMessage = `${host}/api/chat/addMessage`;

export const liveblocksAuthRoute = `${host}/api/liveblocks/auth`;
export const resolveUsersRoute = `${host}/api/liveblocks/resolveUsers`;
