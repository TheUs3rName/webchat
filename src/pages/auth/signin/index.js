import { signIn } from "@/services/httpClient";
import styles from "@/styles/Signin.module.css";
import { validateEmail, validatePassw } from "@/utils/formValidator";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function index() {
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const router = useRouter();

  const { isLoading, mutateAsync } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: signIn,
    retry: false,
  });

  const signinHandler = async () => {
    const isValidEmail = validateEmail(email);
    const isValidPassw = validatePassw(passw);

    if (!isValidEmail) {
      return toast.error("invalid email address !", { position: "top-right" });
    }

    if (!isValidPassw) {
      return toast.error("password too short !", { position: "top-right" });
    }

    const data = { email, password: passw };

    const res = await mutateAsync(data);
    if (res.status === "OK") {
      toast.success("signIn sucessfull !", { position: "top-right" });
      router.push("/profile");
    } else {
      toast.error(res.message, { position: "top-right" });
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
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
        <button onClick={signinHandler}>Signin</button>
        <p>
          Don't have account? <Link href="/auth/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default index;
