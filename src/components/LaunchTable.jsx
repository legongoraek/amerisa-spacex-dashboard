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
      <section className="table-card">
        <div className="table-header">
            <div className="table-title">
                <h2>Lanzamientos</h2>
                <span>{launches.length} registros</span>
            </div>
            <button 
                className="pdf-btn"
                disabled={selectedLaunches.length === 0}
                onClick={() => generateLaunchesPdf(selectedLaunches)}
            >
                Exportar seleccionados ({selectedLaunches.length})
            </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="pdf-column">
                    <input
                        className="pdf-checkbox"
                        type="checkbox"
                        checked={allVisibleSelected}
                        ref={(input) => {
                        if (input) {
                            input.indeterminate = !allVisibleSelected && someVisibleSelected;
                        }
                        }}
                        onChange={toggleSelectAllLaunches}
                    />
                </th>
                <th onClick={() => handleSort("name")}>Nombre</th>
                <th onClick={() => handleSort("date_utc")}>Fecha</th>
                <th onClick={() => handleSort("success")}>Estado</th>
                <th onClick={() => handleSort("launchpad_name")}>Ubicación</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {launches.map((launch) => (
                <tr key={launch.id}>
                    <td className="pdf-column">
                        <input
                            className="pdf-checkbox"
                            type="checkbox"
                            checked={selectedLaunchIds.includes(launch.id)}
                            onChange={() => toggleLaunchSelection(launch.id)}
                        />
                    </td>
                  <td>{launch.name}</td>
                  <td>{formatDate(launch.date_utc)}</td>
                  <td>
                    <span
                      className={
                        launch.success
                          ? "status success"
                          : "status failed"
                      }
                    >
                      {launch.success ? "Exitoso" : "Fallido"}
                    </span>
                  </td>
                  <td>{launch.launchpad_name}</td>
                  <td>
                    <button
                        className={
                            selectedLaunch?.id === launch.id
                            ? "detail-btn detail-btn-active"
                            : "detail-btn"
                        }
                        onClick={() =>
                            setSelectedLaunch((prev) =>
                            prev?.id === launch.id ? null : launch
                            )
                        }
                    >
                        {selectedLaunch?.id === launch.id ? "Cerrar detalle" : "Ver detalle"}
                    </button>
                  </td>
                </tr>
              ))}

              {launches.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <LaunchDetail
        selectedLaunch={selectedLaunch}
        onClose={() => setSelectedLaunch(null)}
        formatDate={formatDate}
      />
    </>
  );
};

export default LaunchTable;