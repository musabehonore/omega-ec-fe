'user client';
import React from 'react';

function chatHeader({ typingStatus }: { typingStatus: string }) {
  return (
    <div className="sm:p-8 p-2">
      <div className="flex gap-3  items-center rounded-md absolute bg-white w-[80%] top-[74px] py-3">
        {/* <Image width={40} height={40} alt="logo" src={unknown} /> */}
        <h1 className="text-xl font-bold">community chat</h1>
      </div>
      {typingStatus !== '' && (
        <div className=" flex items-center justify-center mt-4">
          <small className="bg-main-200 px-2 py-1 rounded-lg">
            {typingStatus}
          </small>
        </div>
      )}
    </div>
  );
}

export default chatHeader;
