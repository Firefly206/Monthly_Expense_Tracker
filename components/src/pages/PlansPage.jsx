import "../../styles.css";
import { Link } from "react-router-dom";
import {useSearchParams} from "react-router-dom";

export function PlanPage() {
    const [params, setParms] = useSearchParams();
    const search = (params.get("search") || "").toLowerCase();
    const plans = [
        {
            key: "monthly",
            name: "Monthly Plans",
            description: "Get started by creating a monthly budgeting plan!"
        },
        {
            key: "daily",
            name: "Daily Plans",
            description: "Get started by creating a daily budgeting plan!"
        },
        {
            key: "weekly",
            name: "Weekly Plans",
            description: "Get started by creating a weekly budgeting plan!"
        }
    ];


const filterPlans = plans.filter((plan) => (!search) || plan.name.toLowerCase().includes(search));
    return (
        <section>
            <div>
                <h2>Available Plans</h2>
                <p>Pick a plan:</p>
                <input 
                    id="plan-search"
                    type="text"
                    placeholder="Search for plan..."
                    value={search}
                    onChange={(event) => {
                        const value = event.target.value;
                        if (value.trim() === "") {
                            setParms({});
                        } else {
                            setParms({search: value});
                        }
                    }} />
                <ul style={{textAlign: "left"}}>
                    {filterPlans.map((plan) => (
                        <li key={plan.key}>
                            <Link to={`plans/${plan.key}`}>{plan.name}</Link>
                            <p>{plan.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
        
    )
}