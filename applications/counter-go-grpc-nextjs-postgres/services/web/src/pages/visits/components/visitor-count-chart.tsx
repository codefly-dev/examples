import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import CountUp from "react-countup";
import { useCodeflyContext } from "../../providers/codefly.provider";

const VisitorCountChart = ({ shouldYearShow = false, width = '400px', height = '100px' }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const [startCounting, setStartCounting] = useState(false);
  const [visitorVisits, setVisitorVisits] = useState([]);
  const [totalVisits, setTotalVisits] = useState();

  const { routing } = useCodeflyContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = routing("GET", "counter-go-grpc-nextjs-postgres/backend", "/visit/statistics")
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const visitorData = await response.json();
        setVisitorVisits(visitorData.visits);
        setTotalVisits(visitorData.totalVisits);
        setStartCounting(true);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (ctx && visitorVisits && visitorVisits.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: visitorVisits.map((entry) =>
            formatDate(entry.date, shouldYearShow)
          ),
          datasets: [
            {
              label: "Visitor Count",
              data: visitorVisits.map((entry) => entry.visits),
              fill: false,
              borderColor: "rgba(54, 162, 235, 1)",
              tension: 0.1,
            },
          ],
        },
        options: {
          animations: {
            tension: {
              duration: 2600,
              easing: "easeInCubic",
              from: 1,
              to: 0,
              loop: true,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [visitorVisits, shouldYearShow]);

  const formatDate = (dateString, shouldShowYear) => {
    const date = new Date(dateString);
    if (shouldShowYear) {
      return date.toLocaleDateString();
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "2-digit",
      });
    }
  };

  return (
    <div className="mt-5 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold  text-blue-600">Total Visitors</h3>
        <div className="flex items-center">
          <CountUp
            start={startCounting ? 0 : undefined}
            end={totalVisits}
            duration={3}
            separator=","
            className="text-2xl font-bold text-blue-600 mr-2"
          />
          {/* <FaEye className="text-xl  text-blue-600" /> */}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        id="visitor-count-chart"
        width={width}
        height={height}
        className="w-full h-auto"
      ></canvas>
    </div>
  );
};

export default VisitorCountChart;
