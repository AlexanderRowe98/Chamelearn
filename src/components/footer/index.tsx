'use client';
import Link from 'next/link';
import { FaComment, FaCommentAlt, FaCommentDollar, FaCommentSlash, FaFolderMinus, FaFolderOpen, FaGlobeEurope, FaHome, FaInfoCircle, FaPhoneAlt } from 'react-icons/fa';
import './footer.css'; // Import the CSS file
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaBookOpen, FaCommentDots, FaFolder, FaFolderClosed, FaFolderTree, FaGlobe, FaRegComments } from 'react-icons/fa6';
import { GetUserInfo } from '@/utils/localStorage';
import { UserInformation } from '@/models/users/userInformation';
// Define the component
const Footer: React.FC = () => {
  const pathname = usePathname(); // Get the current pathname
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [user, setUser] = useState<UserInformation | null>(null);

  useEffect(() => {
    setIsMounted(true);
    GetUserInfo().then((resp: UserInformation | null) => {
      if (resp) {
        setUser(resp);
      }      
    });
  }, []);

  // If on '/login' page and mounted, return nothing (empty fragment)
  if (isMounted && pathname === '/login') {
    return <></>;
  }
  
  return (
    <footer className="fixed-footer">
      <div className="footer-content">
        <Link href="/" passHref>
          <span className="nav-icon">
            <FaHome size={30} />
            <span>{user?.mainLanguage === 'Dutch' ? 'Thuis' : 'Home'}</span>
          </span>
        </Link>
        <Link href="/translator" passHref>
          <span className="nav-icon">
            <FaGlobeEurope size={30} />
            <span>{user?.mainLanguage === 'Dutch' ? 'Vertaler' : 'Translator'}</span>
          </span>
        </Link>
        <Link href="/chat" passHref>
          <span className="nav-icon">
            <FaComment size={30} />
            <span>{user?.mainLanguage === 'Dutch' ? 'Penvriend' : 'Penpal'}</span>
          </span>
        </Link>
        <Link href="/saved-vocabulary" passHref>
          <span className="nav-icon">
            <FaFolderTree size={30} />
            <span>{user?.mainLanguage === 'Dutch' ? 'Opgeslagen woorden' : 'Saved Vocabulary'}</span>
          </span>
        </Link>
        <Link href="/exercises" passHref>
          <span className="nav-icon">
            <FaBookOpen size={30} />
            <span>{user?.mainLanguage === 'Dutch' ? 'Testen' : 'Exercises'}</span>
          </span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
