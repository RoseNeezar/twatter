import React from "react";

const LoadingPage = () => {
  return (
    <div className="grid w-full grid-flow-col gap-10 mt-10 overflow-hidden auto-cols-fr">
      <div className="w-full max-w-sm p-4 mx-auto border rounded-md shadow h-28 border-dark-third">
        <div className="flex space-x-4 animate-pulse">
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 rounded bg-dark-third"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-dark-third"></div>
              <div className="w-5/6 h-4 rounded bg-dark-third"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-sm p-4 mx-auto border rounded-md shadow h-28 border-dark-third">
        <div className="flex space-x-4 animate-pulse">
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 rounded bg-dark-third"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-dark-third"></div>
              <div className="w-5/6 h-4 rounded bg-dark-third"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-sm p-4 mx-auto border rounded-md shadow h-28 border-dark-third">
        <div className="flex space-x-4 animate-pulse">
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 rounded bg-dark-third"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-dark-third"></div>
              <div className="w-5/6 h-4 rounded bg-dark-third"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-sm p-4 mx-auto border rounded-md shadow h-28 border-dark-third">
        <div className="flex space-x-4 animate-pulse">
          <div className="flex-1 py-1 space-y-4">
            <div className="w-3/4 h-4 rounded bg-dark-third"></div>
            <div className="space-y-2">
              <div className="h-4 rounded bg-dark-third"></div>
              <div className="w-5/6 h-4 rounded bg-dark-third"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
