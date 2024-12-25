'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Use this hook for the current pathname
import { FaUser } from 'react-icons/fa6';
import Link from 'next/link';

const styles = {
  header: {
    backgroundColor: '#003DA5',
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    color: 'white',
    marginBottom: '0'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#C8102E',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  logoutBtnHover: {
    backgroundColor: '#d32f2f',
  },
  container: {
    padding: '20px',
    minHeight: '80vh',
    backgroundColor: 'white',
  },
};

export default function Header() {
  const pathname = usePathname(); // Get the current pathname
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure we are on the client
  }, []);

  // If on '/login' page and mounted, return nothing (empty fragment)
  if (isMounted && pathname === '/login') {
    return <></>;
  }

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Englisch</h1>
      <div style={styles.navRight}>
        <Link href="/profile" passHref>
          <span className="nav-icon">
            <FaUser size={30} />
          </span>
        </Link>
      </div>
    </header>
  );
}
