import {
  Paper,
  Box,
  Stack,
  Typography,
  Button,
  Checkbox,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LaunchDetail from "./LaunchDetail";
import { generateLaunchesPdf } from "../utils/pdfGenerator";

const LaunchTable = ({
  launches,
  selectedLaunch,
  setSelectedLaunch,
  formatDate,
  handleSort,
  selectedLaunchIds,
  toggleLaunchSelection,
  toggleSelectAllLaunches,
  selectedLaunches,
}) => {
  const allVisibleSelected =
    launches.length > 0 &&
    launches.every((launch) => selectedLaunchIds.includes(launch.id));

  const someVisibleSelected = launches.some((launch) =>
    selectedLaunchIds.includes(launch.id)
  );

  return (
    <>
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
          spacing={1.5}
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            width: "100%",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: "#1c1e21", fontWeight: 700 }}>
              Lanzamientos
            </Typography>
            <Typography variant="body2" sx={{ color: "#65676b" }}>
              {launches.length} registros
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            disabled={selectedLaunches.length === 0}
            onClick={() => generateLaunchesPdf(selectedLaunches)}
            sx={{
              textTransform: "none",
              backgroundColor: "#1877f2",
              "&:hover": { backgroundColor: "#166fe5" },
              "&.Mui-disabled": {
                backgroundColor: "#e4e6eb",
                color: "#bcc0c4",
              },
            }}
          >
            Exportar PDF ({selectedLaunches.length})
          </Button>
        </Stack>

        <TableContainer
          sx={{
            maxHeight: 520,
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
          }}
        >
          <Table stickyHeader sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ width: 56, backgroundColor: "#f9fafb" }}
                >
                  <Checkbox
                    checked={allVisibleSelected}
                    indeterminate={!allVisibleSelected && someVisibleSelected}
                    onChange={toggleSelectAllLaunches}
                    sx={{
                      color: "#1877f2",
                      "&.Mui-checked": { color: "#1877f2" },
                      "&.MuiCheckbox-indeterminate": { color: "#1877f2" },
                    }}
                  />
                </TableCell>
                <TableCell
                  onClick={() => handleSort("name")}
                  sx={{ backgroundColor: "#f9fafb", cursor: "pointer", fontWeight: 700 }}
                >
                  Nombre
                </TableCell>
                <TableCell
                  onClick={() => handleSort("date_utc")}
                  sx={{ backgroundColor: "#f9fafb", cursor: "pointer", fontWeight: 700 }}
                >
                  Fecha
                </TableCell>
                <TableCell
                  onClick={() => handleSort("success")}
                  sx={{ backgroundColor: "#f9fafb", cursor: "pointer", fontWeight: 700 }}
                >
                  Estado
                </TableCell>
                <TableCell
                  onClick={() => handleSort("launchpad_name")}
                  sx={{ backgroundColor: "#f9fafb", cursor: "pointer", fontWeight: 700 }}
                >
                  Ubicación
                </TableCell>
                <TableCell sx={{ backgroundColor: "#f9fafb", fontWeight: 700 }}>
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {launches.map((launch) => (
                <TableRow
                  key={launch.id}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedLaunchIds.includes(launch.id)}
                      onChange={() => toggleLaunchSelection(launch.id)}
                      sx={{
                        color: "#1877f2",
                        "&.Mui-checked": { color: "#1877f2" },
                      }}
                    />
                  </TableCell>
                  <TableCell>{launch.name}</TableCell>
                  <TableCell>{formatDate(launch.date_utc)}</TableCell>
                  <TableCell>
                    <Chip
                      label={launch.success ? "Exitoso" : "Fallido"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        backgroundColor: launch.success ? "#dcfce7" : "#fee2e2",
                        color: launch.success ? "#166534" : "#991b1b",
                      }}
                    />
                  </TableCell>
                  <TableCell>{launch.launchpad_name}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant={
                        selectedLaunch?.id === launch.id ? "contained" : "outlined"
                      }
                      onClick={() =>
                        setSelectedLaunch((prev) =>
                          prev?.id === launch.id ? null : launch
                        )
                      }
                      sx={
                        selectedLaunch?.id === launch.id
                          ? {
                              textTransform: "none",
                              backgroundColor: "#ef4444",
                              "&:hover": { backgroundColor: "#dc2626" },
                            }
                          : {
                              textTransform: "none",
                              color: "#1877f2",
                              borderColor: "#1877f2",
                              "&:hover": {
                                borderColor: "#166fe5",
                                backgroundColor: "rgba(24, 119, 242, 0.08)",
                              },
                            }
                      }
                    >
                      {selectedLaunch?.id === launch.id ? "Cerrar" : "Ver más"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {launches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "#65676b" }}>
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <LaunchDetail
        selectedLaunch={selectedLaunch}
        onClose={() => setSelectedLaunch(null)}
        formatDate={formatDate}
      />
    </>
  );
};

export default LaunchTable;