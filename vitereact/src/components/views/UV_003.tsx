import React from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'react'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

interface LoadingStateIndicatorProps {
  message?: string;
}

const UV_003: React.FC<LoadingStateIndicatorProps> = ({ message = '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Searching for your perfect watch...'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen bg-white dark:bg-gray-900"
    >
      <div className="mb-4">
        <div
          className="inline-block animate-spin rounded-full border-4 border-tourmaline-500 border-solid h-12 w-12"
          role="status"
          aria-live="polite"
          aria-label="Loading recommendation"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
        </div>
      </div>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        {message}
      </p>
    </div>
  );
};

export default UV_003;







