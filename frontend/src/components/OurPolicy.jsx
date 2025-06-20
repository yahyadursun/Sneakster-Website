import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700 montserrat'>
      <div>
  <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
  <p className='montserrat-bold'>Kolay Değişim Politikası</p>
  <p className='text-gray-400 montserrat'>Sorunsuz değişim politikası sunuyoruz</p>
</div>
<div>
  <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
  <p className='montserrat-bold'>7 Gün İade Politikası</p>
  <p className='text-gray-400 montserrat'>7 gün içerisinde ücretsiz iade politikası sağlıyoruz</p>
</div>
<div>
  <img src={assets.support_icon} className='w-12 m-auto mb-5' alt="" />
  <p className='montserrat-bold'>En İyi Müşteri Desteği</p>
  <p className='text-gray-400 montserrat'>7/24 müşteri desteği sağlıyoruz</p>
</div>

    </div>
  )
}

export default OurPolicy
