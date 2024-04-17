import { ThreeDots } from "react-loader-spinner";

function Loader() {
  return (
    <div>
      <ThreeDots
        visible={true}
        height="10"
        width="80"
        color="#1E1F2B"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default Loader;
