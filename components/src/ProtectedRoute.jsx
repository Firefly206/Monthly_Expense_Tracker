import {Navigate, useLocation} from "react-router-dom";
import { loadSettings } from "./settings";

export function ProtectedRoute({children}) {

    const hasSettings = loadSettings();
    const location = useLocation();

    if (!hasSettings){
        {/**If settings are not loaded, navigate back to the lobby and change the state from the current location pathname to a different one (/home)*/}
        return <Navigate to="/home" state={{from: location.pathname}} replace/>;
    } {/**Else, go to the directed pathway and load their elements */}
    return children;
}