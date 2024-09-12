import React from 'react';
import './App.css';
import ArtworkTable from './components/ArtworkTable';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Artwork Table</h1>
            <ArtworkTable />
        </div>
    );
};

export default App;
