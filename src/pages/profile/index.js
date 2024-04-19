import { whoAmI } from "@/services/httpClient";
import { getCookies } from "@/utils/cookies";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function index({ token }) {
  const { isLoading, data } = useQuery({
    queryKey: ["whoAmI"],
    queryFn: whoAmI,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return <div>profile</div>;
}

export async function getServerSideProps({ req }) {
  const { token } = getCookies(req);
  if (!token)
    return { redirect: { destination: "/auth/signin", permenant: false } };
  return { props: { token } };
}

export default index;
