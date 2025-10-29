import React, { useEffect, useState } from 'react';

type SchemaCol = { name: string; type: string };

const QueryRunner = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState('');

    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [schema, setSchema] = useState<SchemaCol[] | null>(null);
    const [samples, setSamples] = useState<any[] | null>(null);

    useEffect(() => {
        // Load table list on mount
        const loadTables = async () => {
            try {
                const res = await fetch('/api/tables');
                if (!res.ok) throw new Error('Failed to fetch tables');
                const data = await res.json();
                setTables(data.tables || []);
            } catch (err: any) {
                console.error(err);
            }
        };
        loadTables();
    }, []);

    const loadTableInfo = async (name: string) => {
        setSelectedTable(name);
        setSchema(null);
        setSamples(null);
        try {
            const res = await fetch(`/api/table/${encodeURIComponent(name)}`);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.error || 'Failed to fetch table info');
            }
            const data = await res.json();
            setSchema(data.schema || []);
            setSamples(data.samples || []);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err?.error || 'Network response was not ok');
            }

            const data = await response.json();
            setResult(data);
            // refresh table list after non-select queries which may alter schema
            if (!query.trim().toLowerCase().startsWith('select')) {
                const t = await fetch('/api/tables');
                const dt = await t.json();
                setTables(dt.tables || []);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', gap: 16 }}>
            <aside style={{ width: 260, borderRight: '1px solid #ddd', padding: 12 }}>
                <h3>Tables</h3>
                {tables.length === 0 && <div>No tables found</div>}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {tables.map((t) => (
                        <li key={t} style={{ marginBottom: 8 }}>
                            <button
                                onClick={() => loadTableInfo(t)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '6px 8px',
                                    background: selectedTable === t ? '#eef' : '#fff',
                                }}
                            >
                                {t}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            <main style={{ flex: 1, padding: 12 }}>
                <h1>SQL Runner</h1>

                <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
                    <textarea
                        value={query}
                        onChange={handleQueryChange}
                        placeholder="Enter your SQL query here"
                        rows={6}
                        style={{ width: '100%' }}
                    />
                    <div style={{ marginTop: 8 }}>
                        <button type="submit">Run Query</button>
                    </div>
                </form>

                {error && <div style={{ color: 'red' }}>{error}</div>}

                {result && (
                    <section style={{ marginBottom: 16 }}>
                        <h2>Results</h2>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
                    </section>
                )}

                {selectedTable && (
                    <section>
                        <h2>Table: {selectedTable}</h2>

                        <div style={{ marginBottom: 12 }}>
                            <h3>Schema</h3>
                            {schema && schema.length > 0 ? (
                                <table style={{ borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ccc', padding: 6 }}>Column</th>
                                            <th style={{ border: '1px solid #ccc', padding: 6 }}>Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schema.map((col) => (
                                            <tr key={col.name}>
                                                <td style={{ border: '1px solid #ccc', padding: 6 }}>{col.name}</td>
                                                <td style={{ border: '1px solid #ccc', padding: 6 }}>{col.type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div>No schema information available</div>
                            )}
                        </div>

                        <div>
                            <h3>Sample Rows (first 5)</h3>
                            {samples && samples.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ borderCollapse: 'collapse', minWidth: 600 }}>
                                        <thead>
                                            <tr>
                                                {Object.keys(samples[0]).map((col) => (
                                                    <th key={col} style={{ border: '1px solid #ccc', padding: 6 }}>
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {samples.map((row, idx) => (
                                                <tr key={idx}>
                                                    {Object.keys(row).map((col) => (
                                                        <td key={col} style={{ border: '1px solid #ccc', padding: 6 }}>{String(row[col])}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div>No sample rows</div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default QueryRunner;