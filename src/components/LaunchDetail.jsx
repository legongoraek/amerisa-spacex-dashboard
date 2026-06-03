import { useState } from "react";
import LaunchMap from "./LaunchMap";
import { generateLaunchesPdf } from "../utils/pdfGenerator";

const LaunchDetail = ({ selectedLaunch, onClose, formatDate }) => {
  const [failedImageUrl, setFailedImageUrl] = useState(null);

  if (!selectedLaunch) return null;

  const imageUrl = selectedLaunch.images?.[0];
  const hasImageError = imageUrl === failedImageUrl;

  return (
    <section className="detail-card">
      <div className="detail-header">
        <div className="detail-title">
          <p className="detail-eyebrow">Detalle del lanzamiento</p>
        </div>

        <div className="detail-actions">
            <button
                className="pdf-btn"
                onClick={() => generateLaunchesPdf([selectedLaunch])}
            >
                Exportar PDF
            </button>

            <button onClick={onClose}>Cerrar</button>
        </div>
      </div>

        <div className="detail-grid">
            <div className="launch-image-wrap">
            {imageUrl && !hasImageError ? (
                <img
                src={imageUrl}
                alt={selectedLaunch.name}
                className="launch-image"
                referrerPolicy="no-referrer"
                onError={() => setFailedImageUrl(imageUrl)}
                />
            ) : (
                <div className="image-placeholder">
                Imagen no disponible
                </div>
            )}
            </div>

            <div className="launch-info">
            <p>
                <strong>ID:</strong> {selectedLaunch.id}
            </p>

            <p>
                <strong>Nombre:</strong> {selectedLaunch.name}
            </p>


            <p>
                <strong>Cohete:</strong> {selectedLaunch.rocket_name}
            </p>

            <p>
                <strong>Fecha:</strong> {formatDate(selectedLaunch.date_utc)}
            </p>

            <p>
                <strong>Estado:</strong>{" "}
                <span
                className={
                    selectedLaunch.success ? "status success" : "status failed"
                }
                >
                {selectedLaunch.success ? "Exitoso" : "Fallido"}
                </span>
            </p>

            <p>
                <strong>Plataforma:</strong> {selectedLaunch.launchpad_name}
            </p>

            <p>
                <strong>Detalles:</strong> {selectedLaunch.details}
            </p>

            <p>
                <strong>Latitud:</strong>{" "}
                {selectedLaunch.launchpad_location?.latitude}
            </p>

            <p>
                <strong>Longitud:</strong>{" "}
                {selectedLaunch.launchpad_location?.longitude}
            </p>

            
            </div>
        </div>
        <div className="detail-header">
            <div className="detail-title">
                <p className="detail-eyebrow">Ubicación del lanzamiento</p>
            </div>
        </div>
        <div className="launch-map-section">
            <LaunchMap launch={selectedLaunch} />
        </div>
    </section>
  );
};

export default LaunchDetail;