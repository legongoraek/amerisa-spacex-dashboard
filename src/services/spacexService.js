const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const LAUNCHPAD_NAMES = {
  "5e9e4501f5090910d4566f83": {
    name: "Kennedy Space Center LC-39A",
    latitude: 28.608389,
    longitude: -80.604333,
  },
  "5e9e4501f509094ba4566f84": {
    name: "Cape Canaveral SLC-40",
    latitude: 28.5618571,
    longitude: -80.577366,
  },
  "5e9e4502f509092b78566f87": {
    name: "Vandenberg SFB SLC-4E",
    latitude: 34.632093,
    longitude: -120.610829,
  },
};

const getLaunchpadInfo = (launchpadId) => {
  return (
    LAUNCHPAD_NAMES[launchpadId] || {
      name: "Ubicación no disponible",
      latitude: 0,
      longitude: 0,
    }
  );
};

const normalizeLaunchFromApi = (launch) => {
  const launchpadInfo = getLaunchpadInfo(launch.launchpad);

  return {
    id: launch.id,
    name: launch.name,
    date_utc: launch.date_utc,
    success: Boolean(launch.success),
    rocket_name: "SpaceX Rocket",
    launchpad_name: launchpadInfo.name,
    launchpad_location: {
      latitude: launchpadInfo.latitude,
      longitude: launchpadInfo.longitude,
    },
    details: launch.details || "Sin detalles disponibles.",
    images: launch.links?.flickr?.original?.length
      ? launch.links.flickr.original
      : launch.links?.patch?.large
        ? [launch.links.patch.large]
        : [],
  };
};

export const fetchSpaceXLaunches = async () => {
  const response = await fetch(SPACEX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {},
      options: {
        limit: 20,
        sort: {
          date_utc: "desc",
        },
        select: [
          "id",
          "name",
          "date_utc",
          "success",
          "details",
          "launchpad",
          "links",
        ],
      },
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener información desde la API de SpaceX.");
  }

  const data = await response.json();

  return data.docs.map(normalizeLaunchFromApi);
};