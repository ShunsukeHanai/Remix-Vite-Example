import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function Index() {
  return (
    <>
      <h1 className=" text-primary text-lg">Remix+Vite Example</h1>
      <Link to="/users">
        <Button>ユーザー一覧</Button>
      </Link>
    </>
  );
}
