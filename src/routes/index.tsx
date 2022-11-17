import { A, useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { getUser, logout } from "~/db/session";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });
}

export default function Home() {
  const user = useRouteData<typeof routeData>();
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );

  return (
    <main class="w-full p-4 space-y-2">
      <h1 class="font-bold text-3xl">Hello {user()?.username}</h1>
      <h3 class="font-bold text-xl">Message board</h3>
      <Form>
        <button name="logout" type="submit">
          Logout
        </button>
      </Form>
      <hr />
      <a href="/login">&#60;a&#62; link to /login</a>
      <p>
        Hitting /login should trigger the redirect back right away. But the
        redirect doesn't get triggered if the useRouteData ressource isn't being
        used. This is the same result if I just navigate to /login in the
        browser.
      </p>
      <A href="/login">&#60;A&#62; link to /login</A>
      <p>
        This one flashes the /login page for a second but does eventually
        redirect back. Is there not a way for me to avoid rendering the
        component in the first place?
      </p>
    </main>
  );
}
