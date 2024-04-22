import Layout from "@/components/layout/Layout";
import store from "@/redux/store";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });
const client = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <>
      <div className={inter.className}>
        <QueryClientProvider client={client}>
          <Provider store={store}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </QueryClientProvider>
      </div>
    </>
  );
}
