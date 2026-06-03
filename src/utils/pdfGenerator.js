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

const sanitizeFileName = (value) => {
  return String(value)
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

const getImageAsDataUrl = async (imageUrl) => {
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl, {
      mode: "cors",
      cache: "no-cache",
    });

    if (!response.ok) return null;

    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        resolve(null);
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("No se pudo cargar la imagen para el PDF:", imageUrl, error);
    return null;
  }
};

const getImageFormat = (dataUrl) => {
  if (!dataUrl) return "JPEG";

  if (dataUrl.startsWith("data:image/png")) {
    return "PNG";
  }

  if (dataUrl.startsWith("data:image/webp")) {
    return "WEBP";
  }

  return "JPEG";
};

export const generateLaunchesPdf = async (launches = []) => {
  if (!launches.length) return;

  const doc = new jsPDF("p", "mm", "letter");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 12;
  const marginTop = 14;
  const marginBottom = 12;

  const contentWidth = pageWidth - marginX * 2;
  const maxY = pageHeight - marginBottom;

  let y = marginTop;

  const addPage = () => {
    doc.addPage();
    y = marginTop;
  };

  const ensureSpace = (requiredHeight = 10) => {
    if (y + requiredHeight > maxY) {
      addPage();
    }
  };

  const drawLine = () => {
    ensureSpace(4);
    doc.setDrawColor(225);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 6;
  };

  const writeText = ({
    text,
    x = marginX,
    fontSize = 10,
    fontStyle = "normal",
    lineHeight = 5,
    maxWidth = contentWidth,
    spacingAfter = 0,
  }) => {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(String(text ?? ""), maxWidth);
    const blockHeight = lines.length * lineHeight + spacingAfter;

    ensureSpace(blockHeight);

    doc.text(lines, x, y);
    y += blockHeight;
  };

  const writeLabelValue = (label, value) => {
    const labelWidth = 28;
    const valueX = marginX + labelWidth;
    const valueWidth = pageWidth - valueX - marginX;

    doc.setFontSize(10);

    const valueLines = doc.splitTextToSize(String(value ?? "N/A"), valueWidth);
    const rowHeight = Math.max(valueLines.length * 5, 6);

    ensureSpace(rowHeight);

    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, marginX, y);

    doc.setFont("helvetica", "normal");
    doc.text(valueLines, valueX, y);

    y += rowHeight;
  };

  const writeImage = async (imageUrl) => {
    if (!imageUrl) return;

    writeText({
      text: "Imagen:",
      fontSize: 10,
      fontStyle: "bold",
      lineHeight: 5,
      spacingAfter: 1,
    });

    const imageDataUrl = await getImageAsDataUrl(imageUrl);

    if (!imageDataUrl) {
      writeText({
        text: "No se pudo cargar la imagen por restricciones del servidor externo.",
        fontSize: 9,
        fontStyle: "normal",
        lineHeight: 4.5,
        spacingAfter: 3,
      });

      writeText({
        text: imageUrl,
        fontSize: 8,
        fontStyle: "normal",
        lineHeight: 4,
        spacingAfter: 3,
      });

      return;
    }

    const imageWidth = 70;
    const imageHeight = 42;

    ensureSpace(imageHeight + 4);

    doc.addImage(
      imageDataUrl,
      getImageFormat(imageDataUrl),
      marginX,
      y,
      imageWidth,
      imageHeight
    );

    y += imageHeight + 5;
  };

  const writeHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("Reporte de Lanzamientos SpaceX", marginX, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total de registros exportados: ${launches.length}`, marginX, y);

    y += 6;

    doc.text(`Fecha de generación: ${formatDate(new Date())}`, marginX, y);

    y += 8;

    drawLine();
  };

  writeHeader();

  for (const [index, launch] of launches.entries()) {
    const rows = [
      ["ID", launch.id],
      ["Cohete", launch.rocket_name],
      ["Fecha", formatDate(launch.date_utc)],
      ["Estado", getStatusText(launch.success)],
      ["Plataforma", launch.launchpad_name],
      ["Latitud", String(launch.launchpad_location?.latitude ?? "N/A")],
      ["Longitud", String(launch.launchpad_location?.longitude ?? "N/A")],
    ];

    const detailsLines = doc.splitTextToSize(
      launch.details || "Sin detalles disponibles.",
      contentWidth
    );

    const imageUrl = launch.images?.[0];
    const imageLines = imageUrl
      ? doc.splitTextToSize(imageUrl, contentWidth)
      : [];

    const estimatedLaunchHeight =
      8 + // título
      rows.length * 6 +
      6 + // label detalles
      detailsLines.length * 5 +
      (imageUrl ? 6 + imageLines.length * 5 : 0) +
      12; // separación final

    ensureSpace(estimatedLaunchHeight);

    writeText({
      text: `${index + 1}. ${launch.name}`,
      fontSize: 13,
      fontStyle: "bold",
      lineHeight: 6,
      spacingAfter: 2,
    });

    rows.forEach(([label, value]) => {
      writeLabelValue(label, value);
    });

    writeText({
      text: "Detalles:",
      fontSize: 10,
      fontStyle: "bold",
      lineHeight: 5,
      spacingAfter: 1,
    });

    writeText({
      text: launch.details || "Sin detalles disponibles.",
      fontSize: 10,
      fontStyle: "normal",
      lineHeight: 5,
      spacingAfter: 3,
    });

    if (imageUrl) {
      await writeImage(imageUrl);
    }

    drawLine();
  }

  const pageCount = doc.internal.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);

    doc.text(
      `Página ${page} de ${pageCount}`,
      pageWidth - marginX,
      pageHeight - 7,
      { align: "right" }
    );

    doc.setTextColor(0);
  }

  const fileName =
    launches.length === 1
      ? `reporte-${sanitizeFileName(launches[0].name)}.pdf`
      : "reporte-lanzamientos-spacex.pdf";

  doc.save(fileName);
};