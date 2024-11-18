import { useState, useRef, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    let [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    let Links = [
        {name:"TRANG CHỦ",link:"/"},
        {name:"SẢN PHẨM",link:"/"},
        {name:"VỀ CHÚNG TÔI",link:"/"},
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setDropdownOpen(false);
    };

    return (
        <div className="shadow-md w-full absolute top-0 left-0">
            <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
                <div className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-gray-800">
                    <span className="text-3xl text-indigo-600 mr-1 pt-2">
                        <ion-icon name="laptop-outline"></ion-icon>
                    </span>
                    IT Shop
                </div>
                <div onClick={()=>setOpen(!open)} className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden">
                    <ion-icon name={open ? 'close':'menu'}></ion-icon>
                </div>
                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static
                    bg-white md:z-auto z-50 left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in 
                    ${open ? 'top-20 opacity-100':'top-[-490px]'}`}>
                    {
                        Links.map((link)=>(
                            <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
                                <Link to={link.link} className="text-gray-800 hover:text-gray-400 duration-500">
                                    {link.name}
                                </Link>
                            </li>
                        ))
                    }
                    
                    

                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 text-xl text-gray-800 hover:text-gray-400 md:ml-8"
                            >
                                <FaUserCircle className="w-6 h-6" />
                                <span>{user.username}</span>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50
                                    ${open ? 'relative w-full md:absolute md:w-48' : ''}`}>
                                    <div className="px-4 py-2 text-xl text-gray-500 border-b">
                                        Xin chào, {user.username}
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-xl text-gray-800 hover:bg-gray-100"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            setOpen(false);
                                        }}
                                    >
                                        Thông tin cá nhân
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-2 text-xl text-gray-800 hover:bg-gray-100"
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                setOpen(false);
                                            }}
                                        >
                                            Quản trị
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-xl text-red-600 hover:bg-gray-100"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="md:ml-8 text-xl text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;