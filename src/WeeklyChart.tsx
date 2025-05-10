import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import { ChartData, ChartDataset, ChartOptions } from "chart.js";

interface Visit {
    date: string;
    count: number;
}
interface WeeklyData {
    visits: Visit[];
}

export default function WeeklyChart() {
    const [chartData, setChartData] = useState<ChartData<"line", number[], string>>({
        labels: [],
        datasets: [],
    });
    const [darkMode, setDarkMode] = useState<boolean>(false);

    // Detekce dark mode z browser preference (třída na <html> nebo <body>)
    useEffect(() => {
        const handleThemeChange = () => {
            const isDark = document.documentElement.classList.contains("dark-mode");
            setDarkMode(isDark);
        };
        // Počáteční nastavení
        handleThemeChange();
        // Sledujeme změny třídy na <html>
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    // Načtení dat z API
    useEffect(() => {
        const apiUrl = "localhost:5000/api/weekly-visits";
        axios
            .get<WeeklyData>(apiUrl)
            .then((response) => {
                const visits = response.data.visits;
                if (!Array.isArray(visits) || visits.length === 0) {
                    console.warn("Žádná data k vykreslení!");
                    return;
                }
                const labels = visits.map((v) => v.date);
                const data = visits.map((v) => v.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Počet průchodů",
                            data,
                            borderColor: darkMode ? "rgba(255,205,86,1)" : "rgba(75,192,192,1)",
                            backgroundColor: darkMode ? "rgba(255,205,86,0.2)" : "rgba(75,192,192,0.2)",
                            tension: 0.2,
                        } as ChartDataset<"line", number[]>,
                    ],
                });
            })
            .catch((error) => console.error("Chyba při načítání dat:", error));
    }, [darkMode]);

    // Konfigurace Chart.js options
    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { left: 20, right: 20 },
        },
        scales: {
            x: {
                offset: true,
                ticks: {
                    padding: 10,
                    color: darkMode ? "#f0f0f0" : "#b4b4b4",
                },
                grid: {
                    color: darkMode ? "rgba(255,255,255,0.84)" : "rgba(201,201,201,0.48)",
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: darkMode ? "#f0f0f0" : "#b4b4b4",
                },
                grid: {
                    color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(201,201,201,0.48)",
                },
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <Card
            bg={darkMode ? "dark" : "light"}
            text={darkMode ? "light" : "dark"}
            style={{ width: "60%", margin: "2rem auto" }}
        >
            <Card.Body>
                <h2 className="text-center mb-4">Týdenní statistika průchodů</h2>
                <div style={{ height: 400 }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </Card.Body>
        </Card>
    );
}
