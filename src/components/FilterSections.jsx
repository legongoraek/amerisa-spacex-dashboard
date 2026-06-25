import {
  Box,
  Paper,
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const FilterSections = ({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  dataSource,
  setDataSource,
}) => {
  const handleClearFilters = () => {
    setSearch("");
    setDateFilter("");
    setDataSource("json");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2.5,
        border: "1px solid #dddfe2",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        sx={{
          alignItems: { xs: "stretch", sm: "flex-end" },
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <Box
          sx={{
            minWidth: { xs: "100%", sm: 200 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 0.5,
              color: "#65676B",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Fuente de datos
          </Typography>

          <FormControl size="small" fullWidth>
            <Select
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Seleccionar fuente</em>
              </MenuItem>
              <MenuItem value="json">JSON local</MenuItem>
              <MenuItem value="api">API SpaceX</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            minWidth: { xs: "100%", sm: 220 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 0.5,
              color: "#65676B",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Buscar por nombre
          </Typography>

          <TextField
            size="small"
            placeholder="Ej. Starlink"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>

        <Box
          sx={{
            minWidth: { xs: "100%", sm: 200 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 0.5,
              color: "#65676B",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Filtrar por fecha
          </Typography>

          <TextField
            size="small"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            fullWidth
            sx={{
              "& input": {
                fontSize: "0.9rem",
              },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: { xs: 0, sm: 1 } }} />

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleClearFilters}
          sx={{
            color: "#1877f2",
            borderColor: "#1877f2",
            textTransform: "none",
            minWidth: { xs: "100%", sm: "auto" },
            height: 40,
            "&:hover": {
              borderColor: "#166fe5",
              backgroundColor: "rgba(24, 119, 242, 0.08)",
              color: "#166fe5",
            },
          }}
        >
          Limpiar filtros
        </Button>
      </Stack>
    </Paper>
  );
};

export default FilterSections;