import './footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="Footer">
      <p className="Footer-tagline">all things in common all people as one.</p>
      <p className="Footer-copyright">&copy; {year} shed</p>
    </footer>
  );
}

export default Footer;
