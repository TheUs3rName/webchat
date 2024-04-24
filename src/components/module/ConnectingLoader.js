import React from "react";

import { RotatingLines } from "react-loader-spinner";

function ConnectingLoader() {
  return (
    <RotatingLines
      visible={true}
      height="100"
      width="100"
      color="#fcfcfc"
      strokeColor="#fcfcfc"
      strokeWidth="5"
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}

export default ConnectingLoader;
