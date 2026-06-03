import { useEffect, useMemo, useState } from "react";
import launchesData from "./data/spacex_launches_simplified.json";
import FilterSections from "./components/FilterSections";
import LaunchTable from "./components/LaunchTable";
import { fetchSpaceXLaunches } from "./services/spacexService";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date_utc",
    direction: "desc",
  });
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [selectedLaunchIds, setSelectedLaunchIds] = useState([]);
  const [dataSource, setDataSource] = useState("json");
  const [launches, setLaunches] = useState(launchesData);
  const [loadingLaunches, setLoadingLaunches] = useState(false);
  const [launchesError, setLaunchesError] = useState("");

   useEffect(() => {
    const loadLaunches = async () => {
      setSelectedLaunch(null);
      setSelectedLaunchIds([]);
      setLaunchesError("");

      if (dataSource === "json") {
        setLaunches(launchesData);
        return;
      }

      try {
        setLoadingLaunches(true);
        const apiLaunches = await fetchSpaceXLaunches();
        setLaunches(apiLaunches);
      } catch (error) {
        console.error(error);
        setLaunchesError(
          "No se pudo cargar la API de SpaceX. Se muestran datos locales como respaldo."
        );
        setLaunches(launchesData);
      } finally {
        setLoadingLaunches(false);
      }
    };

    loadLaunches();
  }, [dataSource]);

    const filteredLaunches = useMemo(() => {
      let data = [...launches];

      if (search.trim()) {
        data = data.filter((launch) =>
          launch.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (dateFilter) {
        data = data.filter((launch) => launch.date_utc.startsWith(dateFilter));
      }

      data.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (valueA < valueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }

        return 0;
      });

      return data;
    }, [launches, search, dateFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleLaunchSelection = (launchId) => {
    setSelectedLaunchIds((prev) =>
      prev.includes(launchId)
        ? prev.filter((id) => id !== launchId)
        : [...prev, launchId]
    );
  };

  const toggleSelectAllLaunches = () => {
    const visibleLaunchIds = filteredLaunches.map((launch) => launch.id);

    const allVisibleSelected = visibleLaunchIds.every((id) =>
      selectedLaunchIds.includes(id)
    );

    if (allVisibleSelected) {
      setSelectedLaunchIds((prev) =>
        prev.filter((id) => !visibleLaunchIds.includes(id))
      );
    } else {
      setSelectedLaunchIds((prev) => [
        ...new Set([...prev, ...visibleLaunchIds]),
      ]);
    }
  };

  const selectedLaunches = filteredLaunches.filter((launch) =>
    selectedLaunchIds.includes(launch.id)
  );

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow" style={{ cursor: "pointer" }} onClick={() => window.location.href = "https://amerisalogistics.com/"}>Amerisa Logistics</p>
          <h1>SpaceX Launches Dashboard</h1>
          <p>
            Explora los lanzamientos de SpaceX.
          </p>
        </div>
      </section>

      <FilterSections
        search={search}
        setSearch={setSearch}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        dataSource={dataSource}
        setDataSource={setDataSource}
      />

      {loadingLaunches && (
        <p className="loading-message">Cargando información desde SpaceX...</p>
      )}

      {launchesError && (
        <p className="error-message">{launchesError}</p>
      )}

      <LaunchTable
        launches={filteredLaunches}
        selectedLaunch={selectedLaunch}
        setSelectedLaunch={setSelectedLaunch}
        formatDate={formatDate}
        handleSort={handleSort}
        selectedLaunchIds={selectedLaunchIds}
        toggleLaunchSelection={toggleLaunchSelection}
        toggleSelectAllLaunches={toggleSelectAllLaunches}
        selectedLaunches={selectedLaunches}
      />
          
    </main>
  );
}

export default App;