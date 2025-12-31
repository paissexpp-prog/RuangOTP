import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
        {children}
      </div>
    </>
  );
}
