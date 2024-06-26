import Loader from "@/components/module/Loader";
import { signIn } from "@/services/httpClient";
import styles from "@/styles/Form.module.css";
import { getCookies } from "@/utils/cookies";
import { validateEmail, validatePassw } from "@/utils/formValidator";
import {
  INVALID_EMAIL,
  POS,
  SHORT_PASSW,
  SIGNIN_SUCCESS,
} from "@/utils/messages";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function index() {
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const router = useRouter();

  const { status, mutateAsync } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: signIn,
    retry: false,
  });

  const signinHandler = async () => {
    const isValidEmail = validateEmail(email);
    const isValidPassw = validatePassw(passw);

    if (!isValidEmail) {
      return toast.error(INVALID_EMAIL, { position: POS });
    }

    if (!isValidPassw) {
      return toast.error(SHORT_PASSW, { position: POS });
    }

    const data = { email, password: passw };
    const res = await mutateAsync(data);

    if (res.status === "OK") {
      toast.success(SIGNIN_SUCCESS, { position: POS });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      toast.error(res.message, { position: POS });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>Sign in</h3>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={passw}
          onChange={(e) => setPassw(e.target.value)}
          placeholder="Password"
        />
        <div className={styles.button} onClick={signinHandler}>
          {status === "pending" ? <Loader /> : "Sign In"}
        </div>
        <p>
          Don't have account? <Link href="/auth/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = getCookies(req);
  if (token) {
    return { redirect: { destination: "/", permenant: false } };
  }
  return { props: {} };
}
export default index;
