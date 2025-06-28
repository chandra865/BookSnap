import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-solid"></div>
      <span className="ml-4 text-blue-600 font-medium text-lg">Loading...</span>
    </div>
  );
};

export default Loading;
