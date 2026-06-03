import jsPDF from "jspdf";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusText = (success) => {
  return success ? "Exitoso" : "Fallido";
};

export const generateLaunchesPdf = async (launches = []) => {
  if (!launches.length) return;

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Reporte de Lanzamientos SpaceX", margin, y);

  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Total de registros exportados: ${launches.length}`, margin, y);

  y += 7;
  doc.text(`Fecha de generación: ${formatDate(new Date())}`, margin, y);

  y += 10;

  doc.setDrawColor(220);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  launches.forEach((launch, index) => {
    if (y > 245) {
      doc.addPage();
      y = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${index + 1}. ${launch.name}`, margin, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const rows = [
      ["ID", launch.id],
      ["Cohete", launch.rocket_name],
      ["Fecha", formatDate(launch.date_utc)],
      ["Estado", getStatusText(launch.success)],
      ["Plataforma", launch.launchpad_name],
      ["Latitud", String(launch.launchpad_location?.latitude ?? "N/A")],
      ["Longitud", String(launch.launchpad_location?.longitude ?? "N/A")],
    ];

    rows.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margin, y);

      doc.setFont("helvetica", "normal");
      doc.text(String(value), margin + 28, y);

      y += 6;
    });

    doc.setFont("helvetica", "bold");
    doc.text("Detalles:", margin, y);

    y += 6;

    doc.setFont("helvetica", "normal");

    const detailsLines = doc.splitTextToSize(
      launch.details || "Sin detalles disponibles.",
      pageWidth - margin * 2
    );

    doc.text(detailsLines, margin, y);
    y += detailsLines.length * 5 + 4;

    const imageUrl = launch.images?.[0];

    if (imageUrl) {
      doc.setFont("helvetica", "bold");
      doc.text("Imagen:", margin, y);

      y += 6;

      doc.setFont("helvetica", "normal");

      const imageLines = doc.splitTextToSize(
        imageUrl,
        pageWidth - margin * 2
      );

      doc.text(imageLines, margin, y);
      y += imageLines.length * 5 + 4;
    }

    doc.setDrawColor(230);
    doc.line(margin, y, pageWidth - margin, y);

    y += 10;
  });

  doc.save(
    launches.length === 1
      ? `reporte-${launches[0].name}.pdf`
      : "reporte-lanzamientos-spacex.pdf"
  );
};