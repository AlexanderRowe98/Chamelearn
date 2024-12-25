'use client';
import MainLanguageSelector from '@/components/toggles';
import { UserInformation } from '@/models/users/userInformation';
import { saveUser } from '@/utils/dynamoDb/users';
import { GetUserInfo } from '@/utils/localStorage';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [username, setUsername] = useState<string>('');
  const [mainLanguage, setMainLanguage] = useState<string>('');

  useEffect(() => {
    GetUserInfo().then((resp: UserInformation | null) => {
      if (resp?.mainLanguage) {
        setMainLanguage(resp.mainLanguage);
        setUsername(resp.username ?? '');
      }      
    });
  }, [])
  
  const handleLogout = () => {
    // Remove the token cookie
    Cookies.remove('auth-token');
    // Optionally, you can also clear any other session data stored locally, like localStorage.
    localStorage.removeItem('auth-token');
    
    // Redirect the user to the login page
    window.location.href = '/login'; // Use window.location.href for navigation on logout
  };

  const handleChange = async (value: string) => {
     await saveUser(username, value);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profile</h1>
      {mainLanguage !== '' && (
        <MainLanguageSelector title='Main language' id='language-selector' selectedValue={mainLanguage} updateSelectedValue={(value: string) => handleChange(value)} options={['English', 'Dutch']}/>    
      )}
      <button className='button' onClick={handleLogout} >Sign out</button>
    </div>
  );
}
