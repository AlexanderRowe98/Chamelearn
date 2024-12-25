'use client';

import { UserInformation } from "@/models/users/userInformation";
import { GetUserInfo } from "@/utils/localStorage";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<UserInformation | null>(null);

  useEffect(() => {
    GetUserInfo().then((resp: UserInformation | null) => {
      if (resp) {
        setUser(resp);
      }      
    });
  }, [])
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>{user?.mainLanguage === 'English' ? 'Home' : 'Thuis'}</h1>
      <p>{user?.mainLanguage === 'English' ? 'Welcome' : 'Welkom'}, {user?.username}!</p>
    </div>
  );
}
