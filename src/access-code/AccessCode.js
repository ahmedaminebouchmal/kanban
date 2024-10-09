import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Key } from 'lucide-react';

const AccessCode = ({ onAccessGranted }) => {
   const [code, setCode] = useState('');
   const [message, setMessage] = useState('');
   const [loading, setLoading] = useState(false);
   const [typedName, setTypedName] = useState('');
   const [showCursor, setShowCursor] = useState(true);
   const fullName = "Ahmed Amine Bouchmal";

   useEffect(() => {
      let timer;
      let index = 0;
      let isDeleting = false;
      let pauseCounter = 0;

      const typeAndDelete = () => {
         if (pauseCounter > 0) {
            pauseCounter--;
            timer = setTimeout(typeAndDelete, 1000); // Continue the pause
            return;
         }

         if (!isDeleting && index <= fullName.length) {
            setTypedName(fullName.slice(0, index));
            index++;
            if (index > fullName.length) {
               pauseCounter = 5; // Set 5-second pause when fully typed
               isDeleting = true;
            }
         } else if (isDeleting && index >= 0) {
            setTypedName(fullName.slice(0, index));
            index--;
            if (index < 0) {
               pauseCounter = 5; // Set 5-second pause when fully deleted
               isDeleting = false;
            }
         }

         timer = setTimeout(typeAndDelete, pauseCounter > 0 ? 1000 : (isDeleting ? 100 : 150));
      };

      typeAndDelete();

      // Cursor blinking effect
      const cursorInterval = setInterval(() => {
         setShowCursor(prev => !prev);
      }, 530);

      return () => {
         clearTimeout(timer);
         clearInterval(cursorInterval);
      };
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         await new Promise(resolve => setTimeout(resolve, 1500));
         const accessCode = process.env.REACT_APP_ACCESS_CODE;
         if (code === accessCode) {
            setLoading(false);
            setMessage('Access granted! Redirecting...');
            onAccessGranted();
         } else {
            setLoading(false);
            setMessage('Invalid access code. Please try again.');
         }
      } catch (error) {
         setLoading(false);
         setMessage('Something went wrong. Please try again.');
      }
   };

   return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 text-white p-4">
         <div className="mb-12 mt-8 text-center">
            <h1 className="text-5xl font-bold mb-4 text-yellow-300 shadow-text">
               {typedName}
               <span className={`inline-block w-0.5 h-12 bg-yellow-300 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            </h1>
            <p className="text-lg italic text-gray-200">Full Stack Projectmanager</p>
         </div>
         
         <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl text-white">
            <div className="flex items-center justify-center mb-6">
               {loading ? <Unlock className="w-12 h-12 text-yellow-300 animate-pulse" /> : <Lock className="w-12 h-12 text-yellow-300" />}
            </div>
            <h3 className="text-2xl font-bold mb-6 text-center">Enter Access Code</h3>
            <form onSubmit={handleSubmit}>
               <div className="relative">
                  <Key className="absolute top-4 left-3 w-6 h-6 text-gray-300" />
                  <input
                     type="text"
                     value={code}
                     onChange={(e) => setCode(e.target.value)}
                     placeholder="Enter 12-digit access code"
                     className="w-full p-4 pl-12 bg-white bg-opacity-20 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-300"
                  />
               </div>
               <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center"
                  disabled={loading}
               >
                  {loading ? (
                     <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-gray-800" fill="none" viewBox="0 0 24 24">
                           <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                           ></circle>
                           <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                           ></path>
                        </svg>
                        Verifying...
                     </>
                  ) : (
                     'Unlock Access'
                  )}
               </button>
            </form>
         </div>
         {message && (
            <p className={`mt-4 text-lg ${message.includes('granted') ? 'text-green-300' : 'text-red-300'} bg-black bg-opacity-30 px-4 py-2 rounded-full`}>
               {message}
            </p>
         )}
      </div>
   );
};

export default AccessCode;