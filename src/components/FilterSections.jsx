const FilterSections = ({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
}) => {
  const handleClearFilters = () => {
    setSearch("");
    setDateFilter("");
  };

  return (
    <section className="filters-card">
      <div className="filter-group">
        <label>Buscar por nombre</label>
        <input
          type="text"
          placeholder="Ej. Starlink"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Filtrar por fecha</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <button className="clear-btn" onClick={handleClearFilters}>
        Limpiar filtros
      </button>
    </section>
  );
};

export default FilterSections;