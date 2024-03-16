import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

import { drizzle } from "drizzle-orm/d1";
import { users } from "~/db/schema";

// import components
import { Button } from "~/components/ui/button";

interface Env {
  DB: D1Database;
}

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);
  const userList = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users);
  if (!userList) throw new Response("", { status: 404 });
  return json(userList);
};

export default function Index() {
  const userList = useLoaderData<typeof loader>();
  return (
    <>
      <h1 className=" text-red-300 text-lg">HelloWorld!</h1>
      <Button>TEST</Button>
      <ul>
        {userList.map((user) => (
          <li key={user.id}>
            {user.name},{user.email}
          </li>
        ))}
      </ul>
      <p className="text-black"></p>
    </>
  );
}
