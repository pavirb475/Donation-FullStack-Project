import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter, FaPlayCircle } from 'react-icons/fa';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [donateAmount, setDonateAmount] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const openBlogModal = (blog, e) => {
    e.preventDefault();
    setSelectedBlog(blog);
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
  };

  const handleQuickDonate = (e) => {
    e.preventDefault();
    navigate('/campaigns');
  };

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      
      {/* 1. Hero Section with Quick Donation Form */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-16 pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
            alt="Children" 
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start justify-center">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-2/3 text-white"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Join Us in <br/><span className="text-orange-400">Changing Lives</span>
            </h1>
            <p className="text-lg md:text-2xl mb-10 text-stone-200 max-w-2xl">
              Every day, millions of people struggle with poverty, hunger, and lack of education. Together, we can provide them with the resources they need to build a better future. Your support brings hope.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/volunteer" className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-gray-900 transition shadow-lg text-center text-lg">
                Volunteer
              </Link>
              <Link to="/campaigns" className="bg-orange-600 text-white font-bold px-8 py-4 rounded hover:bg-orange-700 transition shadow-lg text-center text-lg">
                Donate Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Floating Stats Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20 -mt-16 mb-16">
        <div className="bg-white rounded-lg shadow-xl py-6 px-8 flex flex-col sm:flex-row justify-between items-center text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          <div className="w-full sm:w-1/4 py-4 sm:py-0">
            <h4 className="text-3xl font-extrabold text-gray-900">234+</h4>
            <p className="text-sm font-medium text-gray-500 uppercase mt-1">Fundraisers</p>
          </div>
          <div className="w-full sm:w-1/4 py-4 sm:py-0">
            <h4 className="text-3xl font-extrabold text-gray-900">56+</h4>
            <p className="text-sm font-medium text-gray-500 uppercase mt-1">Raised (Millions)</p>
          </div>
          <div className="w-full sm:w-1/4 py-4 sm:py-0">
            <h4 className="text-3xl font-extrabold text-gray-900">234k+</h4>
            <p className="text-sm font-medium text-gray-500 uppercase mt-1">Donations</p>
          </div>
          <div className="w-full sm:w-1/4 py-4 sm:py-0">
            <h4 className="text-3xl font-extrabold text-gray-900">160k+</h4>
            <p className="text-sm font-medium text-gray-500 uppercase mt-1">Volunteers</p>
          </div>
        </div>
      </div>

      {/* 3. Vision & Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-lg shadow-md border-t-4 border-orange-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We envision a world where every individual, regardless of their background, has access to basic necessities, education, and equal opportunities to thrive and succeed.
            </p>
            <Link to="/campaigns" className="text-orange-600 font-bold hover:underline">Learn More &rarr;</Link>
          </div>
          <div className="bg-white p-10 rounded-lg shadow-md border-t-4 border-amber-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our mission is to bridge the gap between generous donors and impactful causes, ensuring transparency and providing a platform for passionate volunteers to make a real difference in their communities.
            </p>
            <Link to="/volunteer" className="text-orange-600 font-bold hover:underline">Learn More &rarr;</Link>
          </div>
        </div>
      </section>

      {/* 4. Help the needy people */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
              alt="Help Needy" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Help the needy people</h2>
            <ul className="space-y-4 mb-8 text-gray-600 list-disc pl-5">
              <li>Provide essential food, water, and medical supplies to disaster-stricken areas.</li>
              <li>Fund educational programs for children who lack access to schools.</li>
              <li>Support community-driven projects that empower women and local artisans.</li>
            </ul>
            <Link to="/campaigns" className="bg-orange-500 text-white font-bold px-8 py-3 rounded hover:bg-orange-600 transition shadow-md inline-block">
              Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Make A Difference Every Month (Orange Banner) */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 relative group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop" 
              alt="Make a difference" 
              className="rounded-xl shadow-xl w-full opacity-90 group-hover:opacity-100 transition"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaPlayCircle className="text-6xl text-white shadow-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6 leading-tight">Make A Difference<br/>Every Month</h2>
            <p className="text-orange-100 text-lg mb-8 max-w-md">
              Your monthly contribution ensures that we have sustainable funds to continue our long-term projects and help communities thrive.
            </p>
            <Link to="/campaigns" className="bg-white text-orange-600 font-bold px-8 py-3 rounded hover:bg-stone-100 transition shadow-lg inline-block">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Our Latest Blogs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Latest Blogs</h2>
          <p className="text-gray-500 mt-2">Stories and updates from our community</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              img: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop", 
              title: "How to grow your business", 
              date: "Apr 02, 2022", 
              author: "Swetha", 
              desc: "Discover the fundamental strategies that successful entrepreneurs use to scale their operations and increase revenue year over year.\n\nBuilding a business requires more than just a great idea; it demands consistent execution, understanding your target audience, and managing cash flow effectively. Our recent workshops have shown that focusing on customer retention is often more profitable than simply acquiring new leads. Join our upcoming seminar to learn advanced scaling techniques from industry experts." 
            },
            { 
              img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop", 
              title: "The impact of clean water", 
              date: "May 14, 2022", 
              author: "Keerthana", 
              desc: "Clean water changes everything. See how recent well installations in rural villages have drastically reduced disease and improved school attendance.\n\nBefore the well was installed, young girls spent up to four hours a day walking to fetch water from contaminated streams, keeping them out of the classroom. Today, not only are they back in school, but the overall health of the community has vastly improved, leading to a 40% reduction in waterborne illnesses." 
            },
            { 
              img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop", 
              title: "Volunteering changes lives", 
              date: "Jun 20, 2022", 
              author: "Devananda", 
              desc: "Our volunteers share their heartfelt stories of traveling across the country to rebuild homes and the profound joy they found in giving back.\n\nWhen we arrived at the disaster zone, the devastation was overwhelming. But over the next two weeks, seeing the community come together to lay new foundations brought an incredible sense of hope. Volunteering isn't just about giving your time; it's about connecting with humanity and realizing the profound impact one person can have on the world." 
            }
          ].map((blog, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col">
              <img src={blog.img} alt="Blog" className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>{blog.date}</span>
                  <span>by {blog.author}</span>
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">{blog.title}</h4>
                <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {blog.desc}
                </div>
                <div className="mt-auto pt-2">
                  <button 
                    onClick={(e) => openBlogModal(blog, e)} 
                    className="text-orange-600 font-bold text-sm hover:underline"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Founders Section */}
      <section className="bg-stone-100 py-20 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Meet Our Founders</h2>
          <p className="text-gray-500 mb-12">The visionaries behind our platform</p>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            {/* Reshmitha KR */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 shadow-xl border-4 border-white">
                <img 
                  src="/reshmitha.jpeg" 
                  alt="Reshmitha KR" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reshmitha KR</h3>
              <p className="text-orange-600 font-medium mb-3">Co-Founder</p>
              <a 
                href="https://www.linkedin.com/in/reshmitha-kr-3a44b2289/" 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-400 hover:text-[#0a66c2] transition"
              >
                <FaLinkedin size={28} />
              </a>
            </div>

            {/* Pavithra Rajeev */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 shadow-xl border-4 border-white">
                <img 
                  src="/pavithrafounder.jpeg" 
                  alt="Pavithra Rajeev" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pavithra Rajeev</h3>
              <p className="text-orange-600 font-medium mb-3">Co-Founder</p>
              <a 
                href="https://www.linkedin.com/in/pavithrarajeev475/" 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-400 hover:text-[#0a66c2] transition"
              >
                <FaLinkedin size={28} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">GIVEHOPE</h3>
            <p className="text-sm mb-4">
              GiveHope is a dedicated platform connecting generous donors and passionate volunteers to meaningful causes around the globe. Together, we make a lasting impact.
            </p>
            <p className="text-sm flex items-center"><span className="mr-2">📍</span> Kerala, India</p>
            <p className="text-sm flex items-center mt-2"><span className="mr-2">📞</span> +91 12345 67890</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Important Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
              <li><Link to="/campaigns" className="hover:text-orange-400">Campaigns</Link></li>
              <li><Link to="/volunteer" className="hover:text-orange-400">Volunteer</Link></li>
              <li><Link to="/login" className="hover:text-orange-400">Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-orange-400">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Social Links</h4>
            <p className="text-sm mb-4">Follow us on our social platforms</p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/_paandipada__" target="_blank" rel="noreferrer" className="bg-stone-800 p-3 rounded-full hover:bg-pink-600 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="bg-stone-800 p-3 rounded-full hover:bg-blue-600 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="bg-stone-800 p-3 rounded-full hover:bg-blue-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-800 text-sm text-center">
          <p>Copyright © {new Date().getFullYear()} GiveHope. All rights reserved.</p>
        </div>
      </footer>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeBlogModal}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80 w-full shrink-0">
              <img src={selectedBlog.img} alt={selectedBlog.title} className="w-full h-full object-cover rounded-t-xl" />
              <button 
                onClick={closeBlogModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition backdrop-blur-md"
              >
                &times;
              </button>
            </div>
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-medium tracking-wide">
                <span className="flex items-center gap-1"><span className="text-orange-500">🗓</span> {selectedBlog.date}</span>
                <span className="flex items-center gap-1"><span className="text-orange-500">✍️</span> by {selectedBlog.author}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">{selectedBlog.title}</h2>
              
              <div className="text-gray-700 leading-relaxed space-y-5 text-lg whitespace-pre-line">
                {selectedBlog.desc}
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={closeBlogModal}
                  className="bg-stone-100 text-stone-700 hover:bg-stone-200 px-6 py-2 rounded-lg font-bold transition"
                >
                  Close Article
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Home;
