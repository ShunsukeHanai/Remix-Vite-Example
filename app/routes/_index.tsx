import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, useActionData } from "@remix-run/react";
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/cloudflare";

import { drizzle } from "drizzle-orm/d1";
import { users } from "~/db/schema";

import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { useField } from "remix-validated-form";

// import components
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { toast } from "sonner";

interface Env {
  DB: D1Database;
}

export const userRegisterValidator = withZod(
  z.object({
    name: z.string().min(1),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
  })
);

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);

  const formData = await userRegisterValidator.validate(
    await request.formData()
  );

  if (formData.error) {
    return json({ message: `Error!` });
  }

  const { name, email } = formData.data;

  await db.insert(users).values({ name, email });
  return json({ message: `Success!` });
};

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
  const nameError = useField("name", { formId: "userForm" });
  const emailError = useField("email", { formId: "userForm" });
  const data = useActionData<typeof action>();
  if (data?.message) {
    toast(data.message);
  }
  return (
    <>
      <h1 className=" text-red-300 text-lg">HelloWorld!</h1>

      {userList.map((user) => (
        <Card className="w-[350px]" key={user.id}>
          <CardHeader>
            <CardTitle>{user.id}</CardTitle>
            <CardContent>
              <ul>
                <li>{user.name}</li>
                <li>{user.email}</li>
              </ul>
            </CardContent>
          </CardHeader>
        </Card>
      ))}

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>登録フォーム</CardTitle>
          <CardContent>
            <ValidatedForm
              id="userForm"
              validator={userRegisterValidator}
              method="POST"
            >
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" placeholder="Email" />
                {emailError?.error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{emailError.error}</AlertDescription>
                  </Alert>
                ) : (
                  <></>
                )}
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">名前</Label>
                <Input id="name" name="name" placeholder="Name" />
                {nameError?.error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{nameError.error}</AlertDescription>
                  </Alert>
                ) : (
                  <></>
                )}
              </div>
              <Button type="submit">登録</Button>
            </ValidatedForm>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}
