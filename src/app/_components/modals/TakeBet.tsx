import React from 'react'

const TakeBetModal = () => {
  return (
    <div className='bg-[#D32F2F] rounded-2xl p-6'>
        <h3 className='text-center text-xl font-bold text-white'>Do you confirm this bet?</h3>
        <hr className='border-1 border-[#D32F2F] mt-2 mx-4' />
        <div className='flex items-center justify-between text-white mt-4 gap-4'>
            <button className='bg-transparent border border-white text-white rounded-full p-2 w-full'>No</button>
            <button className='bg-white text-[#D32F2F] rounded-full p-2 w-full'>Yes</button>
        </div>
    </div>
  )
}

export default TakeBetModal