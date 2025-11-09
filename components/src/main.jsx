import { createRoot } from "react-dom/client";
import App from "./App";
import { StrictMode } from "react";
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePageLayout.jsx";
import { PlanPage } from "./pages/PlansPage.jsx";
import { TransactionsPage } from "./App";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { MonthlyPlans } from "./pages/MonthlyPlans.jsx";
import { DailyPlans } from "./pages/DailyPlans.jsx";
import { BudgetPage } from "./pages/BudgetPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />, //Could change to login/signup page or get started page
        children: [
            {   path: "/plans", 
                element: <PlanPage/>,
                children: [
                    {path: "/plans/monthly", element: <MonthlyPlans/>},
                    {path: "/plans/daily", element: <DailyPlans/>}
                ]
            },
            {
                path: "/transactions", 
                element: (
                <ProtectedRoute>
                    <TransactionsPage/>
                </ProtectedRoute>
                ),
            },
            {
                path: "/budget",
                element: (
                    <ProtectedRoute>
                        <BudgetPage/>
                    </ProtectedRoute>
                )
            }

        ]
        

}])

const root = createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>
);
root.render(<App />);
