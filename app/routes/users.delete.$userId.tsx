import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, useActionData } from "@remix-run/react";
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/cloudflare";

import { drizzle } from "drizzle-orm/d1";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";

interface Env {
  DB: D1Database;
}

export const action = async ({ context, params }: ActionFunctionArgs) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);

  await db.delete(users).where(eq(users.id, Number(params.userId)));
  return redirect("/users");
};
