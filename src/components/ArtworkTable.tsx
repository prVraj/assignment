import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSelectionChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { fetchArtworks } from '../services/api';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const ArtworkTable: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        loadArtworks(page);
    }, [page]);

    const loadArtworks = async (page: number) => {
        const data = await fetchArtworks(page);
        if (data) {
            setArtworks(data.data);
            setTotalRecords(data.pagination.total);
        }
    };

    const onPageChange = (event: any) => {
        setPage(event.page + 1);
    };

    const onRowSelect = (e: DataTableSelectionChangeEvent) => {
        const selected = e.value;
        setSelectedArtworks(selected);
    };

    return (
        <div className="card">
            <DataTable
                value={artworks}
                paginator
                rows={10}
                totalRecords={totalRecords}
                lazy
                first={(page - 1) * 10}
                onPage={onPageChange}
                selection={selectedArtworks}
                onSelectionChange={onRowSelect}
                dataKey="id"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="title" header="Title"></Column>
                <Column field="place_of_origin" header="Place of Origin"></Column>
                <Column field="artist_display" header="Artist"></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Start Date"></Column>
                <Column field="date_end" header="End Date"></Column>
            </DataTable>

            <div>
                <h3>Selected Artworks:</h3>
                <ul>
                    {selectedArtworks.map((artwork) => (
                        <li key={artwork.id}>{artwork.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ArtworkTable;
