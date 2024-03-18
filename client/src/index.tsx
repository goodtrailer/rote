import "@fontsource/inter";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import * as ReactRouter from "react-router-dom";

import * as Pages from "./pages/pages.js";

const createRouter = import.meta.env["VITE_HASH_ROUTER"] === "true"
    ? ReactRouter.createHashRouter
    : ReactRouter.createBrowserRouter;

const options = import.meta.env["VITE_HASH_ROUTER"] === "true"
    ? { }
    : { basename: import.meta.env["VITE_BASE"] };

const router = createRouter([
    {
        path: "/",
        errorElement: <Pages.Error/>,
        children: [
            {
                path: "",
                element: <Pages.Root/>,
            },
            {
                path: "about",
                element: <Pages.About/>,
            },
            {
                path: "flashcardsets",
                element: <Pages.Flashcardsets.Root/>,
            },
            {
                path: "flashcardsets/:id",
                element: <Pages.Flashcardsets.Id/>,
            },
            {
                path: "flashcardsets/new",
                element: <Pages.Flashcardsets.New/>,
            },
            {
                path: "login",
                element: <Pages.Login/>,
            },
            {
                path: "logout",
                element: <Pages.Logout/>
            },
            {
                path: "signup",
                element: <Pages.Signup/>,
            },
            {
                path: "users/:id",
                element: <Pages.Users.Id/>,
            },
        ],
    }
], options);

ReactDom.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ReactRouter.RouterProvider router={router}/>
    </React.StrictMode>
);
