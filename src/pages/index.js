import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Menu } from 'lucide-react';  // Importing Menu icon
import { ToastContainer, toast } from 'react-toastify';  // Importing Toast notifications
import 'react-toastify/dist/ReactToastify.css';  // Importing Toastify styles

const scholarships = [
  {
    id: 'civil-services',
    title: 'Hyundai Hope Scholarship for Union and State Civil Services Aspirants',
    publishedDate: '03-06-2024',
    endDate: '01-10-2024',
  },
  {
    id: 'iit',
    title: 'Hyundai Hope Scholarship for Aspiring Innovators from IITs',
    publishedDate: '03-06-2024',
    endDate: '30-09-2024',
  },
  {
    id: 'clat',
    title: 'Hyundai Hope Scholarship for Common Law Admission Test Aspirants',
    publishedDate: '03-06-2024',
    endDate: '30-09-2024',
  },
];

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'About the program', href: '#' },
  { name: 'Scholarship', href: '#' },
  { name: 'Learn More & FAQs', href: '#' },
  { name: 'Login / Register', href: '#' },
  { name: 'Terms & Conditions', href: '#' },
  { name: 'How To Apply', href: '#' },
];

function Home() {
  const [email, setEmail] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);

  const handleCheckResult = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowResult(true);
    setEmailVisible(true); // Make email input visible after clicking Check Result
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/check-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      // Handle non-JSON response
      if (!response.ok) {
        const errorText = await response.text();  // Read the error response as text
        console.error('Error from API:', errorText);
        toast.error('There was an error with your request. Please try again later.');
        setResult('error');
        setIsLoading(false);
        return;
      }

      // Ensure the response is valid JSON
      const data = await response.json();

      if (data && data.data) {
        setResult(data.data.isSelected ? 'Selected' : 'Not Selected');
      } else {
        setResult('Not Found');
      }
    } catch (error) {
      console.error('Error checking result:', error);
      toast.error('Something went wrong. Please try again later.');
      toast.error(error);
      setResult('error');
    }
  
    setIsLoading(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#001B3D]">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <img
                src="https://hyundai.scholarsbox.in/uploads/HMIF%20LOGO-1.jpg"
                alt="Hyundai Logo"
                className="h-12"
              />
            </div>
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-600 hover:text-[#BADEA5]">
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            <ul className={`${isMenuOpen ? 'block' : 'hidden'} absolute md:relative bg-white top-16 left-0 w-full md:w-auto md:flex md:space-x-6 md:items-center md:top-auto md:left-auto z-50 shadow-md md:shadow-none`}>
              {navItems.map((item) => (
                <li key={item.name} className="text-sm">
                  <a href={item.href} className="block py-3 px-4 md:py-0 md:px-0 text-gray-600 hover:text-[#BADEA5] font-medium transition-colors duration-200">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Scholarships</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="bg-white rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <img
                    src="https://hyundai.scholarsbox.in/uploads/HMIF%20LOGO-1.jpg"
                    alt="Hyundai Logo Combined"
                    className="h-20 sm:h-24"
                  />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                  {scholarship.title}
                </h3>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleCheckResult(scholarship)}
                    className="bg-[#001B3D] text-white px-4 py-2 text-sm rounded hover:bg-blue-900 transition-colors duration-200"
                  >
                    Check Result
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-all duration-500 transform translate-y-0">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative transition-all transform translate-y-0">
            <button
              onClick={() => setShowResult(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="text-center">
              {emailVisible && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <span className="block text-lg font-semibold text-black">Enter Your registered Email ID </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#001B3D] text-white py-2 px-4 rounded-md hover:bg-blue-900"
                  >
                    Submit
                  </button>
                </form>
              )}
              {result === 'Selected' ? (
                <div className="space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Congratulations!
                  </h3>
                  <p className="text-gray-600">
                    You have been selected for the scholarship.
                  </p>
                </div>
              ) : result === 'Not Selected' ? (
                <div className="space-y-4">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    We regret to inform you
                  </h3>
                  <p className="text-gray-600">
                    You were not selected for the scholarship. We wish you better luck for future scholarships.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />  {/* Toast container for displaying notifications */}
    </div>
  );
}

export default Home;
