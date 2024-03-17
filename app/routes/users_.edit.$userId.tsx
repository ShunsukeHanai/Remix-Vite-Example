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
import { ValidatedForm } from "remix-validated-form";

// import components
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { InputValidation } from "~/components/InputValidation";
import { eq } from "drizzle-orm";

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

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, Number(params.userId)))
    .get();
  if (!user) throw new Response("", { status: 404 });
  return json(user);
};

export const action = async ({
  context,
  request,
  params,
}: ActionFunctionArgs) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);

  const formData = await userRegisterValidator.validate(
    await request.formData()
  );

  if (formData.error) {
    return json({ message: `Error!` });
  }

  const { name, email } = formData.data;

  await db
    .update(users)
    .set({ name, email })
    .where(eq(users.id, Number(params.userId)));
  return redirect("/users");
};

export default function Edit() {
  const userData = useLoaderData<typeof loader>();
  return (
    <div className="flex justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>編集フォーム</CardTitle>
          <CardContent>
            <ValidatedForm
              id="userForm"
              validator={userRegisterValidator}
              method="POST"
            >
              <div className="grid w-full max-w-sm items-center gap-4">
                <InputValidation
                  name="email"
                  defaultValue={userData.email}
                  placeholder="Email"
                />
                <InputValidation
                  name="name"
                  defaultValue={userData.name}
                  placeholder="Name"
                />
                <Button type="submit">更新</Button>
              </div>
            </ValidatedForm>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
