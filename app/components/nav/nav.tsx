'use client';

import './nav.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

interface NavProps {
  betaUnlocked: boolean;
}

function Nav({ betaUnlocked }: NavProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountWrapperRef = useRef<HTMLDivElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const wasAccountOpen = useRef(false);

  function linkClass(href: string) {
    return `nav-link${pathname === href ? ' nav-link-active' : ''}`;
  }

  // Close on click outside.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountWrapperRef.current && !accountWrapperRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape closes the menu and returns focus to its trigger.
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && accountMenuOpen) {
        setAccountMenuOpen(false);
        accountTriggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [accountMenuOpen]);

  // Close the menu whenever navigation happens.
  useEffect(() => {
    setAccountMenuOpen(false);
  }, [pathname]);

  // Move focus into the panel the moment it opens.
  useEffect(() => {
    if (accountMenuOpen && !wasAccountOpen.current) {
      accountDropdownRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    }
    wasAccountOpen.current = accountMenuOpen;
  }, [accountMenuOpen]);

  return (
    <nav className="navbar bg-body-body" role="navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-4 lg:px-6">
        <div className="Nav-title flex items-center">
          <Link href="/"><Image src='/shed-green.png' alt='shed logo' width="120" height="120" /></Link>
          <p className="text-xl font-semibold"> shed </p>
        </div>
        {betaUnlocked && (
          <div
            className="Nav-links"
            style={{ '--account-color': (status === 'authenticated' && session.user.color) || 'var(--pink)' } as React.CSSProperties}
          >
            <div className="Nav-links-primary">
              <Link href="/about" className={linkClass('/about')}>about</Link>
              {status === 'authenticated' && (
                <Link href="/resources" className={linkClass('/resources')}>resource list</Link>
              )}
            </div>
            <div className="Nav-links-account">
              {status === 'authenticated' ? (
                <div className="Account-menu" ref={accountWrapperRef}>
                  <button
                    type="button"
                    ref={accountTriggerRef}
                    className="Account-trigger"
                    aria-expanded={accountMenuOpen}
                    aria-controls="account-dropdown-panel"
                    onClick={() => setAccountMenuOpen((open) => !open)}
                  >
                    <span
                      className="Account-avatar"
                      style={{ backgroundColor: 'var(--account-color)' }}
                    >
                      {session.user.icon ? (
                        <span
                          className="Account-avatar-icon"
                          style={{ backgroundImage: `url(${session.user.icon})` }}
                        />
                      ) : (
                        session.user.username.charAt(0).toUpperCase()
                      )}
                    </span>
                    {session.user.username}
                    <span className="Account-caret" aria-hidden="true">&#9662;</span>
                  </button>
                  <div
                    id="account-dropdown-panel"
                    className={`Account-dropdown${accountMenuOpen ? ' open' : ''}`}
                    ref={accountDropdownRef}
                  >
                    <Link href={`/users/${session.user.username}`} onClick={() => setAccountMenuOpen(false)}>my shed</Link>
                    <Link href="/friends" onClick={() => setAccountMenuOpen(false)}>friends</Link>
                    <Link href="/account" onClick={() => setAccountMenuOpen(false)}>account</Link>
                    <hr />
                    <button type="button" onClick={() => signOut({ callbackUrl: '/' })}>logout</button>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/signup" className={linkClass('/signup')}>signup</Link>
                  <Link href="/login" className={linkClass('/login')}>log in</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );

}

export default Nav;
