import {createClient} from '@libsql/client';
import 'dotenv/config';

const dbconnector = createClient({
    url: "libsql://isshoni-nhitran26197.turso.io",
    authToken: process.env.DB_TOKEN
});

export const getUserInfoService = async(email) =>{
    const res = await dbconnector.execute({
        sql:'select email, name, pictureURL from user where email = ? ',
        args: [email]
    })

    if (res.rows){
        return res.rows[0]
    }else{
        return "user not found"
    }
}
// export  const getUser = async (userIds) =>{
//     // Dynamically create placeholders based on userIds length
//     console.log("user in getUser")
//     console.log("userIds", userIds  )
//     const ressult =[]
//     userIds.map(async (userId) => {
//         console.log("userId in here", userId)
//       const res = await dbconnector.execute({
//         sql: 'select email, name, pictureURL from user where email = ?',
//         args: [userId]
//       });

//       const userInfo ={
//         name: res.rows[0].name,
//         image: res.rows[0].pictureURL
//       }
//       console.log("userInfo", userInfo)
//       ressult.push(userInfo)
  
//     })

//     console.log("ressult", ressult)


//    return ressult;
//   }

// export const getUser = async (userIds) => {
//     console.log("user in getUser");
//     console.log("userIds", userIds);
  
//     const promises = userIds.map(async (userId) => {
//       console.log("userId in here", userId);
//       const res = await dbconnector.execute({
//         sql: 'SELECT email, name, pictureURL FROM user WHERE email = ?',
//         args: [userId]
//       });
//       console.log("res", res);
  
//       if (res.rows.length > 0) {
//         const userInfo = {
//           name: res.rows[0].name,
//           image: res.rows[0].pictureURL
//         };
//         console.log("userInfo", userInfo);
//         return userInfo;
//       } else {
//         // Handle the case where no user is found
//         console.log("No user found for userId:", userId);
//         return null; // Or however you wish to handle this case
//       }
//     });
  
//     // Wait for all promises to resolve
//     const results = await Promise.all(promises);
//     // Filter out any null values if there were userIds not found
    
//     return results.filter(userInfo => userInfo !== null);
//   }
  
  export const getUser = async(userIds)=>{

    const userId = userIds
    console.log("userId in getUser", userId)
    const res= await dbconnector.execute({
        sql: 'select email, name, pictureURL from user where email = ?',
        args: [userId]
    })
    console.log("res in getUser", res)
    return [{
        name: res.rows[0].name,
        avatar: res.rows[0].pictureURL
    }]

  }