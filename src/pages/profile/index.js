import React from "react";

function index() {
  return <div>profile</div>;
}

export async function getServerSideProps({ req }) {
  const { cookie } = req.headers;
  console.log(cookie);
  return { props: {} };
}
export default index;
