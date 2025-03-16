const Footer = () => {
  return (
    <footer className="flex items-center justify-center bg-gray-900 text-slate-200 p-4">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by Ap Store.
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
