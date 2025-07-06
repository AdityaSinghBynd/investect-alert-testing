import React from 'react'

export default function Home() {
  return (
    <main className='flex bg-[#eaf0fc] min-h-screen w-full'>
      <div className="w-full bg-[#FFFFFFCC] m-3 rounded-lg py-3 px-6 shadow-custom-blue-left">
        <div className="max-w-2xl mx-auto my-20 w-full flex flex-col gap-8 items-center justify-center">

          <h1 className="text-2xl font-medium text-[#001742]">Morning Aditya, Here Are Your Recent Deliveries</h1>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium text-[#001742]">No deliveries found</h2>
          </div>

        </div>
      </div>
    </main>
  );
}
