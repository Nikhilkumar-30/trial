import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
    
    // Realtime updates
    const subscription = supabase
      .channel("realtime:sensor_data")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "sensor_data" }, fetchData)
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchData() {
    let { data, error } = await supabase.from("sensor_data").select("*").order("timestamp", { ascending: false }).limit(10);
    if (!error) setData(data);
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">ESP8266 Sensor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => (
          <Card key={item.id} className="p-4 shadow-lg">
            <CardContent>
              <p className="text-lg font-semibold">🌡️ Temperature: {item.temperature}°C</p>
              <p className="text-lg font-semibold">💧 Humidity: {item.humidity}%</p>
              <p className="text-sm text-gray-500">⏳ {new Date(item.timestamp).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
