import Loader from "@/components/module/Loader";
import { createChat } from "@/services/httpClient";
import styles from "@/styles/Form.module.css";
import { validateName } from "@/utils/formValidator";
import {
  CREATE_CHAT_SUCCESS,
  INVALID_NAME,
  POS,
  UNKNOWN_ERROR,
} from "@/utils/messages";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addOneChat } from "@/redux/chatSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getCookies } from "@/utils/cookies";

function newChat() {
  const [name, setName] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, mutateAsync } = useMutation({
    mutationKey: ["createChat"],
    mutationFn: createChat,
  });

  const createHandler = async () => {
    if (!validateName(name)) {
      return toast.error(INVALID_NAME, { position: POS });
    }

    const res = await mutateAsync({ name });

    if (res.status === "OK") {
      toast.success(CREATE_CHAT_SUCCESS, { position: POS });
      setTimeout(() => {
        dispatch(addOneChat(res));
        router.push(`/chats/${res._id}`);
      }, 1000);
    } else {
      return toast.error(UNKNOWN_ERROR, { position: POS });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>Create new chat</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Chat name"
        />
        <div className={styles.button} onClick={createHandler}>
          {status === "pending" ? <Loader /> : "Create now !"}
        </div>
      </div>
    </div>
  );
}

export default newChat;
export async function getServerSideProps({ req }) {
  const { token } = getCookies(req);
  if (!token) {
    return { redirect: { destination: "/auth/signin", permenant: false } };
  }
  return { props: { token } };
}
