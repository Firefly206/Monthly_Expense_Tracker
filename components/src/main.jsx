import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePageLayout";
import { PlanPage } from "./pages/PlansPage";
import { TransactionsPage } from "./App";
import { ProtectedRoute } from "./ProtectedRoute";
import { MonthlyPlans } from "./pages/MonthlyPlans";
import { DailyPlans } from "./pages/DailyPlans";
import { BudgetPage } from "./pages/BudgetPage";
import DatabaseProvider from "./providers/DatabaseProvider";

// Create a weekly plans component
function WeeklyPlans() {
    return <h2>Weekly Plans:</h2>;
}

// Create a placeholder for the Create page
function CreatePage() {
    return (
        <div className="content">
            <h2>Create New Entry</h2>
            <p>This page will allow you to create new transactions.</p>
        </div>
    );
}

// Home content component
function HomeContent() {
    return (
        <div className="content">
            <h2>Welcome to Monthly Expense Tracker</h2>
            <p>Track your finances with ease. Use the navigation above to get started.</p>
        </div>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <div>
            <h1>Oops! Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go back home</a>
        </div>,
        children: [
            {
                index: true,
                element: <HomeContent />
            },
            {   
                path: "plans", 
                element: <PlanPage />,
                children: [
                    {
                        path: "monthly", 
                        element: <MonthlyPlans />
                    },
                    {
                        path: "daily", 
                        element: <DailyPlans />
                    },
                    {
                        path: "weekly", 
                        element: <WeeklyPlans />
                    }
                ]
            },
            {
                path: "transactions", 
                element: (
                    <ProtectedRoute>
                        <DatabaseProvider>
                            <TransactionsPage />
                        </DatabaseProvider>
                    </ProtectedRoute>
                ),
            },
            {
                path: "budget",
                element: (
                    <ProtectedRoute>
                        <BudgetPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "create",
                element: (
                    <ProtectedRoute>
                        <CreatePage />
                    </ProtectedRoute>
                )
            }
        ]
    }
]);

const root = createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);