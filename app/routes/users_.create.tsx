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
import { InputValidation } from "~/components/InputValidation";
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
  return redirect("/users");
};

export default function Create() {
  const data = useActionData<typeof action>();
  if (data?.message) {
    toast(data.message);
  }
  return (
    <div className="flex justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>登録フォーム</CardTitle>
          <CardContent>
            <ValidatedForm
              id="userForm"
              validator={userRegisterValidator}
              method="POST"
            >
              <div className="grid w-full max-w-sm items-center gap-4">
                <InputValidation name="email" placeholder="Email" />
                <InputValidation name="name" placeholder="Name" />
                <Button type="submit">登録</Button>
              </div>
            </ValidatedForm>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
