// "ignore typescript";
import { DataTable, DataTableStateEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";

interface Artwork {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface DataTableSelectionChangeEvent {
  value: Artwork[];
}

const ArtworksTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [first, setFirst] = useState(0);
  const [rangeValue, setRangeValue] = useState<number | null>(null);
  const handleRangeValueChange = (e: InputNumberValueChangeEvent) => {
    setRangeValue(e.value ?? null);
  };
  const [showRangeInput, setShowRangeInput] = useState(false);

  useEffect(() => {
    fetchData(page + 1);
  }, [page]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}`
      );
      const data = await response.json();
      setArtworks(
        data.data.map((item: Artwork) => ({
          title: item.title,
          place_of_origin: item.place_of_origin,
          artist_display: item.artist_display,
          inscriptions: item.inscriptions,
          date_start: item.date_start,
          date_end: item.date_end,
        }))
      );
      setTotalRecords(data.pagination.total);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  const handleRangeSelection = async () => {
    if (rangeValue !== null) {
      const newSelectedRows: Artwork[] = [];
      const currentPageRows = artworks.slice(
        0,
        Math.min(rangeValue, artworks.length)
      );
      newSelectedRows.push(...currentPageRows);

      if (rangeValue > artworks.length) {
        let remainingRows = rangeValue - artworks.length;
        let nextPage = page + 2;

        while (remainingRows > 0) {
          const response = await fetch(
            `https://api.artic.edu/api/v1/artworks?page=${nextPage}`
          );
          const data = await response.json();
          const nextPageRows = data.data.map((item: Artwork) => ({
            title: item.title,
            place_of_origin: item.place_of_origin,
            artist_display: item.artist_display,
            inscriptions: item.inscriptions,
            date_start: item.date_start,
            date_end: item.date_end,
          }));

          const rowsToAdd = nextPageRows.slice(
            0,
            Math.min(remainingRows, nextPageRows.length)
          );
          newSelectedRows.push(...rowsToAdd);
          remainingRows -= rowsToAdd.length;
          nextPage++;
        }
      }

      setSelectedRows((prevSelected: Artwork[]) => [
        ...new Set([...prevSelected, ...newSelectedRows]),
      ]);
      setShowRangeInput(false);
    }
  };

  const onPageChange = (event: DataTableStateEvent) => {
    setPage(event.page || 0);
    setFirst(event.first || 0);
  };

  return (
    <div>
      <DataTable
        value={artworks}
        paginator
        rows={12}
        totalRecords={totalRecords}
        lazy
        onPage={onPageChange}
        first={first}
        selection={selectedRows}
        onSelectionChange={(e: DataTableSelectionChangeEvent) =>
          setSelectedRows(e.value as Artwork[])
        }
        loading={loading}
         selectionMode="multiple"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
        ></Column>
        <Column
          header={
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                icon="pi pi-chevron-down"
                className="p-button-text p-button-plain"
                onClick={() => setShowRangeInput(true)}
              />
              <span>Title</span>
            </div>
          }
          field="title"
        ></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>

      <Dialog
        header="Select Rows by Range"
        visible={showRangeInput}
        style={{ width: "300px" }}
        onHide={() => setShowRangeInput(false)}
      >
        <div className="field">
          <label htmlFor="rangeInput">Select rows up to:</label>
          <InputNumber
            id="rangeInput"
            value={rangeValue}
            onValueChange={handleRangeValueChange}
            min={1}
            max={totalRecords}
            placeholder="Enter row number"
          />
        </div>
        <Button label="Submit" onClick={handleRangeSelection} />
      </Dialog>
    </div>
  );
};

export default ArtworksTable;
