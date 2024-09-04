import './nav.css';
import Image from 'next/image';
import  Link  from 'next/link';

function Nav() {

  return (
    <nav className="navbar bg-body-body" role="navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="Nav-title flex items-center">
          <Link href="/"><Image src='/shed-green.png' alt='shed logo' width="150" height="150"/></Link>
          <p className="text-xl font-semibold"> shed </p>
        </div>
        <div className="Nav-links flex">
          <Link href="/about" className="nav-link">about</Link>
          <Link href="/users/karlystark" className="nav-link">my shed</Link>
          <Link href="/resources" className="nav-link">resource list</Link>
          <Link href="/signup" className="nav-link">signup</Link>
          <Link href="/login" className="nav-link">log in</Link>
          {/* <Link to="/users" className="nav-link">friends</Link> */}
          <Link href="/logout" className="nav-link">logout</Link>
        </div>
      </div>
      {/* {isLoggedIn ?
     <div className="Nav-links">
    <Link to="">about</Link>
    <Link to="">resource list</Link>
    <Link to="">friends</Link>
    </div>
    :
    <div className="Nav-links">
    <Link to="/about"> about </Link>
    <Link to="/signup"> sign up </Link>
    <Link to="/login"> log in </Link>
    </div>
    } */}
    </nav>
  );

}

export default Nav;