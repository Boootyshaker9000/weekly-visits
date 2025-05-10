import "bootstrap/dist/css/bootstrap.min.css";
import WeeklyChart from "./WeeklyChart.tsx";

export default function App() {

    return (
        <>
            <h1 className="text-center mb-4">Monitoring průchodů</h1>
            <WeeklyChart />
        </>
    )
}
