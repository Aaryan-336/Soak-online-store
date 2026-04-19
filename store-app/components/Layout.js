import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
  
        <main className="w-full max-w-6xl mx-auto px-4 py-6 overflow-x-hidden">
          {children}
        </main>
  
        <Footer />
      </div>
    );
  }
  