import "@fontsource/inter";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import * as ReactRouter from "react-router-dom";

import * as Pages from "./pages/pages.js";

const router = ReactRouter.createBrowserRouter([
    {
        path: "/",
        element: <Pages.Root />,
        errorElement: <Pages.Error/>
    }
]);

ReactDom.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ReactRouter.RouterProvider router={router}/>
    </React.StrictMode>
);
