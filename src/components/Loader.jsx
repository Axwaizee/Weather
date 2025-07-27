// src/components/Loader.jsx

import React from 'react';

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="w-12 h-12 rounded-full animate-spin
                    border-4 border-solid border-cyan-400 border-t-transparent"
      ></div>
    </div>
  );
}

export default Loader;