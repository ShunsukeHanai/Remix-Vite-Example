import { json } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, Link, Form } from "@remix-run/react";
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/cloudflare";

import { drizzle } from "drizzle-orm/d1";
import { users } from "~/db/schema";

// import components
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";

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

export default function Users() {
  const userList = useLoaderData<typeof loader>();
  return (
    <>
      <div className="flex flex-wrap justify-center gap-5 mt-5">
        {userList.map((user) => (
          <Card className="w-[350px]" key={user.id}>
            <CardHeader>
              <CardTitle>ID:{user.id}</CardTitle>
              <CardContent>
                <ul>
                  <li>{user.name}</li>
                  <li>{user.email}</li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Form action={`edit/${user.id}`} method="GET">
                    <Button>編集</Button>
                  </Form>
                  <Form action={`delete/${user.id}`} method="POST">
                    <Button>削除</Button>
                  </Form>
                </div>
              </CardFooter>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="flex justify-center m-5">
        <Button>
          <Link to="/users/create">新規登録</Link>
        </Button>
      </div>
    </>
  );
}
