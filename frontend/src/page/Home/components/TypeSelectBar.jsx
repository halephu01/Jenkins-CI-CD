import React from 'react'

let Links = [
    {name:"Laptop", type :"laptop", img_src:"https://lh3.googleusercontent.com/lFZZtBMUqkbl9qKKUe3DSmHqpb62UjWrOkxqcJ6lN3yM83Wg2Irp-ZlvkUwGO6TMcsscLELMZa_lN9jo8tKteWsCzmUii7po=rw"},
    {name:"PC - Máy tính bàn", type : "pc", img_src:"https://lh3.googleusercontent.com/Y7KEp2iUC1syVaF1SQuQ8ZPCLu8PVhCKqadoVKlI8ON-vKqxyvi0EbgM00Ky8Zb_wIcl9Q8HTLZkQj_MuTzqyJhGuLJz8mFTqw=rw"},
    {name:"Màn hình máy tính", type: "monitor",img_src:"https://lh3.googleusercontent.com/1rbqboPNTH2Gyx3dS28kewywgX0ovZAZHBcstS4KjeJO8j6Qc6Kn19xJH0XpaiqCAj4a-xf_EeAZjlARKaI9mQNBhlHDp6o=rw"},
    {name:"Linh kiện máy tính", type: "pc-components", img_src:"https://lh3.googleusercontent.com/0V32ezrE3Bn6r_lmv4YIyS7Y4QnfVAcjTQ8XjR-86cP_mAtiIzOPsWeEni-MpEklbR5jIfJvtXgD6K-eWhlO7sLsgbxBwsHduQ=rw"},
    {name:"Phụ kiện máy tính",  type: "pc-accessories", img_src:"https://lh3.googleusercontent.com/JuVFuLJ2OmqyEO2mtZ0kJTWvACpFkXE_765ihiBIu8WQoHlS-jYXY8zsXDpZUBk26NqRulJ9U_u3DxLcBTxpPGY7n1uzGdKAuA=rw"},
    {name:"Gaming Gear", type: "gear", img_src:"https://lh3.googleusercontent.com/b21Jd_BPFXamC23rOxJObOlXs9_Pf_CEYTDXiTcHRyamqel7iPvo8TJXYfSy3zinuO9GCrPZPBtNon3aDmCESEcqlYlYO1HR=rw"},
    {name:"Điện thoại", type: "phone",img_src:"https://lh3.googleusercontent.com/dkzFFaKYmPLLkPnC-cyefC1u1Qh0Iy_6Loz7adsbIMs-KAK8FA_PwUOklM3gEppESc1uSeaTa63U4Vejifo=rw"},
    {name:"Phụ kiện điện thoại", type: "phone-accessories", img_src:"https://lh3.googleusercontent.com/slg-pspnUXN25zVZdp_qRMwaTIj008i3gckyGvSYLepffuJZIHNvVo7unNfzkCJZdJw0Om4vMTDttW9z1LZ8ojgVerpfxxM=rw"},
    {name:"Thiết bị âm thanh", type: "audio", img_src:"https://lh3.googleusercontent.com/5H5fwM3O8jhVpnNCQziLVok28E6e1c8hT3579MXy3UD4YxKBv7ybyGeRzYrFrPoqvXe20fGGD2wndnDx9EwO_B6yy4kErU8KUw=rw"},
];

const TypeSelectBar = ({ onSelectType, selectedType }) => {
  return (
    <div className='flex flex-col gap-4'>
      {Links.map((link, index) => (
        <div
          key={index}
          className={`flex items-center gap-4 cursor-pointer p-2 rounded-lg transition-all duration-300
            ${selectedType === link.name.toLowerCase() 
              ? 'bg-indigo-100 text-indigo-600' 
              : 'hover:bg-gray-100'
            }`}
          onClick={() => onSelectType(link.type)}
        >
          <img 
            src={link.img_src} 
            alt={link.name} 
            className='w-12 h-12 object-cover rounded-lg' 
          />
          <span className={`${
            selectedType === link.name.toLowerCase() 
              ? 'font-semibold' 
              : 'text-gray-700'
          }`}>
            {link.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TypeSelectBar;
