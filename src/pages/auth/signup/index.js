import styles from "@/styles/Form.module.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { validateEmail, validatePassw } from "@/utils/formValidator";
import { DONT_MATCH, INVALID_EMAIL, POS, SHORT_PASSW } from "@/utils/messages";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/services/httpClient";
import Loader from "@/components/module/Loader";
import { useRouter } from "next/navigation";

function index() {
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [rePassw, setRePassw] = useState("");

  const { status, mutateAsync } = useMutation({
    mutationKey: ["signUp"],
    mutationFn: signUp,
    retry: false,
  });

  const router = useRouter();

  const signupHandler = async () => {
    const isValidEmail = validateEmail(email);
    const isValidPassw = validatePassw(passw);
    const isPasswEquals = passw === rePassw;

    if (!isValidEmail) {
      return toast.error(INVALID_EMAIL, { position: POS });
    }

    if (!isPasswEquals) {
      return toast.error(DONT_MATCH, { position: POS });
    }

    if (!isValidPassw) {
      return toast.error(SHORT_PASSW, { position: POS });
    }

    const data = { email, password: passw };
    const res = await mutateAsync(data);

    if (res.status === "OK") {
      toast.success(res.message, { position: POS });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      toast.error(res.message, { position: POS });
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.main}>
        <h3>Sign up</h3>
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
        <input
          value={rePassw}
          onChange={(e) => setRePassw(e.target.value)}
          placeholder="Repeat password"
        />
        <div className={styles.button} onClick={signupHandler}>
          {status === "pending" ? <Loader /> : "Sign Up"}
        </div>
        <p>
          Already Have account? <Link href="/auth/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default index;
