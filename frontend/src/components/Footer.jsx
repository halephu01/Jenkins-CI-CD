import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-gray-800 px-4 md:px-16 lg:px-28 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h2 className='text-lg font-bold mb-4 text-white'>
                Về chúng tôi
              </h2>
              <p className='text-gray-300'>
              Chúng tôi là đội ngũ luôn hướng tới chất lượng của sản phầm và dịch vụ tới khách hàng
              </p>  
            </div>

            <div>
              <h2 className='text-lg font-bold mb-4 text-white'>
                Địa chỉ 
              </h2>
              <p className='text-gray-300'>
                Ký túc xá khu B, ĐHQG.TPHCM
              </p>  
            </div>

            <div>
              <h2 className='text-lg font-bold mb-4 text-white'>Thông tin liên hệ</h2>
              <ul className='flex space-x-4'>
                <li>
                  <FaFacebook className='text-blue-500'/>
                  <a href="#" className='hover:underline text-gray-300'>Facebook</a>
                </li>
                <li>
                  <FaInstagram className='text-orange-500'/>
                  <a href="#" className='hover:underline text-gray-300'>Instagram</a>
                </li>
                <li>
                  <FaTwitter className='text-sky-500'/>
                  <a href="#" className='hover:underline text-gray-300'>Twitter</a>
                </li>
              </ul>
            </div>

        </div>

        <div className='border-gray-600 border-t pt-6 text-center mt-6 text-white'>
              <p>&copy; Code by Amiby. All Rights Reserved </p>
        </div>

    </footer>
  )
}

export default Footer