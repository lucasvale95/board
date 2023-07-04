import { app } from "@/services/firebaseConection"
import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore/lite"
import NextAuth, { Session } from "next-auth"
import GithubProvider from "next-auth/providers/github"


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
      }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, user }: any) {

      const db = getFirestore(app)      
      const docUsers = await getDocs(collection(db, "users"))        
      const updateUser: any = []
      
      docUsers.forEach((doc) => {
        return updateUser.push(doc.data())
      })  

      return {
        ...session,
        vip: updateUser[0]?.donate, 
        lastDonate: updateUser[0]?.lastDonate
      }
    }

    },
    async signIn({user, account, profile}: any){
      const { email } = user;
      try{
        return true;
      }catch(err){
        console.log('DEU ERRO: ', err);
        return false;
      }

    }
}
export default NextAuth(authOptions)