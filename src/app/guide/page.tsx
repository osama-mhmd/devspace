import { Home } from "lucide-react";

function Callout({ title, children }: { title: string; children: string }) {
  return (
    <div className="max-w-screen-md bg-cyan-600/20 p-4 rounded-md border border-cyan-600">
      <h3 className="mb-3">💡 {title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function Guide() {
  return (
    <main className="mt-20">
      <div className="max-w-screen-md flex flex-col mx-auto px-4 gap-3">
        <h2>Guide</h2>
        <p className="text-green-800 max-w-screen-md">
          Please follow this breif guide to make sure you are using the app in
          the correct way and benefiting from it
        </p>
        <p className="max-w-screen-md">
          Unlike notion and the other apps, that gives you a lot of options and
          ends up with a lot of myth. But actually we are using these apps to
          simplify our life not to make it more complex. As a result, we created
          &#34;DevSpace&#34;. It provides a:
        </p>
        <ul>
          <li>
            Clear structure: all the notes you have, have a common parent{" "}
            <code>
              <Home /> Home
            </code>
            . And any page you add it from the quick add,{" "}
            <code>with the default settings</code> it is added to the{" "}
            <code>capture</code> database, where you should filter them later.
          </li>
          <li>
            Linear and non-linear structuring: any page you create have a white
            board, where you could brainstorming your ideas.{" "}
            <span className="text-green-800">
              We maybe in the future add a non-linear view...
            </span>
          </li>
        </ul>
        <hr />
        <p>Written By Osama Mohammed - 12 Aug, 2024</p>
      </div>
    </main>
  );
}
