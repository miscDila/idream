import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-mono text-2xl font-bold mb-4">iDream.club</h3>
            <p className="font-mono text-lg text-gray-400">
              Turn your dreams into reality
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="font-mono text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="font-mono text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="font-mono text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-lg font-bold mb-4">Contact</h4>
            <a 
              href="mailto:hello@idream.club" 
              className="font-mono text-gray-400 hover:text-white transition-colors block"
            >
              hello@idream.club
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="font-mono text-gray-400">
            © {new Date().getFullYear()} iDream.club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

