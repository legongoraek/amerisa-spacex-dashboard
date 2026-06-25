import { useEffect, useMemo, useState } from "react";
import { Box, Container, Paper, Typography, Alert, CircularProgress, Stack } from "@mui/material";
import launchesData from "./data/spacex_launches_simplified.json";
import FilterSections from "./components/FilterSections";
import LaunchTable from "./components/LaunchTable";
import { fetchSpaceXLaunches } from "./services/spacexService";

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
        if (!Array.isArray(apiLaunches)) {
          throw new Error("La respuesta de la API no es un array válido.");
        }
        setLaunchesError("");
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
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#1877f2",
            color: "#ffffff",
            p: 4,
            borderRadius: "16px",
            mb: 3,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              opacity: 0.85,
              letterSpacing: "2px",
              cursor: "pointer",
              display: "inline-block",
            }}
            onClick={() =>
              (window.location.href = "https://amerisalogistics.com/")
            }
          >
            Amerisa Logistics
          </Typography>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>
            SpaceX Launches Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Explora los lanzamientos de SpaceX.
          </Typography>
        </Paper>

        <FilterSections
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          dataSource={dataSource}
          setDataSource={setDataSource}
        />

        {loadingLaunches && (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              width: "100%",
              minWidth: 0,
              backgroundColor: "#e7f3ff",
              color: "#1877f2",
              p: 2,
              borderRadius: "12px",
              mb: 2.5,
            }}
          >
            <CircularProgress size={18} sx={{ color: "#1877f2" }} />
            <Typography sx={{ fontWeight: 600 }}>
              Cargando información desde SpaceX...
            </Typography>
          </Stack>
        )}

        {launchesError && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: "12px" }}>
            {launchesError}
          </Alert>
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
      </Container>
    </Box>
  );
}

export default App;