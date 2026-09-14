import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";

const GITHUB_URL = "https://github.com/legongoraek/amerisa-spacex-dashboard";

const FEATURES = [
  { label: "Tabla", value: "Filtros, orden y selección múltiple" },
  { label: "Detalle", value: "Vista extendida por lanzamiento" },
  { label: "Mapa", value: "Ubicación del sitio con Leaflet" },
  { label: "PDF", value: "Exportación de reportes con jsPDF" },
  { label: "Datos", value: "JSON local o API pública de SpaceX" },
];

function Landing() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid #e0e3e8",
          backgroundColor: "#ffffff",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between", py: 2 }}
          >
            <Typography sx={{ fontWeight: 700, color: "#1877f2" }}>
              Amerisa Logistics
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<GitHubIcon />}
                sx={{ color: "#1f2937", textTransform: "none" }}
              >
                GitHub
              </Button>
              <Button
                component={RouterLink}
                to="/app"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  backgroundColor: "#1877f2",
                  textTransform: "none",
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "#1565d8" },
                }}
              >
                Ver demo
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ py: { xs: 6, md: 10 }, alignItems: "flex-start" }}
        >
          <Box sx={{ flex: 1 }}>
            <Chip
              label="Prueba técnica · Case study"
              sx={{
                backgroundColor: "#e7f3ff",
                color: "#1877f2",
                fontWeight: 600,
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 800, mb: 2, color: "#111827" }}
            >
              SpaceX Launches Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#4b5563", mb: 3, maxWidth: 520 }}
            >
              Mini dashboard para consultar lanzamientos de SpaceX: detalle
              por lanzamiento, ubicación en mapa y generación de reportes en
              PDF. Desarrollado como parte de una prueba técnica para la
              vacante de Desarrollador en Amerisa Logistics.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                to="/app"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  backgroundColor: "#1877f2",
                  textTransform: "none",
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "#1565d8" },
                }}
              >
                Abrir demo
              </Button>
              <Button
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                startIcon={<GitHubIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  borderColor: "#d1d5db",
                  color: "#1f2937",
                }}
              >
                Ver código
              </Button>
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              flex: "0 0 340px",
              width: { xs: "100%", md: 340 },
              p: 3,
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              variant="overline"
              sx={{ letterSpacing: "1.5px", color: "#6b7280" }}
            >
              Funcionalidades
            </Typography>
            <Stack divider={<Divider sx={{ my: 1.25 }} />} sx={{ mt: 1 }}>
              {FEATURES.map((feature) => (
                <Box key={feature.label}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                    {feature.label}
                  </Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: 14 }}>
                    {feature.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default Landing;
