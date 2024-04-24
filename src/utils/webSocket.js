import { ReadyState } from "react-use-websocket";

const getReadyState = (state) => {
  const readyState = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[state];
  return readyState;
};

const ConnectionReady = (state) => getReadyState(state) === "Open";

export { getReadyState, ConnectionReady };
