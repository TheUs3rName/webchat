import { whoAmI } from "@/services/httpClient";
import { getCookies } from "@/utils/cookies";
import { useQuery } from "@tanstack/react-query";
import styles from "@/styles/Profile.module.css";
import { MdAccountCircle } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { MdDateRange } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";

function index({ whoami }) {
  const { isLoading, data } = useQuery({
    queryKey: ["whoAmI"],
    queryFn: whoAmI,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className={styles.container}>
      <h3>Personal information</h3>
      <div className={styles.section}>
        <div className={styles.info}>
          <span>
            <MdAccountCircle />
            <p>name: {whoami.name ? whoami.name : "not set"}</p>
          </span>
          <CiEdit />
        </div>
        <div className={styles.info}>
          <span>
            <HiOutlineMail />
            <p>email: {whoami.email}</p>
          </span>
          <CiEdit />
        </div>
        <div className={styles.info}>
          <span>
            <MdDateRange />
            <p>{new Date(+whoami.created_at * 1000).toUTCString()}</p>
          </span>
        </div>
        <div className={styles.info}>
          <span>
            <GrContactInfo />
            <p>bio :</p>
            <br />
            <textarea></textarea>
          </span>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = getCookies(req);
  if (!token)
    return { redirect: { destination: "/auth/signin", permenant: false } };
  const whoami = await whoAmI(token);
  return { props: { token, whoami } };
}

export default index;
