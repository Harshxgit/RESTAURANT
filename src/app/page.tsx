"use client"
import { signIn, signOut, useSession } from "next-auth/react";


export default function Home() {
  // const {data:session,status } = useSession()
  return (
   <> <h1 className="text-4xl">
    hello harshu
   </h1>
        <button onClick={()=>signIn()} > Signin</button>
        <button onClick={()=>signOut()}className="mx-1" > SignOut</button>
        {/* <>{session?.user.name} </> */}
   </>
  );
}
