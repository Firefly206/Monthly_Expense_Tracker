import "../../styles.css";
import { Navigation } from "../Navigation";
import {Outlet} from "react-router-dom";
import { loadSettings } from "../settings";

export function HomePage () {
    //Theme Toggle

    const settings = loadSettings();
    return (
        <main>
            <header>
                {settings && settings.name && (
                    <h2>Welcome, {settings.name}</h2>
                )}
            </header>
            <Navigation/>
            <Outlet/>
        </main>
    );
}