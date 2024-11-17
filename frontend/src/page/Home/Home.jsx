import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import ItemCard from './components/ItemCard'
import TypeSelectBar from './components/TypeSelectBar'
import Footer from '../../components/Footer'
import Carousel from './components/Carousel'
import axios from 'axios'

const Home = () => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('all');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    const fetchProducts = async (type) => {
      setLoading(true);
      try {
        let url = 'http://localhost:9000/api/products';
        if (type && type !== 'all') {
          url = `http://localhost:9000/api/products/type/${type}`;
        }
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchProducts(selectedType);
    }, [selectedType]);
  
    const handleTypeSelect = (type) => {
      setSelectedType(type);
    };
    


    return (
      <div className='pt-24'>
        <Navbar />
        <Carousel/>
        <div className='flex flex-row mx-6 md:mx-20'>
          <div className='flex-none mx-5 hidden md:block'>
            <TypeSelectBar 
              onSelectType={handleTypeSelect}
              selectedType={selectedType}
            />
          </div>


            {/* Mobile Menu Button */}
        <div className="fixed bottom-4 right-4 md:hidden z-50">
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Danh mục sản phẩm</h3>
                <button onClick={() => setShowMobileMenu(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TypeSelectBar 
                onSelectType={(type) => {
                  handleTypeSelect(type);
                  setShowMobileMenu(false);
                }}
                selectedType={selectedType}
              />
            </div>
          </div>
        )}


          <div className='grow mx-5 px-5 py-6'>
            <div className='flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg px-5 py-2'>
              <div className='font-bold text-xl font-[Poppins] md:text-2xl'>
                {selectedType === 'all' ? 'TẤT CẢ SẢN PHẨM' : `SẢN PHẨM ${selectedType.toUpperCase()}`}
              </div>
              {loading ? (
                "Loading..."
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : products && products.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {products.map(product => (
                    <ItemCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">Không có sản phẩm nào</div>
              )}
            </div>
          </div>  
        </div>
        <Footer/>
      </div>
    );
  };
  
  export default Home;