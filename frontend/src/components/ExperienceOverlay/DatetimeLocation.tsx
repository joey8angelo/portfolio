import { useEffect, useState } from "react";

export default function DatetimeLocation() {
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setYears(now.getFullYear());
      setMonths(now.getMonth() + 1);
      setDays(now.getDate());
      setHours(now.getHours());
      setMinutes(now.getMinutes());
      setSeconds(now.getSeconds());
    };
    const interval = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(interval);
  }, []);

  const location = "Los Angeles, CA";

  return (
    <div className="absolute top-4 right-6 text-white text-md font-[IBM_Plex_Mono] text-right">
      <div>{location}</div>
      <div>{`${years}-${months.toString().padStart(2, "0")}-${days.toString().padStart(2, "0")}
      ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</div>
    </div>
  );
}
