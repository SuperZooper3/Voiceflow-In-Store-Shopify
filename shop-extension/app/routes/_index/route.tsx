import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({ showForm: Boolean(login) });
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Voiceflow-In-Store for Shopify</h1>
        <p className={styles.text}>
          Connect your Voiceflow Agent to your Store to enable AI driven contextual conversations.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Connect with Voiceflow</strong>. Connect with the best customizable platform for building conversational AI agents.
          </li>
          <li>
            <strong>Get context specific answers</strong>. Give your AI agent context of where it is on the website for more accurate answers and seamless conversations.
          </li>
          <li>
            <strong>Custom buttons</strong>. Built in Add to Cart buttons that your agent can serve to drive sales.
          </li>
        </ul>
      </div>
    </div>
  );
}
