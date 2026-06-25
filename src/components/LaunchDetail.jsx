import { useState } from "react";
import {
  Paper,
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import LaunchMap from "./LaunchMap";
import { generateLaunchesPdf } from "../utils/pdfGenerator";

const LaunchDetail = ({ selectedLaunch, onClose, formatDate }) => {
  const [failedImageUrl, setFailedImageUrl] = useState(null);

  if (!selectedLaunch) return null;

  const imageUrl = selectedLaunch.images?.[0];
  const hasImageError = imageUrl === failedImageUrl;

  const InfoRow = ({ label, value }) => (
    <Typography variant="body2" sx={{ color: "#1c1e21" }}>
      <Box component="strong" sx={{ fontWeight: 700 }}>
        {label}:
      </Box>{" "}
      {value}
    </Typography>
  );

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
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        mb={2}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography
          variant="overline"
          sx={{ color: "#1877f2", fontWeight: 700, letterSpacing: "1px" }}
        >
          Detalle del lanzamiento
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => generateLaunchesPdf([selectedLaunch])}
            sx={{
              textTransform: "none",
              backgroundColor: "#1877f2",
              "&:hover": { backgroundColor: "#166fe5" },
            }}
          >
            Exportar PDF
          </Button>

          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onClose}
            sx={{
              textTransform: "none",
              color: "#65676b",
              borderColor: "#dddfe2",
              "&:hover": {
                borderColor: "#bcc0c4",
                backgroundColor: "#f0f2f5",
              },
            }}
          >
            Cerrar
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: 300,
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl && !hasImageError ? (
            <Box
              component="img"
              src={imageUrl}
              alt={selectedLaunch.name}
              referrerPolicy="no-referrer"
              onError={() => setFailedImageUrl(imageUrl)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          ) : (
            <Typography sx={{ color: "#65676b", fontWeight: 700 }}>
              Imagen no disponible
            </Typography>
          )}
        </Box>

        <Stack spacing={1} sx={{ textAlign: "justify" }}>
          <InfoRow label="ID" value={selectedLaunch.id} />
          <InfoRow label="Nombre" value={selectedLaunch.name} />
          <InfoRow label="Cohete" value={selectedLaunch.rocket_name} />
          <InfoRow label="Fecha" value={formatDate(selectedLaunch.date_utc)} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#1c1e21" }}>
              Estado:
            </Typography>
            <Chip
              label={selectedLaunch.success ? "Exitoso" : "Fallido"}
              size="small"
              sx={{
                fontWeight: 700,
                backgroundColor: selectedLaunch.success ? "#dcfce7" : "#fee2e2",
                color: selectedLaunch.success ? "#166534" : "#991b1b",
              }}
            />
          </Stack>

          <InfoRow label="Plataforma" value={selectedLaunch.launchpad_name} />
          <InfoRow label="Detalles" value={selectedLaunch.details} />
          <InfoRow
            label="Latitud"
            value={selectedLaunch.launchpad_location?.latitude}
          />
          <InfoRow
            label="Longitud"
            value={selectedLaunch.launchpad_location?.longitude}
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="overline"
        sx={{ color: "#1877f2", fontWeight: 700, letterSpacing: "1px" }}
      >
        Ubicación del lanzamiento
      </Typography>

      <Box sx={{ mt: 1.5 }}>
        <LaunchMap launch={selectedLaunch} />
      </Box>
    </Paper>
  );
};

export default LaunchDetail;