import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaHandsHelping, FaGlobeAmericas } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left md:w-2/3"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Empower change.<br />
              <span className="text-blue-200">Inspire hope.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl">
              Join our community of donors and volunteers to make a real impact around the world. Every action counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/campaigns" className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg text-lg text-center">
                Donate Now
              </Link>
              <Link to="/volunteer" className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition shadow-lg text-lg text-center">
                Become a Volunteer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div whileHover={{ y: -5 }} className="p-6 rounded-xl bg-blue-50">
              <FaHeart className="mx-auto text-4xl text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Donate</h3>
              <p className="text-gray-600">Fund verified campaigns directly and securely.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="p-6 rounded-xl bg-green-50">
              <FaHandsHelping className="mx-auto text-4xl text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Volunteer</h3>
              <p className="text-gray-600">Offer your skills and time to causes that need you.</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="p-6 rounded-xl bg-purple-50">
              <FaGlobeAmericas className="mx-auto text-4xl text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Impact</h3>
              <p className="text-gray-600">Track your contributions and see real-world changes.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
